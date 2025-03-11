import { AfterContentInit, Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { isNaN, parseInt } from "lodash";
import { take } from "rxjs";


@Directive({
  standalone: true,
  selector: 'input[appThousandsSeparator]'
})
export class ThousandsSeparatorDirective implements AfterContentInit {

  @Input() maxDecimal: number = 0;

  constructor(private el: ElementRef, private control: NgControl) {
  }

  ngAfterContentInit() {
    const inputElement = this.el.nativeElement;
    //init
    let initValue = this.control.value;
    if (initValue && !isNaN(Number(initValue))) {
      inputElement.value = this.formatNumber(initValue);
    } else if (isNaN(Number(initValue))) {
      this.control.control?.setErrors({ invalidNumber: true });
    }

    //la field tinh toan
    this.control.control?.valueChanges.pipe(take(1)).subscribe((value) => {
      const _value = value.replace(/,/g, ''); // Loại bỏ dấu phẩy cũ
      if (value && !isNaN(Number(_value))) {
        inputElement.value = this.formatNumber(_value);
      } else if (isNaN(Number(_value))) {
        // inputElement.value = '0';
        this.control.control?.setErrors({ invalidNumber: true });
      }
    });
  }

  @HostListener('input', ['$event'])
  @HostListener('focus', ['$event'])
  onInput(event: any) {
    const inputElement = this.el.nativeElement;
    const value = inputElement.value.replace(/,/g, ''); // Loại bỏ dấu phẩy cũ
    if (value && !isNaN(Number(value))) {
      if (!this.isValidNumberDecimal(value)) {
        this.control.control?.setErrors({ invalidNumberDecimal: true });
      } else if (!this.control.errors) {
        this.control.control?.setErrors(null);
        this.control.control?.setValue(Number(value), { emitEvent: false });
        inputElement.value = this.formatNumber(value);
      }
    } else if (isNaN(Number(value))) {
      // inputElement.value = '';
      this.control.control?.setErrors({ invalidNumber: true });
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

  private isValidNumberDecimal(value: string): boolean {
    if (this.maxDecimal) {
      const regex = new RegExp(`^-?\\d*(\\.\\d{0,${this.maxDecimal}})?$`);// so thap phan
      return regex.test(value);
    } else return true;
  }
}
