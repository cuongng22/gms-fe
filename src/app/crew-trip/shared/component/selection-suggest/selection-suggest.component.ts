import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Input, model, OnInit, output, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { InputSizeComponent } from '../../input/input-size.component';
import { debounceTime, distinctUntilChanged, startWith, Subject } from 'rxjs';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';
import { MESSAGE } from '../../utils/constant';
import { NgxControlError } from 'ngxtension/control-error';
import { Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-selection-suggest',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatAutocompleteModule, CommonModule, NgxControlError,
    MatIconModule
  ],
  templateUrl: './selection-suggest.component.html',
  styleUrl: './selection-suggest.component.scss',
  hostDirectives: [NgxControlValueAccessor],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class SelectionSuggestComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    this.auto?.options.changes.subscribe((list: any[]) => {
      if (list) {
        let findResult = list.find((o) => o.value === this.formControl.value);
        findResult?.focus(null, { preventScroll: true });
        findResult?.select(false)
      }

    })
    if (this.requiredControl) {
      this.viewControl.addValidators(Validators.required);
    }

  }

  @Input() size = 'sm';
  @Input() label = '';
  @Input() attrValue = '';
  @Input() attrDisplay = '';
  selectionChange = output<any>();

  private _options: any[] = []
  keySearch = new Subject<string>();
  filtered = model<any[]>([]);

  MESSAGE = MESSAGE;

  @ViewChild('inputSearch') inputSearch: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocomplete) auto: MatAutocomplete;

  protected viewControl = new FormControl();
  protected selectionControl = inject<NgxControlValueAccessor<any>>(
    NgxControlValueAccessor,
  );

  get formControl(): FormControl {
    return (this.selectionControl?.ngControl?.control as FormControl) ?? new FormControl();
  }

  get requiredControl(): boolean {
    return this.formControl.hasValidator(Validators.required);
  }

  ngOnInit(): void {
    this.keySearch.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith(''),
    ).subscribe(value => {
      const optionFilter = [...(this.options ?? [])]
      this.formControl.setValue(null);
      this.formControl.updateValueAndValidity()
      if (!value) {
        this.filtered.set(optionFilter);
        return;
      }
      this.filtered.set(optionFilter.filter(option => {
        const valueAttrDisplay = (this.attrDisplay ? option[this.attrDisplay] : option)?.toString().toLowerCase();
        return valueAttrDisplay.includes(value.toLowerCase());
      }));
    });

    // this.formControl.valueChanges.subscribe((value: any) => {
    //   this.setViewValueInit(value)
    // })

  }

  setViewValueInit(value: any) {
    console.log('setViewValueInit: ', value)
    const selected = this.options.filter((option: any) => {
      return value === (this.attrValue ? option[this.attrValue] : option);
    });
    if (selected && selected.length > 0) {
      this.viewControl.setValue(this.attrDisplay ? selected[0][this.attrDisplay] : selected[0]);
    }
  }

  filter(): void {
    const filterValue = this.inputSearch.nativeElement.value;
    this.formControl.setValue(null);
    this.formControl.updateValueAndValidity()
    this.keySearch.next(filterValue);
  }

  onSelectionChange(event: any) {
    this.viewControl.setValue(event.option.viewValue ?? null);
    this.viewControl.updateValueAndValidity()
    this.selectionControl.writeValue(event.option.value ?? null);
    this.formControl.updateValueAndValidity();
    this.selectionChange.emit({
      value: event.option.value ?? null,
      viewValue: event.option.viewValue ?? null
    })
  }


  @Input() set options(options: any[]) {
    this._options = options;
    this.filtered.set([...(this._options ?? [])]);
    this.setViewValueInit(this.formControl.value)
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
    let findResult = this.auto?.options.find((o) => o.selected);
    findResult?.focus(null, { preventScroll: false });
    findResult?.deselect(false)
  }
}
