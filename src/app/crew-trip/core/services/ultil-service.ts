import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UltilService {
  formatNumber(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value);
  }
}
