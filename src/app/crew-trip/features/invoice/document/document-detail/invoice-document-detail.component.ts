import {ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe, DecimalPipe, NgClass, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
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
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {NgxEditorModule} from 'ngx-editor';
import {
  MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle
} from '@angular/material/expansion';
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
import * as ContractLookup from 'src/app/crew-trip/features/contract/contract-lookup';
import {ServiceFeeService} from 'src/app/crew-trip/core/services/service-fee-service';
import {InvoiceFormService} from "src/app/crew-trip/core/services/invoice-form-service";
import {DigitOnlyModule} from "@uiowa/digit-only";
import * as InvoiceLookup from "src/app/crew-trip/features/invoice/invoice-lookup";
import {InvoiceDocumentService} from 'src/app/crew-trip/core/services/invoice-document-service';
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {ContractService} from "src/app/crew-trip/core/services/contract-service";
import {
  SelectionSuggestComponent
} from "src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component";
import {map, Observable, startWith} from "rxjs";
import {
  DatepickerYearMonthComponent
} from "src/app/crew-trip/shared/component/datepicker-year-month/datepicker-year-month.component";
import {SeparatorDirective} from "src/app/crew-trip/shared/directive/separator.directive";
import {ThousandsSeparatorDirective} from "src/app/crew-trip/shared/directive/thousand-separator.directive";
import {HttpStatusCode} from "@angular/common/http";


@Component({
  selector: 'app-invoice-document-detail',
  standalone: true,
  imports: [DataTransformPipe, FormsModule, InputSizeComponent, MatAccordion, MatButtonModule, MatCardModule, MatCheckboxModule, MatError, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle, MatFormField, MatInput, MatLabel, MatMenuModule, MatOption, MatPaginatorModule, MatPrefix, MatRadioModule, MatSelect, MatSuffix, MatTab, MatTabGroup, MatTableModule, NgClass, NgIf, NgxEditorModule, ReactiveFormsModule, RouterLink, TitleCasePipe, MatHint, MatDatepickerModule, MatDatepicker, MatDatepickerToggle, MatNativeDateModule, FileUploadModule, ClickOutside, MatAutocomplete, MatAutocompleteTrigger, NgxTrimDirectiveModule, NgxMaterialTimepickerModule, NgxMatTimepickerFieldComponent, NgForOf, NgxMaterialTimepickerModule, DigitOnlyModule, DecimalPipe, CdkTextareaAutosize, SelectionSuggestComponent, AsyncPipe, DatepickerYearMonthComponent, SeparatorDirective, ThousandsSeparatorDirective],
  templateUrl: './invoice-document-detail.component.html',
  styleUrl: './invoice-document-detail.component.scss',
  providers: [provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),

  ]
})


export class InvoiceDocumentDetailComponent extends CommonComponent implements OnInit {
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
  _displayedColumnsHeader1: string[] = [];
  _displayedColumnsHeader2: string[] = [];
  _displayedColumnsRow: string[] = [];
  _displayedColumnsFooter: string[] = [];
  _displayedColumnsAll: {
    label: string; value: string, type?: string, format?: string, rowspan?: string, colspan?: string
  }[] =
    [
      {label: $localize`Access Bridge`, value: "accessBridge", type: Constant.NUMBER, rowspan: "2"}, {
      label: $localize`Accommodation Tax Cc Charge`,
      value: "accommodationTaxCcCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Accommodation Tax Fc Charge`,
      value: "accommodationTaxFcCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Airport Parking Fee`,
      value: "airportParkingFee",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Breakfast Cc`,
      value: "breakfastCc",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {label: $localize`Breakfast Fc`, value: "breakfastFc", type: Constant.NUMBER, rowspan: "2"}, {
      label: $localize`Cc`,
      value: "cc",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Ci Date`,
      value: "ciDate",
      type: Constant.DATE,
      format: Constant.DATE_FORMAT
    }, {label: $localize`Ci Fltno`, value: "ciFltno"}, {
      label: $localize`Ci Time`,
      value: "ciTime"
    }, {
      label: $localize`City Tax Cc Charge`,
      value: "cityTaxCcCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`City Tax Fc Charge`,
      value: "cityTaxFcCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Co Date`,
      value: "coDate",
      type: Constant.DATE,
      format: Constant.DATE_FORMAT
    }, {label: $localize`Co Fltno`, value: "coFltno"}, {
      label: $localize`Co Time`,
      value: "coTime"
    }, {label: $localize`Cdate`, value: "cdate", type: Constant.NUMBER, rowspan: "2"}, {
      label: $localize`Detail`,
      value: "detail",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Early Checkin`,
      value: "earlyCheckin",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Eci Single Room Cc Charge`,
      value: "eciSingleRoomCcCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Eci Single Room Fc Charge`,
      value: "eciSingleRoomFcCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Eci Twin Room Cc Charge`,
      value: "eciTwinRoomCcCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {label: $localize`Fc`, value: "fc", type: Constant.NUMBER, rowspan: "2"}, {
      label: $localize`Fltno`,
      value: "fltno",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Fullname`,
      value: "fullname",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Late Checkout`,
      value: "lateCheckout",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Lco Single Room Cc Charge`,
      value: "lcoSingleRoomCcCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Lco Single Room Fc Charge`,
      value: "lcoSingleRoomFcCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Lco Twin Room Cc Charge`,
      value: "lcoTwinRoomCcCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Night`,
      value: "night",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Number Of Nights`,
      value: "numberOfNights",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Number Of Vehicle`,
      value: "numberOfVehicle",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {label: $localize`Price`, value: "price", type: Constant.NUMBER, rowspan: "2"}, {
      label: $localize`Remark`,
      value: "remark",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Room No`,
      value: "roomNo",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Service Tax Cc Charge`,
      value: "serviceTaxCcCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Service Tax Fc Charge`,
      value: "serviceTaxFcCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Single Room Cc`,
      value: "singleRoomCc",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Single Room Cc Charge`,
      value: "singleRoomCcCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Single Room Fc`,
      value: "singleRoomFc",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Single Room Fc Charge`,
      value: "singleRoomFcCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {label: $localize`Time Stay`, value: "timeStay", type: Constant.NUMBER, rowspan: "2"}, {
      label: $localize`Toll`,
      value: "toll",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Total Amount Cc`,
      value: "totalAmountCc",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Total Amount Fc`,
      value: "totalAmountFc",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Total Breakfast Cc Charge`,
      value: "totalBreakfastCcCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Total Breakfast Fc Charge`,
      value: "totalBreakfastFcCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Total Charge`,
      value: "totalCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Total Charges`,
      value: "totalCharges",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Total Night`,
      value: "totalNight",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Total Revenue`,
      value: "totalRevenue",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Total Single Rooms Cc`,
      value: "totalSingleRoomsCc",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Total Single Rooms Fc`,
      value: "totalSingleRoomsFc",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Total Twin Rooms Cc`,
      value: "totalTwinRoomsCc",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Total Vat`,
      value: "totalVat",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Transit Duty`,
      value: "transitDuty",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Transport Charge`,
      value: "transportCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Twin Room Cc`,
      value: "twinRoomCc",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Twin Room Cc Charge`,
      value: "twinRoomCcCharge",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {
      label: $localize`Unit Price`,
      value: "unitPrice",
      type: Constant.NUMBER,
      rowspan: "2"
    }, {label: $localize`Type Room`, value: "typeRoom", rowspan: "2"}];
  ready: boolean = false;
  protected readonly LOCALE = LOCALE;
  protected readonly transform = transform;
  protected readonly DATE_FORMAT_DD_MM_YYYY = DATE_FORMAT_DD_MM_YYYY;

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
      note: [],
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
      fileUpload: []
    });
  }

  override async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([this.detail(this.id), this.loadListFlightMarket(), this.loadListFeeService(), this.setReadMode(this.formGroupDetail)]).then(() => {
      });

    } catch (e) {
      console.log(e);
    } finally {
      await this.spinner.hide();
    }

  }

  goBack() {
    this.backStepEmit.emit([]);
    window.scrollTo({top: 0, behavior: 'instant'});
  }

  async setReadMode(form: FormGroup) {
    Object.entries(form.controls).forEach(([k, v]) => {
      if (this.readMode) {
        v.disable();
      }
    });
  }

  calTotal(column: any) {
    if (column.type === Constant.NUMBER) {
      return this.formGroupDetail.getRawValue().invoiceFormDtl.reduce((prev: any, cur: any) => prev + cur[column.value], 0)
    } else {
      return '';
    }
  }

  async download(fileRow: any) {
    try {
      await this.spinner.show();
      let res = await this.baseService.getFileData(fileRow.id);
      this.downloadFile(res, fileRow.fileName + "." + fileRow.fileType);

    } catch (e) {
      console.log(e)
    } finally {
      await this.spinner.hide();
    }
  }

  async airportCodeChange($event: any) {
    if ($event?.value) {
      try {
        await this.spinner.show();
        await this.baseService.getContractByAirport($event.value).then(res => {
          if (res.data?.bizDocId) {
            //todo set du lieu thong tin hop dong cho form detail
          }
        });
      } catch (e) {
        console.log(e);
      } finally {
        await this.spinner.hide();
      }
    }
  }

  changeServiceFee($event: any, row: any, type: any) {
    if (type === 'code') {
      row.unit = this.listFeeService.find((s: any) => s.code == $event.value)?.unit;
      row.serviceName = this.listFeeService.find((s: any) => s.code == $event.value)?.name;
    } else if (type === 'name') {
      row.unit = this.listFeeService.find((s: any) => s.name == $event.value)?.unit;
      row.serviceCode = this.listFeeService.find((s: any) => s.name == $event.value)?.code;
    }
  }

  async actionUpload() {
    try {
      await this.spinner.show();
      const formUpload = new FormData();
      const fileUpload = this.formGroupDetail.getRawValue().fileUpload[0];
      console.log(fileUpload,'fileUploadfileUpload')
      //validate
      // if(!fileUpload.name.includes(this.COMMON_CONFIG.FILE_ACCEPT.split(',')) || fileUpload.size > 5 * 1048576){
      if (fileUpload.size > 5 * 1048576) {
        this.baseService.showError(MESSAGE.MAX_FILE_SIZE);
        return;
      }
      formUpload.append('file', fileUpload, fileUpload.name);
      formUpload.append('body', JSON.stringify({
        fileFolder: '/document',
      }));
      await this.baseService.uploadFileCommon(formUpload).then(res => {
        if (res.code == HttpStatusCode.Ok) {
          let listFile = [...this.formGroupDetail.getRawValue().fileAttachments, {
            ctype: 'MANUAL',
            fileName: fileUpload.name,
            fileSize: fileUpload.size,
            fileUrl: res.data,
            fileType: fileUpload.type,
          }];
          console.log(listFile)
          this.formGroupDetail.patchValue({fileAttachments: listFile});

        }
      });
    } catch (e: any) {
      console.log(e);
      this.baseService.showError((e.error?.error?.file) ?? (e.error?.error) ?? (e.error?.error?.code) ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
      this.formGroupDetail.patchValue({fileUpload: []});

    }

  }

  test() {
    console.log(this.formGroupDetail.getRawValue())
  }
}
