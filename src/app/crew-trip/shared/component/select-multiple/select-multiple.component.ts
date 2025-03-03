import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Self,
  SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NgControl,
  ReactiveFormsModule,
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
import { debounceTime, tap } from 'rxjs';
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
})
export class SelectMultipleComponent
implements ControlValueAccessor, OnInit, OnChanges
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

	destroyRef: DestroyRef = inject(DestroyRef);

	search = new FormControl('');

	constructor(@Optional() @Self() public ngControl: NgControl) {
	  if (this.ngControl) {
	    this.ngControl.valueAccessor = this;
	  }
	}

	@Input() set options(options: any[]) {
	  this._options = options;
	  this.selectOptionsRaw = [...this._options];
	}

	get options(): any[] {
	  return this._options;
	}

	ngOnInit(): void {
	  this.selectOptionsRaw = [...this.options];
	  this.formControl.valueChanges
	    .pipe(
	      debounceTime(200),
	      tap((value) => this.onChange(value)),
	      takeUntilDestroyed(this.destroyRef),
	    )
	    .subscribe();

	  this.search.valueChanges.pipe(debounceTime(200)).subscribe((keySearch) => {
	    if (!keySearch) {
	      this.selectOptionsRaw = [...this.options];
	    } else {
				const filteredOptions = this.options.filter((option: any) => {
					const attr = this.attrDisplay ? option[this.attrDisplay] : option;
					return attr.toLowerCase().includes(keySearch.toLowerCase());
				});

				this.selectOptionsRaw = filteredOptions.length > 0 ? filteredOptions : [...this.options];

			}
	  });
	}

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
	  if (isDisabled) {
	    this.readonly = true;
	  } else {
	    this.readonly = false;
	  }
	}

	onChange = (value: any) => {};
	onTouched = () => {};

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
	allSelected = false;
	toggleSelectAll() {
		this.allSelected = !this.allSelected;
		const selectedValues = this.allSelected
			? this.selectOptionsRaw.map(option => this.attrValue ? option[this.attrValue] : option)
			: [];
		this.formControl.setValue(selectedValues);

	}
}
