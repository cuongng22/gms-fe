import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClickOutside } from 'ngxtension/click-outside';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
  selector: 'app-budget-procurement-flight-period',
  standalone: true,
  imports: [MatTableModule, CommonModule,MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside],
  templateUrl: './budget-procurement-flight-period.component.html',
  styleUrl: './budget-procurement-flight-period.component.scss'
})
export class BudgetProcurementFlightPeriodComponent implements OnInit {

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ["period", "aircraftType", "numberOfFlight"];

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
  }


  clickEdit(data: any) {
    data.editing = true;
  }
  clickOutside(data: any) {
    data.editing = false;
  }
}
