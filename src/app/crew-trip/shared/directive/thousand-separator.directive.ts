import {AfterContentInit, Directive, ElementRef, HostListener} from '@angular/core';
import {NgControl} from '@angular/forms';
import {isNaN, parseInt} from "lodash";
import {take} from "rxjs";


@Directive({
  standalone: true,
  selector: 'input[appThousandsSeparator]'
})
export class ThousandsSeparatorDirective implements AfterContentInit {

  constructor(private el: ElementRef, private control: NgControl) {
  }

  ngAfterContentInit() {
    this.control.control?.valueChanges.pipe(take(1)).subscribe((value) => {
      const inputElement = this.el.nativeElement;
      if (value && !isNaN(Number(value))) {
        inputElement.value = this.formatNumber(value);
      } else {
        inputElement.value = '0';
      }
    });
  }

  @HostListener('input', ['$event'])
  @HostListener('focus', ['$event'])
  onInput(event: any) {
    const inputElement = this.el.nativeElement;
    const value = inputElement.value.replace(/,/g, ''); // Loại bỏ dấu phẩy cũ
    if (value && !isNaN(Number(value))) {
      this.control.control?.setValue(Number(value), {emitEvent: false});
      inputElement.value = this.formatNumber(value);
    } else {
      inputElement.value = '';
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: any) {
    const inputElement = this.el.nativeElement;
    if (inputElement.value.endsWith('.')) {
      inputElement.value = inputElement.value.slice(0, -1); // Loại bỏ dấu chấm thừa cuối
    }
  }

  // Hàm định dạng số với dấu phân cách hàng nghìn
  private formatNumber(value: string | number): string {
    const parts = value.toString().split('.'); // Tách phần nguyên và thập phân
    parts[0] = parseInt(parts[0], 10).toLocaleString('en-US'); // Thêm dấu phân cách hàng nghìn cho phần nguyên
    return parts.join('.'); // Ghép lại phần nguyên và thập phân
  }


}
