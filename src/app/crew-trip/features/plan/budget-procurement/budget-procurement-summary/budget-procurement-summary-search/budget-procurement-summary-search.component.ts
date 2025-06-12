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
import { categories, CategoryEnum, categoryOfPlans, StatusesSummary } from '../../budget-procurement.model';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { FlightMarketStatusEnum } from 'src/app/crew-trip/features/category/flight-market/flight-market.model';
import { CategoriesEnum } from '../../../estimated-cost/estimated-cost.model';

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
export class BudgetProcurementSummarySearchComponent extends CommonComponent implements OnInit {

  private readonly destroyRef = inject(DestroyRef);
  flightMarketService = inject(FlightMarketService);

  _categoryType: string = '';
  searchEvent = output<any>();
  formChangeEvent = output<any>();

  @ViewChild('airport') airport: ElementRef<HTMLInputElement>;
  filteredOptionsAirport = model<any[]>([]);
  keySearchAirport = new Subject<string>();
  categories = categories;
  categoryOfPlans = categoryOfPlans;
  statuses = StatusesSummary;

  override formGroupSearch = this.formBuilder.group({
    airportCodes: [''],
    categoryOfPlan: [''], // loại kế hoạch ngân sách hay mua sắm
    category: [''], // loại quốc tế hay quốc nội
    status: ['']
  });


  override ngOnInit(): void {
    const typeAirport = this.categoryType === CategoriesEnum.ALL || this.categoryType === 'All' ? '' : this.categoryType;
    this.loadListFlightMarket({ type: typeAirport });
    this.formGroupSearch.valueChanges.subscribe((value) => {
      this.formChangeEvent.emit(value);
    });
  }


  onSearch(): void {
    this.searchEvent.emit(this.formGroupSearch.value);
  }

  @Input()
  set categoryType(value: string) {
    this._categoryType = value;
  }

  get categoryType(): string {
    return this._categoryType;
  }
}


