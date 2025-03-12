import {CommonModule, NgClass, NgIf, TitleCasePipe} from '@angular/common';
import {HttpStatusCode} from '@angular/common/http';
import {Component, inject, Input, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatError, MatFormFieldModule, MatLabel, MatSuffix,} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {cloneDeep} from 'lodash';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {NgxControlError} from 'ngxtension/control-error';
import {ContractService} from 'src/app/crew-trip/core/services/contract-service';
import {FlightMarketService} from 'src/app/crew-trip/core/services/flight-market.service';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {SelectMultipleComponent} from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import {DataTransformPipe} from 'src/app/crew-trip/shared/data-transform.pipe';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {ListResponse} from 'src/app/crew-trip/shared/models/common.model';
import {Constant, MESSAGE, removeNullValues,} from 'src/app/crew-trip/shared/utils/constant';

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
  fb = inject(FormBuilder);

  //variable
  step = 1;
  readMode = true;
  action = 'edit';
  bizDocId: any;
  contractObj: any;
  listPartner: any[] = [];
  tblAnnexData = new MatTableDataSource();
  _displayedColumns: {
    label: string;
    label1?: string;
    value: string;
    type?: string;
    format?: string;
  }[] = [
    // {label: 'Ngày tạo', value: 'ngayTao', type: Constant.DATE, format: Constant.DATE_FORMAT},
    {label: $localize`Airport code`, value: 'marketCode'},
    {label: $localize`BizDocId`, label1: $localize`Appendix No`, value: 'bizDocId'},
    {label: $localize`Contract Code`, label1: $localize`Appendix Code`, value: 'contractCode',},
    {label: $localize`Contract No`, value: 'contractNo'},
    {label: $localize`Contract Name`, label1: $localize`Appendix Name`, value: 'contractName',},
    {label: $localize`Supplier`, value: 'partnerName'},
    {label: $localize`Service Type`, value: 'serviceObject'},
    {label: $localize`Signed Date`, value: 'signedDate', type: Constant.DATE, format: Constant.DATE_FORMAT,},
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
    this.formGroupSearchInit = {...this.formGroupSearch.value};
    this.formGroupDetailInit = {...this.formGroupDetail.value};
  }

  override async ngOnInit() {
    const cache = JSON.parse(localStorage.getItem('viewType')!);
    if (cache) {
      this.viewType = cache.viewType;
      this.contractObj = cache.contractObj;
      this.showListAnnex(cache.bizDocId, cache.contractObj);
    }
    await Promise.all([
      this.loadListFlightMarket(),
      this.loadListHotel(),
      this.loadListVehicle(),
      this.search(),
    ]).then(() => {

      const listCombine = [...this.listVehicles, ...this.listHotels];
      this.listPartner = listCombine.map((s: any) => ({
        code: s.code ?? s.hotelCode,
        name: s.name
          ? `[${s.code}] - ${s.name}`
          : s.hotelName
            ? `[${s.hotelCode}] - ${s.hotelName}`
            : '',
      }));
    });
    if (this.isHD()) {
      this.displayedColumns = [
        'stt',
        ...this._displayedColumns.map((s) => s.value),
        'effectiveDate',
        'appendixCount',
        'action',
      ]
    } else {
      this.displayedColumns = [
        'stt',
        'contractCode',
        'bizDocId',
        'contractName',
        'partnerName',
        'marketCode',
        'effectiveDate',
        'action',
      ];
    }
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

  async syncDWH() {
    await this.baseService.syncContract({}).then((res) => {
      // console.log(res);
      this.baseService.showSuccess(MESSAGE.UPDATE_SUCCESS);
    });
  }

  async showListAnnex(id: any, contractObj?: any) {
    this.viewType = 'PL';
    await this._router.navigate([], {fragment: 'annex'});
    const initData = cloneDeep(this.formGroupSearchInit);
    this.formGroupSearch.patchValue({...initData, contractId: id});
    if (contractObj) {
      this.contractObj = contractObj
    } else {
      this.contractObj = this.dataSource.data.find(
        (value: any) => value.bizDocId == id,
      );
    }

    this.formGroupDetail.patchValue({
      bizDocIdC1: this.contractObj.bizDocId,
      contractName: this.contractObj.contractName,
      contractCode: this.contractObj.contractCode,
    });
    await this.search();
    localStorage.setItem(
      'viewType',
      JSON.stringify({
        bizDocId: id,
        step: 2,
        viewType: this.viewType,
        contractObj: this.contractObj
      }),
    );
  }

  async showListContract() {
    localStorage.removeItem('viewType');
    this.viewType = 'HD';
    this.formGroupSearch.patchValue(this.formGroupSearchInit);
    await this.search();
  }

  override async search<T>(body?: any, isNextPage?: boolean) {
    try {
      await this.spinner.show();
      if (!isNextPage) {
        this.pageIndex = Constant.PAGE;
      }
      let res;
      if (this.isHD()) {
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
      } else if (this.isPL()) {
        this.displayedColumns = [
          'stt',
          'contractCode',
          'bizDocId',
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
      this.formGroupSearch.patchValue(body);
      this.baseService
        .export(removeNullValues(this.formGroupSearch.value))
        .then((res) => {
          this.downloadFile(res, filename ?? res.fileName);
        });
      this.formGroupSearch.patchValue({export: false, exportType: 'ALL'});
    } catch (e: any) {
      this.baseService.showError(e.error?.error?.code ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async exportAppendix(filename?: string) {
    try {
      await this.spinner.show();
      this.baseService.exportAppendix(removeNullValues({contractId: this.contractObj.bizDocId, export: true})).then((res) => {
        this.downloadFile(res, filename ?? res.fileName);
      });
    } catch (e: any) {
      console.log(e);
      this.baseService.showError(e.error?.error?.code ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  isHD() {
    return this.viewType === 'HD';
  }

  isPL() {
    return this.viewType === 'PL';
  }
}
