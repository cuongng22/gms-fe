import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataCalculateTotal',
  standalone: true,
})
export class DataCalculateTotal implements PipeTransform {
  transform(item: any[], type: string): number {
    let total = 0;
    for (const i of item) {
      total += i[type];
    }
    return total;
  }
}
