import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { ClickOutside } from 'ngxtension/click-outside';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { truncateDate } from 'src/app/crew-trip/shared/utils/common';
import { Constant, ctz } from 'src/app/crew-trip/shared/utils/constant';
import { PlanCategoryEnum } from '../../../../budget-procurement/budget-procurement.model';
import { formula, getHeaderRowDef1, getHeaderRowDef2, getRowDef } from './domestic-estimated-cost-car-rental.model';
import { round } from 'lodash';

@Component({
  selector: 'app-domestic-estimated-cost-car-rental',
  standalone: true,
  imports: [
    MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside, MatButtonModule, DataTransformPipe, DigitOnlyModule
  ],
  templateUrl: './domestic-estimated-cost-car-rental.component.html',
  styleUrl: './domestic-estimated-cost-car-rental.component.scss',
  providers: [DatePipe, DataTransformPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DomesticEstimatedCostCarRentalComponent {

  yearPlan = input<number>(2024); // năm kế hoạch
  data = input<any>();
  disabled = input<boolean>(false);

  dataTransformPipe = inject(DataTransformPipe);
  dataSource = new MatTableDataSource();

  headerRowDef1: string[] = [];
  headerRowDef2: string[] = [];
  rowDef: string[] = [];

  PlanCategoryEnum = PlanCategoryEnum;

  resultTotal: { [key: string]: number } = {}; // dùng để lưu trữ giá trị tổng cho dòng cuối cùng trong bảng
  round = round;
  constructor(private datePipe: DatePipe, private cdRef: ChangeDetectorRef) {
    effect(() => {
      console.log('effect data DomesticEstimatedCostCarRentalComponent: ', this.data())
      if (this.data() && Object.keys(this.data()).length > 0) {
        this.setDataSource(this.data().planCarentals, this.data().isSummary);
      }
    })
  }
  ngOnInit(): void {
    this.getRow();
  }

  setDataSource(data: any, isSummary?: boolean) {
    this.dataSource.data = [...data]
    this.getRow();
    this.dataSource.data.forEach((item: any, index) => {
      let period = `Tháng ${this.dataTransformPipe.transform(item.periodStart, [Constant.DATE, Constant.MONTH_FORMAT])}`;
      item.periodLabel = period;
      this.calculateData(item, index, isSummary);
    });
    this.calculateTotal()
  }
  calculateTotal() {
    this.setTotal('numberVehicles')
    this.setTotal('numberVehiclesYearPerform')
    this.setTotal('singleRoom')
    this.setTotal('doubleRoom')
    this.setTotal('totalAmount', true)
    this.setTotal('totalAmountVat', true)
  }

  // TÍnh dòng tổng 
  setTotal(control: string, isRound?: boolean, fractionDigits?: number) {
    //Cột Thành tiền VND - bao gồm VAT:   tính tổng từ T12/2024-T11/2025,   còn các cột còn lại đều tính tổng từ T1/2025-T12/2025
    // const startDatePlanGroup = new Date(this.yearPlan(), 0, 1);
    const totalValue = Math.round(this.dataSource.data.map((t: any) => {
      // if (truncateDate(new Date(t['periodStart'])) >= truncateDate(startDatePlanGroup)) {
        return isRound ? round(Number(t[control]), fractionDigits) : Number(t[control]);
      // }
      // return 0;
    }).reduce((acc, value) => acc + value, 0));
    this.resultTotal[control] = totalValue;
  }

  getTotal(control: string) {
    return this.resultTotal[control] ?? 0
  }

  getRow(): void {
    this.headerRowDef1 = getHeaderRowDef1();
    this.headerRowDef2 = getHeaderRowDef2();
    this.rowDef = getRowDef();
  }


  
    /**
     *
     * @param item Giá trị từng dòng của dataSource theo công thức
     */
    private calculateData(item: any, index: number, isCalculate?: boolean) {
      if (isCalculate) {
        // Số tiền chưa Vat
        this.calculate(item, 'totalAmount', true);
        // Số tiền có Vat
        this.calculate(item, 'totalAmountVat', true);
  
  
        // Số tiền chưa Vat của năm thực hiện
        this.calculate(item, 'totalAmountPerform', true);
        // Số tiền có Vat của năm thực hiện
        this.calculate(item, 'totalAmountVatPerform', true);
      }
    }
  
  
  
    // hàm công thức tính chung
    calculate(item: any, key: string, isRound?: boolean, fractionDigits?: number) {
      // let data: any = this.dataSource.data[index];
      // Check lập kế hoạch sản lượng thay đổi
      // Tháng nào đã thực hiện thì tính theo công thưc mới
      const objFormula = formula[key];
      let strFomular = objFormula.formula;
      // if (item.monthIsPerform) {
      //   if (objFormula.formulaYearPerform) {
      //     strFomular = objFormula.formulaYearPerform;
      //   }
      // }
      if (strFomular) {
        item[key] = this.calculateFormula(item, strFomular);
      }
      if (isRound) {
        item[key] = round(item[key], fractionDigits);
      }
      return item[key];
    }
  
    // Hàm tính toán dựa trên công thức động
    calculateFormula(data: any, formula: string): number {
      // Sử dụng Function để tạo hàm động từ công thức
      const dynamicFunction = new Function(
        'data', 'generalData', 'ctz',
        `return ${formula};`    // Công thức cần tính
      );
      const result = dynamicFunction(data, null, ctz);
      return result;
    }
}
