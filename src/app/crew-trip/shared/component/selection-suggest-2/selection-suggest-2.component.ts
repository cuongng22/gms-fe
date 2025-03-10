import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef, EventEmitter,
  inject,
  Input,
  model,
  OnInit, Output,
  output,
  ViewChild
} from '@angular/core';
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
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-selection-suggest-2',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatAutocompleteModule, CommonModule, NgxControlError,
    MatIconModule, MatTooltipModule
  ],
  templateUrl: './selection-suggest-2.component.html',
  styleUrl: './selection-suggest-2.component.scss',
  hostDirectives: [NgxControlValueAccessor],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class SelectionSuggest2Component implements OnInit, AfterViewInit, AfterViewChecked {

  ngAfterViewInit(): void {
    this.auto?.options.changes.subscribe((list: any[]) => {
      if (list) {
        const findResult = list.find((o) => o.value === this.formControl.value);
        findResult?.focus(null, { preventScroll: true });
        findResult?.select(false);
      }
    });
    if (this.requiredControl) {
      this.viewControl.addValidators(Validators.required);
    }


  }
  ngAfterViewChecked(): void {
    if (this.formControl.touched) {
      this.viewControl.markAsTouched();
      this.viewControl.updateValueAndValidity()
    }
    this.setViewValueInit(this.formControl.value);

  }

  @Input() size = 'sm';
  @Input() label = '';
  @Input() label2 = '';
  @Input() attrValue = '';
  @Input() attrDisplay = '';
  @Input() attrDisplay2 = '';
  @Input() editInlineTable = false
  @Input() errors : any;
  @Output() clearInputEvent = new EventEmitter<void>();
  @Input() formControlName: string
  @Output() selectionChange = new EventEmitter<any>();
  @Output() inputChange = new EventEmitter<any>();

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

  ngOnInit(): void {
    this.keySearch.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith('')
    ).subscribe(value => {
      const optionFilter = [...(this.options ?? [])];
      // this.formControl.setValue(null);
      // this.formControl.updateValueAndValidity();
      if (!value) {
        this.filtered.set(optionFilter);
        return;
      }
      this.filtered.set(
        optionFilter.filter(option => {
          let valueAttrDisplay = value;
          if (this.attrDisplay) {
            valueAttrDisplay = option[this.attrDisplay] || '';
            if (this.attrDisplay2) {
              valueAttrDisplay += ' ' + (option[this.attrDisplay2] || '');
            }
          } else {
            valueAttrDisplay = option.toString();
          }
          return valueAttrDisplay.toLowerCase().includes(value.toLowerCase());
        })
      );
      this.inputChange.emit(value);

    });

    this.formControl.statusChanges.subscribe((res) => {
      if ('DISABLED' === res) {
        this.viewControl.disable();
      } else {
        this.viewControl.enable();
      }
    });
  }


  setViewValueInit(value: any) {
   /* if (!this.setInitValue) {
      if (value) {
        const selected = this.options.filter((option: any) => {
          return value === (this.attrValue ? option[this.attrValue] : option);
        });
        if (selected && selected.length > 0) {
          this.viewControl.setValue(
            this.attrDisplay ? selected[0][this.attrDisplay] : selected[0],
          );
          this.setInitValue = true
        } else {
          this.setInitValue = false
        }
      } else {
        this.setInitValue = false
      }
    }*/


  }

  filter(): void {
    const filterValue = this.inputSearch.nativeElement.value;
    // this.formControl.setValue(null);
    // this.formControl.updateValueAndValidity();
    this.keySearch.next(filterValue);
  }

  onSelectionChange(event: any) {
    const filterValue = this.inputSearch.nativeElement.value ?? "";
    /*this.viewControl.setValue(event.option.viewValue ?? null);
    this.viewControl.updateValueAndValidity();
    this.selectionControl.writeValue(event.option.value ?? null);
    this.formControl.updateValueAndValidity();*/
    this.selectionChange.emit(filterValue);
  }

  @Input() set options(options: any[]) {
    this._options = options;
    this.filtered.set([...(this._options ?? [])]);
    this.setViewValueInit(this.formControl.value);
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

  get errorMessage(){
    if(this.errors?.message){
      //this.viewControl.setErrors(this.errors.overlapValidator);
      return this.errors.message
    }
    return null;
  }
}
