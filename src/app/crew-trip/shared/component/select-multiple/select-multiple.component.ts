import { CommonModule } from '@angular/common';
import {
	AfterViewChecked,
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import {
	FormControl,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import {
	MatError,
	MatFormFieldModule,
	MatLabel,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';
import { debounceTime } from 'rxjs';
import { InputSizeComponent } from '../../input/input-size.component';
import { MESSAGE } from '../../utils/constant';

@Component({
	selector: 'app-select-multiple',
	standalone: true,
	imports: [
		FormsModule,
		MatError,
		MatLabel,
		MatOption,
		MatSelect,
		ReactiveFormsModule,
		MatButtonModule,
		MatTooltipModule,
		CommonModule,
		InputSizeComponent,
		MatSelectModule,
		MatFormFieldModule,
		MatInputModule,
		NgxControlError,
		NgxTrimDirectiveModule,
	],
	templateUrl: './select-multiple.component.html',
	styleUrl: './select-multiple.component.scss',
	hostDirectives: [NgxControlValueAccessor],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMultipleComponent
	implements OnInit, OnChanges, AfterViewInit, AfterViewChecked
{
	@Input() placeholder = '';
	@Input() size = 'sm';
	@Input() label = '';
	@Input() readonly = false;
	@Input() hint = '';
	@Input() required = false;
	private _options: any[] = [];
	@Input() attrValue = ''; // trường để lấy giá trị trong options
	@Input() attrDisplay = ''; // Trường để hiển thị trong options
	@Input() isSearch = true;
	selectOptionsRaw: any[] = [];
	MESSAGE = MESSAGE;
	allSelected = false;

	destroyRef: DestroyRef = inject(DestroyRef);

	search = new FormControl('');
	protected ngControl = inject<NgxControlValueAccessor<any>>(
		NgxControlValueAccessor,
	);

	@Input() set options(options: any[]) {
		this._options = options || []; // Default to empty array if undefined
		this.selectOptionsRaw = Array.isArray(this._options)
			? [...this._options]
			: [];
	}

	get options(): any[] {
		return this._options || []; // Return empty array if _options is undefined
	}

	ngOnInit(): void {
		this.selectOptionsRaw = [...this.options];
		this.search.valueChanges.pipe(debounceTime(200)).subscribe((keySearch) => {
			if (!keySearch) {
				this.selectOptionsRaw = [...this.options];
			} else {
				const filteredOptions = this.options.filter((option: any) => {
					const attr = this.attrDisplay ? option[this.attrDisplay] : option;
					return attr.toLowerCase().includes(keySearch.toLowerCase());
				});

				this.selectOptionsRaw =
					filteredOptions.length > 0 ? filteredOptions : []; //[...this.options];
			}
		});
		//kiểm tra checkall
		this.formControl.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
			this.allSelected =
				Array.isArray(value) && value.length === this.selectOptionsRaw.length;
		});
	}
	ngAfterViewChecked(): void {}
	ngAfterViewInit(): void {}

	ngOnChanges(changes: SimpleChanges) {
		const ocSelectOptions = changes?.['selectOptions'];
		if (
			ocSelectOptions &&
			ocSelectOptions.currentValue &&
			ocSelectOptions.currentValue.length > 0 &&
			!ocSelectOptions?.firstChange
		) {
			this.selectOptionsRaw = ocSelectOptions.currentValue;
		}
		if (changes['readonly']) {
			this.updateEnableState();
		}
		console.log('changedddddd', this.selectOptionsRaw);
	}

	get formControl(): FormControl {
		return (
			(this.ngControl?.ngControl?.control as FormControl) ?? new FormControl()
		);
	}
	get requiredControl(): boolean {
		return this.formControl.hasValidator(Validators.required);
	}

	writeValue(obj: any): void {
		if (this.formControl?.value !== obj) {
			this.formControl.setValue(obj, { emitEvent: false });
		}
	}

	getSelectTrigger(): string {
		const selected = this.formControl?.value || [];
		if (Array.isArray(selected) && selected && selected.length > 0) {
			return (
				selected
					.map((select: any) =>
						this.options.find(
							(option: any) =>
								(this.attrValue ? option[this.attrValue] : option) === select,
						),
					)
					.filter((value: any) => !!value)
					.map((select: any) =>
						this.attrDisplay ? select[this.attrDisplay] : select,
					)
					.filter((name: any) => name)
					.join('; ') ?? this.placeholder
			);
		}
		return '';
	}

	private updateEnableState() {
		if (!this.readonly) {
			this.formControl.enable({ emitEvent: false });
		} else {
			this.formControl.disable({ emitEvent: false });
		}
	}

	toggleSelectAll() {
		this.allSelected = !this.allSelected;
		const selectedValues = this.allSelected
			? this.selectOptionsRaw.map((option) =>
					this.attrValue ? option[this.attrValue] : option,
				)
			: [];
		this.formControl.setValue(selectedValues);
	}

	openedChange(isOpen: boolean) {
		if (!isOpen) {
			this.search.setValue('');
		}
	}
}
