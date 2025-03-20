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
import { Constant, round } from 'src/app/crew-trip/shared/utils/constant';
import { truncateDate } from 'src/app/crew-trip/shared/utils/common';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { PlanCategoryEnum } from '../../../budget-procurement.model';
import moment from 'moment';
import { ThousandsSeparatorDirective } from 'src/app/crew-trip/shared/directive/thousand-separator.directive';

@Component({
  selector: 'app-international-budget-procurement-car-rental',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside, MatButtonModule, DataTransformPipe, DigitOnlyModule, ClickOutside, ThousandsSeparatorDirective],
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
  disabled = input<boolean>(false);

  PlanCategoryEnum = PlanCategoryEnum;

  planFlightPeriods: any[] = []; // danh sách chuyến bay theo giai đoạn
  resultTotal: { [key: string]: number } = {}; // dùng để lưu trữ giá trị tổng cho dòng cuối cùng trong bảng

  constructor(private datePipe: DatePipe, private cdRef: ChangeDetectorRef) {
    effect(() => {
      if (this.data()) {
        this.setPlanFlightPeriods(this.data().planFlightPeriods ?? []);
        this.setDataSource(this.data().planCarentals ?? [], this.data().isSummary);
      }
    })
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges(); // Phát hiện và cập nhật các thay đổi
  }
  ngOnInit(): void {

  }

  setDataSource(data: any[], isSummary?: boolean) {
    this.dataSource.data = [...data];
    this.dataSource.data.forEach((item: any, index) => {
      let period = '';
      if (this.type() === PlanCategoryEnum.PROCUREMENT) {
        period = `T${this.dataTransformPipe.transform(item.periodStart, [Constant.DATE, Constant.MONTH_FORMAT])} - T${this.dataTransformPipe.transform(item.periodEnd, [Constant.DATE, Constant.MONTH_FORMAT])}`;
      } else {
        period = `Tháng ${this.dataTransformPipe.transform(item.periodStart, [Constant.DATE, Constant.MONTH_FORMAT])}`;
      }
      item.period = period;
      this.calculateData(item, index, isSummary);
    });
    this.calculateTotal()
  }

  getDataSource() {
    const _stringData = JSON.stringify(this.dataSource.data);
    let _jsonData = JSON.parse(_stringData);
    _jsonData.forEach((item: any, index: number) => {
      //Số chuyến bay theo tàu 
      item.totalFlightByAircraft = round(item.totalFlightByAircraft);

      //Thành tiền (ngoại tệ) - Chưa bao gồm VAT
      item.totalAmountForeign = round(item.totalAmountForeign);
      //Thành tiền (ngoại tệ) - Bao gồm VAT
      item.totalAmountForeignVat = round(item.totalAmountForeignVat);
      //Thành tiền VND (Chưa bao gồm VAT)
      item.totalAmount = round(item.totalAmount);
      //Thành tiền VND (Bao gồm VAT)
      item.totalAmountVat = round(item.totalAmountVat);
    })
    return _jsonData;
  }

  setExchangeRate(exchangeRateData: any) {
    this.dataSource.data.forEach((item: any, index) => {
      if (PlanCategoryEnum.BUDGET === this.type()) {

        const _periodStart = moment(item.periodStart);
        const _exchangeRate = exchangeRateData[_periodStart.format('MMM').toLowerCase()]
        if (_exchangeRate) {
          item.rateInPeriod = _exchangeRate;
        }
      } else {
        item.rateInPeriod = exchangeRateData.average
      }
      this.calculateData(item, index, true);
    });
    this.calculateTotal()
  }

  setPrice(priceData: any[]) {
    const _priceTransportation = priceData.find((item: any) => item.code === 'transportation') as any;
    this.dataSource.data.forEach((item: any, index: number) => {
      item.unitPrice = _priceTransportation.priceBeforeTax;
      item.unitPriceVat = _priceTransportation.priceAfterTax;
      this.calculateData(item, index, true);
    })
    this.calculateTotal()
  }

  private calculateData(item: any, index?: number, isSummary?: boolean) {
    if (isSummary) {

      if (this.type() === PlanCategoryEnum.PROCUREMENT) {
        //Số lượng chuyến bay theo giai đoạn
        item.numberFlight = this.planFlightPeriods.filter((t: any) =>
          t.periodStart === item.periodStart && t.periodEnd === item.periodEnd
        ).map((t: any) => t.numberOfFlight).reduce((acc, value) => acc + value, 0);
      }

      if (!item.monthIsPerform) {
        //Số lượt xe
        this.calculate(item, 'numberVehicles');
      }
      //Thành tiền (ngoại tệ) - Chưa bao gồm VAT
      this.calculate(item, 'totalAmountForeign');
      //Thành tiền (ngoại tệ) - Bao gồm VAT
      this.calculate(item, 'totalAmountForeignVat');
      //Thành tiền VND (Chưa bao gồm VAT)
      this.calculate(item, 'totalAmount');
      //Thành tiền VND (Bao gồm VAT)
      this.calculate(item, 'totalAmountVat');
    }

  }
  setPlanFlightPeriods(data: any[]) {
    this.planFlightPeriods = data;
  }

  // TÍnh dòng tổng 
  setTotal(control: string) {
    //Cột Thành tiền VND - bao gồm VAT:   tính tổng từ T12/2024-T11/2025,   còn các cột còn lại đều tính tổng từ T1/2025-T12/2025
    let totalValue = 0
    const startDatePlanGroup = new Date(this.yearPlan(), 0, 1);
    if (this.type() === PlanCategoryEnum.BUDGET && ['totalAmountVat', 'totalAmountForeignVat'].includes(control)) {
      const endDatePlanGroup = new Date(this.yearPlan(), 10, 1);
      totalValue = Math.round(this.dataSource.data.map((t: any) => {
        if (truncateDate(new Date(t['periodStart'])) <= truncateDate(endDatePlanGroup)) {
          return round(Number(t[control]));
        }
        return 0;
      }).reduce((acc, value) => acc + value, 0));
      this.resultTotal[control] = totalValue;
      return
    }
    totalValue = Math.round(this.dataSource.data.map((t: any) => {
      if (truncateDate(new Date(t['periodStart'])) >= truncateDate(startDatePlanGroup)) {
        return round(Number(t[control]));
      }
      return 0;
    }).reduce((acc, value) => acc + value, 0));
    this.resultTotal[control] = totalValue;
  }

  getTotal(control: string) {
    return this.resultTotal[control] ?? 0
  }

  calculateTotal() {
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('numberFlight') }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('numberVehicles') }
    if (this.type() === PlanCategoryEnum.BUDGET) { this.setTotal('extraTransfer') }
    this.setTotal('totalAmountForeign')
    this.setTotal('totalAmountForeignVat')
    this.setTotal('totalAmount')
    this.setTotal('totalAmountVat')

  }

  // hàm công thức tính chung
  calculate(item: any, key: string, isRound?: boolean, fractionDigits?: number) {
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
    if (isRound) {
      item[key] = round(item[key], fractionDigits);
    }
    return item[key];
  }

  // hàm tính tổng theo group (rowspan)
  getTotalByGroup(index: number, key: string, control: string) {
    let data: any = this.dataSource.data[index];
    const filterData = this.dataSource.data.filter((item: any) => this.groupFormula(item, data, formula[key].groupFormula));
    data[control] = filterData.map((t: any) => round(t[key])).reduce((acc, value) => acc + value, 0);
  }

  // Hàm tính toán dựa trên công thức động
  calculateFormula(data: any, formula: string, key?: string): number {
    // Sử dụng Function để tạo hàm động từ công thức
    const dynamicFunction = new Function(
      'data', 'ctz',
      `return ${formula};`    // Công thức cần tính
    );
    //Các tháng đã thực hiện: không tính toán 
    const currentMonth = new Date().getUTCMonth();
    const periodMonth = new Date(data.periodStart).getUTCMonth();
    if (this.updateBudgetPlan() && periodMonth <= currentMonth && key) {
      return data[key];
    }
    return (dynamicFunction(data, this.ctz));
  }
  // convertToZero
  ctz(value: any) {
    if (value) {
      return new Number(value.toString().replace(',', '.'));
    }
    return 0;
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
    if (control === 'unitPriceVatEditing') {
      data.unitPrice = Number(data.unitPriceVat) / (1 + (Number(data.taxRate) / 100))
    }
    this.calculateData(data, undefined, true);
    this.calculateTotal()
  }
}