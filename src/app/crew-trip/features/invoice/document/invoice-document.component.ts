import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {Constant, DATE_FORMAT_DD_MM_YYYY, MESSAGE, removeNullValues} from 'src/app/crew-trip/shared/utils/constant';
import {FlightMarketService} from 'src/app/crew-trip/core/services/flight-market.service';
import {HotelService} from 'src/app/crew-trip/core/services/hotel-service';
import {VehicleService} from 'src/app/crew-trip/core/services/vehicle.service';
import {ListResponse} from 'src/app/crew-trip/shared/models/common.model';
import {HttpStatusCode} from '@angular/common/http';
import {InvoiceFormDetailComponent} from "src/app/crew-trip/features/invoice/form/form-detail/invoice-form-detail.component";
import {provideMomentDateAdapter} from "@angular/material-moment-adapter";
import {InvoiceDocumentService} from 'src/app/crew-trip/core/services/invoice-document-service';
import * as InvoiceLookup from "src/app/crew-trip/features/invoice/invoice-lookup";
import {InvoiceDocumentExportType} from "src/app/crew-trip/features/invoice/invoice-lookup";
import {cloneDeep} from "lodash";
import moment from "moment";
import {BaseImport} from "src/app/crew-trip/shared/base-import";

@Component({
  selector: 'app-invoice-document',
  standalone: true,
  imports: [BaseImport, InvoiceFormDetailComponent],
  templateUrl: './invoice-document.component.html',
  styleUrl: './invoice-document.component.scss',
  providers: [provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY, {useUtc: true}),
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
  dataObject: any;
  listInvoiceDocumentStatus = InvoiceLookup.InvoiceDocumentStatus.filter(s => s.key != 'MATCHED');
  listInvoiceDocumentStatusEmail = InvoiceLookup.InvoiceDocumentStatusEmail;
  startOfMonth = moment().startOf('year').format('YYYY-MM-DD');
  endOfMonth = moment().format('YYYY-MM-DD');

  //1=hotel quoc te ; 2=hotel quoc noi ; 3=xe quoc te ; 4=xe quoc noi
  formType = 1;
  _displayedColumnsHeader1: string[] = [];
  _displayedColumnsHeader2: string[] = [];
  _displayedColumnsRow: string[] = [];
  _displayedColumnsFooter: string[] = [];
  _displayedColumnsAll: {
    label: string; value: string, type?: string, format?: string, rowspan?: string, colspan?: string, sticky?: boolean
  }[] = [
    {label: $localize`Airport Code`, value: 'airportCode', rowspan: "2", sticky:true},
    {label: $localize`Invoice Number`, value: 'invoiceNumber', rowspan: "2", sticky:true},
    {label: $localize`Invoice Date`, value: 'invoiceDate', type: Constant.DATE, format: Constant.DATE_FORMAT, rowspan: "2"},
    {label: $localize`InvoiceReceive Date`, value: 'invoiceReceiveDate', type: Constant.DATE, format: Constant.DATE_FORMAT, rowspan: "2"},
    {label: $localize`Period From`, value: 'periodFrom', type: Constant.DATE, format: Constant.DATE_FORMAT, rowspan: "2"},
    {label: $localize`Period To`, value: 'periodTo', type: Constant.DATE, format: Constant.DATE_FORMAT, rowspan: "2"},
    {label: $localize`bizDocId`, value: 'bizDocId', rowspan: "2"},
    {label: $localize`Partner Name`, value: 'partnerName', rowspan: "2"},
    {label: $localize`Partner Type`, value: 'partnerType', rowspan: "2"},
    {label: $localize`Description`, value: 'description', rowspan: "2"},
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
    {label: $localize`Payment Note`, value: 'statusPaymentDescription', rowspan: "2"},
    {label: $localize`Payment Due Date`, value: 'paymentDueDate', type: Constant.DATE, format: Constant.DATE_FORMAT, rowspan: "2"},
  ];
  @Input() contractId: any;
  formGroupFile!: FormGroup;
  showDialogFile = false;
  isShowFormHdr: boolean = false;
  formHdrId: any;
  override pageSize = 10;
  tblDetail: any[]
  currentRow: any
  selectedRow: any = null;
  showListChild = true;
  dataListChild: any;

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      searchString: [],
      ctype: [],
      partnerType: [],
      airportCode: [],
      listAirportCode: [],
      periodFrom: [this.startOfMonth],
      periodTo: [moment().format('YYYY-MM-DD')],
      status: [],
      statusEmail: [],
      version: [],
      isLatest: [true]
    });
    this.formGroupDetail = this.fb.group({
      id: [], emailTo: ['chien12345aabb@gmail.com'], emailCc: ['chien12345aabb@gmail.com'], emailSubject: ['test'], emailContent: ['test1']
    });
    this.formGroupFile = this.fb.group({
      ctype: ['INTERNATIONAL'], partnerType: [], fileUpload: [], templateName: [], templateNameLabel: []
    });
    this.formGroupSearchInit = {...this.formGroupSearch.value};
    this.formGroupDetailInit = {...this.formGroupDetail.value};
  }

  override async ngOnInit() {

    // await Promise.all([this.loadListFlightMarket(), this.loadListHotel(), this.loadListVehiclesPartner(),]).then(() => {
    await Promise.all([this.search(), this.loadListFlightMarket()]).then(() => {
      this.showDocumentDtl(this.dataSource.data[0]);
    });
    this._displayedColumnsHeader1 = ['stt', 'airportCode', 'invoice', 'periodDate', 'contract', 'description', 'amountBeforeVat',
      'vat', 'totalAmount', 'reimbursementTotal', 'status', 'statusEmail', 'statusPayment', 'statusPaymentDescription', 'paymentDueDate', 'action'];
    this._displayedColumnsHeader2 = ['amountFcBeforeVat', 'amountVndBeforeVat', 'vatFc', 'vatVnd', 'totalAmountFc',
      'totalAmountVnd', 'reimbursementTotalFc', 'reimbursementTotalVnd'];
    this._displayedColumnsRow = ['stt', 'airportCode', 'invoice', 'periodDate', 'contract', 'description', 'amountFcBeforeVat', 'amountVndBeforeVat', 'vatFc', 'vatVnd', 'totalAmountFc',
      'totalAmountVnd', 'reimbursementTotalFc', 'reimbursementTotalVnd', 'status', 'statusEmail', 'statusPayment', 'statusPaymentDescription', 'paymentDueDate', 'action'];
    this._displayedColumnsFooter = this._displayedColumnsRow.filter(item => !this._displayedColumnsHeader2.includes(item));
  }

  async nextStep(id?: any, readMode?: any, step?: any, dataObject?: any) {
    this.id = id;
    this.step = step;
    this.readMode = readMode;
    this.dataObject = dataObject;
    this.nextStepEmit.emit([this.id, this.readMode, this.step, this.dataObject])
  }

  async checkVersion(data: any) {
    try {
      await this.spinner.show();
      if (moment(data.periodOccurrence).isValid()) {
        let res = await this.baseService.search({
          page: this.pageIndex,
          size: this.pageSize,
          limit: this.pageSize, ...removeNullValues({
            listAirportCode: data.airportCode,
            partnerCode: data.partnerCode,
            periodOccurrence: moment(data.periodOccurrence).startOf('month').format('YYYY-MM-DD')
          })
        });
        if (res.data?.totalElements > 1) {
          this.showListChild = true;
          this.dataListChild = res.data.content;
        } else {
          this.showListChild = false;
          // this.nextStep(data.id, true, 2, data);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      await this.spinner.hide();
    }
  }

  async backStep() {
    await this.search();
    this.step = 1;
  }

  override async search<T>(body?: any, isNextPage?: boolean) {
    try {
      this.formGroupSearch.patchValue({
        listAirportCode: this.formGroupSearch.getRawValue().airportCode,
      });
      await this.spinner.show();
      if (!isNextPage) {
        this.pageIndex = Constant.PAGE;
      }
      let req = body || this.formGroupSearch.getRawValue();
      req.periodFrom = moment(req.periodFrom).isValid() ? moment(req.periodFrom).format(Constant.LOCAL_DATE_FORMAT) : null;
      req.periodTo = moment(req.periodTo).isValid() ? moment(req.periodTo).format(Constant.LOCAL_DATE_FORMAT) : null;
      let res = await this.baseService.search<ListResponse<T>>({
        page: this.pageIndex,
        size: this.pageSize,
        limit: this.pageSize, ...removeNullValues(req)
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
      let body = this.formGroupSearch.getRawValue();
      body.periodFrom = moment(body.periodFrom).isValid() ? moment(body.periodFrom).format(Constant.LOCAL_DATE_FORMAT) : null;
      body.periodTo = moment(body.periodTo).isValid() ? moment(body.periodTo).format(Constant.LOCAL_DATE_FORMAT) : null;
      body = removeNullValues(body);
      body.page = 0;
      body.limit = 999999;
      body.exportType = InvoiceDocumentExportType.DOCUMENT_LIST
      if (type === 'EXPORT') {
        const res = await this.baseService.exportListData(body);
        this.downloadFile(res, 'export.xlsx');
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

  showFormHdr(formHdrId: any) {
    if (+formHdrId > 0) {
      this.formHdrId = formHdrId;
      this.isShowFormHdr = true;
    } else if (+formHdrId < 0) {
      this.baseService.showError("Không tìm thấy bảng kê chứng từ");
    }
  }

  showDocumentDtl($event: any) {
    this.selectedRow = $event.id;
    let listHdr = cloneDeep(this.dataSource.data);
    let currentHdr = listHdr.find((s: any) => s.id === $event.id);
    this.tblDetail = currentHdr?.invoiceDocumentDtl ?? [];

  }

  sendEmail() {
    this.baseService.sendEmail(this.formGroupDetail.getRawValue()).then(res => {
      this.baseService.showSuccess(this.MESSAGE.SEND_EMAIL);
      let current = this.dataSource.data.find(s => s.id === this.formGroupDetail.getRawValue().id);
      current.statusEmail = 'SEND';
      this.closeDetail();
    });

  }

  showDialogSendEmail(data: any) {
    this.formGroupDetail.patchValue({
      id: data.id
    })
    this.toggleDialogCreate();
  }

  isSelected(row: any): boolean {
    return this.selectedRow === row.id;
  }

  closeInvoiceForm() {
    this.isShowFormHdr = false;
    setTimeout(() => {
      this.formHdrId = null;
    }, 300);
  }

}
