import { CommonModule } from '@angular/common';
import {
	AfterViewChecked,
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Input,
	model,
	OnInit,
	Output,
	output,
	ViewChild,
} from '@angular/core';
import {
	FormControl,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import {
	MatAutocomplete,
	MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxControlError } from 'ngxtension/control-error';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';
import { debounceTime, distinctUntilChanged, startWith, Subject } from 'rxjs';
import { InputSizeComponent } from '../../input/input-size.component';
import { MESSAGE } from '../../utils/constant';

@Component({
	selector: 'app-selection-suggest',
	standalone: true,
	imports: [
		FormsModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		MatSelectModule,
		MatButtonModule,
		MatFormField,
		MatInputModule,
		InputSizeComponent,
		MatAutocompleteModule,
		CommonModule,
		NgxControlError,
		MatIconModule,
		MatTooltipModule,
	],
	templateUrl: './selection-suggest.component.html',
	styleUrl: './selection-suggest.component.scss',
	hostDirectives: [NgxControlValueAccessor],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionSuggestComponent
	implements OnInit, AfterViewInit, AfterViewChecked
{
	ngAfterViewInit(): void {
		this.auto?.options.changes.subscribe((list: any[]) => {
			if (list) {
				const findResult = list.find((o) => o.value === this.formControl.value);
				findResult?.focus(null, { preventScroll: true });
				findResult?.select(false);
			}
		});
		this.setRequired();
	}

	ngAfterViewChecked(): void {
		if (this.formControl.touched) {
			this.viewControl.markAsTouched();
			this.viewControl.updateValueAndValidity();
		}
		this.setViewValueInit(this.formControl.value);

		if (this.selectionControl.ngControl?.disabled) {
			this.viewControl.disable();
		} else {
			this.viewControl.enable();
		}
	}

	setRequired(isFormControl?: boolean) {
		if (isFormControl) {
			this.formControl.addValidators(Validators.required);
			this.formControl.updateValueAndValidity();
		}
		if (this.requiredControl) {
			this.viewControl.addValidators(Validators.required);
		}
	}

	@Input() size = 'sm';
	@Input() label = '';
	@Input() label2 = '';
	@Input() attrValue = '';
	@Input() attrDisplay = '';
	@Input() attrDisplay2 = '';
	@Input() editInlineTable = false;
	@Input() errors: any;
	@Output() clearInputEvent = new EventEmitter<void>();
	selectionChange = output<any>();

	private _options: any[] = [];
	keySearch = new Subject<string>();
	filtered = model<any[]>([]);

	MESSAGE = MESSAGE;

	setInitValue = false;

	@ViewChild('inputSearch') inputSearch: ElementRef<HTMLInputElement>;
	@ViewChild(MatAutocomplete) auto: MatAutocomplete;

	protected viewControl = new FormControl();
	protected selectionControl = inject<NgxControlValueAccessor<any>>(
		NgxControlValueAccessor,
	);

	get formControl(): FormControl {
		return (
			(this.selectionControl?.ngControl?.control as FormControl) ??
			new FormControl()
		);
	}

	get requiredControl(): boolean {
		return this.formControl.hasValidator(Validators.required);
	}

	// Thêm biến private để lưu giá trị ban đầu
	private _initialValue: any = null;

	ngOnInit(): void {
		this.keySearch
			.pipe(debounceTime(500), distinctUntilChanged(), startWith(''))
			.subscribe((value) => {
				const optionFilter = [...(this.options ?? [])];
				// this.formControl.setValue(null);
				// this.formControl.updateValueAndValidity();
				if (!value) {
					this.filtered.set(optionFilter);
					return;
				}
				this.filtered.set(
					optionFilter.filter((option) => {
						const valueAttrDisplay = (
							this.attrDisplay ? option[this.attrDisplay] : option
						)
							?.toString()
							.toLowerCase();
						return valueAttrDisplay.includes(value.toLowerCase());
					}),
				);
			});

		this.selectionControl.writeValue = (value: any) => {
			this._initialValue = value;
			this.applyValueIfOptionsReady();
		};
	}

	private applyValueIfOptionsReady(): void {
		if (
			this.options &&
			this.options.length > 0 &&
			this._initialValue !== undefined
		) {
			const selected = this.options.find((option: any) => {
				return (
					this._initialValue ===
					(this.attrValue ? option[this.attrValue] : option)
				);
			});
			if (selected) {
				this.viewControl.setValue(
					this.attrDisplay ? selected[this.attrDisplay] : selected,
				);
			} else {
				this.viewControl.setValue('');
			}
		} else {
			this.viewControl.setValue('');
		}
	}

	setViewValueInit(value: any, force?: boolean) {
		if (!this.setInitValue || force) {
			if (value) {
				const selected = this.options.filter((option: any) => {
					return value === (this.attrValue ? option[this.attrValue] : option);
				});
				if (selected && selected.length > 0) {
					this.viewControl.setValue(
						this.attrDisplay ? selected[0][this.attrDisplay] : selected[0],
					);
					this.setInitValue = true;
				} else {
					this.setInitValue = false;
				}
			} else {
				this.setInitValue = false;
			}
		}
	}

	filter(): void {
		const filterValue = this.inputSearch.nativeElement.value;
		this.keySearch.next(filterValue);
	}

	onSelectionChange(event: any) {
		this.viewControl.setValue(event.option.viewValue ?? null);
		this.viewControl.updateValueAndValidity();
		this.selectionControl.writeValue(event.option.value ?? null);
		this.formControl.setValue(event.option.value ?? null);
		this.formControl.updateValueAndValidity();
		this.selectionChange.emit({
			value: event.option.value ?? null,
			viewValue: event.option.viewValue ?? null,
		});
	}

	@Input() set options(options: any[]) {
		this._options = options;
		this.filtered.set([...(this._options ?? [])]);

		// Áp dụng giá trị đã lưu sau khi options được cập nhật
		this.applyValueIfOptionsReady();
	}

	get options(): any[] {
		return this._options;
	}

	clearInput() {
		this.viewControl.setValue('');
		this.formControl.setValue('');
		this.selectionControl.writeValue('');
		this.viewControl.updateValueAndValidity();
		this.formControl.updateValueAndValidity();
		this.keySearch.next('');
		const findResult = this.auto?.options.find((o) => o.selected);
		findResult?.focus(null, { preventScroll: false });
		findResult?.deselect(false);
		this.clearInputEvent.emit();
	}
}
