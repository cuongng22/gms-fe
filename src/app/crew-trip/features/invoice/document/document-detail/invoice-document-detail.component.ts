import {Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, QueryList, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe, CommonModule, DecimalPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet, TitleCasePipe} from '@angular/common';
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
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import * as InvoiceLookup from "src/app/crew-trip/features/invoice/invoice-lookup";
import {InvoiceDocumentService} from 'src/app/crew-trip/core/services/invoice-document-service';
import {CdkTextareaAutosize} from "@angular/cdk/text-field";
import {ContractService} from "src/app/crew-trip/core/services/contract-service";
import {SelectionSuggestComponent} from "src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component";
import {DatepickerYearMonthComponent} from "src/app/crew-trip/shared/component/datepicker-year-month/datepicker-year-month.component";
import {SeparatorDirective} from "src/app/crew-trip/shared/directive/separator.directive";
import {ThousandsSeparatorDirective} from "src/app/crew-trip/shared/directive/thousand-separator.directive";
import {HttpStatusCode} from "@angular/common/http";
import moment from "moment";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {ConfirmDeleteDialog} from "src/app/crew-trip/shared/dialog/confirm-delete-dialog";
import {ConfirmDialog} from "src/app/crew-trip/shared/dialog/confirm-dialog/confirm-dialog";
import {InvoiceDocumentStatus, InvoiceDocumentStatusEnum} from "src/app/crew-trip/features/invoice/invoice-lookup";


@Component({
  selector: 'app-invoice-document-detail',
  standalone: true,
  imports: [CommonModule, DataTransformPipe, FormsModule, InputSizeComponent, MatAccordion, MatButtonModule, MatCardModule, MatCheckboxModule, MatError, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle, MatFormField, MatInput, MatLabel, MatMenuModule, MatOption, MatPaginatorModule, MatPrefix, MatRadioModule, MatSelect, MatSuffix, MatTab, MatTabGroup, MatTableModule, NgClass, NgIf, NgxEditorModule, ReactiveFormsModule, RouterLink, TitleCasePipe, MatHint, MatDatepickerModule, MatDatepicker, MatDatepickerToggle, MatNativeDateModule, FileUploadModule, ClickOutside, MatAutocomplete, MatAutocompleteTrigger, NgxTrimDirectiveModule, NgxMaterialTimepickerModule, NgxMatTimepickerFieldComponent, NgForOf, NgxMaterialTimepickerModule, DigitOnlyModule, DecimalPipe, CdkTextareaAutosize, SelectionSuggestComponent, AsyncPipe, DatepickerYearMonthComponent, SeparatorDirective, ThousandsSeparatorDirective, MatGridTile, MatGridList, NgTemplateOutlet, CdkVirtualScrollViewport, ConfirmDeleteDialog, ConfirmDialog],
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
  @Output() nextStepEmit = new EventEmitter<any>();
  @Output() backStepEmit = new EventEmitter<any>();
  @Input() dialogMode: boolean = false;
  @Output() dialogModeEmit = new EventEmitter<any>();
  firstLoad: boolean = true;
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
  }[] = [{label: "Access Bridge", value: "accessBridge", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Accommodation Tax Cc Charge",
    value: "accommodationTaxCcCharge",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Accommodation Tax Fc Charge", value: "accommodationTaxFcCharge", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Airport Parking Fee",
    value: "airportParkingFee",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Breakfast Cc", value: "breakfastCc", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Breakfast Fc",
    value: "breakfastFc",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Cc", value: "cc", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Ci Date",
    value: "ciDate",
    type: Constant.DATE,
    format: Constant.DATE_FORMAT
  }, {label: "Ci Fltno", value: "ciFltno"}, {label: "Ci Time", value: "ciTime"}, {
    label: "City Tax Cc Charge",
    value: "cityTaxCcCharge",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "City Tax Fc Charge", value: "cityTaxFcCharge", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Co Date",
    value: "coDate",
    type: Constant.DATE,
    format: Constant.DATE_FORMAT
  }, {label: "Co Fltno", value: "coFltno"}, {label: "Co Time", value: "coTime"}, {
    label: "Cdate",
    value: "cdate",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Detail", value: "detail", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Early Checkin",
    value: "earlyCheckin",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Eci Single Room Cc Charge", value: "eciSingleRoomCcCharge", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Eci Single Room Fc Charge",
    value: "eciSingleRoomFcCharge",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Eci Twin Room Cc Charge", value: "eciTwinRoomCcCharge", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Fc",
    value: "fc",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Fltno", value: "fltno", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Fullname",
    value: "fullname",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Late Checkout", value: "lateCheckout", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Lco Single Room Cc Charge",
    value: "lcoSingleRoomCcCharge",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Lco Single Room Fc Charge", value: "lcoSingleRoomFcCharge", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Lco Twin Room Cc Charge",
    value: "lcoTwinRoomCcCharge",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Night", value: "night", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Number Of Nights",
    value: "numberOfNights",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Number Of Vehicle", value: "numberOfVehicle", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Price",
    value: "price",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Remark", value: "remark", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Room No",
    value: "roomNo",
    rowspan: "2"
  }, {label: "Service Tax Cc Charge", value: "serviceTaxCcCharge", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Service Tax Fc Charge",
    value: "serviceTaxFcCharge",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Single Room Cc", value: "singleRoomCc", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Single Room Cc Charge",
    value: "singleRoomCcCharge",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Single Room Fc", value: "singleRoomFc", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Single Room Fc Charge",
    value: "singleRoomFcCharge",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Time Stay", value: "timeStay", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Toll",
    value: "toll",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Total Amount Cc", value: "totalAmountCc", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Total Amount Fc",
    value: "totalAmountFc",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Total Breakfast Cc Charge", value: "totalBreakfastCcCharge", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Total Breakfast Fc Charge",
    value: "totalBreakfastFcCharge",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Total Charge", value: "totalCharge", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Total Charges",
    value: "totalCharges",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Total Night", value: "totalNight", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Total Revenue",
    value: "totalRevenue",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Total Single Rooms Cc", value: "totalSingleRoomsCc", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Total Single Rooms Fc",
    value: "totalSingleRoomsFc",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Total Twin Rooms Cc", value: "totalTwinRoomsCc", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Total Vat",
    value: "totalVat",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Transit Duty", value: "transitDuty", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Transport Charge",
    value: "transportCharge",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Twin Room Cc", value: "twinRoomCc", type: Constant.NUMBER, rowspan: "2"}, {
    label: "Twin Room Cc Charge",
    value: "twinRoomCcCharge",
    type: Constant.NUMBER,
    rowspan: "2"
  }, {label: "Unit Price", value: "unitPrice", type: Constant.NUMBER, rowspan: "2"}, {label: "Type Room", value: "typeRoom", rowspan: "2"},];
  ready: boolean = false;
  @ViewChild('inputElementRef1, inputElementRef2, inputElementRef3, inputElementRef4') inputElementRef: QueryList<ElementRef>;
  @ViewChild('totalab') totalab: ElementRef;
  public listDocumentParent: any[] = [];
  showDialogFinish = false;
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
      fileUpload: [],
      _id: [],
      _invoiceNumber: [],
      _invoiceDate: [],
    });

    if (!this.readMode) {
      this.formGroupDetail.controls['airportCode'].valueChanges.subscribe(async (value) => {
        if (value && !this.firstLoad) {
          try {
            await this.spinner.show();
            const [res, res2] = await Promise.all([
              this.baseService.getContractByAirport(value),
              this.loadListDocumentParent()
            ]);
            if (res.data?.bizDocId) {
              let partnerType = res.data?.isHotel ? 'HOTEL' : 'TRANSPORTATION';
              this.formGroupDetail.patchValue({
                paymentDueDay: res.data?.dueDateNumber,
                bizDocId: res.data?.bizDocId,
                partnerCode: res.data?.partnerCode,
                partnerName: res.data?.partnerName, // partnerType: partnerType,
                currency: res.data?.currency,
              })

              //paymentDueDate
              let invoiceDate = this.formGroupDetail.getRawValue().invoiceDate;
              let _value = (moment(invoiceDate) || invoiceDate)?.add(res.data?.dueDateNumber || 0, 'days')
              this.formGroupDetail.patchValue({
                paymentDueDate: _value?.format('YYYY-MM-DD') || ''
              });
            }
          } catch (e) {
            console.log(e);
            this.baseService.showError(MESSAGE.ERROR);
          } finally {
            await this.spinner.hide();
          }
        }
      });

      this.formGroupDetail.controls['periodFrom'].valueChanges.subscribe((value) => {
        if (value && !this.firstLoad) {
          this.formGroupDetail.patchValue({
            periodOccurrence: (moment(value) || value)?.format('YYYY-MM-DD') || '',
          });
        }
      });

      this.formGroupDetail.controls['invoiceDate'].valueChanges.subscribe((value) => {
        if (value && !this.firstLoad) {
          let _value = (moment(value) || value)?.add(this.formGroupDetail.getRawValue().paymentDueDay || 0, 'days')
          this.formGroupDetail.patchValue({
            paymentDueDate: _value?.format('YYYY-MM-DD') || ''
          });
        }
      });

      this.formGroupDetail.controls['invoiceDate'].valueChanges.subscribe((value) => {
        if (value && !this.firstLoad) {
          let _value = (moment(value) || value)?.add(this.formGroupDetail.getRawValue().paymentDueDay || 0, 'days')
          this.formGroupDetail.patchValue({
            paymentDueDate: _value?.format('YYYY-MM-DD') || ''
          });
        }
      });

      this.formGroupDetail.controls['idParent'].valueChanges.subscribe((value) => {
        if (!this.firstLoad) {
          this.formGroupDetail.patchValue({version: value ? 2 : 1});
        }
      });
    }
  }

  override async ngOnInit() {
    try {
      await this.spinner.show();
      await this.loadListDocumentParent();
      await Promise.all([this.detail(this.id), this.loadListFlightMarket(), this.loadListFeeService(), this.setReadMode(this.formGroupDetail)]).then(() => {
        this.formGroupDetail.patchValue({idParent: this.formGroupDetail.getRawValue().idParent})
      });
    } catch (e) {
      console.log(e);
      this.baseService.showError(MESSAGE.ERROR);
    } finally {
      this.firstLoad = false;
      await this.spinner.hide();
    }

  }

  goBack() {
    this.backStepEmit.emit([]);
    window.scrollTo({top: 0, behavior: 'instant'});
  }

  saveAndNext() {
    this.save().then(res => {
      this.nextStepEmit.emit([this.id, this.readMode, 3, this.dataObject]);
      window.scrollTo({top: 0, behavior: 'instant'});
    });
  }

  saveAndFinish() {
    this.formGroupDetail.patchValue({status: InvoiceDocumentStatusEnum.FINISHED})
    this.save();
  }

  toggleDialogFinish() {
    this.showDialogFinish = !this.showDialogFinish;
  }

  async setReadMode(form: FormGroup) {
    const disableField = ['airportCode', 'paymentDueDay', 'paymentDueDate', 'bizDocId', 'partnerCode', 'partnerName', 'partnerType', 'currency', 'amountFcBeforeVat', 'vatFc', 'amountVndBeforeVat', 'vatVnd', 'totalAmountFc', 'totalAmountVnd', 'version'];
    Object.entries(form.controls).forEach(([k, v]) => {
      if (this.readMode) {
        v.disable();
      } else {
        if (disableField.includes(k)) {
          v.disable();
        }
      }
    });
  }

  calTotal(column: any) {
    let value = this.formGroupDetail.getRawValue().invoiceDocumentDtl.reduce((prev: any, cur: any) => prev + cur[column], 0)
    let key: any = {};
    if (column === 'amountFcVat') {
      key['vatFc'] = value;
    } else if (column === 'amountVndVat') {
      key['vatVnd'] = value;
    } else {
      key[column] = value;
    }
    this.formGroupDetail.patchValue({...key});
    this.formGroupDetail.patchValue({
      totalAmountFc: (this.formGroupDetail.getRawValue().amountFcBeforeVat || 0) + (this.formGroupDetail.getRawValue().vatFc || 0),
      totalAmountVnd: (this.formGroupDetail.getRawValue().amountVndBeforeVat || 0) + (this.formGroupDetail.getRawValue().vatVnd || 0),
    });
    const inputs = this.totalab.nativeElement.querySelectorAll('input');
    inputs.forEach((inputRef: any) => {
      inputRef.dispatchEvent(new Event('focus'));
    })
  }

  /*  async airportCodeChange($event: any) {
      if ($event?.value) {
        try {
          await this.spinner.show();
          await this.baseService.getContractByAirport($event.value).then(res => {
            if (res.data?.bizDocId) {
              //todo set du lieu thong tin hop dong cho form detail
              this.formGroupDetail.patchValue({
                paymentDueDay : 15,
                bizDocId: res.data?.bizDocId,
              })
            }
          });
        } catch (e) {
          console.log(e);
          this.baseService.showError(MESSAGE.ERROR);
        } finally {
          await this.spinner.hide();
        }
      }
    }*/

  async download(fileRow: any) {
    try {
      await this.spinner.show();
      let res = await this.baseService.getFileData({
        id: fileRow.id, url: fileRow.fileUrl, fileSize: fileRow.fileSize,
      });
      this.downloadFile(res, fileRow.fileName + "." + fileRow.fileType);

    } catch (e) {
      console.log(e);
      this.baseService.showError(MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
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
          let lastDotIndex = fileUpload.name.lastIndexOf('.');
          let fileName = fileUpload.name.substring(0, lastDotIndex);
          let listFile = [...this.formGroupDetail.getRawValue().fileAttachments, {
            ctype: 'MANUAL', fileName: fileName, fileSize: fileUpload.size, fileUrl: res.data, fileType: fileUpload.name.split('.').pop(),
          }];
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

  override async save(): Promise<any> {
    try {
      let removeNull = this.formGroupDetail.getRawValue().invoiceDocumentDtl.filter((s: any) => s.serviceCode);
      this.formGroupDetail.patchValue({invoiceDocumentDtl: removeNull});
      this.formGroupDetail.markAllAsTouched();
      if (this.formGroupDetail.invalid) {
        this.findInvalidControls(this.formGroupDetail);
        return;
      }
      const update = !!this.formGroupDetail.getRawValue().id;
      await this.spinner.show();
      let res;
      if (update) {
        res = await this.baseService.update(this.formGroupDetail.getRawValue());
      } else {
        res = await this.baseService.create(this.formGroupDetail.getRawValue());
      }
      this.baseService.showSuccess(
        update ? MESSAGE.UPDATE_SUCCESS : MESSAGE.CREATE_SUCCESS,
      );
        return res;

    } catch (e: any) {
      this.baseService.showError(
        e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR,
      );
    } finally {
      await this.spinner.hide();
    }
  }

  validField(row: any, cell: any, inputRef?: any) {
    if (!row[cell]) {
      return 'Not empty';
    } else if ((cell == 'col614' || cell == 'col624' || cell == 'col634' || cell == 'col635') && row[cell] > 2) {
      inputRef.control.setErrors({invalid: true});
      return 'Must less than 2';
    } else if (cell == 'col633') {
      const regex = /^(>?)([1-9]|1[0-9]|2[0-4])$/;
      if (!regex.test(row[cell])) {
        inputRef.control.setErrors({invalid: true});
        return 'Not valid';
      }
    } else if (cell == 'col613') {
      const from = +(row['col612'].replace(':', ''));
      const to = +(row['col613'].replace(':', ''));
      if (to < from) {
        inputRef.control.setErrors({invalid: true});
        return 'Must after from';
      }
    } else if (cell == 'col623') {
      const from = +(row['col622'].replace(':', ''));
      const to = +(row['col623'].replace(':', ''));
      if (to < from) {
        inputRef.control.setErrors({invalid: true});
        return 'Must after from';
      }
    } else if (cell == 'col632') {
      const from = +(row['col631'].replace(':', ''));
      const to = +(row['col632'].replace(':', ''));
      if (to < from) {
        inputRef.control.setErrors({invalid: true});
        return 'Must after from';
      }
    }
    return '';
  }

  addDtl() {
    let listDtl = [...this.formGroupDetail.getRawValue().invoiceDocumentDtl || [], {}];
    this.formGroupDetail.patchValue({invoiceDocumentDtl: listDtl});
  }

  async loadListDocumentParent() {
    console.log(this.dataObject, 'dataObject')
    if (!this.readMode) {
      await this.baseService.getListDocumentParent({airportCode: this.dataObject?.airportCode}).then((res) => {
        if (res.data) {
          this.listDocumentParent = res.data;
        }
      });
    }
  }

  override async detail(id: any) {
    await super.detail(id);
    if (!!!id) {
      this.formGroupDetail.patchValue({status: InvoiceDocumentStatusEnum.UNVERIFIED});
    }
    this.listDocumentParent = [...this.listDocumentParent,
      {
        id: this.formGroupDetail.getRawValue()._id,
        invoiceNumber: this.formGroupDetail.getRawValue()._invoiceNumber,
        invoiceDate: this.formGroupDetail.getRawValue()._invoiceDate,
      }];
  }
}
