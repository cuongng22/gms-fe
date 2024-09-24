import {Pipe, PipeTransform} from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'dataTransformPipe',
  standalone: true,
})
export class DataTransformPipe implements PipeTransform {
  transform(value: any, args: any[]): any {
    console.log(value, args)
    const type = args[0];
    const format = args[1];
    if (type === 'number') {
      return value.toLocaleString('vi-VN');
    } else if (type === 'date') {
      return moment(value).format(format);
    }
    return value;
  }
}
