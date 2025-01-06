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
import {
  InvoiceFormDetailComponent
} from "src/app/crew-trip/features/invoice/form/form-detail/invoice-form-detail.component";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {FileUploadModule} from "@iplab/ngx-file-upload";
import {provideMomentDateAdapter} from "@angular/material-moment-adapter";
import {InvoiceDocumentService} from 'src/app/crew-trip/core/services/invoice-document-service';


@Component({
  selector: 'app-invoice-document',
  standalone: true,
  imports: [RouterLink, CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet, ContractDetailComponent, MatDatepickerModule, MatHint, InvoiceFormDetailComponent, MatRadioGroup, MatRadioButton, FileUploadModule],
  templateUrl: './invoice-document.component.html',
  styleUrl: './invoice-document.component.scss',
  providers: [provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),
  ]
})


export class InvoiceDocumentComponent extends CommonComponent implements OnInit {
  override baseService = inject(InvoiceDocumentService);
  flightMarketService = inject(FlightMarketService);
  hotelService = inject(HotelService);
  vehicleService = inject(VehicleService);
  fb = inject(FormBuilder);

  //variable
  @Input() tabType: any;
  @Output() nextStepEmit = new EventEmitter<any>();
  step = 1;
  readMode = true;
  action = 'edit';
  id: any;
  listPartner: any[] = [];
  listHotel = [];
  listVehicle = [];
  listAirportCode = [];
  //1=hotel quoc te ; 2=hotel quoc noi ; 3=xe quoc te ; 4=xe quoc noi
  formType = 1;
  _displayedColumnsHeader1: string[] = [];
  _displayedColumnsHeader2: string[] = [];
  _displayedColumnsRow: string[] = [];
  _displayedColumnsFooter: string[] = [];
  _displayedColumnsAll: {
    label: string; value: string, type?: string, format?: string, rowspan?: string, colspan?: string
  }[] = [
    {label: $localize`Airport Code`, value: 'airportCode', rowspan: "2"},
    {label: $localize`Invoice Number`, value: 'invoiceNumber', rowspan: "2"},
    {
      label: $localize`Invoice Date`,
      value: 'invoiceDate',
      type: Constant.DATE,
      format: Constant.DATE_FORMAT,
      rowspan: "2"
    },
    {
      label: $localize`InvoiceReceive Date`,
      value: 'invoiceReceiveDate',
      type: Constant.DATE,
      format: Constant.DATE_FORMAT,
      rowspan: "2"
    },
    {
      label: $localize`Period From`,
      value: 'periodFrom',
      type: Constant.DATE,
      format: Constant.DATE_FORMAT,
      rowspan: "2"
    },
    {label: $localize`Period To`, value: 'periodTo', type: Constant.DATE, format: Constant.DATE_FORMAT, rowspan: "2"},
    {label: $localize`bizDocId`, value: 'bizDocId', rowspan: "2"},
    {label: $localize`Partner Name`, value: 'partnerName', rowspan: "2"},
    {label: $localize`Partner Type`, value: 'partnerType', rowspan: "2"},
    // {label: $localize`Description`, value: 'description', rowspan: "2"},
    {label: $localize`FC`, value: 'amountFcBeforeVat', type: Constant.NUMBER},
    {label: $localize`VND`, value: 'amountVndBeforeVat', type: Constant.NUMBER},
    {label: $localize`FC`, value: 'vatFc', type: Constant.NUMBER},
    {label: $localize`VND`, value: 'vatVnd', type: Constant.NUMBER},
    {label: $localize`FC`, value: 'totalAmountFc', type: Constant.NUMBER},
    {label: $localize`VND`, value: 'totalAmountVnd', type: Constant.NUMBER},
    {label: $localize`FC`, value: 'reimbursementTotalFc', type: Constant.NUMBER},
    {label: $localize`VND`, value: 'reimbursementTotalVnd', type: Constant.NUMBER},
    {label: $localize`Status`, value: 'status', rowspan: "2"},
    {label: $localize`Email Status`, value: 'statusEmail', rowspan: "2"},
    {label: $localize`Payment Status`, value: 'statusPayment', rowspan: "2"},
    {
      label: $localize`Payment Due Date`,
      value: 'paymentDueDate',
      type: Constant.DATE,
      format: Constant.DATE_FORMAT,
      rowspan: "2"
    },
  ];
  @Input() contractId: any;
  formGroupFile!: FormGroup;
  showDialogFile = false;

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      searchString: [],
      ctype: [],
      partnerType: [],
      airportCode: [],
      listAirportCode: [],
      periodFrom: [],
      periodTo: [],
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

    // await Promise.all([this.loadListFlightMarket(), this.loadListHotel(), this.loadListVehiclesPartner(),]).then(() => {
    await Promise.all([this.search(),]).then(() => {

    });
    this._displayedColumnsHeader1 = ['stt', 'airportCode', 'invoice', 'periodDate', 'contract', 'description', 'amountBeforeVat',
      'vat', 'totalAmount', 'reimbursementTotal', 'status', 'statusEmail', 'statusPayment', 'paymentDueDate', 'action'];
    this._displayedColumnsHeader2 = ['amountFcBeforeVat', 'amountVndBeforeVat', 'vatFc', 'vatVnd', 'totalAmountFc',
      'totalAmountVnd', 'reimbursementTotalFc', 'reimbursementTotalVnd'];
    this._displayedColumnsRow = ['stt', 'airportCode', 'invoice', 'periodDate', 'contract', 'description', 'amountFcBeforeVat', 'amountVndBeforeVat', 'vatFc', 'vatVnd', 'totalAmountFc',
      'totalAmountVnd', 'reimbursementTotalFc', 'reimbursementTotalVnd', 'status', 'statusEmail', 'statusPayment', 'paymentDueDate', 'action'];
    this._displayedColumnsFooter = this._displayedColumnsRow.filter(item => !this._displayedColumnsHeader2.includes(item));
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
      await this.spinner.show();
      if (!isNextPage) {
        this.pageIndex = Constant.PAGE;
      }
      let res = await this.baseService.search<ListResponse<T>>({
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

  async upload() {
    try {
      await this.spinner.show();
      let formUpload = new FormData();
      let fileUpload = this.formGroupFile.value.fileUpload[0];
      if (fileUpload.size > 50 * 1048576) {
        this.baseService.showError(MESSAGE.MAX_FILE_SIZE);
        return;
      }
      formUpload.append('file', fileUpload, fileUpload.name);
      formUpload.append('invoiceRequest', JSON.stringify({
        ctype: this.formGroupFile.getRawValue().ctype,
        partnerType: this.formGroupFile.getRawValue().partnerType
      }));
      await this.baseService.uploadFileData(formUpload).then(res => {
        if (res.code == HttpStatusCode.Ok) {
          this.search();
          this.baseService.showSuccess(this.MESSAGE.UPLOAD_SUCCESS);
        }
      });
    } catch (e: any) {
      this.baseService.showError(e.error?.message ?? this.MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
      this.closeDialogFile();
    }
  }

  async download(type: any) {
    try {
      await this.spinner.show();
      let filename = '';
      if (type === 'EXPORT') {
      } else if (type === 'DOWNLOAD') {
        const res = await this.baseService.exportFileData({
          fileExportType: '1'
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
        ctype: this.formGroupFile.getRawValue().ctype,
        partnerType: this.formGroupFile.getRawValue().partnerType
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
        templateName: '[Crew Trip]_Template bảng kê chi phí khách sạn_Quốc tế.xlsx',
        templateNameLabel: 'report-hotel-international-template.xlsx'
      })
    } else if (this.formGroupFile.getRawValue().ctype === 'DOMESTIC' && this.formGroupFile.getRawValue().partnerType === 'HOTEL') {
      this.formGroupFile.patchValue({
        templateName: '[CrewTrip]_Template bảng kê chi phí khách sạn_Quốc nội.xlsx',
        templateNameLabel: 'report-hotel-domestic-template.xlsx'
      })
    } else if (this.formGroupFile.getRawValue().ctype === 'INTERNATIONAL' && this.formGroupFile.getRawValue().partnerType === 'TRANSPORTATION') {
      this.formGroupFile.patchValue({
        templateName: '[Crew Trip]_Template bảng kê chi phí thuê xe_Quốc tế.xlsx',
        templateNameLabel: 'report-transport-international-template.xlsx'
      })
    } else if (this.formGroupFile.getRawValue().ctype === 'DOMESTIC' && this.formGroupFile.getRawValue().partnerType === 'TRANSPORTATION') {
      this.formGroupFile.patchValue({
        templateName: '[Crew Trip]_Template bảng kê chi phí thuê xe_Quốc nội.xlsx',
        templateNameLabel: 'report-transport-international-template.xlsx'
      })
    }
  }
}
