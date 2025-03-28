import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { ClickOutside } from 'ngxtension/click-outside';
import { co } from 'node_modules/@fullcalendar/core/internal-common';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { Constant } from 'src/app/crew-trip/shared/utils/constant';

@Component({
  selector: 'app-budget-procurement-flight-period',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside, DigitOnlyModule],
  templateUrl: './budget-procurement-flight-period.component.html',
  styleUrl: './budget-procurement-flight-period.component.scss',
  providers: [DatePipe, DataTransformPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetProcurementFlightPeriodComponent implements OnInit, AfterViewChecked {
  cdRef = inject(ChangeDetectorRef);
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['period', 'aircraftType', 'numberOfFlight'];
  periodRowspan = 0;
  data = input<any>();
  periodsSpan: any = {};
  aircraftTypeSpan: any = {};

  constructor(private datePipe: DatePipe, private dataTransformPipe: DataTransformPipe) {
    effect(() => {
      if (this.data()) {
        // this.periodRowspan = this.data().periodRowspan;
        this.setDataSource(this.data().planFlightPeriods ?? []);
      }
    })
  }

  ngOnInit(): void {

  }
  ngAfterViewChecked(): void {
    this.cdRef.detectChanges()
  }

  setDataSource(data: any[]) {

    this.dataSource.data = [...data];
    this.periodRowspan = this.dataSource.data.map((item: any) => item.aircraftType).
      filter((value: any, index: any, self: any) => self.indexOf(value) === index).length;

    this.calculateSpan();
  }


  calculateSpan() {
    this.periodsSpan = {}
    this.aircraftTypeSpan = {}
    this.dataSource.data.forEach((item: any, index) => {
      item.period = `T${this.dataTransformPipe.transform(item.periodStart, [Constant.DATE, Constant.MONTH_FORMAT])} - T${this.dataTransformPipe.transform(item.periodEnd, [Constant.DATE, Constant.MONTH_FORMAT])}`;;

      // tính toán rowspan cho cột giai đoạn
      if (this.periodsSpan.hasOwnProperty(item.period)) {
        this.periodsSpan[item.period].count += 1;
      } else {
        this.periodsSpan[item.period] = { count: 1, firstIndex: index };
      }

      item.periodStartDate = new Date(item.periodStart)
    });
  }

  clickEdit(data: any) {
    data.editing = true;
  }
  clickOutside(data: any) {
    data.editing = false;
  }
}
