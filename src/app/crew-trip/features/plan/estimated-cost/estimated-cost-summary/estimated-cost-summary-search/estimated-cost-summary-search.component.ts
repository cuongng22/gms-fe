import { CommonModule, AsyncPipe } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, Input, model, OnInit, output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
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
import { Subject } from 'rxjs';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { categories, categoryOfPlans, StatusesSummary } from '../../../budget-procurement/budget-procurement.model';
import { CategoriesEnum } from '../../estimated-cost.model';

@Component({
  selector: 'app-estimated-cost-summary-search',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    DataTransformPipe, RouterLink, RouterModule, AsyncPipe, SelectionSuggestComponent, SelectionComponent,
    SelectMultipleComponent
  ],
  templateUrl: './estimated-cost-summary-search.component.html',
  styleUrl: './estimated-cost-summary-search.component.scss'
})
export class EstimatedCostSummarySearchComponent implements OnInit {

  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  flightMarketService = inject(FlightMarketService);

  CategoriesEnum = CategoriesEnum;

  _categoryType: CategoriesEnum = CategoriesEnum.ALL;
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
  set categoryType(value: CategoriesEnum) {
    this._categoryType = value;
  }

  get categoryType(): CategoriesEnum {
    return this._categoryType;
  }

}
