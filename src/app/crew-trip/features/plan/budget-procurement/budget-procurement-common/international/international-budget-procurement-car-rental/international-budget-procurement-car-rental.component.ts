import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClickOutside } from 'ngxtension/click-outside';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { exampleData, formula, getHeaderRowDef1, getHeaderRowDef2, getRowDef, planFlightByOvernight, planFlightPeriodList } from './international-budget-procurement-car-rental.model';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { Constant } from 'src/app/crew-trip/shared/utils/constant';
import { truncateDateUTC } from 'src/app/crew-trip/shared/utils/common';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { PlanCategoryEnum } from '../../../budget-procurement.model';

@Component({
  selector: 'app-international-budget-procurement-car-rental',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside, MatButtonModule, DataTransformPipe, DigitOnlyModule, ClickOutside],
  templateUrl: './international-budget-procurement-car-rental.component.html',
  styleUrl: './international-budget-procurement-car-rental.component.scss',
  providers: [DatePipe, DataTransformPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternationalBudgetProcurementCarRentalComponent implements OnInit, AfterViewChecked {
  dataTransformPipe = inject(DataTransformPipe);
  dataSource = new MatTableDataSource();

  headerRowDef1: string[] = getHeaderRowDef1();
  headerRowDef2: string[] = getHeaderRowDef2();
  rowDef: string[] = getRowDef();

  updateBudgetPlan = input<boolean | undefined>(false); //tích chọn check box Lập kế hoạch sản lượng thay đổi
  yearPlan = input<number>(2024); // năm kế hoạch
  type = input<PlanCategoryEnum>(PlanCategoryEnum.BUDGET); // Loại Ngân sách hoặc mua sắm (budget/procurement)
  data = input<any>();

  PlanCategoryEnum = PlanCategoryEnum;

  planFlightPeriods: any[] = []; // danh sách chuyến bay theo giai đoạn

  constructor(private datePipe: DatePipe, private cdRef: ChangeDetectorRef) {
    effect(() => {
      console.log('effect data InternationalBudgetProcurementCarRentalComponent: ', this.data())
      if (this.data()) {
        this.setPlanFlightPeriods(this.data().planFlightPeriods);
        this.setDataSource(this.data().planCarentals);
      }
    })
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges(); // Phát hiện và cập nhật các thay đổi
  }
  ngOnInit(): void {

  }

  setDataSource(data: any[]) {
    this.dataSource.data = [...data];
    this.dataSource.data.forEach((item: any, index) => {
      let period = '';
      if (this.type() === PlanCategoryEnum.PROCUREMENT) {
        period = `T${this.dataTransformPipe.transform(item.periodStart, [Constant.DATE, Constant.MONTH_FORMAT])} - T${this.dataTransformPipe.transform(item.periodEnd, [Constant.DATE, Constant.MONTH_FORMAT])}`;
      } else {
        period = `Tháng ${this.dataTransformPipe.transform(item.periodStart, [Constant.DATE, Constant.MONTH_FORMAT])}`;
      }
      item.period = period;
      this.calculateData(item, index);
    });
  }

  private calculateData(item: any, index: number) {

    if (this.type() === 'PROCUREMENT') {
      //Số lượng chuyến bay theo giai đoạn
      item.numberFlight = this.planFlightPeriods.filter((t: any) =>
        t.periodStart === item.periodStart && t.periodEnd === item.periodEnd
      ).map((t: any) => t.numberOfFlight).reduce((acc, value) => acc + value, 0);
    }

    //Số lượt xe
    this.calculate(item, 'numberVehicles');
    //Thành tiền (ngoại tệ) - Chưa bao gồm VAT
    this.calculate(item, 'totalAmountForeign');
    //Thành tiền (ngoại tệ) - Bao gồm VAT
    this.calculate(item, 'totalAmountForeignVat');
    //Thành tiền VND (Chưa bao gồm VAT)
    this.calculate(item, 'totalAmount');
    //Thành tiền VND (Bao gồm VAT)
    this.calculate(item, 'totalAmountVat');

  }
  setPlanFlightPeriods(data: any[]) {
    this.planFlightPeriods = data;
  }
  // TÍnh dòng tổng 
  getTotal(control: string) {
    //Cột Thành tiền VND - bao gồm VAT:   tính tổng từ T12/2024-T11/2025,   còn các cột còn lại đều tính tổng từ T1/2025-T12/2025
    const startDatePlanGroup = new Date(this.yearPlan() + 1, 0, 1);
    if (control === 'totalAmountVat') {
      const endDatePlanGroup = new Date(this.yearPlan() + 1, 10, 1);
      return Math.round(this.dataSource.data.map((t: any) => {
        if (truncateDateUTC(new Date(t['periodStart'])) <= truncateDateUTC(endDatePlanGroup)) {
          return Number(t[control]);
        }
        return 0;
      }).reduce((acc, value) => acc + value, 0));
    }
    return Math.round(this.dataSource.data.map((t: any) => {
      if (truncateDateUTC(new Date(t['periodStart'])) >= truncateDateUTC(startDatePlanGroup)) {
        return Number(t[control]);
      }
      return 0;
    }).reduce((acc, value) => acc + value, 0));;
  }

  // hàm công thức tính chung
  calculate(item: any, key: string) {
    // Check lập kế hoạch sản lượng thay đổi
    // Tháng nào đã thực hiện thì tính theo công thưc mới
    const objFormula = formula[key];
    // Nếu là mua sắm thì lấy theo công thức mua sắm
    let strFomular = this.type() === PlanCategoryEnum.PROCUREMENT && objFormula.formulaProcurement ? objFormula.formulaProcurement : objFormula.formula;
    if (this.updateBudgetPlan() && item.monthIsPerform) {
      if (objFormula.formulaUpdateBudgetPlan) {
        strFomular = objFormula.formulaUpdateBudgetPlan;
      }
    }
    if (!!strFomular) {
      item[key] = this.calculateFormula(item, strFomular);
    }
    return item[key];
  }

  // hàm tính tổng theo group (rowspan)
  getTotalByGroup(index: number, key: string, control: string) {
    let data: any = this.dataSource.data[index];
    const filterData = this.dataSource.data.filter((item: any) => this.groupFormula(item, data, formula[key].groupFormula));
    data[control] = filterData.map((t: any) => t[key]).reduce((acc, value) => acc + value, 0);
  }

  // Hàm tính toán dựa trên công thức động
  calculateFormula(data: any, formula: string, key?: string): number {
    // Sử dụng Function để tạo hàm động từ công thức
    const dynamicFunction = new Function(
      'data',
      `return ${formula};`    // Công thức cần tính
    );
    //Các tháng đã thực hiện: không tính toán 
    const currentMonth = new Date().getUTCMonth();
    const periodMonth = new Date(data.periodStart).getUTCMonth();
    if (this.updateBudgetPlan() && periodMonth <= currentMonth && key) {
      return data[key];
    }
    return Math.round(dynamicFunction(data));
  }

  // hàm filter theo group
  groupFormula(dataSource: any, dataTarget: any, formula: string): any {
    let formulaArr = formula.split(' ').map((item: string) => item.trim());
    if (formulaArr.length > 0) {
      formulaArr.forEach((item: string, index: number) => {
        if (!(item.includes('&&') || item.includes('||'))) {
          formulaArr[index] = `dataSource.${item} === dataTarget.${item}`;
        }
      });
      formula = formulaArr.join(' ');
      const dynamicFunction = new Function(
        'dataSource', 'dataTarget',
        `return ${formula};`
      );
      const calFormular = dynamicFunction(dataSource, dataTarget);
      return calFormular;
    }
    return false
  }

  clickEdit(data: any, control: string) {
    data[control] = true;
  }
  clickOutside(data: any, control: string) {
    data[control] = false;
  }
}