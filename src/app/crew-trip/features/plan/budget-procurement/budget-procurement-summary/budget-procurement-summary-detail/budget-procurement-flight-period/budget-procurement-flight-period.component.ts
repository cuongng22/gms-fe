import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClickOutside } from 'ngxtension/click-outside';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { Constant } from 'src/app/crew-trip/shared/utils/constant';

@Component({
  selector: 'app-budget-procurement-flight-period',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside],
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
    this.dataSource.data = [

      {
        periodStart: new Date(2025, 1, 1),
        periodEnd: new Date(2025, 12, 1),
        aircraftType: "B787",
        numberOfFlight: 10
      },
      {
        periodStart: new Date(2025, 1, 1),
        periodEnd: new Date(2025, 12, 1),
        aircraftType: "A321",
        numberOfFlight: 10
      },
      {
        periodStart: new Date(2026, 1, 1),
        periodEnd: new Date(2026, 12, 1),
        aircraftType: "B787",
        numberOfFlight: 10
      },
      {
        periodStart: new Date(2026, 1, 1),
        periodEnd: new Date(2026, 12, 1),
        aircraftType: "A321",
        numberOfFlight: 10
      }, {
        periodStart: new Date(2027, 1, 1),
        periodEnd: new Date(2027, 4, 1),
        aircraftType: "B787",
        numberOfFlight: 10
      },
      {
        periodStart: new Date(2027, 1, 1),
        periodEnd: new Date(2027, 4, 1),
        aircraftType: "A321",
        numberOfFlight: 10
      }
    ];

    this.periodRowspan = this.dataSource.data.map((item: any) => item.aircraftType).filter((value: any, index: any, self: any) => self.indexOf(value) === index).length;

    this.dataSource.data.forEach((item: any) => {
      const period = `T${this.datePipe.transform(item.periodStart, Constant.MONTH_FORMAT)} - T${this.datePipe.transform(item.periodEnd, Constant.MONTH_FORMAT)}`;
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
