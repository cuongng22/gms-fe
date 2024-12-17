import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appSeparator]',
  standalone: true
})
export class SeparatorDirective {
  constructor(private _inputEl: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    if (this._inputEl.nativeElement.value === '-') return;
    let commasRemoved = this._inputEl.nativeElement.value.replace(/,/g, '');
    let toInt: number;
    let toLocale: string;
    if (commasRemoved.split('.').length > 1) {
      let decimal = isNaN(parseInt(commasRemoved.split('.')[1])) ? '' : parseInt(commasRemoved.split('.')[1]);
      toInt = parseInt(commasRemoved);
      toLocale = toInt.toLocaleString('en-US') + '.' + decimal;
    } else {
      toInt = parseInt(commasRemoved);
      toLocale = toInt.toLocaleString('en-US');
    }
    if (toLocale === 'NaN') {
      this._inputEl.nativeElement.value = '';
    } else {
      this._inputEl.nativeElement.value = toLocale;
    }
  }

  @HostBinding('value') get value() {
    this.onInput(null);
    return this._inputEl.nativeElement.value;
  }
}
