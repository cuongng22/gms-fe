import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CommonModule, NgClass, NgIf, TitleCasePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DataTransformPipe} from 'src/app/crew-trip/shared/data-transform.pipe';
import {MatError, MatFormField, MatHint, MatLabel, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {RoleFunctionComponent} from 'src/app/crew-trip/features/roles/role-function/role-function.component';
import {NoDataRowOutlet} from '@angular/cdk/table';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {ContractDetailComponent} from 'src/app/crew-trip/features/contract/contract-detail/contract-detail.component';
import {Constant, DATE_FORMAT_DD_MM_YYYY, MESSAGE, removeNullValues} from 'src/app/crew-trip/shared/utils/constant';
import {FlightMarketService} from 'src/app/crew-trip/core/services/flight-market.service';
import {HotelService} from 'src/app/crew-trip/core/services/hotel-service';
import {VehicleService} from 'src/app/crew-trip/core/services/vehicle.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ListResponse} from 'src/app/crew-trip/shared/models/common.model';
import {HttpStatusCode} from '@angular/common/http';
import {InvoiceFormService} from 'src/app/crew-trip/core/services/invoice-form-service';
import {InvoiceFormDetailComponent} from "src/app/crew-trip/features/invoice/form/form-detail/invoice-form-detail.component";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {FileUploadModule} from "@iplab/ngx-file-upload";
import {provideMomentDateAdapter} from "@angular/material-moment-adapter";
import moment from "moment";
import {SelectMultipleComponent} from "src/app/crew-trip/shared/component/select-multiple/select-multiple.component";
import {FlightMarketStatusEnum} from "src/app/crew-trip/features/category/flight-market/flight-market.model";


@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [RouterLink, CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet, ContractDetailComponent, MatDatepickerModule, MatHint, InvoiceFormDetailComponent, MatRadioGroup, MatRadioButton, FileUploadModule, SelectMultipleComponent],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss',
  providers: [provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),]
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
  @Output() nextStepEmit = new EventEmitter<any>();
  step = 1;
  readMode = true;
  action = 'edit';
  id: any;
  startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

  //1=hotel quoc te ; 2=hotel quoc noi ; 3=xe quoc te ; 4=xe quoc noi
  formType = 1;
  _displayedColumns: {
    label: string; value: string, type?: string, format?: string
  }[] = [
    {label: $localize`Airport Code`, value: 'airportCode'},
    {label: $localize`Partner Name`, value: 'partnerName'},
    {label: $localize`Invoice Number`, value: 'invoiceNumber'},
    {label: $localize`Invoice Date`, value: 'invoiceDate', type: Constant.DATE, format: Constant.DATE_FORMAT},
    {label: $localize`Receive Date`, value: 'invoiceReceiveDate', type: Constant.DATE, format: Constant.DATE_FORMAT},
    {label: $localize`Total Amount`, value: 'totalAmount', type: Constant.NUMBER}
  ];
  @Input() contractId: any;
  formGroupFile!: FormGroup;
  showDialogFile = false;

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      searchString: [], ctype: [], partnerType: [], airportCode: [], listAirportCode: [], periodFrom: [this.startOfMonth], periodTo: [this.endOfMonth],
    });
    this.formGroupDetail = this.fb.group({
      id: [], bizDocId: [], bizDocIdC1: [], contractName: [], contractCode: []
    });
    this.formGroupFile = this.fb.group({
      ctype: ['INTERNATIONAL'], partnerType: [], fileUpload: [], templateName: [], templateNameLabel: []
    });
    this.formGroupSearchInit = {...this.formGroupSearch.value};
    this.formGroupDetailInit = {...this.formGroupDetail.value};
  }

  override async ngOnInit() {
    this.formGroupFile.patchValue({partnerType: this.partnerType});
    // await Promise.all([this.loadListFlightMarket(), this.loadListHotel(), this.loadListVehiclesPartner(),]).then(() => {
    await Promise.all([this.loadListFlightMarket({status: FlightMarketStatusEnum.OPERATIONAL}), this.search(),]).then(() => {

    });
    this.displayedColumns = ['stt', 'airportCode', 'partnerName', 'invoiceNumber', 'invoiceDate', 'invoiceReceiveDate', 'periodDate', 'totalAmount', 'action'];
  }

  async nextStep(id?: any, readMode?: any, action?: any) {
    this.id = id;
    this.step = 2;
    this.readMode = readMode;
    this.action = action;
    await this.cookTemplateName();
    this.nextStepEmit.emit([this.id, this.readMode])
  }

  async backStep() {
    await this.search();
    this.step = 1;
  }

  override async search<T>(body?: any, isNextPage?: boolean) {
    try {
      this.formGroupSearch.patchValue({
        listAirportCode: this.formGroupSearch.getRawValue().airportCode, partnerType: this.partnerType
      });
      await this.spinner.show();
      if (!isNextPage) {
        this.pageIndex = Constant.PAGE;
      }
      let res;
      let req = body || this.formGroupSearch.getRawValue();
      req.periodFrom = moment(req.periodFrom).isValid() ? moment(req.periodFrom).format(Constant.LOCAL_DATE_FORMAT) : null;
      req.periodTo = moment(req.periodTo).isValid() ? moment(req.periodTo).format(Constant.LOCAL_DATE_FORMAT) : null;
      this.displayedColumns = ['stt', 'airportCode', 'partnerName', 'invoiceNumber', 'invoiceDate', 'invoiceReceiveDate', 'periodDate', 'totalAmount', 'action'];

      res = await this.baseService.search<ListResponse<T>>({
        page: this.pageIndex, size: this.pageSize, limit: this.pageSize, ...removeNullValues(req)
      });

      if (res) {
        if (res.code === HttpStatusCode.Ok) {
          this.dataSource.data = res.data.content;
          this.totalElement = res.data.totalElements;
        }
        return res;
      }
    } catch (e: any) {
      console.log(e)
      this.baseService.showError(e.error?.message ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async upload() {
    try {
      await this.spinner.show();
      if (!(this.formGroupFile.value.fileUpload?.length ?? 0)) {
        this.baseService.showError(MESSAGE.FILE_UPLOAD_EMPTY);
        return;
      }
      let formUpload = new FormData();
      let fileUpload = this.formGroupFile.value.fileUpload[0];
      if (fileUpload.size > 50 * 1048576) {
        this.baseService.showError(MESSAGE.MAX_FILE_SIZE);
        return;
      }
      formUpload.append('file', fileUpload, fileUpload.name);
      formUpload.append('invoiceRequest', JSON.stringify({
        ctype: this.formGroupFile.getRawValue().ctype, partnerType: this.formGroupFile.getRawValue().partnerType
      }));
      await this.baseService.uploadFileData(formUpload).then(res => {
        if (res.code == HttpStatusCode.Ok) {
          this.search();
          this.baseService.showSuccess(this.MESSAGE.UPLOAD_SUCCESS);
          this.closeDialogFile();
        }
      }).catch(e => {
        if (e.error?.message.includes('No valid')) {
          this.baseService.showError(this.MESSAGE.FILE_UPLOAD_INVALID_XLSX);
        } else {
          this.baseService.showError(e.error?.message ?? this.MESSAGE.ERROR);
        }
      });
    } catch (e: any) {
      this.baseService.showError(e.error?.message ?? this.MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
      this.formGroupFile.patchValue({fileUpload: []});
    }
  }

  async download(type: any) {
    try {
      await this.spinner.show();
      let filename = '';
      if (type === 'EXPORT') {
      } else if (type === 'DOWNLOAD') {
        const res = await this.baseService.exportFileData({
          fileExportType: this.formType
          // ctype: this.formGroupFile.getRawValue().ctype,
          // partnerType: this.formGroupFile.getRawValue().partnerType
        });
        this.downloadFile(res, this.formGroupFile.getRawValue().templateNameLabel);
      }
    } catch (e) {
      console.log(e)
    } finally {
      await this.spinner.hide();
    }
  }

  override async exportFile(body?: any, filename?: string) {
    try {
      await this.spinner.show();
      const res = await this.baseService.exportData({
        ctype: this.formGroupFile.getRawValue().ctype, partnerType: this.formGroupFile.getRawValue().partnerType
      });
      this.downloadFile(res.blob, filename ?? res.fileName);
    } catch (e: any) {
      this.baseService.showError((e.error?.error?.code) ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async openDialogFile() {
    await this.cookTemplateName();
    this.showDialogFile = !this.showDialogFile;
  }

  closeDialogFile() {
    this.showDialogFile = !this.showDialogFile;
  }

  async cookTemplateName() {
    if (this.formGroupFile.getRawValue().ctype === 'INTERNATIONAL' && this.formGroupFile.getRawValue().partnerType === 'HOTEL') {
      this.formGroupFile.patchValue({
        templateName: '[Crew Trip]_Template bảng kê chi phí khách sạn_Quốc tế.xlsx', templateNameLabel: 'report-hotel-international-template.xlsx'
      })
      this.formType = 1;
    } else if (this.formGroupFile.getRawValue().ctype === 'DOMESTIC' && this.formGroupFile.getRawValue().partnerType === 'HOTEL') {
      this.formGroupFile.patchValue({
        templateName: '[CrewTrip]_Template bảng kê chi phí khách sạn_Quốc nội.xlsx', templateNameLabel: 'report-hotel-domestic-template.xlsx'
      })
      this.formType = 2;
    } else if (this.formGroupFile.getRawValue().ctype === 'INTERNATIONAL' && this.formGroupFile.getRawValue().partnerType === 'TRANSPORTATION') {
      this.formGroupFile.patchValue({
        templateName: '[Crew Trip]_Template bảng kê chi phí thuê xe_Quốc tế.xlsx', templateNameLabel: 'report-transport-international-template.xlsx'
      })
      this.formType = 3;
    } else if (this.formGroupFile.getRawValue().ctype === 'DOMESTIC' && this.formGroupFile.getRawValue().partnerType === 'TRANSPORTATION') {
      this.formGroupFile.patchValue({
        templateName: '[Crew Trip]_Template bảng kê chi phí thuê xe_Quốc nội.xlsx', templateNameLabel: 'report-transport-domestic-template.xlsx'
      })
      this.formType = 4;
    }
  }

  ctypeChange() {
    if (this.formGroupSearch.getRawValue().ctype == 'INTERNATIONAL') {
      this.loadListFlightMarket({type: 'International', status: FlightMarketStatusEnum.OPERATIONAL})
    } else if (this.formGroupSearch.getRawValue().ctype == 'DOMESTIC') {
      this.loadListFlightMarket({type: 'Domestic', status: FlightMarketStatusEnum.OPERATIONAL})
    } else {
      this.loadListFlightMarket()
    }
  }

  isHotel() {
    return this.partnerType === 'HOTEL'
  }

  isTransportation() {
    return this.partnerType === 'TRANSPORTATION'
  }
}
