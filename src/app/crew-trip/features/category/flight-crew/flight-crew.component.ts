import {Component, ElementRef, inject, model, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption
} from "@angular/material/autocomplete";
import {MatAnchor, MatButton, MatButtonModule} from "@angular/material/button";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableModule
} from "@angular/material/table";
import {
  MatDatepickerActions,
  MatDatepickerApply, MatDatepickerCancel, MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker, MatEndDate, MatStartDate
} from "@angular/material/datepicker";
import {MatError, MatFormField, MatFormFieldModule, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSelect} from "@angular/material/select";
import {CommonModule, NgClass, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {
  ConfigOvernightRateComponent
} from "src/app/crew-trip/features/category/flight-crew/config-overnight-rate/config-overnight-rate.component";
import {OtherCrewComponent} from "src/app/crew-trip/features/category/flight-crew/other-crew/other-crew.component";
import {DataTransformPipe} from "src/app/crew-trip/shared/data-transform.pipe";
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {NationService} from "src/app/crew-trip/core/services/nation-service";
import {UsersService} from "src/app/crew-trip/core/services/users-service";
import {FlightCrewService} from "src/app/crew-trip/core/services/flight-crew-service";
import {RoleFunctionComponent} from "src/app/crew-trip/features/roles/role-function/role-function.component";
import {NoDataRowOutlet} from "@angular/cdk/table";
import {InputComponent} from "src/app/ui-elements/input/input.component";
import {RouterLink} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import {SelectionComponent} from "src/app/crew-trip/shared/component/selection/selection.component";
import {SelectOptions} from "src/app/crew-trip/shared/select-option";
import {FlightMarketService} from "src/app/crew-trip/core/services/ flight-market.service";
import {CrewsDetailComponent} from "src/app/crew-trip/features/category/crews/crews-detail/crews-detail.component";
import {MatDialog} from "@angular/material/dialog";
import {InfoPlaneService} from "src/app/crew-trip/core/services/InfoPlaneService.service";
import {Role} from "src/app/crew-trip/features/system/users/users.model";
import {SelectMultipleComponent} from "src/app/crew-trip/shared/component/select-multiple/select-multiple.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LOCALE} from "src/app/crew-trip/shared/utils/constant";
import {Observable, Subject} from "rxjs";
import {
  FlightCrewDetailComponent
} from "src/app/crew-trip/features/category/flight-crew/flight-crew-detail/flight-crew-detail.component";

@Component({
  selector: 'app-flight-crew',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet, InputComponent, NgxTrimDirectiveModule, OtherCrewComponent, ConfigOvernightRateComponent, MatAutocomplete, MatAutocompleteTrigger, SelectionComponent, InputSizeComponent, SelectMultipleComponent],

  templateUrl: './flight-crew.component.html',
  styleUrl: './flight-crew.component.scss'
})
export class FlightCrewComponent extends CommonComponent implements OnInit {
  override baseService = inject(FlightCrewService);
  flightMarketService = inject(FlightMarketService);
  infoPlaneService = inject(InfoPlaneService);
  usersService = inject(UsersService);
  fb = inject(FormBuilder);
  statusOptions = SelectOptions.STATUS;
  @ViewChild('marketCode') marketCode: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  markets: string[] = [];

  filteredOptionsMarket: any[];
  listActype: any[] = [];

  override formGroupDetail = this.fb.group({
    id: ['',],
    marketCode: ['', [Validators.required]],
    acType: ['', [Validators.required]],
    pilotNumber: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
    numberAttendant: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
    notes: ['', [Validators.maxLength(500)]],
    status: [true,]
  });


  constructor(public dialog: MatDialog) {
    super();
    this.formGroupSearch = this.fb.group({
      marketCode: ['',], status: ['',], acType: ['',],
    });
    this.formGroupSearchInit = {...this.formGroupSearch.value};
  }

  override async ngOnInit() {
    super.ngOnInit();
    this.displayedColumns = ['stt', 'market', 'acType', 'pilotNumber', 'attendantNumber', 'remark', 'status', 'action'];
    await Promise.all([
      this.getActypes(),
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

  async getActypes() {
    try {
      await this.spinner.show();
      const res = await this.infoPlaneService.search({
        page: this.pageIndex,
        limit: 9999
      });
      this.listActype = res.data.content;
    } finally {
      await this.spinner.hide();
    }
  }

  async flightCrewDetail(id?: any) {
    let item = {};
    if (!!id) {
      const response = await this.baseService.detail(id);
      item = {...response.data}
    }
    let markets = this.markets;
    let acTypes = this.listActype;
    const dialogRef = this.dialog.open(FlightCrewDetailComponent, {
      data: {item, markets, acTypes},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search();
      }
    });
  }
}
