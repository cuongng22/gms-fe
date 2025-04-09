import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {Constant, DATE_FORMAT_DD_MM_YYYY, MESSAGE, PATTERN, removeNullValues} from 'src/app/crew-trip/shared/utils/constant';
import {FlightMarketService} from 'src/app/crew-trip/core/services/flight-market.service';
import {HttpStatusCode} from '@angular/common/http';
import {provideMomentDateAdapter} from "@angular/material-moment-adapter";
import * as InvoiceLookup from "src/app/crew-trip/features/invoice/invoice-lookup";
import {InvoiceDocumentService} from 'src/app/crew-trip/core/services/invoice-document-service';
import moment from "moment";
import {PaymentMailService} from "src/app/crew-trip/core/services/payment-mail.service";
import {EmailSupplierService} from "src/app/crew-trip/core/services/email-supplier-service";
import {Editor, Toolbar} from "ngx-editor";
import {BaseImport} from "src/app/crew-trip/shared/base-import";


@Component({
  selector: 'app-invoice-document-remind',
  standalone: true,
  imports: [BaseImport],
  templateUrl: './invoice-document-remind.component.html',
  styleUrl: './invoice-document-remind.component.scss',
  providers: [provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY, {useUtc: true}),
  ]
})


export class InvoiceDocumentRemindComponent extends CommonComponent implements OnInit {
  viewType = 'HD';//HD-PL
  override baseService = inject(InvoiceDocumentService);
  flightMarketService = inject(FlightMarketService);
  paymentMailService = inject(PaymentMailService);
  emailSupplierService = inject(EmailSupplierService);
  fb = inject(FormBuilder);

  //variable
  @Input() partnerType: any;
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
  listInvoiceDocumentStatusEmail = InvoiceLookup.InvoiceDocumentStatusEmail;
  _displayedColumns: {
    label: string; value: string, type?: string, format?: string, rowspan?: string, colspan?: string
  }[] = [
    {label: $localize`Airport Code`, value: 'airportCode'},
    {label: $localize`Partner Name`, value: 'partnerName'},
    {label: $localize`Partner Type`, value: 'partnerType'},
    {label: $localize`Period Occurrence`, value: 'periodOccurrence'},
    {label: $localize`Email Status`, value: 'statusEmail'},
  ];
  @Input() contractId: any;
  formGroupFile!: FormGroup;
  showDialogFile = false;
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

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
      statusEmail: [],
      strPeriodTo: [moment().format('YYYY-MM-DD')]
    });
    this.formGroupDetail = this.fb.group({
      id: [],
      emailTo: [, [Validators.pattern(PATTERN.EMAIL)]],
      emailCc: [, [Validators.pattern(PATTERN.EMAIL_MULTI)]],
      emailSubject: [, [Validators.maxLength(250)]],
      emailContent: [, [Validators.required]],
      fileAttachs: []
    });

    this.formGroupSearchInit = {...this.formGroupSearch.value};
    this.formGroupDetailInit = {...this.formGroupDetail.value};
    this.editor = new Editor();
  }

  override async ngOnInit() {
    await Promise.all([this.getDocumentNotSent(this.formGroupSearch.getRawValue()),]).then(() => {

    });
    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'action'];
  }

  async getDocumentNotSent<T>(body?: any, isNextPage?: boolean) {
    try {
      await this.spinner.show();
      if (!isNextPage) {
        this.pageIndex = Constant.PAGE;
      }
      let res;
      res = await this.baseService.getDocumentNotSent({
        page: this.pageIndex,
        size: this.pageSize,
        limit: this.pageSize, ...removeNullValues(body)
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

  sendEmail() {
    if (this.formGroupDetail.getRawValue().emailContent === '<p></p>') {
      this.formGroupDetail.patchValue({emailContent: ''});
    }
    this.formGroupDetail.markAllAsTouched();
    if (this.formGroupDetail.invalid) {
      this.findInvalidControls(this.formGroupDetail);
      return;
    }

    let formUpload = new FormData();
    let reqBody = this.formGroupDetail.getRawValue();
    delete reqBody.fileAttachs;
    formUpload.append('request', JSON.stringify(reqBody));

    let reqFile = this.formGroupDetail.getRawValue().fileAttachs;
    if (reqFile && reqFile.length) {
      for (let i = 0; i < reqFile.length; i++) {
        formUpload.append('files', reqFile[i]);
      }
    }

    this.baseService.sendEmail(formUpload).then(res => {
      this.baseService.showSuccess(this.MESSAGE.SEND_EMAIL);
      let current = this.dataSource.data.find(s => s.id === this.formGroupDetail.getRawValue().id);
      current.statusEmail = 'SEND';
      this.closeDetail();
    });

  }

  async showDialogSendEmail(data: any) {
    this.toggleDialogCreate();
    let res: any = await this.paymentMailService.getAirportEmail(data.airportCode);
    let res1: any = await this.emailSupplierService.getAirportEmailConfig({emailClass: 'INVOICE_REMINDER', marketClass: data.contractServiceType});
    let emailTitle = res1.data?.content[0]?.title;
    let emailContent = res1.data?.content[0]?.content;
    this.formGroupDetail.patchValue({
      id: data.id,
      emailTo: res.status === HttpStatusCode.Ok ? res.data.emails : '',
      emailSubject: emailTitle ?? '',
      emailContent: emailContent ?? ''
    })
  }
}
