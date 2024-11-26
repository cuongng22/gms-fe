import { NgIf, CommonModule } from '@angular/common';
import { Component, DestroyRef, forwardRef, inject, input, Input, model, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { InputSizeComponent } from '../../input/input-size.component';
import { debounceTime, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debouncedSignal, MESSAGE } from '../../utils/constant';

@Component({
  selector: 'app-select-multiple',
  standalone: true,
  imports: [FormsModule, MatError, MatFormField, MatLabel,
    MatOption, MatSelect, ReactiveFormsModule,
    CommonModule, InputSizeComponent, MatSelectModule],
  templateUrl: './select-multiple.component.html',
  styleUrl: './select-multiple.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectMultipleComponent),
      multi: true
    }
  ]
})
export class SelectMultipleComponent implements ControlValueAccessor, OnInit {
  // @Input() placeholder: string = '';
  @Input() sizeInput: string = 'sm';
  @Input() label: string = '';
  // @Input() readonly: boolean = false;
  // @Input() hint = '';
  @Input() required: boolean = false;
  @Input() options: [] = [];
  @Input() attrValue = ''; // trường để lấy giá trị trong options
  @Input() attrDisplay = ''; // Trường để hiển thị trong options
  MESSAGE = MESSAGE;

  destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }
  ngOnInit(): void {
    this.formControl.valueChanges
      .pipe(
        debounceTime(200),
        tap(value => this.onChange(value)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
  get formControl(): FormControl {
    return (this.ngControl?.control as FormControl) ?? new FormControl();
  }

  @Input() set disabled(value: boolean) {
    if (this.setDisabledState) {
      this.setDisabledState(value);
    }
  }

  writeValue(obj: any): void {
    if (this.formControl?.value !== obj) {
      this.formControl.setValue(obj, { emitEvent: false });
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }

  onChange = (value: any) => {
  };
  onTouched = () => {
  };


  search = model<string>('');
  debounceSearch = debouncedSignal(this.search, 300);

  getSelectTrigger(): string {
    const selected = this.formControl?.value || [];
    if (Array.isArray(selected)) {
      return selected
        .map((code: any) => this.options.find((option: any) => option[this.attrValue] === code)?.[this.attrDisplay])
        .filter((name: any) => name)
        .join('; ');
    }
    return '';
  }
}
