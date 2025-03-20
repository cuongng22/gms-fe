import { CommonModule } from '@angular/common';
import {AfterContentChecked, Component, inject, Input, input, OnInit} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { InputSizeComponent } from '../../input/input-size.component';
import { MESSAGE } from '../../utils/constant';
import { NgxControlError } from 'ngxtension/control-error';
import { DatepickerYearMonthAdapter } from './datepicker-year-month-adapter.component';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';
const moment = _rollupMoment || _moment;

export const MONTH_MODE_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};


@Component({
  selector: 'app-datepicker-year-month',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDatepickerModule, MatNativeDateModule, NgxMaterialTimepickerModule,
    MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent, NgxControlError, ReactiveFormsModule
  ],
  templateUrl: './datepicker-year-month.component.html',
  styleUrl: './datepicker-year-month.component.scss',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MONTH_MODE_FORMATS },
    { provide: DateAdapter, useClass: DatepickerYearMonthAdapter }
  ],
  hostDirectives: [NgxControlValueAccessor],
})
export class DatepickerYearMonthComponent implements OnInit {
  MESSAGE = MESSAGE;
  size = input<string>('');
  label = input<string>();
  readonly = input<boolean>(false);
  requiredLabel = input<boolean>(false);
  @Input() editInlineTable = false;

  protected datepickerYearMonth = inject<NgxControlValueAccessor<any>>(
    NgxControlValueAccessor,
  );

  get formControl(): FormControl {
    return (this.datepickerYearMonth?.ngControl?.control as FormControl) ?? new FormControl();
  }

  ngOnInit(): void {
  }
  get requiredControl(): boolean {
    console.log('requiredControl: ', this.datepickerYearMonth.ngControl?.control?.hasValidator(Validators.required));
    return this.formControl.hasValidator(Validators.required);
  }

  setMonthAndYear(normalizedMonthAndYear: any, datepicker: MatDatepicker<any>) {
    const ctrlValue = this.datepickerYearMonth.value ? moment(this.datepickerYearMonth.value) : moment();
    ctrlValue.month(normalizedMonthAndYear.getMonth());
    ctrlValue.year(normalizedMonthAndYear.getFullYear());
    this.datepickerYearMonth.writeValue(ctrlValue.toDate());
    this.formControl.setValue(ctrlValue.toDate());
    datepicker.close();
  }

}
