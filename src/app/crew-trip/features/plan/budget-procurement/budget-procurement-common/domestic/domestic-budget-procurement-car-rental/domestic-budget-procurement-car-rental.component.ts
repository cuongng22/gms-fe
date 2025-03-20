import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { ClickOutside } from 'ngxtension/click-outside';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { formula, getHeaderRowDef1, getHeaderRowDef2, getRowDef } from './domestic-budget-procurement-car-rental.model';
import { truncateDate } from 'src/app/crew-trip/shared/utils/common';
import { PADDING_0, PlanCategoryEnum } from '../../../budget-procurement.model';
import { Constant, ctz, round } from 'src/app/crew-trip/shared/utils/constant';
import moment from 'moment';

@Component({
  selector: 'app-domestic-budget-procurement-car-rental',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside, MatButtonModule, DataTransformPipe, DigitOnlyModule],
  templateUrl: './domestic-budget-procurement-car-rental.component.html',
  styleUrl: './domestic-budget-procurement-car-rental.component.scss',
  providers: [DatePipe, DataTransformPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DomesticBudgetProcurementCarRentalComponent implements AfterViewChecked {

  yearPlan = input<number>(2024); // năm kế hoạch
  updateBudgetPlan = input<boolean | undefined>(false); //tích chọn check box Lập kế hoạch sản lượng thay đổi
  type = input<PlanCategoryEnum>(PlanCategoryEnum.BUDGET); // Loại Ngân sách hoặc mua sắm (budget/procurement)
  data = input<any>();
  disabled = input<boolean>(false);

  dataTransformPipe = inject(DataTransformPipe);
  dataSource = new MatTableDataSource();

  headerRowDef1: string[] = [];
  headerRowDef2: string[] = [];
  rowDef: string[] = [];

  PADDING_0 = PADDING_0;

  PlanCategoryEnum = PlanCategoryEnum;

  resultTotal: { [key: string]: number } = {}; // dùng để lưu trữ giá trị tổng cho dòng cuối cùng trong bảng
  round = round;
  constructor(private readonly datePipe: DatePipe, private readonly cdRef: ChangeDetectorRef) {
    effect(() => {
      if (this.data()) {
        this.setDataSource(this.data().planCarentals, this.data().isSummary);
      }
    })
  }
  ngOnInit(): void {
    this.getRow();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges()
  }

  setDataSource(data: any[], isSummary?: boolean) {
    if (data && data.length > 0) {
      this.dataSource.data = [...data]
      this.getRow();
      this.dataSource.data.forEach((item: any, index) => {
        let period = '';
        if (this.type() === PlanCategoryEnum.PROCUREMENT) {
          period = `T${this.dataTransformPipe.transform(item.periodStart, [Constant.DATE, Constant.MONTH_FORMAT])} - T${this.dataTransformPipe.transform(item.periodEnd, [Constant.DATE, Constant.MONTH_FORMAT])}`;
        } else {
          // period = `Tháng ${this.dataTransformPipe.transform(item.periodStart, [Constant.DATE, Constant.MONTH_FORMAT])}`;
          period = moment(item.periodStart).locale('en').format('MMMM')
        }
        item.periodLabel = period;
        this.calculateData(item, index, isSummary);
      });
      this.calculateTotal()
    }

  }

  // TÍnh dòng tổng 
  setTotal(control: string) {
    //Cột Thành tiền VND - bao gồm VAT:   tính tổng từ T12/2024-T11/2025,   còn các cột còn lại đều tính tổng từ T1/2025-T12/2025
    let totalValue = 0;
    const startDatePlanGroup = new Date(this.yearPlan(), 0, 1);
    if (this.type() === PlanCategoryEnum.BUDGET && control === 'totalAmountVat') {
      const endDatePlanGroup = new Date(this.yearPlan(), 10, 1);
      totalValue = Math.round(this.dataSource.data.map((t: any) => {
        if (truncateDate(new Date(t['periodStart'])) <= truncateDate(endDatePlanGroup)) {
          return round(Number(t[control]));
        } else {
          return round(Number(t['totalAmountVatPerform']));
        }
      }).reduce((acc, value) => acc + value, 0));
      this.resultTotal[control] = totalValue;
      return;
    }
    totalValue = Math.round(this.dataSource.data.map((t: any) => {
      if (truncateDate(new Date(t['periodStart'])) >= truncateDate(startDatePlanGroup)) {
        return round(Number(t[control]));
      }
      return 0;
    }).reduce((acc, value) => acc + value, 0));
    this.resultTotal[control] = totalValue;
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


  getTotal(control: string) {
    return this.resultTotal[control] ?? 0
  }

  calculateTotal() {
    this.setTotal('numberVehiclesYearPerform')
    this.setTotal('numberVehicles')
    this.setTotal('singleRoom')
    this.setTotal('doubleRoom')
    this.setTotal('totalAmount')
    this.setTotal('totalAmountVat')
  }

  getRow(): void {
    this.headerRowDef1 = getHeaderRowDef1(null, this.type());
    this.headerRowDef2 = getHeaderRowDef2(null, this.type());
    this.rowDef = getRowDef(null, this.type());
  }


  clickEdit(data: any, control: string) {
    data[control] = true;
  }

  clickOutside(data: any, control: string) {
    data[control] = false;
    this.calculateData(data, 0, true);
    this.calculateTotal()
  }

}
