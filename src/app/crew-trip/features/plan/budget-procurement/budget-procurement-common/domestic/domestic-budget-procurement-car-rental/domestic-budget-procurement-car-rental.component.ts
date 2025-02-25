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
import { getHeaderRowDef1, getHeaderRowDef2, getRowDef } from './domestic-budget-procurement-car-rental.model';
import { truncateDateUTC } from 'src/app/crew-trip/shared/utils/common';
import { PlanCategoryEnum } from '../../../budget-procurement.model';
import { Constant } from 'src/app/crew-trip/shared/utils/constant';
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

  PlanCategoryEnum = PlanCategoryEnum;

  constructor(private readonly datePipe: DatePipe, private readonly cdRef: ChangeDetectorRef) {
    effect(() => {
      if (this.data()) {
        this.setDataSource(this.data());
      }
    })
  }
  ngOnInit(): void {
    this.getRow();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges()
  }

  setDataSource(data: any) {
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
    });
  }

  // TÍnh dòng tổng 
  getTotal(control: string) {
    //Cột Thành tiền VND - bao gồm VAT:   tính tổng từ T12/2024-T11/2025,   còn các cột còn lại đều tính tổng từ T1/2025-T12/2025
    const startDatePlanGroup = new Date(this.yearPlan(), 0, 1);
    if (control === 'totalAmountVat') {
      const endDatePlanGroup = new Date(this.yearPlan(), 10, 1);
      return Math.round(this.dataSource.data.map((t: any) => {
        if (truncateDateUTC(new Date(t['periodStart'])) <= truncateDateUTC(endDatePlanGroup)) {
          return Number(t[control]);
        } else {
          return Number(t['totalAmountYearPerformVat'])
        }
      }).reduce((acc, value) => acc + value, 0));
    }
    return Math.round(this.dataSource.data.map((t: any) => {
      if (truncateDateUTC(new Date(t['periodStart'])) >= truncateDateUTC(startDatePlanGroup)) {
        return Number(t[control]);
      }
      return 0;
    }).reduce((acc, value) => acc + value, 0));;
  }

  getRow(): void {
    this.headerRowDef1 = getHeaderRowDef1(null, this.type());
    this.headerRowDef2 = getHeaderRowDef2(null, this.type());
    this.rowDef = getRowDef(null, this.type());
  }

}
