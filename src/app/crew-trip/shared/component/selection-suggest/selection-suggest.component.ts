import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, ElementRef, inject, input, Input, model, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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

@Component({
  selector: 'app-selection-suggest',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatAutocompleteModule, CommonModule, NgxControlError],
  templateUrl: './selection-suggest.component.html',
  styleUrl: './selection-suggest.component.scss',
  hostDirectives: [NgxControlValueAccessor],

})
export class SelectionSuggestComponent implements OnInit {

  @Input() size = 'sm';
  @Input() label = '';
  @Input() attrValue = '';
  @Input() attrDisplay = '';

  private _options: any[] = []
  keySearch = new Subject<string>();
  filtered = model<any[]>([]);

  MESSAGE = MESSAGE;

  @ViewChild('inputSearch') inputSearch: ElementRef<HTMLInputElement>;

  protected selectionControl = inject<NgxControlValueAccessor<any>>(
    NgxControlValueAccessor,
  );

  get formControl(): FormControl {
    return (this.selectionControl?.ngControl?.control as FormControl) ?? new FormControl();
  }

  get required(): boolean {
    return this.formControl.hasValidator(Validators.required);
  }
  ngOnInit(): void {
    this.keySearch.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith(''),
    ).subscribe(value => {
      const optionFilter = [...this.options]
      if (!value) {
        this.filtered.set(optionFilter);
        return;
      }
      this.filtered.set(optionFilter.filter(option => {
        const valueAttrDisplay = (this.attrDisplay ? option[this.attrDisplay] : option)?.toString().toLowerCase();
        return valueAttrDisplay.includes(value.toLowerCase());
      }));
    });
  }

  filter(): void {
    const filterValue = this.inputSearch.nativeElement.value;
    this.keySearch.next(filterValue);
  }

  onSelectionChange(event: any) {
    this.selectionControl.writeValue(event.option.value ?? null);
  }


  @Input() set options(options: any[]) {
    this._options = options;
    this.filtered.set([...this._options]);
  }

  get options(): any[] {
    return this._options;
  }
}
