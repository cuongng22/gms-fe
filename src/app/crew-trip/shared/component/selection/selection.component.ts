import { CommonModule, NgIf } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  Optional,
  Self,
  SimpleChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import {
  MatError,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
  selector: 'app-selection',
  standalone: true,
  imports: [
    FormsModule,
    MatError,
    MatLabel,
    MatFormFieldModule,
    MatOption,
    MatSelect,
    NgIf,
    ReactiveFormsModule,
    CommonModule,
    InputSizeComponent,
  ],
  templateUrl: './selection.component.html',
  styleUrl: './selection.component.scss',
})
export class SelectionComponent implements ControlValueAccessor, OnChanges {
	@Input() placeholder = '';
	@Input() size = 'sm';
	@Input() label = '';
	@Input() readonly = false;
	@Input() hint = '';
	@Input() required = false;
	@Input() options: any[] = [];
	@Input() attrValue = 'value';
	@Input() attrDisplay = 'display';

	get formControl(): FormControl {
	  return (this.ngControl?.control as FormControl) ?? new FormControl();
	}

	constructor(@Optional() @Self() public ngControl: NgControl) {
	  if (this.ngControl) {
	    this.ngControl.valueAccessor = this;
	  }
	}

	onChange = (value: any) => {};
	onTouched = () => {};

	registerOnChange(fn: any): void {
	  this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
	  this.onTouched = fn;
	}

	writeValue(value: any): void {
	  if (this.formControl?.value !== value) {
	    this.formControl.setValue(value, { emitEvent: false });
	  }
	}

	validate() {
	  return this.formControl?.valid ? null : { invalid: true };
	}

	ngOnChanges(changes: SimpleChanges): void {
	  if (changes['readonly']) {
	    this.updateEnableState();
	  }
	}

	private updateEnableState() {
	  if (!this.readonly) {
	    this.formControl.enable({ emitEvent: false });
	  } else {
	    this.formControl.disable({ emitEvent: false });
	  }
	}
}
