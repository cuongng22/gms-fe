import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClickOutside } from 'ngxtension/click-outside';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { exampleData, getHeaderRowDef1, getHeaderRowDef2, getRowDef } from './budget-procurement-car-rental.model';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { Constant } from 'src/app/crew-trip/shared/utils/constant';

@Component({
  selector: 'app-budget-procurement-car-rental',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside, MatButtonModule, DataTransformPipe],
  templateUrl: './budget-procurement-car-rental.component.html',
  styleUrl: './budget-procurement-car-rental.component.scss',
  providers: [DatePipe, DataTransformPipe]
})
export class BudgetProcurementCarRentalComponent implements OnInit, AfterViewChecked {

  dataSource = new MatTableDataSource();
  periodRowspan = 0;
  periods: string[] = [];

  headerRowDef1: string[] = getHeaderRowDef1();
  headerRowDef2: string[] = getHeaderRowDef2();
  rowDef: string[] = getRowDef();

  constructor(private datePipe: DatePipe, private cdRef: ChangeDetectorRef) { }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges(); // Phát hiện và cập nhật các thay đổi
  }
  ngOnInit(): void {
    this.dataSource.data = exampleData;

    this.periodRowspan = this.dataSource.data.map((item: any) => item.aircraftType).filter((value: any, index: any, self: any) => self.indexOf(value) === index).length;

    this.dataSource.data.forEach((item: any) => {
      const period = `Tháng ${this.datePipe.transform(item.periodStart, Constant.MONTH_FORMAT)}`;
      if (!this.periods.includes(period)) {
        this.periods.push(period);
        item.period = period;
      }
    });

  }


  clickEdit(data: any, control: string) {
    data[control] = true;
  }
  clickOutside(data: any, control: string) {
    data[control] = false;
  }
}