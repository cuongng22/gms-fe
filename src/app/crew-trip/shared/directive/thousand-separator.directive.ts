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

  constructor(private el: ElementRef, private control: NgControl) {}

  ngAfterContentInit() {
    const inputElement = this.el.nativeElement;
    // Khoi tao gia tri
    let initValue = this.control.value;
    if (initValue && !isNaN(Number(initValue))) {
      inputElement.value = this.formatNumber(initValue);
    } else if (initValue) {
      this.control.control?.setErrors({ invalidNumber: true });
    }

    // Xu ly thay doi gia tri
    this.control.control?.valueChanges.pipe(take(1)).subscribe((value) => {
      if (value && !isNaN(Number(value))) {
        inputElement.value = this.formatNumber(value);
      } else {
        this.control.control?.setErrors({ invalidNumber: true });
      }
    });
  }

  @HostListener('input', ['$event'])
  @HostListener('focus', ['$event'])
  onInput(event: any) {
    const inputElement = this.el.nativeElement;
    const value = inputElement.value.replace(/,/g, ''); // Loai bo dau phay cu
    if (value && !isNaN(Number(value))) {
      if (!this.isValidNumberDecimal(value)) {
        this.control.control?.setErrors({ invalidNumberDecimal: true });
      } else if (!this.control.errors) {
        this.control.control?.setErrors(null);
        this.control.control?.setValue(Number(value), { emitEvent: false });
        inputElement.value = this.formatNumber(value);
      }
    } else if (value) {
      this.control.control?.setErrors({ invalidNumber: true });
    }
  }

  @HostListener('blur', ['$event'])
  onBlur(event: any) {
    const inputElement = this.el.nativeElement;
    if (inputElement.value.endsWith('.')) {
      inputElement.value = inputElement.value.slice(0, -1); // Loai bo dau cham thua cuoi
    }
  }

  // Dinh dang so voi dau phan cach hang nghin
  private formatNumber(value: string | number): string {
    const parts = value.toString().split('.');
    parts[0] = parseInt(parts[0], 10).toLocaleString('en-US'); // Them dau phan cach hang nghin
    return parts.join('.');
  }

  private isValidNumberDecimal(value: string): boolean {
    if (this.maxDecimal) {
      const regex = new RegExp(`^-?\\d*(\\.\\d{0,${this.maxDecimal}})?$`); // Kiem tra so thap phan
      return regex.test(value);
    } else return true;
  }
}
