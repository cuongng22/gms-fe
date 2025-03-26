import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DecimalPipe, NgClass, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
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
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {NgxEditorModule} from 'ngx-editor';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepicker, MatDatepickerModule, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {FileUploadModule} from '@iplab/ngx-file-upload';
import {Constant, DATE_FORMAT_DD_MM_YYYY, LOCALE, MESSAGE} from 'src/app/crew-trip/shared/utils/constant';
import {ClickOutside} from 'ngxtension/click-outside';
import {NationService} from 'src/app/crew-trip/core/services/nation-service';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {NgxMatTimepickerFieldComponent} from 'ngx-mat-timepicker';
import {transform} from 'lodash';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import {ServiceFeeService} from 'src/app/crew-trip/core/services/service-fee-service';
import {DigitOnlyModule} from "@uiowa/digit-only";
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {DatepickerYearMonthComponent} from "src/app/crew-trip/shared/component/datepicker-year-month/datepicker-year-month.component";
import {ThousandsSeparatorDirective} from "src/app/crew-trip/shared/directive/thousand-separator.directive";
import {InvoiceDocumentService} from "src/app/crew-trip/core/services/invoice-document-service";
import {ContractService} from "src/app/crew-trip/core/services/contract-service";
import * as InvoiceLookup from "src/app/crew-trip/features/invoice/invoice-lookup";
import {InvoiceDocumentExportType, InvoiceDocumentStatus, InvoiceDocumentStatusEnum} from "src/app/crew-trip/features/invoice/invoice-lookup";
import {HttpStatusCode} from "@angular/common/http";
import {InvoiceDocumentComponent} from "src/app/crew-trip/features/invoice/document/invoice-document.component";
import {InvoiceDocumentRemindComponent} from "src/app/crew-trip/features/invoice/document/invoice-document-remind.component";
import {ConfirmDialog} from "src/app/crew-trip/shared/dialog/confirm-dialog/confirm-dialog";
import {FlightMarketStatusEnum} from "src/app/crew-trip/features/category/flight-market/flight-market.model";
import {ControlErrorComponent} from "src/app/crew-trip/shared/component/control-error/control-error.component";


@Component({
  selector: 'app-invoice-document-review',
  standalone: true,
  imports: [DataTransformPipe, FormsModule, InputSizeComponent, MatAccordion, MatButtonModule, MatCardModule, MatCheckboxModule, MatError, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle, MatFormField, MatInput, MatLabel, MatMenuModule, MatOption, MatPaginatorModule, MatPrefix, MatRadioModule, MatSelect, MatSuffix, MatTab, MatTabGroup, MatTableModule, NgClass, NgIf, NgxEditorModule, ReactiveFormsModule, RouterLink, TitleCasePipe, MatHint, MatDatepickerModule, MatDatepicker, MatDatepickerToggle, MatNativeDateModule, FileUploadModule, ClickOutside, MatAutocomplete, MatAutocompleteTrigger, NgxTrimDirectiveModule, NgxMaterialTimepickerModule, NgxMatTimepickerFieldComponent, NgForOf, NgxMaterialTimepickerModule, DigitOnlyModule, DecimalPipe, CdkTextareaAutosize, DatepickerYearMonthComponent, ThousandsSeparatorDirective, InvoiceDocumentComponent, InvoiceDocumentRemindComponent, ConfirmDialog, ControlErrorComponent],
  templateUrl: './invoice-document-review.component.html',
  styleUrl: './invoice-document-review.component.scss',
  providers: [provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY, {useUtc: true}),

  ]
})


export class InvoiceDocumentReviewComponent extends CommonComponent implements OnInit {
  override baseService = inject(InvoiceDocumentService);
  nationService = inject(NationService);
  serviceFeeService = inject(ServiceFeeService);
  contractService = inject(ContractService);
  fb = inject(FormBuilder);


  //variable
  @Input() id: any;
  @Input() viewType: any;
  @Input() readMode: any;
  @Input() action: any;
  @Input() dataObject: any;
  @Input() contractObj: any;
  @Output() nextStepEmit = new EventEmitter<any>();
  @Output() backStepEmit = new EventEmitter<any>();

  //1=hotel quoc te ; 2=hotel quoc noi ; 3=xe quoc te ; 4=xe quoc noi
  @Input() formType: any;
  tblAttachedDocument = new MatTableDataSource();
  tblUnitPrice = new MatTableDataSource();
  expandList = new Set<string>(['tab1', 'tab2', 'tab3']);
  formGroupFileUpload!: FormGroup;
  showDialogDeleteFile = false;

  listDocumentType = InvoiceLookup.InvoiceDocumentType;
  listInvoiceDocumentStatus = InvoiceLookup.InvoiceDocumentStatus;
  listInvoiceDocumentStatusEmail = InvoiceLookup.InvoiceDocumentStatusEmail;
  totalColSpan: any;
  _displayedColumnsHeader1: string[] = [];
  _displayedColumnsHeader2: string[] = [];
  _displayedColumnsRow: string[] = [];
  _displayedColumnsFooter: string[] = [];
  _displayedColumnsAll: {
    label: string;
    value: string,
    type?: string,
    format?: string,
    rowspan?: string,
    colspan?: string,
    displayTotal?: boolean,
  }[] = [
    {label: $localize`Access Bridge`, value: "accessBridge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Accommodation Tax Cc Charge`, value: "accommodationTaxCcCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Accommodation Tax Fc Charge`, value: "accommodationTaxFcCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Airport Parking Fee`, value: "airportParkingFee", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Breakfast Cc`, value: "breakfastCc", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Breakfast Fc`, value: "breakfastFc", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Cc`, value: "cc", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Date`, value: "ciDate", type: Constant.DATE, format: Constant.DATE_FORMAT},
    {label: $localize`Flight no`, value: "ciFltno"},
    {label: $localize`Time`, value: "ciTime", type: Constant.NUMBER},
    {label: $localize`City Tax Cc Charge`, value: "cityTaxCcCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`City Tax Fc Charge`, value: "cityTaxFcCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Date`, value: "coDate", type: Constant.DATE, format: Constant.DATE_FORMAT},
    {label: $localize`Flight no`, value: "coFltno"},
    {label: $localize`Time`, value: "coTime", type: Constant.NUMBER},
    {label: $localize`Date`, value: "cdate", type: Constant.DATE, format: Constant.DATE_FORMAT},
    {label: $localize`Detail`, value: "detail"},
    {label: $localize`Early Checkin`, value: "earlyCheckin", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Eci Single Room Cc Charge`, value: "eciSingleRoomCcCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Eci Single Room Fc Charge`, value: "eciSingleRoomFcCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Eci Twin Room Cc Charge`, value: "eciTwinRoomCcCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Fc`, value: "fc", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Fltno`, value: "fltno"},
    {label: $localize`Fullname`, value: "fullname", rowspan: "2"},
    {label: $localize`Late Checkout`, value: "lateCheckout", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Lco Single Room Cc Charge`, value: "lcoSingleRoomCcCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Lco Single Room Fc Charge`, value: "lcoSingleRoomFcCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Lco Twin Room Cc Charge`, value: "lcoTwinRoomCcCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Night`, value: "night", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Number Of Nights`, value: "numberOfNights", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Number Of Vehicle`, value: "numberOfVehicle", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Price (includes VAT)`, value: "price", type: Constant.NUMBER, rowspan: "2"},
    {label: $localize`Remark`, value: "remark"},
    {label: $localize`Room No`, value: "roomNo", rowspan: "2"},
    {label: $localize`Service Tax Cc Charge`, value: "serviceTaxCcCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Service Tax Fc Charge`, value: "serviceTaxFcCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Single Room Cc`, value: "singleRoomCc", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Single Room Cc Charge`, value: "singleRoomCcCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Single Room Fc`, value: "singleRoomFc", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Single Room Fc Charge`, value: "singleRoomFcCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Time Stay`, value: "timeStay", type: Constant.NUMBER, rowspan: "2"},
    {label: $localize`Toll`, value: "toll", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Total Amount Cc`, value: "totalAmountCc", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Total Amount Fc`, value: "totalAmountFc", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Total Breakfast Cc Charge`, value: "breakfastCcCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Total Breakfast Fc Charge`, value: "breakfastFcCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Total Charge`, value: "totalCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Total Charges`, value: "totalCharges", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Total Night`, value: "totalNight", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Total Revenue`, value: "totalRevenue", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Total Single Rooms Cc`, value: "totalSingleRoomsCc", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Total Single Rooms Fc`, value: "totalSingleRoomsFc", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Total Twin Rooms Cc`, value: "totalTwinRoomsCc", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Total Vat`, value: "totalVat", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Transit Duty`, value: "transitDuty", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Transport Charge`, value: "transportCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Twin Room Cc`, value: "twinRoomCc", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Twin Room Cc Charge`, value: "twinRoomCcCharge", type: Constant.NUMBER, rowspan: "2", displayTotal: true},
    {label: $localize`Unit Price`, value: "unitPrice", type: Constant.NUMBER, rowspan: "2"},
    {label: $localize`Type Room`, value: "typeRoom", rowspan: "2"}
  ];
  ready: boolean = false;
  showDialogUnMatched = false;
  showDialogFinish = false;
  protected readonly LOCALE = LOCALE;
  protected readonly transform = transform;
  protected readonly DATE_FORMAT_DD_MM_YYYY = DATE_FORMAT_DD_MM_YYYY;
  protected readonly InvoiceDocumentStatusEnum = InvoiceDocumentStatusEnum;

  constructor() {
    super();
    window.scrollTo({top: 0, behavior: 'instant'});
    this.formGroupDetail = this.fb.group({
      id: [],
      idParent: [],
      idContract: [],
      idInvoiceForm: [],
      version: [],
      ctype: [],
      invoiceNumber: [],
      invoiceDate: [],
      invoiceReceiveDate: [],
      periodFrom: [],
      periodTo: [],
      periodOccurrence: [],
      paymentDueDay: [],
      paymentDueDate: [],
      bizDocId: [],
      airportCode: [],
      airportName: [],
      partnerCode: [],
      partnerName: [],
      partnerType: [],
      contractServiceType: [],
      currency: [],
      exchangeRate: [],
      exchangeRateDate: [],
      exchangeRateType: [],
      description: [],
      note: [, [Validators.maxLength(500)]],
      status: [],
      statusEmail: [],
      amountFcBeforeVat: [],
      vatFc: [],
      totalAmountFc: [],
      amountVndBeforeVat: [],
      vatVnd: [],
      totalAmountVnd: [],
      reimbursementTotalFc: [],
      reimbursementTotalVnd: [],
      invoiceDocumentDtl: [],
      fileAttachments: [],
      fileUpload: [],
      invoiceDocumentReviewProjection: [],
      invoiceDocumentReview: [],
      invoiceDocumentReviewForm: []
    });
  }

  override async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([this.detail(this.id), this.loadListFlightMarket(), this.loadListFeeService(), this.setReadMode(this.formGroupDetail)]).then(() => {
        if (this.formGroupDetail.getRawValue().contractServiceType === 'INTERNATIONAL' && this.formGroupDetail.getRawValue().partnerType === 'HOTEL') {
          this.formType = 1;
          this._displayedColumnsHeader1 = ['stt', 'checkin2col', 'checkout2col', 'fc', 'cc', 'singleRoomFc', 'singleRoomCc', 'twinRoomCc', 'numberOfNights', 'earlyCheckin', 'lateCheckout', 'totalSingleRoomsFc', 'totalSingleRoomsCc', 'totalTwinRoomsCc', 'breakfastFc', 'breakfastCc', 'singleRoomFcCharge', 'singleRoomCcCharge', 'twinRoomCcCharge', 'eciSingleRoomFcCharge', 'eciSingleRoomCcCharge', 'eciTwinRoomCcCharge', 'lcoSingleRoomFcCharge', 'lcoSingleRoomCcCharge', 'lcoTwinRoomCcCharge', 'breakfastFcCharge', 'breakfastCcCharge', 'cityTaxFcCharge', 'cityTaxCcCharge', 'serviceTaxFcCharge', 'serviceTaxCcCharge', 'accommodationTaxFcCharge', 'accommodationTaxCcCharge', 'transportCharge', 'totalCharges', 'remark'];
          this._displayedColumnsHeader2 = ['ciFltno', 'ciDate', 'coFltno', 'coDate'];
          this._displayedColumnsRow = ['stt', 'ciFltno', 'ciDate', 'coFltno', 'coDate', 'fc', 'cc', 'singleRoomFc', 'singleRoomCc', 'twinRoomCc', 'numberOfNights', 'earlyCheckin', 'lateCheckout', 'totalSingleRoomsFc', 'totalSingleRoomsCc', 'totalTwinRoomsCc', 'breakfastFc', 'breakfastCc', 'singleRoomFcCharge', 'singleRoomCcCharge', 'twinRoomCcCharge', 'eciSingleRoomFcCharge', 'eciSingleRoomCcCharge', 'eciTwinRoomCcCharge', 'lcoSingleRoomFcCharge', 'lcoSingleRoomCcCharge', 'lcoTwinRoomCcCharge', 'breakfastFcCharge', 'breakfastCcCharge', 'cityTaxFcCharge', 'cityTaxCcCharge', 'serviceTaxFcCharge', 'serviceTaxCcCharge', 'accommodationTaxFcCharge', 'accommodationTaxCcCharge', 'transportCharge', 'totalCharges', 'remark'];
          this._displayedColumnsFooter = this._displayedColumnsRow.filter(item => !this._displayedColumnsHeader2.includes(item));
          this.totalColSpan = 5;
        } else if (this.formGroupDetail.getRawValue().contractServiceType === 'DOMESTIC' && this.formGroupDetail.getRawValue().partnerType === 'HOTEL') {
          this.formType = 2;
          this._displayedColumnsHeader1 = ['stt', 'fullname', 'checkin3col', 'checkout3col', 'roomNo', 'night', 'timeStay', 'earlyCheckin', 'lateCheckout', 'totalNight', 'price', 'totalCharge', 'remark', 'typeRoom'];
          this._displayedColumnsHeader2 = ['ciFltno', 'ciDate', 'ciTime', 'coFltno', 'coDate', 'coTime',];
          this._displayedColumnsRow = ['stt', 'fullname', 'ciFltno', 'ciDate', 'ciTime', 'coFltno', 'coDate', 'coTime', 'roomNo', 'night', 'timeStay', 'earlyCheckin', 'lateCheckout', 'totalNight', 'price', 'totalCharge', 'remark', 'typeRoom'];
          this._displayedColumnsFooter = this._displayedColumnsRow.filter(item => !this._displayedColumnsHeader2.includes(item) && item != 'fullname');
          this.totalColSpan = 8;
        } else if (this.formGroupDetail.getRawValue().contractServiceType === 'INTERNATIONAL' && this.formGroupDetail.getRawValue().partnerType === 'TRANSPORTATION') {
          this.formType = 3;
          this._displayedColumnsHeader1 = ['stt', 'fltno', 'cdate', 'detail', 'numberOfVehicle', 'unitPrice', 'accessBridge', 'toll', 'transitDuty', 'airportParkingFee', 'totalCharge', 'remark'];
          this._displayedColumnsHeader2 = [];
          this._displayedColumnsRow = ['stt', 'fltno', 'cdate', 'detail', 'numberOfVehicle', 'unitPrice', 'accessBridge', 'toll', 'transitDuty', 'airportParkingFee', 'totalCharge', 'remark'];
          this._displayedColumnsFooter = this._displayedColumnsRow.filter(item => !this._displayedColumnsHeader2.includes(item));
        } else if (this.formGroupDetail.getRawValue().contractServiceType === 'DOMESTIC' && this.formGroupDetail.getRawValue().partnerType === 'TRANSPORTATION') {
          this.formType = 4;
          this._displayedColumnsHeader1 = ['stt', 'fltno', 'cdate', 'detail', 'numberOfVehicle', 'unitPrice', 'totalCharge', 'remark'];
          this._displayedColumnsHeader2 = [];
          this._displayedColumnsRow = ['stt', 'fltno', 'cdate', 'detail', 'numberOfVehicle', 'unitPrice', 'totalCharge', 'remark'];
          this._displayedColumnsFooter = this._displayedColumnsRow.filter(item => !this._displayedColumnsHeader2.includes(item));
        }

        let reviewStatus = this.reviewMatch() ? InvoiceDocumentStatusEnum.VERIFIED : InvoiceDocumentStatusEnum.UNVERIFIED
        let filterForm = this.formGroupDetail.getRawValue().invoiceDocumentReview.filter((s: any) => s.sourceData == 'FORM');
        let filterAves = this.formGroupDetail.getRawValue().invoiceDocumentReview.filter((s: any) => s.sourceData == 'AVES');
        //check diff
     /*   filterForm.forEach(form=>{
          if (this.formGroupDetail.getRawValue().contractServiceType === 'INTERNATIONAL' && this.formGroupDetail.getRawValue().partnerType === 'HOTEL') {
            let avesRow =   filterAves.find(aves=>aves.ciFltno == form.ciFltno && aves.ciDate == form.ciDate);
            if(!avesRow || avesRow.)
          }

        });*/

        this.formGroupDetail.patchValue({invoiceDocumentReviewForm: filterForm, status: reviewStatus});
      });

    } catch (e) {
      console.log(e);
      this.baseService.showError(MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }

  }

  goBack() {
    this.backStepEmit.emit([]);
    window.scrollTo({top: 0, behavior: 'instant'});
  }

  async setReadMode(form: FormGroup) {
    const disableField = ['paymentDueDay', 'paymentDueDate', 'bizDocId', 'partnerCode', 'partnerName', 'partnerType', 'currency', 'amountFcBeforeVat', 'vatFc', 'amountVndBeforeVat', 'vatVnd', 'totalAmountFc', 'totalAmountVnd', 'version'];
    const enableField = ['note',];
    Object.entries(form.controls).forEach(([k, v]) => {
      if (this.readMode) {
        v.disable();
      } else {
        if (!enableField.includes(k)) {
          v.disable();
        }
      }
    });
  }

  async download(type?: any) {
    try {
      await this.spinner.show();
      const res = await this.baseService.exportListData({
        id: this.id, exportType: InvoiceDocumentExportType.DOCUMENT_REVIEW
      });
      this.downloadFile(res, 'export.xlsx');
    } catch (e) {
      console.log(e)
    } finally {
      await this.spinner.hide();
    }
  }



  override async save(): Promise<any> {
    let res = await super.save();
    if (res) {
      this.goBack();
    }
  }


  addDtl() {
    let listDtl = [...this.formGroupDetail.getRawValue().invoiceDocumentDtl, {}];
    this.formGroupDetail.patchValue({invoiceDocumentDtl: listDtl});
  }

  calTotal(column: any) {
    if (column.type === Constant.NUMBER) {
      return this.formGroupDetail.getRawValue().invoiceDocumentReviewForm.reduce((prev: any, cur: any) => {
        // prev + +cur[column.value]
        if (cur.typeRoom === 'CC Twin room') {
          return prev + +(cur[column.value] / 2);
        } else {
          return prev + +cur[column.value];
        }
      }, 0)
    } else {
      return '';
    }
  }

  saveAndNext() {
    this.formGroupDetail.patchValue({invoiceDocumentReviewProjection: null});
    this.save().then(res => {
      this.nextStepEmit.emit([this.id, this.readMode, 2, this.dataObject]);
      window.scrollTo({top: 0, behavior: 'instant'});
    });
  }

  toggleDialogUnMatched() {
    this.showDialogUnMatched = !this.showDialogUnMatched;

  }

  toggleDialogFinish() {
    this.showDialogFinish = !this.showDialogFinish;

  }

  saveAndFinish() {
    this.formGroupDetail.patchValue({
      invoiceDocumentReviewProjection: null, status: InvoiceDocumentStatusEnum.FINISHED
    })
    this.save();
  }

  getRowSpan(index: number, innerColumn: any, data: any): number {
    if (data.typeRoom === 'CC Twin room' && ['roomNo', 'night', 'timeStay', 'earlyCheckin', 'lateCheckout', 'totalNight', 'price', 'totalCharge'].includes(innerColumn.value)) {
      let dtl = this.formGroupDetail.getRawValue().invoiceDocumentReviewForm.filter((item: any) => item.typeRoom === 'CC Twin room');
      let currentRow = dtl[index];
      let nextRow = dtl[index + 1];
      // if (nextRow?.roomNo === currentRow?.roomNo && nextRow?.ciDate === currentRow?.ciDate) {
      if (nextRow?.roomNo === currentRow?.roomNo) {
        return 2;
      } else return 1;
    } else {return 1;}
  }

  shouldShowRowSpan(index: number, innerColumn: any): boolean {
    if (['roomNo', 'night', 'timeStay', 'earlyCheckin', 'lateCheckout', 'totalNight', 'price', 'totalCharge'].includes(innerColumn.value)) {
      let dtl = this.formGroupDetail.getRawValue().invoiceDocumentReviewForm
      return (index === 0 || dtl[index]?.typeRoom !== 'CC Twin room' || dtl[index]?.roomNo !== dtl[index - 1]?.roomNo
        // (dtl[index]?.roomNo === dtl[index - 1]?.roomNo && dtl[index]?.ciDate !== dtl[index - 1]?.ciDate)
      );
    } else return true;
  }

  reviewMatch() {
    return !this.formGroupDetail.getRawValue().invoiceDocumentReviewProjection.some((item: any) => item.diff !== null && item.diff !== 0);
  }
}
