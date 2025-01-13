import { CommonModule, NgClass, NgIf, TitleCasePipe } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatError,
  MatFormFieldModule,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { ContractService } from 'src/app/crew-trip/core/services/contract-service';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { HotelService } from 'src/app/crew-trip/core/services/hotel-service';
import { VehicleService } from 'src/app/crew-trip/core/services/vehicle.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { ListResponse } from 'src/app/crew-trip/shared/models/common.model';
import {
  Constant,
  MESSAGE,
  removeNullValues,
} from 'src/app/crew-trip/shared/utils/constant';

@Component({
  selector: 'app-contract',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    NgIf,
    MatCheckboxModule,
    TitleCasePipe,
    DataTransformPipe,
    NgClass,
    MatFormFieldModule,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    InputSizeComponent,
    MatError,
    MatSuffix,
    MatDatepickerModule,
    NgxTrimDirectiveModule,
    SelectMultipleComponent,
    NgxControlError,
  ],
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss',
  providers: [
    provideMomentDateAdapter({
      parse: {
        dateInput: 'DD/MM/YYYY',
      },
      display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MM/YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MM/YYYY',
      },
    }),
  ],
})
export class ContractComponent extends CommonComponent implements OnInit {
  viewType = 'HD'; //HD-PL
  override baseService = inject(ContractService);
  flightMarketService = inject(FlightMarketService);
  hotelService = inject(HotelService);
  vehicleService = inject(VehicleService);
  fb = inject(FormBuilder);

  //variable
  step = 1;
  readMode = true;
  action = 'edit';
  bizDocId: any;
  contractObj: any;
  listPartner: any[] = [];
  listHotel = [];
  listVehicle = [];
  tblAnnexData = new MatTableDataSource();
  _displayedColumns: {
		label: string;
		value: string;
		type?: string;
		format?: string;
	}[] = [
      // {label: 'Ngày tạo', value: 'ngayTao', type: Constant.DATE, format: Constant.DATE_FORMAT},
      { label: $localize`Airport code`, value: 'marketCode' },
      {
        label: $localize`bizDocId`,
        value: 'bizDocId',
      },
      { label: $localize`Contract Code`, value: 'contractCode' },
      {
        label: $localize`Contract No`,
        value: 'contractNo',
      },
      { label: $localize`Contract Name`, value: 'contractName' },
      {
        label: $localize`Supplier`,
        value: 'partnerName',
      },
      { label: $localize`Service Type`, value: 'serviceObject' },
      {
        label: $localize`Signed Date`,
        value: 'signedDate',
        type: Constant.DATE,
        format: Constant.DATE_FORMAT,
      },
    ];
	@Input() contractId: any;

	showPopupAnnex = false;

	constructor() {
	  super();
	  this.formGroupSearch = this.fb.group({
	    s: [],
	    marketCodes: [],
	    partnerCode: [],
	    startDate: [],
	    endDate: [],
	    export: [null],
	    exportType: [],
	    active: [false],
	    contractId: [],
	  });
	  this.formGroupDetail = this.fb.group({
	    id: [],
	    bizDocId: [],
	    bizDocIdC1: [],
	    contractName: [],
	    contractCode: [],
	  });
	  this.formGroupSearchInit = { ...this.formGroupSearch.value };
	  this.formGroupDetailInit = { ...this.formGroupDetail.value };
	}

	override async ngOnInit() {
	  await Promise.all([
	    this.loadListFlightMarket(),
	    this.loadListHotel(),
	    this.loadListVehiclesPartner(),
	    this.search(),
	  ]).then(() => {
	    const listCombine = [...this.listVehicle, ...this.listHotel];
	    this.listPartner = listCombine.map((s: any) => ({
	      code: s.code ?? s.hotelCode,
	      name: s.name
	        ? `[${s.code} - ${s.name}]`
	        : s.hotelName
	          ? `[${s.hotelCode} - ${s.hotelName}]`
	          : '',
	    }));
	  });
	  this.displayedColumns = [
	    'stt',
	    ...this._displayedColumns.map((s) => s.value),
	    'effectiveDate',
	    'appendixCount',
	    'action',
	  ];
	}

	async nextStep(id?: any, readMode?: any, action?: any) {
	  /*this.bizDocId = id;
    this.step = 2;
    this.readMode = readMode;
    this.action = action;*/
	  localStorage.setItem(
	    'detail',
	    JSON.stringify({
	      bizDocId: id,
	      step: 2,
	      readMode: readMode,
	      action: action,
	      contractObj: this.contractObj,
	      dataObject: this.formGroupDetail.getRawValue(),
	      viewType: this.viewType,
	    }),
	  );
	  await this._router.navigate(['/category/contract/detail'], {
	    state: {
	      data: JSON.stringify({
	        bizDocId: id,
	        step: 2,
	        readMode: readMode,
	        action: action,
	        contractObj: this.contractObj,
	        dataObject: this.formGroupDetail.getRawValue(),
	        viewType: this.viewType,
	      }),
	    },
	  });
	}

	async backStep() {
	  await this.search();
	  this.step = 1;
	  this._router.navigate(['/category/contract']);
	  localStorage.removeItem('detail');
	}

	async showAnnex(index: any) {
	  // await this.baseService.getListAnnex({contractId: id}).then(res => {
	  //   this.tblAnnexData.data = res.data.content;
	  this.tblAnnexData.data = (this.dataSource.data[index] as any).appendixList;
	  this.showPopupAnnex = true;
	}

	async loadListHotel() {
	  await this.hotelService.search({}).then((res) => {
	    if (res.data) {
	      this.listHotel = res.data.content;
	    }
	  });
	}

	async loadListVehiclesPartner() {
	  await this.vehicleService.search({}).then((res) => {
	    if (res.data) {
	      this.listVehicle = res.data.content;
	    }
	  });
	}

	async syncDWH() {}

	async showListAnnex(id: any) {
	  this.viewType = 'PL';
	  this.formGroupSearch.patchValue({ contractId: id });
	  this.contractObj = this.dataSource.data.find(
	    (value: any) => value.bizDocId == id,
	  );
	  this.formGroupDetail.patchValue({
	    bizDocIdC1: this.contractObj.bizDocId,
	    contractName: this.contractObj.contractName,
	    contractCode: this.contractObj.contractCode,
	  });

	  await this.search();
	}

	async showListContract() {
	  this.viewType = 'HD';
	  await this.search();
	}

	override async search<T>(body?: any, isNextPage?: boolean) {
	  try {
	    await this.spinner.show();
	    if (!isNextPage) {
	      this.pageIndex = Constant.PAGE;
	    }
	    let res;
	    if (this.viewType == 'HD') {
	      this.displayedColumns = [
	        'stt',
	        ...this._displayedColumns.map((s) => s.value),
	        'effectiveDate',
	        'appendixCount',
	        'action',
	      ];
	      res = await this.baseService.search<ListResponse<T>>({
	        page: this.pageIndex,
	        size: this.pageSize,
	        limit: this.pageSize,
	        ...(removeNullValues(body) ||
						removeNullValues(this.formGroupSearch.value)),
	      });
	    } else if (this.viewType == 'PL') {
	      this.displayedColumns = [
	        'stt',
	        'bizDocId',
	        'contractCode',
	        'contractName',
	        'partnerName',
	        'marketCode',
	        'effectiveDate',
	        'action',
	      ];
	      res = await this.baseService.getListAnnex<ListResponse<T>>({
	        page: this.pageIndex,
	        size: this.pageSize,
	        limit: this.pageSize,
	        ...(removeNullValues(body) ||
						removeNullValues(this.formGroupSearch.value)),
	      });
	    }

	    if (res) {
	      if (res.status === HttpStatusCode.Ok) {
	        this.dataSource.data = res.data.content;
	        this.dataSource.data = this.dataSource.data.map((s: any) => ({
	          ...s,
	          contractCode: s.appendixCode ? s.appendixCode : s.contractCode,
	          contractName: s.appendixName ? s.appendixName : s.contractName,
	          contractNo: s.appendixNo ? s.appendixNo : s.contractNo,
	          appendixCount: s.appendixList?.length ?? 0,
	          isActiveLabel:
							s.isActive === true || !!s.isActive
							  ? MESSAGE.ACTIVE
							  : MESSAGE.INACTIVE,
	          activeLabel:
							s.active === true || !!s.active || s.status === true || !!s.status
							  ? MESSAGE.ACTIVE
							  : MESSAGE.INACTIVE,
	        }));
	        this.totalElement = res.data.totalElements;
	      }
	      return res;
	    }
	  } catch (e: any) {
	    this.baseService.showError(
	      e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR,
	    );
	  } finally {
	    await this.spinner.hide();
	  }
	}

	override async exportFile(body?: any, filename?: string) {
	  try {
	    await this.spinner.show();
	    this.formGroupSearch.patchValue({ export: true, exportType: 'ALL' });
	    this.baseService
	      .export(removeNullValues(this.formGroupSearch.value))
	      .then((res) => {
	        this.downloadFile(res, filename ?? res.fileName);
	      });
	    this.formGroupSearch.patchValue({ export: false, exportType: 'ALL' });
	  } catch (e: any) {
	    this.baseService.showError(e.error?.error?.code ?? MESSAGE.ERROR);
	  } finally {
	    await this.spinner.hide();
	  }
	}
}
