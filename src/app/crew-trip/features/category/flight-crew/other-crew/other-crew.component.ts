import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { MatAnchor, MatButton, MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {
  MatDatepicker,
  MatDatepickerActions,
  MatDatepickerApply, MatDatepickerCancel, MatDatepickerInput, MatDatepickerModule, MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker, MatEndDate, MatStartDate
} from '@angular/material/datepicker';
import { MatError, MatFormField, MatFormFieldModule, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { CommonModule, NgClass, NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableModule
} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FlightCrewService } from 'src/app/crew-trip/core/services/flight-crew-service';
import { FlightCrewOtherService } from 'src/app/crew-trip/core/services/flight-crew-other-service';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { RoleFunctionComponent } from 'src/app/crew-trip/features/roles/role-function/role-function.component';
import { NoDataRowOutlet } from '@angular/cdk/table';
import { InputComponent } from 'src/app/ui-elements/input/input.component';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import {
  ConfigOvernightRateComponent
} from 'src/app/crew-trip/features/category/flight-crew/config-overnight-rate/config-overnight-rate.component';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { SelectOptions } from "src/app/crew-trip/shared/select-option";
import { NationService } from "src/app/crew-trip/core/services/nation-service";
import {
  SelectionSuggestComponent
} from "src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component";
import { FlightMarketService } from "src/app/crew-trip/core/services/flight-market.service";
import { AirplaneService } from "src/app/crew-trip/core/services/airplane-service";
import { InfoPlaneService } from "src/app/crew-trip/core/services/InfoPlaneService.service";
import { MatMomentDateModule, provideMomentDateAdapter } from "@angular/material-moment-adapter";
import { HttpStatusCode } from "@angular/common/http";
import { DATE_FORMAT_DD_MM_YYYY, MESSAGE } from "src/app/crew-trip/shared/utils/constant";
import { HasPermissionDirective } from 'src/app/crew-trip/shared/directive/has-permission.directive';
import { ifValidator } from 'ngxtension/if-validator';
import { NgxControlError } from 'ngxtension/control-error';
import { truncateDate } from 'src/app/crew-trip/shared/utils/common';

@Component({
  selector: 'app-other-crew',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatFormFieldModule, MatDatepickerModule, MatMomentDateModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet, MatFormField, NgxTrimDirectiveModule, ReactiveFormsModule, InputSizeComponent, SelectionComponent, InputSizeComponent, SelectMultipleComponent, SelectionSuggestComponent, MatDatepicker, MatDatepickerInput, MatDatepickerToggle,
    HasPermissionDirective, NgxControlError
  ],
  templateUrl: './other-crew.component.html',
  styleUrl: './other-crew.component.scss',
  providers: [HasPermissionDirective,
    provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY)
  ]
})
export class OtherCrewComponent extends CommonComponent implements OnInit {
  override baseService = inject(FlightCrewOtherService);
  nationService = inject(NationService);
  flightCrewService = inject(FlightCrewService);
  airplaneService = inject(AirplaneService);
  infoPlaneService = inject(InfoPlaneService);
  flightMarketSv = inject(FlightMarketService);
  @ViewChild('marketCode') marketCode: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  markets: any[] = [];
  airportList: any[] = [];
  countries: any[] = [];
  fltNoList: any[] = [];
  acGroupList: any[] = [];
  acTypeList: any[] = [];
  acTypeListAll: any[] = [];
  targetPersonals: any[] = [{ label: 'Pilot', code: 'FC' }, { label: 'Attendant', code: 'CC' }]
  filteredOptionsMarket: any[];
  fb = inject(FormBuilder);
  listType: any[] = SelectOptions.OTHER_CREW_TYPE;
  sysdate = truncateDate(new Date(new Date().setDate(new Date().getDate() + 1)));

  override formGroupDetail = this.fb.group({
    id: ['',],
    type: ['', [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(250)]],
    nationId: ['', [Validators.required]],
    airportCodes: [''],
    desCode: ['', ifValidator(() => this.validateDesCode, [Validators.required])],
    arrCode: [''],
    flightNo: [''],
    acGroup: [''],
    acType: [''],
    applyFor: ['', [Validators.required]],
    fromDate: ['', [Validators.required]],
    toDate: ['', [Validators.required]],
    notes: ['', [Validators.maxLength(500)]],
    status: [true,]
  });
  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      s: ['',], type: ['',], export: [false],
    });

    this.formGroupSearchInit = { ...this.formGroupSearch.value };
    this.formGroupDetailInit = { ...this.formGroupDetail.value };
  }

  @ViewChild('suggestDesCode') suggestDesCode: SelectionSuggestComponent


  override async ngOnInit() {
    super.ngOnInit();
    this.displayedColumns = ['stt', 'name', 'nation', 'airportCodes', 'des-arr', 'flightNo', 'acGroup', 'acType', 'applyFor', 'time', 'remark', 'action'];
    await Promise.all([
      this.getListNation(),
      this.search(),
      this.getAllAirportCode(),
      this.getFltNoList(),
      this.getListAirplanAcGroup(),
      this.getListAirplanAcType()
    ]).then(() => {
    });
    // this.formGroupDetail.controls.desCode.valueChanges.subscribe((value: any) => {
    //   const arrCodeControl = this.formGroupDetail.get('arrCode');
    //   if (value && (!arrCodeControl?.value || arrCodeControl.value.trim() === '')) {
    //     arrCodeControl?.setErrors({ required: true });
    //   } else {
    //     arrCodeControl?.setErrors(null);
    //   }
    // });
    this.formGroupDetail.controls.airportCodes.valueChanges.subscribe(value => {
      if (value) {
        this.formGroupDetail.controls.desCode.setValue(value);
        this.formGroupDetail.controls.desCode.disable()
      } else {
        this.formGroupDetail.controls.desCode.reset();
        this.formGroupDetail.controls.desCode.enable()
      }
    })
  }

  async getListNation() {
    this.nationService.search({ page: 0, limit: 99999, active: true }).then(res => {
      this.countries = res.data.content.map((item: any) => {
        return { ...item, display: item.code + ' - ' + item.engName }
      });
    });
  }

  async getFltNoList() {
    this.flightCrewService.getListFltNos().then(res => {
      this.fltNoList = res.data;
    });
  }

  async getListAirportCodeByNation(idNation: any) {
    const res = await this.nationService.getAirportByNation({ id: idNation, option: 0 });
    this.markets = res.data
  }

  async getListAirplanAcGroup() {
    this.airplaneService.listAirplanes("AC_GROUP").then(res => {
      this.acGroupList = res.data;
    });
  }

  async getListAirplanAcType() {
    this.infoPlaneService.search({ page: 0, limit: 99999 }).then(res => {
      this.acTypeListAll = res.data.content;
      this.acTypeList = res.data.content;
    });
  }

  async getAllAirportCode() {
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
    if (newValue) {
      this.getListAirportCodeByNation(newValue.value);
    }
  }

  changeAcGroup(newValue: any) {
    if (newValue) {
      if (this.acTypeList) {
        this.acTypeList = this.acTypeListAll.filter(item => item.acgroup == newValue.value);
      }
    }
  }

  onClearInput(type: any) {
    if (type == 'ACGROUP') {
      this.acTypeList = this.acTypeListAll;
    } else {
      this.getAllAirportCode();
    }
  }

  override async save() {
    try {
      this.formGroupDetail.markAllAsTouched();
      this.formGroupDetail.updateValueAndValidity();
      this.formGroupDetail.controls.desCode.updateValueAndValidity()
      if (this.formGroupDetail.controls.desCode.hasError('required')) {
        this.suggestDesCode.setRequired(true)
      }
      this.formGroupDetail.controls.desCode.updateValueAndValidity()
      if (this.formGroupDetail.invalid) {
        console.log(this.formGroupDetail.controls)
        this.findInvalidControls(this.formGroupDetail);
        return;
      }
      debugger
      if (this.formGroupDetail.controls.arrCode.value === this.formGroupDetail.controls.desCode.value) {
        this.showError($localize`:@@ORGMustBeDifferentFromDST:ORG must be different from DST`)
        return;
      }
      else if (!this.markets.some(value => value === this.formGroupDetail.controls.arrCode.value || value === this.formGroupDetail.controls.desCode.value)) {
        this.showError($localize`:@@ORGMustBeDifferentFromDST:ORG must be different from DST`)
        return;
      }
      const update = !!this.formGroupDetail.getRawValue().id;
      await this.spinner.show();
      let res;
      if (update) {
        res = await this.baseService.update(this.formGroupDetail.getRawValue());
      } else {
        res = await this.baseService.create(this.formGroupDetail.getRawValue());
      }
      await this.search();
      this.baseService.showSuccess(
        update ? MESSAGE.UPDATE_SUCCESS : MESSAGE.CREATE_SUCCESS,
      );
      await this.closeDetail();
      return res;
    } catch (e: any) {
    } finally {
      await this.spinner.hide();
    }
  }

  override async showDialogDetail(id?: any, type?: string) {
    this.formGroupDetail.reset()
    if (id != null && type === 'index') {
      this.formGroupDetail.patchValue(this.dataSource.data[id]);
    } else if (id != null) {
      await this.detail(id);
      this.getListAirportCodeByNation(this.formGroupDetail.controls.nationId.value)
    }
    this.toggleDialogCreate();
  }

  get validateDesCode(): boolean {
    return !!this.formGroupDetail?.controls?.arrCode?.value;
  }
}
