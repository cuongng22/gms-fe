import { F } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, model, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { FlightMarketService } from 'src/app/crew-trip/core/services/ flight-market.service';
import { NationService } from 'src/app/crew-trip/core/services/nation-service';
import { ServiceFeeService } from 'src/app/crew-trip/core/services/service-fee-service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { debouncedSignal } from 'src/app/crew-trip/shared/utils/constant';
import { LOCALE_ID, Inject } from '@angular/core';
import { FlightGroupData } from 'src/app/crew-trip/core/metadata/flight-group.data';
import { debounceTime, map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-flight-market-detail',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, MatChipsModule, RouterLink, RouterModule],
  templateUrl: './flight-market-detail.component.html',
  styleUrl: './flight-market-detail.component.scss'
})
export class FlightMarketDetailComponent extends CommonComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  override baseService = inject(FlightMarketService);
  serviceFeeService = inject(ServiceFeeService);
  nationService = inject(NationService);

  // id của flight market
  id = input.required<number>();

  searchCostCategory = model<string>('');
  debounceSearchCostCategory = debouncedSignal(this.searchCostCategory, 300);

  filteredCountry: Observable<any[]>;

  costCategorysRaw: any[] = [];
  costCategorys: any[] = [];

  countries: any[] = [];

  flightGroupData = FlightGroupData;

  override formGroupDetail = this.formBuilder.group({
    marketCode: [''],
    name: [''],
    nationId: [''],
    nationName: [''],
    marketType: [''],
    flightGroup: [''],
    serviceFeeId: [''],
    statusUsage: [''],
    notes: ['']
  });

  constructor(@Inject(LOCALE_ID) public locale: string) {
    super();
    console.debug('locale: ', locale);
    // tìm kiếm danh mục chi phí
    effect(() => {
      const keySearch = this.debounceSearchCostCategory();
      if (!keySearch) {
        this.costCategorys = this.costCategorysRaw;
      } else {
        this.costCategorys = this.costCategorysRaw.filter(x => (x.name.toLowerCase().includes(keySearch.toLowerCase()) || x.code.toLowerCase().includes(keySearch.toLowerCase())));
      }

    });

  }

  override ngOnInit(): void {
    // lấy danh sách dịch vụ
    this.serviceFeeService.search({ page: 0, size: 99999 }).then(res => {
      this.costCategorysRaw = res.data.content;
      this.costCategorys = res.data.content;
    });

    // Lấy danh sách quốc gia
    this.nationService.search({ page: 0, size: 99999 }).then(res => {
      this.countries = res.data.content;
      this.filteredCountry = this.formGroupDetail.controls.nationName.valueChanges.pipe(
        debounceTime(300), // Đợi 300ms sau lần nhập cuối cùng
        startWith(''),
        map(value => this._filterCountry(value ?? '')));
    });

    // Lấy chi tiết flight market
    this.baseService.detail(this.id()).then(res => {
      this.formGroupDetail.patchValue(res.data);
    });
  }

  private _filterCountry(value: string): any[] {
    console.log('searchCountry', value)
    if (!value) {
      return this.countries.map(country => country.vniName);
    }
    const filterValue = value.toLowerCase();
    return this.countries.filter(country => country.engName.toLowerCase().includes(filterValue) || country.vniName.toLowerCase().includes(filterValue)).map(country => country.vniName);
  }
}