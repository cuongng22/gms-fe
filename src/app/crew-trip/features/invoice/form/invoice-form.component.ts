import {Component, inject, Input, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CommonModule, NgClass, NgIf, TitleCasePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DataTransformPipe} from 'src/app/crew-trip/shared/data-transform.pipe';
import {MatError, MatFormField, MatHint, MatLabel, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {RoleFunctionComponent} from 'src/app/crew-trip/features/roles/role-function/role-function.component';
import {NoDataRowOutlet} from '@angular/cdk/table';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {ContractDetailComponent} from 'src/app/crew-trip/features/contract/contract-detail/contract-detail.component';
import {Constant, MESSAGE, removeNullValues} from 'src/app/crew-trip/shared/utils/constant';
import {FlightMarketService} from 'src/app/crew-trip/core/services/flight-market.service';
import {HotelService} from 'src/app/crew-trip/core/services/hotel-service';
import {VehicleService} from 'src/app/crew-trip/core/services/vehicle.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ListResponse} from 'src/app/crew-trip/shared/models/common.model';
import {HttpStatusCode} from '@angular/common/http';
import {InvoiceFormService} from 'src/app/crew-trip/core/services/invoice-form-service';
import {
  InvoiceFormDetailComponent
} from "src/app/crew-trip/features/invoice/form/form-detail/invoice-form-detail.component";


@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [RouterLink, CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet, ContractDetailComponent, MatDatepickerModule, MatHint, InvoiceFormDetailComponent],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss',
})


export class InvoiceFormComponent extends CommonComponent implements OnInit {
  viewType = 'HD';//HD-PL
  override baseService = inject(InvoiceFormService);
  flightMarketService = inject(FlightMarketService);
  hotelService = inject(HotelService);
  vehicleService = inject(VehicleService);
  fb = inject(FormBuilder);

  //variable
  @Input() partnerType: any;
  step = 1;
  readMode = true;
  action = 'edit';
  id: any;
  bizDocId: any;
  contractObj: any;
  listFlightMarket = [];
  listPartner: any[] = [];
  listHotel = [];
  listVehicle = [];
  listAirportCode = [];
  tblAnnexData = new MatTableDataSource();
  _displayedColumns: {
    label: string; value: string, type?: string, format?: string
  }[] = [
    {label: $localize`Airport Code`, value: 'airportCode'},
    {label: $localize`Partner Name`, value: 'partnerName'},
    {label: $localize`Invoice Number`, value: 'invoiceNumber'},
    {label: $localize`Invoice Date`, value: 'invoiceDate', type: Constant.DATE, format: Constant.DATE_FORMAT},
    {
      label: $localize`InvoiceReceive Date`,
      value: 'invoiceReceiveDate',
      type: Constant.DATE,
      format: Constant.DATE_FORMAT
    },
    //{ label: $localize`Period From`, value: 'periodFrom', type: Constant.DATE, format: Constant.DATE_FORMAT },
    //{ label: $localize`Period To`, value: 'periodTo', type: Constant.DATE, format: Constant.DATE_FORMAT },
    {label: $localize`Total Amount`, value: 'totalAmount', type: Constant.NUMBER}
  ];
  @Input() contractId: any;

  showPopupAnnex = false;

  constructor() {
    super();

    this.formGroupSearch = this.fb.group({
      searchString: [],
      ctype: [],
      airportCode: [],
      periodFrom: [],
      periodTo: [],
      /*  export: [null],
        exportType: [],
        active: [false],
        contractId: []*/
    });
    this.formGroupDetail = this.fb.group({
      id: [], bizDocId: [], bizDocIdC1: [], contractName: [], contractCode: []
    });
    this.formGroupSearchInit = {...this.formGroupSearch.value};
    this.formGroupDetailInit = {...this.formGroupDetail.value};
  }

  override async ngOnInit() {
    await Promise.all([this.loadListFlightMarket(), this.loadListHotel(), this.loadListVehiclesPartner(), this.search(),]).then(() => {
      const listCombine = [...this.listVehicle, ...this.listHotel];
      this.listPartner = listCombine.map((s: any) => ({
        code: s.code ?? s.hotelCode, name: s.name ?? s.hotelName,
      }));
    });
    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'periodDate', 'action'];
  }

  async nextStep(id?: any, readMode?: any, action?: any) {
    this.bizDocId = id;
    this.step = 2;
    this.readMode = readMode;
    this.action = action;
  }

  async backStep() {
    await this.search();
    this.step = 1;
  }

  async showAnnex(index: any) {
    // await this.baseService.getListAnnex({contractId: id}).then(res => {
    //   this.tblAnnexData.data = res.data.content;
    this.tblAnnexData.data = (this.dataSource.data[index] as any).appendixList;
    this.showPopupAnnex = true;

  }

  async loadListFlightMarket() {
    await this.flightMarketService.search({option: 1}).then(res => {
      if (res.data) {
        this.listFlightMarket = res.data;
      }
    });
  }

  async loadListHotel() {
    await this.hotelService.search({}).then(res => {
      if (res.data) {
        this.listHotel = res.data.content;
      }
    });
  }

  async loadListVehiclesPartner() {
    await this.vehicleService.search({}).then(res => {
      if (res.data) {
        this.listVehicle = res.data.content;
      }
    });
  }

  async syncDWH() {
  }


  async showListAnnex(id: any) {
    this.viewType = 'PL';
    this.formGroupSearch.patchValue({contractId: id});
    this.contractObj = this.dataSource.data.find((value: any) => value.bizDocId == id);
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
      this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'periodDate', 'action'];
      res = await this.baseService.search<ListResponse<T>>({
        page: this.pageIndex,
        size: this.pageSize,
        limit: this.pageSize, ...removeNullValues(body) || removeNullValues(this.formGroupSearch.value)
      });

      if (res) {
        if (res.code === HttpStatusCode.Ok) {
          this.dataSource.data = res.data.content;
          this.totalElement = res.data.totalElements;
        }
        return res;
      }
    } catch (e: any) {
      this.baseService.showError(e.error?.message ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  override async exportFile(body?: any, filename?: string) {
    try {
      await this.spinner.show();
      this.formGroupSearch.patchValue({export: true, exportType: 'ALL'});
      this.baseService.export(removeNullValues(this.formGroupSearch.value)).then(res => {
        this.downloadFile(res, filename ?? res.fileName);
      });
      this.formGroupSearch.patchValue({export: false, exportType: 'ALL'});

    } catch (e: any) {
      console.log(e);
      this.baseService.showError((e.error?.error?.code) ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  /*  override async delete() {
      try {
        console.log(this.formGroupDetail.getRawValue(), 'this.formGroupDetail.getRawValue()this.formGroupDetail.getRawValue()')
        await this.spinner.show();
        const res = await this.baseService.delete(this.formGroupDetail.getRawValue().bizDocId);
        this.baseService.showSuccess(MESSAGE.DELETE_SUCCESS);
        await this.search();
        return res;
      } catch (e: any) {
        this.baseService.showError((e.error?.error) ?? (e.error?.error?.code) ?? MESSAGE.ERROR);
      } finally {
        await this.spinner.hide();
        await this.closeConfirmDelete();
      }
    }*/

}
