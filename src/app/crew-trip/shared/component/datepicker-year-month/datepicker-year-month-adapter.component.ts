import { NativeDateAdapter } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { Constant } from '../../utils/constant';
const moment = _rollupMoment || _moment;

export class DatepickerYearMonthAdapter extends NativeDateAdapter {
  override format(date: Date): string {
    return moment(date).format(Constant.MONTH_FORMAT);
  }

  override parse(value: any): Date | null {
    if (!value) {
      return null;
    }
    if (!moment(value, Constant.MONTH_FORMAT, true).isValid()) {
      return this.invalid();
    }
    return moment(value, Constant.MONTH_FORMAT, true).toDate();
  }
}
