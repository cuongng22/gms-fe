import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, Input, input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { ClickOutside } from 'ngxtension/click-outside';
import { DigitOnlyModule } from '@uiowa/digit-only';

@Component({
  selector: 'app-international-budget-procurement-flight-rate',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside, DigitOnlyModule
  ],
  templateUrl: './international-budget-procurement-flight-rate.component.html',
  styleUrl: './international-budget-procurement-flight-rate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InternationalBudgetProcurementFlightRateComponent implements OnInit {
  cdRef = inject(ChangeDetectorRef);
  data = input<any>();
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['year', 'rateOrTotal'];

  constructor() {
    effect(() => {
      if (this.data()) {
        this.setDataSource(this.data());
      }
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges(); // Phát hiện và cập nhật các thay đổi
  }

  setDataSource(data: any[]) {
    this.dataSource.data = [...data];
  }

  clickEdit(data: any) {
    data.editing = true;
  }
  clickOutside(data: any) {
    data.editing = false;
  }
}
