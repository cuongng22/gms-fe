
import { Platform } from '@angular/cdk/platform';
import { DatePipe } from '@angular/common';
import { Component, inject, Inject, LOCALE_ID } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';
import { log } from 'console';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
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
  template: ''
})
export class AppDateAdapter extends NativeDateAdapter {
  constructor(
        @Inject('MAT_DATE_LOCALE') matDateLocale: string,
        @Inject(LOCALE_ID) public override locale: string,
  ) {
    super(matDateLocale);
  }

  override parse(value: any): Date | null {
    return moment(value, MONTH_MODE_FORMATS.display.dateInput).toDate();
  }

  override format(date: Date, displayFormat: any): string {
    return moment(date).format(displayFormat);
  }

}