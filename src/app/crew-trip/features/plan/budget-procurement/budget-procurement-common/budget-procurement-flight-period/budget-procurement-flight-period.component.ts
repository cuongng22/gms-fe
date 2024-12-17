import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { ClickOutside } from 'ngxtension/click-outside';
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
  providers: [DatePipe]
})
export class BudgetProcurementFlightPeriodComponent implements OnInit {

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ["period", "aircraftType", "numberOfFlight"];
  periodRowspan = 0;
  periods: string[] = [];

  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {

  }

  setDataSource(data: any[]) {
    this.dataSource.data = data;
    this.periodRowspan = this.dataSource.data.map((item: any) => item.aircraftType).
      filter((value: any, index: any, self: any) => self.indexOf(value) === index).length;

    this.dataSource.data.forEach((item: any) => {
      const period = `${item.periodStartStr} - ${item.periodEndStr}`;
      if (!this.periods.includes(period)) {
        this.periods.push(period);
        item.period = period;
      }
    });
  }


  clickEdit(data: any) {
    data.editing = true;
  }
  clickOutside(data: any) {
    data.editing = false;
  }
}
