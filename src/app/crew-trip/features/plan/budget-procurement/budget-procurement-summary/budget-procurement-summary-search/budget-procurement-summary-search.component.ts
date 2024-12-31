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
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { categories, categoryOfPlans, StatusesSummary } from '../../budget-procurement.model';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';

@Component({
  selector: 'app-budget-procurement-summary-search',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    DataTransformPipe, RouterLink, RouterModule, AsyncPipe, SelectionSuggestComponent, SelectionComponent,
    SelectMultipleComponent],
  templateUrl: './budget-procurement-summary-search.component.html',
  styleUrl: './budget-procurement-summary-search.component.scss'
})
export class BudgetProcurementSummarySearchComponent implements OnInit {

  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  flightMarketService = inject(FlightMarketService);

  _categoryType: string = '';
  search = output<any>();

  @ViewChild('airport') airport: ElementRef<HTMLInputElement>;
  filteredOptionsAirport = model<any[]>([]);
  keySearchAirport = new Subject<string>();
  airports = model<any[]>([]);
  categories = categories;
  categoryOfPlans = categoryOfPlans;
  statuses = StatusesSummary;

  formGroupSearch = this.formBuilder.group({
    airportCodes: [''],
    categoryOfPlan: [''], // loại kế hoạch ngân sách hay mua sắm
    category: [''], // loại quốc tế hay quốc nội
    status: ['']
  });


  ngOnInit(): void {
    // Lấy danh sách thị trường cho ô search
    this.flightMarketService.search({ option: 1 }).then(res => {
      this.airports.set(res.data);
    });
  }


  onSearch(): void {
    this.search.emit(this.formGroupSearch.value);
  }

  @Input()
  set categoryType(value: string) {
    this._categoryType = value;
  }

  get categoryType(): string {
    return this._categoryType;
  }
}


