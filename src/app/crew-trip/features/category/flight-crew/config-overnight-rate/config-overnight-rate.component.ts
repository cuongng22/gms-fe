import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSelect} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {SelectMultipleComponent} from "src/app/crew-trip/shared/component/select-multiple/select-multiple.component";
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {FlightCrewService} from "src/app/crew-trip/core/services/flight-crew-service";
import {FlightMarketService} from "src/app/crew-trip/core/services/ flight-market.service";
import {InfoPlaneService} from "src/app/crew-trip/core/services/InfoPlaneService.service";
import {UsersService} from "src/app/crew-trip/core/services/users-service";
import {ConfigOvernightRateService} from "src/app/crew-trip/core/services/config-overnight-rate-service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-config-overnight-rate',
  standalone: true,
  imports: [
    FormsModule,
    InputSizeComponent,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    ReactiveFormsModule,
    SelectMultipleComponent
  ],
  templateUrl: './config-overnight-rate.component.html',
  styleUrl: './config-overnight-rate.component.scss'
})
export class ConfigOvernightRateComponent extends CommonComponent implements OnInit {
  override baseService = inject(ConfigOvernightRateService);
  flightMarketService = inject(FlightMarketService);
  fb = inject(FormBuilder);
  @ViewChild('marketCode') marketCode: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  markets: string[] = [];
  filteredOptionsMarket: any[];


  constructor(public dialog: MatDialog) {
    super();
    this.formGroupSearch = this.fb.group({
      marketCode: ['',]
    });
    this.formGroupSearchInit = {...this.formGroupSearch.value};
  }

  override async ngOnInit() {
    super.ngOnInit();
    this.displayedColumns = ['stt', 'market', 'acType', 'pilotNumber', 'attendantNumber', 'remark', 'status', 'action'];
    await Promise.all([
      this.getListAirport(),
      this.search(),
    ]).then(() => {
    });
  }


  getListAirport() {
    this.flightMarketService.search({page: 0, limit: 99999, option: 0}).then(res => {
      this.markets = res.data.content.map((item: any) => item.marketCode);
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

}
