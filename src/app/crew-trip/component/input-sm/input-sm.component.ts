import {Component, Input, Optional, Self, SimpleChanges} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  ReactiveFormsModule,
  FormControl
} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {NgxControlError} from "ngxtension/control-error";
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";

@Component({
  selector: 'app-input-sm',
  standalone: true,
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    NgIf,
    NgxTrimDirectiveModule,
    MatFormFieldModule,
    MatInputModule,
    NgxControlError,
    InputSizeComponent
  ],
  templateUrl: './input-sm.component.html',
  styleUrl: './input-sm.component.scss',
})
export class InputSmComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() enable: boolean = true;
  @Input() hint = '';
  @Input() maxLength: number = 100;
  @Input() required: boolean = false;
  @Input() type: string = 'text';

  get formControl(): FormControl {
    return (this.ngControl?.control as FormControl) ?? new FormControl();
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }


  // ngOnInit() {
  //   const validators = [];
  //   if (this.required) {
  //     validators.push(Validators.required);
  //   }
  //   if (this.maxLength > 0) {
  //     validators.push(Validators.maxLength(this.maxLength));
  //   }
  //   if (this.type && this.type === 'email') {
  //     validators.push(Validators.maxLength(this.maxLength));
  //   }
  //   // this.formControl.setValidators(validators as ValidatorFn[]);
  //   // if (!this.enable) {
  //   //   this.formControl.disable();
  //   // } else {
  //   //   this.formControl.enable();
  //   // }
  //   this.updateEnableState();
  //   // this.formControl.updateValueAndValidity();
  // }

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
    console.log("valuevaluevalue:",value)
    if (this.formControl?.value !== value) {
      this.formControl.setValue(value, { emitEvent: false });
    }
  }

  validate() {
    return this.formControl?.valid ? null : { invalid: true };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['enable']) {
      this.updateEnableState();
    }
  }

  private updateEnableState() {
    if (this.enable) {
      this.formControl.enable({emitEvent: false});
    } else {
      this.formControl.disable({emitEvent: false});
    }
  }
}
