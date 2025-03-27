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
import { Constant } from 'src/app/crew-trip/shared/utils/constant';
import { PlanCategoryEnum } from '../../../../budget-procurement/budget-procurement.model';
import { getHeaderRowDef1, getHeaderRowDef2, getRowDef } from './domestic-estimated-cost-car-rental.model';

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
    });
    this.calculateTotal()
  }
  calculateTotal() {
    this.setTotal('numberVehicles')
    this.setTotal('numberVehiclesYearPerform')
    this.setTotal('singleRoom')
    this.setTotal('doubleRoom')
    this.setTotal('totalAmount')
    this.setTotal('totalAmountVat')
  }

  // TÍnh dòng tổng 
  setTotal(control: string) {
    //Cột Thành tiền VND - bao gồm VAT:   tính tổng từ T12/2024-T11/2025,   còn các cột còn lại đều tính tổng từ T1/2025-T12/2025
    const startDatePlanGroup = new Date(this.yearPlan(), 0, 1);
    const totalValue = Math.round(this.dataSource.data.map((t: any) => {
      if (truncateDate(new Date(t['periodStart'])) >= truncateDate(startDatePlanGroup)) {
        return Number(t[control]);
      }
      return 0;
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
}
