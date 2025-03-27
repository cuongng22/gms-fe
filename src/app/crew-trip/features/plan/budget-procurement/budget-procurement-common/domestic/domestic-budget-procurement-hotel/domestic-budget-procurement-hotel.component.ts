import { CommonModule, DatePipe } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  effect,
  inject,
  input,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { ClickOutside } from 'ngxtension/click-outside';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { truncateDate } from 'src/app/crew-trip/shared/utils/common';
import { Constant, round } from 'src/app/crew-trip/shared/utils/constant';
import { PADDING_0, PlanCategoryEnum } from '../../../budget-procurement.model';
import {
  formula,
  getHeaderRowDef1,
  getHeaderRowDef2,
  getRowDef,
} from './domestic-budget-procurement-hotel.model';
import { ThousandsSeparatorDirective } from 'src/app/crew-trip/shared/directive/thousand-separator.directive';
import moment from 'moment';

@Component({
  selector: 'app-domestic-budget-procurement-hotel',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatFormFieldModule,
    MatFormField,
    MatInputModule,
    InputSizeComponent,
    FormsModule,
    ReactiveFormsModule,
    ClickOutside,
    MatButtonModule,
    DataTransformPipe,
    DigitOnlyModule, ThousandsSeparatorDirective
  ],
  templateUrl: './domestic-budget-procurement-hotel.component.html',
  styleUrl: './domestic-budget-procurement-hotel.component.scss',
  providers: [DatePipe, DataTransformPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DomesticBudgetProcurementHotelComponent
  implements OnInit, AfterViewChecked {
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

  startDatePlanGroup: any;
  endDatePlanGroup: any;
  resultTotal: { [key: string]: number } = {}; // dùng để lưu trữ giá trị tổng cho dòng cuối cùng trong bảng

  round = round;
  constructor(private datePipe: DatePipe, private cdRef: ChangeDetectorRef) {
    effect(() => {
      if (this.data() && Object.keys(this.data()).length > 0) {
        this.setDataSource(this.data().planHotels, this.data().isSummary);
      }
    });
  }

  ngOnInit(): void {
    this.startDatePlanGroup = new Date(this.yearPlan(), 0, 1);
    this.endDatePlanGroup = new Date(this.yearPlan(), 10, 1);
    this.getRow();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges(); // Phát hiện và cập nhật các thay đổi
  }

  setDataSource(data: any[], isSummary?: boolean) {
    this.dataSource.data = [...(data ?? [])];
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

  getDataSource() {
    const _stringData = JSON.stringify(this.dataSource.data);
    let _jsonData = JSON.parse(_stringData);
    _jsonData.forEach((item: any, index: number) => {
      // Tổng Số phòng đơn
      item.totalSingleRoom = round(item.totalSingleRoom);
      // Tổng Số phòng đôi
      item.totalDoubleRoom = round(item.totalDoubleRoom);
      // Thành tiền chưa vat
      item.totalAmount = round(item.totalAmount);
      // Thành tiền  có vat
      item.totalAmountVat = round(item.totalAmountVat);

      // Thành tiền có vat của năm thực hiện
      item.totalAmountYearPerformVat = round(item.totalAmountYearPerformVat);
    });
    return _jsonData;
  }

  getRow(): void {
    this.headerRowDef1 = getHeaderRowDef1(null, this.type());
    this.headerRowDef2 = getHeaderRowDef2(null, this.type());
    this.rowDef = getRowDef(null, this.type());
  }

  /**
   *
   * @param item Giá trị từng dòng của dataSource theo công thức
   */
  private calculateData(item: any, index: number, isCalculate?: boolean) {
    if (isCalculate) {
      // Tổng Số phòng đơn
      this.calculate(item, 'totalSingleRoom');
      // Tổng Số phòng đôi
      this.calculate(item, 'totalDoubleRoom');
      // Thành tiền chưa vat
      this.calculate(item, 'totalAmount', true);
      // Thành tiền  có vat
      this.calculate(item, 'totalAmountVat', true);

      if (new Date(item.periodStart) < this.startDatePlanGroup) {
        // thành tiền có vat của tháng 12 năm ngoái (12/2024 cho kế hoạch 2025)
        this.calculate(item, 'totalAmountVatLastYear', true);
        console.log('item.totalAmountVatLastYear: ', item.totalAmountVatLastYear);
        item.totalAmountVat = item.totalAmountVatLastYear
      }
      // Thành tiền có vat của năm thực hiện
      this.calculate(item, 'totalAmountYearPerformVat', true);
    }
  }

  // hàm công thức tính chung
  calculate(item: any, key: string, isRound?: boolean, fractionDigits?: number) {
    // let data: any = this.dataSource.data[index];
    // Check lập kế hoạch sản lượng thay đổi
    // Tháng nào đã thực hiện thì tính theo công thưc mới
    const objFormula = formula[key];
    let strFomular = objFormula.formula;
    // if (this.updateBudgetPlan() && item.monthIsPerform) {
    //   if (objFormula.formulaUpdateBudgetPlan) {
    //     strFomular = objFormula.formulaUpdateBudgetPlan;
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
    const result = dynamicFunction(data, null, this.ctz);
    return result;
  }
  // convertToZero
  ctz(value: any) {
    if (value) {
      return new Number(value.toString().replace(',', '.'));
    }
    return 0;
  }

  // TÍnh dòng tổng
  setTotal(control: string) {
    //Cột Thành tiền VND - bao gồm VAT:   tính tổng từ T12/2024-T11/2025,   còn các cột còn lại đều tính tổng từ T1/2025-T12/2025
    // const startDatePlanGroup = new Date(this.yearPlan(), 0, 1);
    let totalValue = 0
    if (this.type() === PlanCategoryEnum.BUDGET && control === 'totalAmountVat') {
      // const endDatePlanGroup = new Date(this.yearPlan(), 10, 1);
      totalValue = this.dataSource.data.map((t: any) => {
        if (truncateDate(new Date(t['periodStart'])) <= truncateDate(this.endDatePlanGroup)) {
          return round(Number(t[control]));
        } else {
          return round(Number(t['totalAmountYearPerformVat']))
        }
      }).reduce((acc, value) => acc + value, 0);
      this.resultTotal[control] = totalValue;
      return;
    }
    totalValue = this.dataSource.data.map((t: any) => {
      if (truncateDate(new Date(t['periodStart'])) >= truncateDate(this.startDatePlanGroup)) {
        return round(Number(t[control]));
      }
      return 0;
    }).reduce((acc, value) => acc + value, 0);
    this.resultTotal[control] = totalValue;
  }


  getTotal(control: string) {
    return this.resultTotal[control] ?? 0
  }

  calculateTotal() {
    this.setTotal('singleRoomYearPerform')
    this.setTotal('doubleRoomYearPerform')
    this.setTotal('singleRoom')
    this.setTotal('doubleRoom')
    this.setTotal('singleRoomExtra')
    this.setTotal('doubleRoomExtra')
    this.setTotal('totalSingleRoom')
    this.setTotal('totalDoubleRoom')
    this.setTotal('totalAmount')
    this.setTotal('totalAmountVat')

  }

  clickEdit(data: any, control: string) {
    data[control] = true;
  }

  clickOutside(data: any, control: string) {
    data[control] = false;
    if (['priceSingleRoomEditing', 'priceSingleRoomVatEditing', 'priceDoubleRoomEditing',
      'priceDoubleRoomVatEditing', 'singleRoomExtraEditing', 'doubleRoomExtraEditing',
      'singleRoomEditing', 'doubleRoomEditing']
      .includes(control)) {
      this.calculateData(data, 0, true)
    }
    this.calculateTotal()
  }
}
