import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  NO_ERRORS_SCHEMA,
  OnInit,
  ViewChild
} from '@angular/core';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {RouterLink} from '@angular/router';
import {CommonModule, NgClass, NgIf, TitleCasePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DataTransformPipe} from 'src/app/crew-trip/shared/data-transform.pipe';
import {MatError, MatFormField, MatFormFieldModule, MatLabel, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';
import {MatInput, MatInputModule} from '@angular/material/input';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {RoleFunctionComponent} from 'src/app/crew-trip/features/roles/role-function/role-function.component';
import {NoDataRowOutlet} from '@angular/cdk/table';
import {NationService} from 'src/app/crew-trip/core/services/nation-service';
import {UsersService} from 'src/app/crew-trip/core/services/users-service';
import {HotelService} from 'src/app/crew-trip/core/services/hotel-service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
  MatNativeDateModule,
  NativeDateAdapter,
  provideNativeDateAdapter
} from '@angular/material/core';
import {MatAutocompleteModule, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {map, Observable, startWith} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {FlightMarketService} from 'src/app/crew-trip/core/services/flight-market.service';
import {Constant, DATE_FORMAT_DD_MM_YYYY} from 'src/app/crew-trip/shared/utils/constant';
import {MAT_MOMENT_DATE_FORMATS, provideMomentDateAdapter} from '@angular/material-moment-adapter';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule
  ],
  providers: [DataTransformPipe,
    provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),
  ],
  templateUrl: './report8.component.html',
  styleUrl: './report8.component.scss'
})
export class reportcomponent8 extends CommonComponent implements OnInit {
  override baseService = inject(HotelService);
  flightMarketService = inject(FlightMarketService);
  @ViewChild('marketCode') marketCode: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  markets: any[] = [];
  filteredOptionsMarket: any[];


  override formGroupSearch = this.formBuilder.group({
    s: [''], //Keyword Search
    marketCode: [''],
    contractStartDate: [''],
    contractEndDate: [''],
    active: [''],
  });

  constructor(public dataTransformPipe: DataTransformPipe) {
    super();
  }

  override async ngOnInit() {
    super.ngOnInit();
    this.displayedColumns = ['stt', 'market', 'code','name', 'address', 'contactDetails', 'active', 'notes'];
    this.search();

    this.flightMarketService.search({option: 1}).then(res => {
      this.markets = res.data;
    });
  }

  filterMarket(): void {
    const filterValue = this.marketCode.nativeElement.value.toLowerCase();
    if (!filterValue) {
      this.filteredOptionsMarket = this.markets;
    }
    this.filteredOptionsMarket = this.markets.filter(market => market.toLowerCase().includes(filterValue));
  }

  onFocusMarket(): void {
    this.filteredOptionsMarket = this.markets;
    this.autocompleteTrigger.openPanel();
  }

  override search(body?: any, isNextPage?: boolean): any {
    const contractStartDate = this.formGroupSearch.controls.contractStartDate.value;
    const contractEndDate = this.formGroupSearch.controls.contractEndDate.value;
    const searchValue = {
      ...this.formGroupSearch.value,
      contractStartDate: contractStartDate ? this.dataTransformPipe.transform(contractStartDate, ['date', Constant.DATE_FORMAT]) : null,
      contractEndDate: contractEndDate ? this.dataTransformPipe.transform(contractEndDate, ['date', Constant.DATE_FORMAT]) : null,
    };
    super.search(searchValue, isNextPage);
  }
}
