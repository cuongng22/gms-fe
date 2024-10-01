import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import { Constant } from './utils/constant';
import { sprintf } from 'sprintf-js';
@Pipe({
  name: 'dataTransformPipe',
  standalone: true,
})
export class DataTransformPipe implements PipeTransform {
  transform(value: any, args: any[]): any {
    // console.log(value, args)
    const type = args[0];
    const format = args[1];
    if (type === 'number') {
      return value.toLocaleString('vi-VN');
    } else if (type === Constant.DATE) {
      return moment(value).format(format);
    } else if (type === Constant.STRING_FORMAT) {
      const params = args.slice(1);
      return sprintf(value, params);
    }
    return value;
  }
}
