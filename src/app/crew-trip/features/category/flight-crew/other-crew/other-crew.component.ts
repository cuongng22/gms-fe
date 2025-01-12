import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatAnchor, MatButton, MatButtonModule} from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {
  MatDatepickerActions,
  MatDatepickerApply, MatDatepickerCancel, MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker, MatEndDate, MatStartDate
} from '@angular/material/datepicker';
import {MatError, MatFormField, MatFormFieldModule, MatLabel, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import {CommonModule, NgClass, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {SelectMultipleComponent} from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableModule
} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {FlightCrewService} from 'src/app/crew-trip/core/services/flight-crew-service';
import {FlightCrewOtherService} from 'src/app/crew-trip/core/services/flight-crew-other-service';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DataTransformPipe} from 'src/app/crew-trip/shared/data-transform.pipe';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {RoleFunctionComponent} from 'src/app/crew-trip/features/roles/role-function/role-function.component';
import {NoDataRowOutlet} from '@angular/cdk/table';
import {InputComponent} from 'src/app/ui-elements/input/input.component';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {
  ConfigOvernightRateComponent
} from 'src/app/crew-trip/features/category/flight-crew/config-overnight-rate/config-overnight-rate.component';
import {SelectionComponent} from 'src/app/crew-trip/shared/component/selection/selection.component';
import {SelectOptions} from "src/app/crew-trip/shared/select-option";
import {NationService} from "src/app/crew-trip/core/services/nation-service";
import {
  SelectionSuggestComponent
} from "src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component";
import {FlightMarketService} from "src/app/crew-trip/core/services/flight-market.service";

@Component({
  selector: 'app-other-crew',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatFormFieldModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet, MatFormField, NgxTrimDirectiveModule, ReactiveFormsModule, InputSizeComponent, SelectionComponent, InputSizeComponent, SelectMultipleComponent, SelectionSuggestComponent
  ],
  templateUrl: './other-crew.component.html',
  styleUrl: './other-crew.component.scss'
})
export class OtherCrewComponent  extends CommonComponent implements OnInit {
  override baseService = inject(FlightCrewOtherService);
  nationService = inject(NationService);
  flightMarketSv = inject(FlightMarketService);
  @ViewChild('marketCode') marketCode: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  markets: any[] = [];
  airportList: any[] = [];
  countries: any[] = [];
  filteredOptionsMarket: any[];
  fb = inject(FormBuilder);
  listType: any[] = SelectOptions.OTHER_CREW_TYPE;


  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      s: ['',], type: ['',],
    });
    this.formGroupDetail = this.fb.group({
      id: ['',],
      type: ['', [Validators.required]],
      name: ['', [Validators.required]],
      nation: ['',[Validators.required]],
      airportCodes: [''],
      desCode :[''],
      arrCode :[''],
      notes: [''],
      status: [true,]
    });
    this.formGroupSearchInit = {...this.formGroupSearch.value};
    this.formGroupDetailInit = {...this.formGroupDetail.value};
  }

  override async ngOnInit() {
    super.ngOnInit();
    this.displayedColumns = ['stt', 'name', 'nation', 'airportCodes', 'des-arr', 'flightNo', 'acGroup','acType','applyFor','time','remark', 'action'];
    await Promise.all([
      this.getListNation(),
      this.search(),
      this.getAllAirportCode()
    ]).then(() => {
    });

  }

  getListNation(){
    this.nationService.search({page: 0, limit: 99999, active: true}).then(res => {
      this.countries = res.data.content;
    });
  }

  getListAirportCodeByNation(idNation:any){
    this.nationService.getAirportByNation({id:idNation,option :0}).then(res => {
      this.markets = res.data;
    });
  }

  getAllAirportCode(){
    this.flightMarketSv.search({ option: 1, status: 'Operational' }).then(res => {
      this.markets = res.data;
      this.airportList = res.data;
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


  changeValueNation(newValue: any) {
    if(newValue){
      this.getListAirportCodeByNation(newValue.value);
    }
  }
}
