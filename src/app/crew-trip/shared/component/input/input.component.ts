import {Component, Input, Optional, Self, SimpleChanges, OnChanges} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  ReactiveFormsModule,
  FormControl
} from '@angular/forms';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    NgIf,
    NgxTrimDirectiveModule,
    MatFormFieldModule,
    MatInputModule,
    InputSizeComponent
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements ControlValueAccessor, OnChanges {
  @Input() placeholder = '';
  @Input() label = '';
  @Input() sizeInput = 'sm';
  @Input() readonly = false;
  @Input() hint = '';
  @Input() maxLength = 100;
  @Input() required = false;
  @Input() type = 'text';

  get formControl(): FormControl {
    return (this.ngControl?.control as FormControl) ?? new FormControl();
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    if (this.readonly) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  onChange = (value: any) => {
  };
  onTouched = () => {
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      this.onChange(inputElement.value);
    }
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    if (this.formControl?.value !== value) {
      this.formControl.setValue(value, {emitEvent: false});
    }
  }

  validate() {
    return this.formControl?.valid ? null : {invalid: true};
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['readonly']) {
      this.updateEnableState();
    }
  }

  private updateEnableState() {
    if (!this.readonly) {
      this.formControl.enable({emitEvent: false});
    } else {
      this.formControl.disable({emitEvent: false});
    }
  }
}
