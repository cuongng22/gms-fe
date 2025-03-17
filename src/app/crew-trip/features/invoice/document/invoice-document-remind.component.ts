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
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {RoleFunctionComponent} from 'src/app/crew-trip/features/roles/role-function/role-function.component';
import {NoDataRowOutlet} from '@angular/cdk/table';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {ContractDetailComponent} from 'src/app/crew-trip/features/contract/contract-detail/contract-detail.component';
import {Constant, DATE_FORMAT_DD_MM_YYYY, MESSAGE, PATTERN, removeNullValues} from 'src/app/crew-trip/shared/utils/constant';
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
import {ConfirmDeleteDialog} from "src/app/crew-trip/shared/dialog/confirm-delete-dialog";
import * as InvoiceLookup from "src/app/crew-trip/features/invoice/invoice-lookup";
import {InvoiceDocumentService} from 'src/app/crew-trip/core/services/invoice-document-service';
import moment from "moment";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {PaymentMailService} from "src/app/crew-trip/core/services/payment-mail.service";
import {EmailSupplierService} from "src/app/crew-trip/core/services/email-supplier-service";
import {ControlErrorComponent} from "src/app/crew-trip/shared/component/control-error/control-error.component";


@Component({
  selector: 'app-invoice-document-remind',
  standalone: true,
  imports: [RouterLink, CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet, ContractDetailComponent, MatDatepickerModule, MatHint, InvoiceFormDetailComponent, MatRadioGroup, MatRadioButton, FileUploadModule, ConfirmDeleteDialog, MatGridList, MatGridTile, CdkTextareaAutosize, ControlErrorComponent],
  templateUrl: './invoice-document-remind.component.html',
  styleUrl: './invoice-document-remind.component.scss',
  providers: [provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),
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

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      searchString: [moment().format('YYYY-MM-DD')],
      ctype: [],
      partnerType: [],
      airportCode: [],
      listAirportCode: [],
      periodFrom: [],
      periodTo: [],
      statusEmail: [],
    });
    this.formGroupDetail = this.fb.group({
      id: [],
      emailTo: [, [Validators.pattern(PATTERN.EMAIL)]],
      emailCc: [, [Validators.pattern(PATTERN.EMAIL_MULTI)]],
      emailSubject: [, [Validators.maxLength(250)]],
      emailContent: []
    });

    this.formGroupSearchInit = {...this.formGroupSearch.value};
    this.formGroupDetailInit = {...this.formGroupDetail.value};
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
    this.formGroupDetail.markAllAsTouched();
    if (this.formGroupDetail.invalid) {
      this.findInvalidControls(this.formGroupDetail);
      return;
    }
    this.baseService.sendEmail(this.formGroupDetail.getRawValue()).then(res => {
      this.baseService.showSuccess(this.MESSAGE.SEND_EMAIL);
      let current = this.dataSource.data.find(s => s.id === this.formGroupDetail.getRawValue().id);
      current.statusEmail = 'SEND';
      this.closeDetail();
    });

  }

  async showDialogSendEmail(data: any) {
    console.log(data)
    let res: any = await this.paymentMailService.getAirportEmail(data.airportCode);
    let res1: any = await this.emailSupplierService.getAirportEmailConfig({emailClass: 'INVOICE_REMINDER', marketClass: data.contractServiceType});
    let emailTitle = res1.data?.content[0]?.title;
    let emailContent = res1.data?.content[0]?.content;
    console.log(res, res1, 'ss')
    this.formGroupDetail.patchValue({
      id: data.id,
      emailTo: res.status === HttpStatusCode.Ok ? res.data.emails : '',
      emailSubject: emailTitle ?? '',
      emailContent: emailContent ?? ''
    })
    this.toggleDialogCreate();
  }
}
