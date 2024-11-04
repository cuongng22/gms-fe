import { CommonModule, AsyncPipe } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, input, Input, model, OnInit, output, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, RouterModule } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { debounceTime, startWith, Subject } from 'rxjs';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
  selector: 'app-budget-procurement-summary-search',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    DataTransformPipe, RouterLink, RouterModule, AsyncPipe],
  templateUrl: './budget-procurement-summary-search.component.html',
  styleUrl: './budget-procurement-summary-search.component.scss'
})
export class BudgetProcurementSummarySearchComponent implements OnInit {

  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  categoryType = input<string>();
  search = output<any>();

  @ViewChild('airport') airport: ElementRef<HTMLInputElement>;
  filteredOptionsAirport = model<any[]>([]);
  keySearchAirport = new Subject<string>();
  airports: any[] = ['HAN','SGN'];

  formGroupSearch = this.formBuilder.group({
    airport: [''],
    categoryOfPlan: [''],
    category: [''],
    status: ['']
  });


  ngOnInit(): void {
    this.keySearchAirport.pipe(
      debounceTime(500),
      startWith(''),
    ).subscribe((value: string) => this._filterAirport(value ?? ''));
  }

  private _filterAirport(value: string): void {
    if (!value) {
      this.filteredOptionsAirport.set(this.airports);
      return;
    }
    const filterValue = value.toLowerCase();
    this.filteredOptionsAirport.set(this.airports.filter(airport => airport?.toLowerCase().includes(filterValue)));
  }

  filterAirport(): void {
    const filterdValue = this.airport.nativeElement.value;
    if (!filterdValue) {
      this.filteredOptionsAirport.set(this.airports);
      return;
    }
    this.keySearchAirport.next(filterdValue);
  }

  onSearch(): void {
    this.search.emit(this.formGroupSearch.value);
  }
}


