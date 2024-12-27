import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { ClickOutside } from 'ngxtension/click-outside';

@Component({
  selector: 'app-budget-procurement-flight-rate',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside
  ],
  templateUrl: './budget-procurement-flight-rate.component.html',
  styleUrl: './budget-procurement-flight-rate.component.scss'
})
export class BudgetProcurementFlightRateComponent implements OnInit {

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['year', 'rateOrTotal'];

  ngOnInit(): void {
    this.dataSource.data = [

      {
        year: 2025,
        value: 5000000,
        type: 'total'
      },
      {
        year: 2026,
        value: 6000000,
        type: 'total'
      },
      {
        year: 2027,
        value: 7000000,
        type: 'total'
      },
      {
        year: 2026,
        rateYear: 2025,
        value: 8000000,
        type: 'rate'
      },
      {
        year: 2027,
        rateYear: 2025,
        value: 9000000,
        type: 'rate'
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
