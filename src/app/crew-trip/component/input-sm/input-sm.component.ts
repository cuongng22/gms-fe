import {Component, forwardRef, Input, SimpleChanges} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidatorFn
} from "@angular/forms";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {Validators} from "ngx-editor";

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
    MatInputModule
  ],
  templateUrl: './input-sm.component.html',
  styleUrl: './input-sm.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSmComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputSmComponent),
      multi: true,
    },
  ],
})
export class InputSmComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() enable: boolean = true;
  @Input() formControl: FormControl = new FormControl('');
  @Input() maxLength: number = 100;
  @Input() required: boolean = false;
  @Input() type: string = 'text';

  ngOnInit() {
    const validators = [];
    if (this.required) {
      validators.push(Validators.required);
    }
    if (this.maxLength > 0) {
      validators.push(Validators.maxLength(this.maxLength));
    }
    this.formControl.setValidators(validators as ValidatorFn[]);
    if (!this.enable) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
    this.updateEnableState();
    this.formControl.updateValueAndValidity();
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
    this.formControl.setValue(value);
  }

  validate() {
    return this.formControl.valid ? null : {invalid: true};
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

  protected readonly HTMLInputElement = HTMLInputElement;
}
