import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataCalculateTotal',
  standalone: true,
})
export class DataCalculateTotal implements PipeTransform {
  transform(item: any[], type: string): number {
    let total = 0;
    return item.map(i => i[type]).reduce((preValue, currValue) => Number(this.ctz(preValue)) + Number(this.ctz(currValue)), 0)
  }

  /**
   * Convert to Zero
   * @param value 
   * @returns 
   */
  ctz(value: any) {
    return value ?? 0
  }
}
