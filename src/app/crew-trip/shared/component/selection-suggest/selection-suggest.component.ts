import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, ElementRef, inject, input, Input, model, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { InputSizeComponent } from '../../input/input-size.component';
import { debounceTime, startWith, Subject } from 'rxjs';
import { NgxControlValueAccessor } from 'ngxtension/control-value-accessor';

@Component({
  selector: 'app-selection-suggest',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatAutocompleteModule, CommonModule],
  templateUrl: './selection-suggest.component.html',
  styleUrl: './selection-suggest.component.scss',
  hostDirectives: [NgxControlValueAccessor],

})
export class SelectionSuggestComponent implements OnInit, AfterViewInit, AfterContentInit {

  @Input() size = 'sm';
  @Input() label = '';
  @Input() attrValue = '';
  @Input() attrDisplay = '';

  private _options: any[] = []
  keySearch = new Subject<string>();
  filtered = model<any[]>([]);


  @ViewChild('inputSearch') inputSearch: ElementRef<HTMLInputElement>;

  protected selectionControl = inject<NgxControlValueAccessor<any>>(
    NgxControlValueAccessor,
  );

  ngOnInit(): void {
    this.keySearch.pipe(
      debounceTime(500),
      startWith(''),
    ).subscribe(value => {
      if (!value) {
        this.filtered.set(this.options);
        return;
      }
      this.filtered.set(this.options.filter(option => {
        const valueAttrDisplay = (this.attrDisplay ? option[this.attrDisplay] : option)?.toString().toLowerCase();
        return valueAttrDisplay.includes(value.toLowerCase());
      }));
    });
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit options: ', this.options);
  }

  ngAfterContentInit(): void {
    console.log('ngAfterContentInit options: ', this.options);
  }

  filter(): void {
    const filterValue = this.inputSearch.nativeElement.value;
    if (!filterValue) {
      this.filtered.set([...this.options]);
      return;
    }
    this.keySearch.next(filterValue);
  }

  onSelectionChange(event: any) {
    this.selectionControl.writeValue(event.option.value ?? null);
  }


  @Input() set options(options: any[]) {
    this._options = options;
    this.filtered.set(this._options);
  }

  get options(): any[] {
    return this._options;
  }
}
