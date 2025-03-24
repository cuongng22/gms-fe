import {Pipe, PipeTransform} from '@angular/core';
import moment from 'moment';
import {sprintf} from 'sprintf-js';
import {Constant} from './utils/constant';

@Pipe({
  name: 'dataTransformPipe',
  standalone: true,
})
export class DataTransformPipe implements PipeTransform {
  transform(value: any, args: any[]): any {
    try {
      const type = args[0];
      const format = args[1];
      const utcOffset = args[2];
      if (type === 'number') {
        // return value.toLocaleString('vi-VN');
        return value.toLocaleString('en-US', {maximumFractionDigits: format ? format : 2});
      } else if (type === Constant.DATE) {
        if (utcOffset) {
          return moment.utc(value).isValid() ? moment.utc(value).utcOffset(utcOffset).format(format) : '';
        } else {
          return moment(value).isValid() ? moment(value).format(format) : '';
        }
      } else if (type === Constant.STRING_FORMAT) {
        const params = args.slice(1);
        return sprintf(value, params);
      }
      return value;
    } catch (e) {
      return value;
    }
  }
}
