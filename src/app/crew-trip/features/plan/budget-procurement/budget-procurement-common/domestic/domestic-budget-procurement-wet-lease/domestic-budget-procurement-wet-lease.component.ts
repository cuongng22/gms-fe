import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { ClickOutside } from 'ngxtension/click-outside';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { formula, getHeaderRowDef1, getHeaderRowDef2, getRowDef } from './domestic-budget-procurement-wet-lease.model';
import { truncateDateUTC } from 'src/app/crew-trip/shared/utils/common';
import { PADDING_0, PlanCategoryEnum } from '../../../budget-procurement.model';

@Component({
  selector: 'app-domestic-budget-procurement-wet-lease',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside, MatButtonModule, DataTransformPipe, DigitOnlyModule, ClickOutside],
  templateUrl: './domestic-budget-procurement-wet-lease.component.html',
  styleUrl: './domestic-budget-procurement-wet-lease.component.scss',
  providers: [DatePipe, DataTransformPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DomesticBudgetProcurementWetLeaseComponent {
  dataTransformPipe = inject(DataTransformPipe);
  dataSource = new MatTableDataSource();

  headerRowDef1: string[];
  headerRowDef2: string[];
  rowDef: string[];

  updateBudgetPlan = input<boolean | undefined>(false); //tích chọn check box Lập kế hoạch sản lượng thay đổi
  yearPlan = input<number>(2024); // năm kế hoạch
  type = input<PlanCategoryEnum>(PlanCategoryEnum.BUDGET); // Loại Ngân sách hoặc mua sắm (budget/procurement)

  planFlightPeriods: any[] = []; // danh sách chuyến bay theo giai đoạn
  year = signal<number>(2024);
  data = input<any>();

  PADDING_0 = PADDING_0;

  constructor(private datePipe: DatePipe, private cdRef: ChangeDetectorRef) {
    effect(() => {
      console.log('effect data DomesticBudgetProcurementWetLeaseComponent: ', this.data())
      if (this.data()) {
        this.setDataSource(this.data());
      }
    }, { allowSignalWrites: true })
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges(); // Phát hiện và cập nhật các thay đổi
  }
  ngOnInit(): void {
    this.getRow();
  }

  calculateData(item: any, index: number) {
    // Thành tiền chưa VAT
    this.calculate(item, 'totalAmount');
    // Thành tiền có VAT
    this.calculate(item, 'totalAmountVat');
  }

  setDataSource(data: any[]) {
    console.log('DomesticBudgetProcurementWetLeaseComponent: ', data);
    if (!data || data.length === 0) {
      const year = this.type() === PlanCategoryEnum.BUDGET ? this.yearPlan() : (Number(this.yearPlan()) + 1);
      this.dataSource.data = [{
        id: null,
        content: 'Phòng đơn/đôi',
        year: year
      }];
      this.year.set(year);
    } else {
      this.dataSource.data = [...data];
      this.year.set(data[0].year);
    }
    this.getRow();
    this.dataSource.data.forEach((item: any, index) => {
      this.calculateData(item, index);
    });
  }


  getRow(): void {
    this.headerRowDef1 = getHeaderRowDef1(null, this.type());
    this.headerRowDef2 = getHeaderRowDef2(null, this.type());
    this.rowDef = getRowDef(null, this.type());
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
    // let data: any = this.dataSource.data[index];
    // Check lập kế hoạch sản lượng thay đổi
    // Tháng nào đã thực hiện thì tính theo công thưc mới
    const objFormula = formula[key];
    let strFomular = objFormula.formula;
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

  // Hàm tính toán dựa trên công thức động
  calculateFormula(data: any, formula: string): number {
    // Sử dụng Function để tạo hàm động từ công thức
    const dynamicFunction = new Function(
      'data',
      `return ${formula};`    // Công thức cần tính
    );
    const result = dynamicFunction(data);
    return Math.round(result);
  }

  clickEdit(data: any, control: string) {
    data[control] = true;
  }
  clickOutside(data: any, control: string) {
    data[control] = false;
  }
}
