import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxControlError } from 'ngxtension/control-error';
import { InputSizeComponent } from '../../input/input-size.component';


import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MESSAGE } from '../../utils/constant';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';
import { AppDateAdapter } from './datepicker-adapter';
const moment = _rollupMoment || _moment;

export const MONTH_MODE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDatepickerModule, MatNativeDateModule, NgxMaterialTimepickerModule,
    MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent, NgxControlError, ReactiveFormsModule
  ],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MONTH_MODE_FORMATS },
    {
      provide: DateAdapter,
      useClass: AppDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
  ],
  hostDirectives: [NgxControlValueAccessor],
})
export class DatepickerComponent {
  MESSAGE = MESSAGE;
  size = input<string>('sm');
  label = input<string>();
  readonly = input<boolean>(false);

  protected datepicker = inject<NgxControlValueAccessor<any>>(
    NgxControlValueAccessor,
  );

  get formControl(): FormControl {
    return (this.datepicker?.ngControl?.control as FormControl) ?? new FormControl();
  }

  ngOnInit(): void {
  }
  get required(): boolean {
    return this.formControl.hasValidator(Validators.required);
  }


}
