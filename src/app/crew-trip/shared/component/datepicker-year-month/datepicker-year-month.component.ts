import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, input, LOCALE_ID, OnInit, Optional, Self, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
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
    // {
    //   provide: NG_VALUE_ACCESSOR,
    //   useExisting: forwardRef(() => DatepickerYearMonthComponent),
    //   multi: true
    // },
    { provide: MAT_DATE_FORMATS, useValue: MONTH_MODE_FORMATS },
    {
      provide: DateAdapter,
      useClass: AppDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: DateAdapter, useClass: DatepickerYearMonthAdapter }
  ],
  hostDirectives: [NgxControlValueAccessor],
})
export class DatepickerYearMonthComponent implements OnInit {
  MESSAGE = MESSAGE;
  size = input<string>('');
  label = input<string>();
  readonly = input<boolean>(false);

  protected datepickerYearMonth = inject<NgxControlValueAccessor<any>>(
    NgxControlValueAccessor,
  );

  get formControl(): FormControl {
    return (this.datepickerYearMonth?.ngControl?.control as FormControl) ?? new FormControl();
  }

  ngOnInit(): void {
  }
  get required(): boolean {
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
