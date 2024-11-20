import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ClickOutside } from 'ngxtension/click-outside';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
  selector: 'app-budget-procurement-flight-overnight',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside, MatButtonModule],
  templateUrl: './budget-procurement-flight-overnight.component.html',
  styleUrl: './budget-procurement-flight-overnight.component.scss'
})
export class BudgetProcurementFlightOvernightComponent {

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ["numberOfOvernight", "flightRate", "action"];

  ngOnInit(): void {
    this.dataSource.data = [

      {
        numberOfOvernight: 1,
        flightRate: 75
      },
      {
        numberOfOvernight: 2,
        flightRate: 25
      }
    ];
  }


  clickEdit(data: any) {
    console.log(data);
    data.editing = true;
    console.log(data);
  }
  clickOutside(data: any) {
    data.editing = false;
  }
}
