import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { ClickOutside } from 'ngxtension/click-outside';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
  selector: 'app-domestic-budget-procurement-flight-rate',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside, MatButtonModule, DigitOnlyModule, MatCardModule, MatTooltipModule],
  templateUrl: './domestic-budget-procurement-flight-rate.component.html',
  styleUrl: './domestic-budget-procurement-flight-rate.component.scss'
})
export class DomesticBudgetProcurementFlightRateComponent {
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ["year", "t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9", "t10", "t11", "t12", "value", "total"];


  setDataSource(data: any) {
    this.dataSource.data = [...data];
  }


  
}
