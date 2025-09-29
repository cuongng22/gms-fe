import { CommonModule, NgIf } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Optional,
	Output,
	Self,
	SimpleChanges,
} from '@angular/core';
import {
	ControlValueAccessor,
	FormControl,
	FormsModule,
	NgControl,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
	selector: 'app-selection',
	standalone: true,
	imports: [
		FormsModule,
		MatError,
		MatFormField,
		MatLabel,
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
	@Input() isFirstBlank = false;
	@Input() labelFirst = '';
	@Output() selectionChange = new EventEmitter<any>();

	get formControl(): FormControl {
		return (this.ngControl?.control as FormControl) ?? new FormControl();
	}

	constructor(@Optional() @Self() public ngControl: NgControl) {
		if (this.ngControl) {
			this.ngControl.valueAccessor = this;
		}
	}
	get requiredControl(): boolean {
		return this.formControl.hasValidator(Validators.required);
	}
	onChange = (value: any) => {};
	onTouched = () => {};

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	onSelectionChange(value: any): void {
		this.onChange(value);
		this.selectionChange.emit({
			value: value,
			selectedItem: this.options.find(option => 
				this.attrValue ? option[this.attrValue] === value : option === value
			)
		});
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
