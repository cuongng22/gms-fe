import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { ClickOutside } from 'ngxtension/click-outside';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { truncateDateUTC } from 'src/app/crew-trip/shared/utils/common';
import { Constant } from 'src/app/crew-trip/shared/utils/constant';
import { PlanCategoryEnum, PADDING_0 } from '../../../../budget-procurement/budget-procurement.model';
import { getHeaderRowDef1, getHeaderRowDef2, getRowDef, formula } from './domestic-estimated-cost-hotel.model';

@Component({
  selector: 'app-domestic-estimated-cost-hotel',
  standalone: true,
  imports: [
    MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside, MatButtonModule, DataTransformPipe, DigitOnlyModule
  ],
  templateUrl: './domestic-estimated-cost-hotel.component.html',
  styleUrl: './domestic-estimated-cost-hotel.component.scss',
  providers: [DatePipe, DataTransformPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DomesticEstimatedCostHotelComponent implements OnInit, AfterViewChecked {

  yearPlan = input<number>(2024); // năm kế hoạch
  data = input<any>();
  disabled = input<boolean>(false);

  dataTransformPipe = inject(DataTransformPipe);
  dataSource = new MatTableDataSource();

  headerRowDef1: string[] = [];
  headerRowDef2: string[] = [];
  rowDef: string[] = [];

  PADDING_0 = PADDING_0;
  PlanCategoryEnum = PlanCategoryEnum;

  constructor(private datePipe: DatePipe, private cdRef: ChangeDetectorRef) {
    effect(() => {
      console.log('effect data DomesticBudgetProcurementHotelComponent: ', this.data())
      if (this.data()) {
        this.setDataSource(this.data());
      }
    })
  }
  ngOnInit(): void {
    this.getRow();
  }
  ngAfterViewChecked(): void {
    this.cdRef.detectChanges(); // Phát hiện và cập nhật các thay đổi
  }


  setDataSource(data: any[]) {
    this.dataSource.data = [...data];
    this.getRow();

    this.dataSource.data.forEach((item: any, index) => {
      let period = `Tháng ${this.dataTransformPipe.transform(item.periodStart, [Constant.DATE, Constant.MONTH_FORMAT])}`;
      item.periodLabel = period;
      this.calculateData(item, index);
    });
  };

  getRow(): void {
    this.headerRowDef1 = getHeaderRowDef1(null);
    this.headerRowDef2 = getHeaderRowDef2(null);
    this.rowDef = getRowDef(null);
  }

  /**
   * 
   * @param item Giá trị từng dòng của dataSource theo công thức
   */
  private calculateData(item: any, index: number) {
    // Tổng Số phòng đơn
    this.calculate(item, 'totalSingleRoom');
    // Tổng Số phòng đôi
    this.calculate(item, 'totalDoubleRoom');
    // Thành tiền chưa vat
    this.calculate(item, 'totalAmount');
    // Thành tiền chưa có vat
    this.calculate(item, 'totalAmountVat');
    // Thành tiền có vat của năm thực hiện
    // this.calculate(item, 'totalAmountYearPerformVat');
  }


  // hàm công thức tính chung
  calculate(item: any, key: string) {
    // let data: any = this.dataSource.data[index];
    // Check lập kế hoạch sản lượng thay đổi
    // Tháng nào đã thực hiện thì tính theo công thưc mới
    const objFormula = formula[key];
    let strFomular = objFormula.formula;
    if (!!strFomular) {
      item[key] = this.calculateFormula(item, strFomular);
    }
    return item[key];
  }

  // Hàm tính toán dựa trên công thức động
  calculateFormula(data: any, formula: string): number {
    // Sử dụng Function để tạo hàm động từ công thức
    const dynamicFunction = new Function(
      'data', 'generalData',
      `return ${formula};`    // Công thức cần tính
    );
    const result = dynamicFunction(data, null);
    return Math.round(result);
  }

  // TÍnh dòng tổng 
  getTotal(control: string) {
    //Cột Thành tiền VND - bao gồm VAT:   tính tổng từ T12/2024-T11/2025,   còn các cột còn lại đều tính tổng từ T1/2025-T12/2025
    const startDatePlanGroup = new Date(this.yearPlan(), 0, 1);
    // if (control === 'totalAmountVat') {
    //   const endDatePlanGroup = new Date(this.yearPlan(), 10, 1);
    //   return Math.round(this.dataSource.data.map((t: any) => {
    //     if (truncateDateUTC(new Date(t['periodStart'])) <= truncateDateUTC(endDatePlanGroup)) {
    //       return Number(t[control]);
    //     } else {
    //       return Number(t['totalAmountYearPerformVat'])
    //     }
    //   }).reduce((acc, value) => acc + value, 0));
    // }
    return Math.round(this.dataSource.data.map((t: any) => {
      if (truncateDateUTC(new Date(t['periodStart'])) >= truncateDateUTC(startDatePlanGroup)) {
        return Number(t[control]);
      }
      return 0;
    }).reduce((acc, value) => acc + value, 0));;
  }



  clickEdit(data: any, control: string) {
    data[control] = true;
  }
  clickOutside(data: any, control: string) {
    data[control] = false;
  }

}
