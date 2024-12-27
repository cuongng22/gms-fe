import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, LOCALE_ID, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { AppDateAdapter } from './datepicker-year-month-adapter';
import { InputSizeComponent } from '../../input/input-size.component';
import { MESSAGE } from '../../utils/constant';
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
    MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent
  ],
  templateUrl: './datepicker-year-month.component.html',
  styleUrl: './datepicker-year-month.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    },
    { provide: MAT_DATE_FORMATS, useValue: MONTH_MODE_FORMATS },
    // provideMomentDateAdapter(MONTH_MODE_FORMATS),
    {
      provide: DateAdapter,
      useClass: AppDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
  ],
})
export class DatepickerComponent implements OnInit, ControlValueAccessor {
  MESSAGE = MESSAGE;
  size = input<string>('');
  label = input<string>();
  required = input<boolean>(false);
  messageRequired = input<string>('');
  _datePickerValue: Date;

  constructor() {
  }
  ngOnInit(): void {
  }


  get datePickerValue(): Date {
    return this._datePickerValue;
  }

  set datePickerValue(value: Date) {
    this._datePickerValue = value;
    this.propagateChange(this._datePickerValue);
  }

  writeValue(value: Date) {
    if (value !== undefined) {
      this._datePickerValue = value;
    }
  }

  propagateChange = (_: any) => { };
  propagateTouched = (_: any) => { };

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    this.propagateTouched = fn;
  }

  touched($event: any) {
    this.propagateTouched($event);
  }

  setMonthAndYear(normalizedMonthAndYear: any, datepicker: MatDatepicker<any>) {
    console.log(normalizedMonthAndYear);
    const ctrlValue = this.datePickerValue ? moment(this.datePickerValue) : moment();
    ctrlValue.month(normalizedMonthAndYear.getMonth());
    ctrlValue.year(normalizedMonthAndYear.getFullYear());
    this.datePickerValue = ctrlValue.toDate();
    datepicker.close();
  }
}
