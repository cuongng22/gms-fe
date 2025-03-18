import {Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, QueryList, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {Constant, DATE_FORMAT_DD_MM_YYYY, LOCALE, MESSAGE, PATTERN} from 'src/app/crew-trip/shared/utils/constant';
import {NationService} from 'src/app/crew-trip/core/services/nation-service';
import {transform} from 'lodash';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import {ServiceFeeService} from 'src/app/crew-trip/core/services/service-fee-service';
import * as InvoiceLookup from "src/app/crew-trip/features/invoice/invoice-lookup";
import {InvoiceDocumentStatusEnum, InvoiceDocumentTypeEnum} from "src/app/crew-trip/features/invoice/invoice-lookup";
import {InvoiceDocumentService} from 'src/app/crew-trip/core/services/invoice-document-service';
import {ContractService} from "src/app/crew-trip/core/services/contract-service";
import {HttpStatusCode} from "@angular/common/http";
import moment from "moment";
import {BaseImport} from "src/app/crew-trip/shared/base-import";
import {debounceTime} from "rxjs";


@Component({
  selector: 'app-invoice-document-detail',
  standalone: true,
  imports: [BaseImport],
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
  @Input() titleHeader = $localize`Detailed Statement`;
  expandList = new Set<string>(['tab1', 'tab2', 'tab3']);
  formGroupFileUpload!: FormGroup;
  showDialogDeleteFile = false;
  dsInvoiceDocumentDtl = new MatTableDataSource<any>([]);
  listDocumentType = InvoiceLookup.InvoiceDocumentType;
  listInvoiceDocumentStatus = InvoiceLookup.InvoiceDocumentStatus;
  listInvoiceDocumentStatusEmail = InvoiceLookup.InvoiceDocumentStatusEmail;
  _displayedColumnsHeader1: string[] = [];
  _displayedColumnsHeader2: string[] = [];
  _displayedColumnsRow: string[] = [];
  _displayedColumnsFooter: string[] = [];
  _displayedColumnsAll: {
    label: string; value: string, type?: string, format?: string, rowspan?: string, colspan?: string
  }[] = [
    {label: "Access Bridge", value: "accessBridge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Accommodation Tax Cc Charge", value: "accommodationTaxCcCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Accommodation Tax Fc Charge", value: "accommodationTaxFcCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Airport Parking Fee", value: "airportParkingFee", type: Constant.NUMBER, rowspan: "2"},
    {label: "Breakfast Cc", value: "breakfastCc", type: Constant.NUMBER, rowspan: "2"},
    {label: "Breakfast Fc", value: "breakfastFc", type: Constant.NUMBER, rowspan: "2"},
    {label: "Cc", value: "cc", type: Constant.NUMBER, rowspan: "2"},
    {label: "Ci Date", value: "ciDate", type: Constant.DATE, format: Constant.DATE_FORMAT},
    {label: "Ci Fltno", value: "ciFltno"},
    {label: "Ci Time", value: "ciTime"},
    {label: "City Tax Cc Charge", value: "cityTaxCcCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "City Tax Fc Charge", value: "cityTaxFcCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Co Date", value: "coDate", type: Constant.DATE, format: Constant.DATE_FORMAT},
    {label: "Co Fltno", value: "coFltno"},
    {label: "Co Time", value: "coTime"},
    {label: "Cdate", value: "cdate", type: Constant.NUMBER, rowspan: "2"},
    {label: "Detail", value: "detail", type: Constant.NUMBER, rowspan: "2"},
    {label: "Early Checkin", value: "earlyCheckin", type: Constant.NUMBER, rowspan: "2"},
    {label: "Eci Single Room Cc Charge", value: "eciSingleRoomCcCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Eci Single Room Fc Charge", value: "eciSingleRoomFcCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Eci Twin Room Cc Charge", value: "eciTwinRoomCcCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Fc", value: "fc", type: Constant.NUMBER, rowspan: "2"},
    {label: "Fltno", value: "fltno", type: Constant.NUMBER, rowspan: "2"},
    {label: "Fullname", value: "fullname", type: Constant.NUMBER, rowspan: "2"},
    {label: "Late Checkout", value: "lateCheckout", type: Constant.NUMBER, rowspan: "2"},
    {label: "Lco Single Room Cc Charge", value: "lcoSingleRoomCcCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Lco Single Room Fc Charge", value: "lcoSingleRoomFcCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Lco Twin Room Cc Charge", value: "lcoTwinRoomCcCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Night", value: "night", type: Constant.NUMBER, rowspan: "2"},
    {label: "Number Of Nights", value: "numberOfNights", type: Constant.NUMBER, rowspan: "2"},
    {label: "Number Of Vehicle", value: "numberOfVehicle", type: Constant.NUMBER, rowspan: "2"},
    {label: "Price", value: "price", type: Constant.NUMBER, rowspan: "2"},
    {label: "Remark", value: "remark", type: Constant.NUMBER, rowspan: "2"},
    {label: "Room No", value: "roomNo", rowspan: "2"},
    {label: "Service Tax Cc Charge", value: "serviceTaxCcCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Service Tax Fc Charge", value: "serviceTaxFcCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Single Room Cc", value: "singleRoomCc", type: Constant.NUMBER, rowspan: "2"},
    {label: "Single Room Cc Charge", value: "singleRoomCcCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Single Room Fc", value: "singleRoomFc", type: Constant.NUMBER, rowspan: "2"},
    {label: "Single Room Fc Charge", value: "singleRoomFcCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Time Stay", value: "timeStay", type: Constant.NUMBER, rowspan: "2"},
    {label: "Toll", value: "toll", type: Constant.NUMBER, rowspan: "2"},
    {label: "Total Amount Cc", value: "totalAmountCc", type: Constant.NUMBER, rowspan: "2"},
    {label: "Total Amount Fc", value: "totalAmountFc", type: Constant.NUMBER, rowspan: "2"},
    {label: "Total Breakfast Cc Charge", value: "totalBreakfastCcCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Total Breakfast Fc Charge", value: "totalBreakfastFcCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Total Charge", value: "totalCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Total Charges", value: "totalCharges", type: Constant.NUMBER, rowspan: "2"},
    {label: "Total Night", value: "totalNight", type: Constant.NUMBER, rowspan: "2"},
    {label: "Total Revenue", value: "totalRevenue", type: Constant.NUMBER, rowspan: "2"},
    {label: "Total Single Rooms Cc", value: "totalSingleRoomsCc", type: Constant.NUMBER, rowspan: "2"},
    {label: "Total Single Rooms Fc", value: "totalSingleRoomsFc", type: Constant.NUMBER, rowspan: "2"},
    {label: "Total Twin Rooms Cc", value: "totalTwinRoomsCc", type: Constant.NUMBER, rowspan: "2"},
    {label: "Total Vat", value: "totalVat", type: Constant.NUMBER, rowspan: "2"},
    {label: "Transit Duty", value: "transitDuty", type: Constant.NUMBER, rowspan: "2"},
    {label: "Transport Charge", value: "transportCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Twin Room Cc", value: "twinRoomCc", type: Constant.NUMBER, rowspan: "2"},
    {label: "Twin Room Cc Charge", value: "twinRoomCcCharge", type: Constant.NUMBER, rowspan: "2"},
    {label: "Unit Price", value: "unitPrice", type: Constant.NUMBER, rowspan: "2"},
    {label: "Type Room", value: "typeRoom", rowspan: "2"},
  ];
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
      ctype: [InvoiceDocumentTypeEnum.STANDARD],
      invoiceNumber: [, [Validators.maxLength(50), Validators.pattern(PATTERN.STRING_NUMBER1)]],
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
      partnerType: ['HOTEL'],
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

      //table
      tblInvoiceDocumentDtl: this.fb.array([]),

    });

    if (!this.readMode) {
      this.formGroupDetail.controls['airportCode'].valueChanges.subscribe(async (value) => {
        if (value && !this.firstLoad) {
          try {
            await this.spinner.show();
            const [res, res2, res3] = await Promise.all([
              this.contractService.getMarket({marketCode: value.toUpperCase()}),
              this.findContract(),
              this.loadListDocumentParent()
            ]);
            if (res.data) {
              this.formGroupDetail.patchValue({
                contractServiceType: res.data.marketType.toUpperCase(),
              })
            }
          } catch (e) {
            console.log(e);
            this.baseService.showError(MESSAGE.ERROR);
          } finally {
            await this.spinner.hide();
          }
        }
      });

      this.formGroupDetail.controls['partnerType'].valueChanges.subscribe((value) => {
        if (value && !this.firstLoad) {
          this.findContract();
        }
      });

      this.formGroupDetail.controls['periodTo'].valueChanges.subscribe((value) => {
        if (value && !this.firstLoad) {
          this.findContract();
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

  // addRow(table: any, addType: any, init?: any) {
  //   let row: FormGroup = this.fb.group({})
  //   if (addType === 'tblPriceUnit') {
  //     row = this.fb.group({
  //       id: [],
  //       serviceCode: [this.listFeeService[0]?.code, [Validators.required]],
  //       vnaTransId: [, [Validators.maxLength(50)]],
  //       expenseCatgId: [, [Validators.maxLength(50)]],
  //       priceNoTax: [],
  //       taxCode: [,],
  //       taxRate: [],
  //       originalAmount3: [],
  //       priceWithTax: [],
  //       notes: [, [Validators.maxLength(50)]],
  //       bizDocId: [],
  //       fromDate: [this.formGroupDetail.getRawValue().effectiveDate || ''],
  //       toDate: [this.formGroupDetail.getRawValue().expiryDate || ''],
  //       active: [],
  //       serviceName: [this.listFeeService[0]?.name],
  //       serviceUnit: [this.listFeeService[0]?.unit],
  //     });
  //     row.controls['toDate'].setValidators([beforeValidator(row.controls['fromDate'])]);
  //     // row.controls['toDate'].setValidators([beforeValidator(row.controls['fromDate'])]);
  //     row.controls['taxCode'].setValidators([Validators.maxLength(24), Validators.pattern(PATTERN.STRING)]);
  //     init && row.patchValue(init);
  //     table.push(row);
  //     this.dsPriceUnit.data = table.controls;
  //   } else if (addType === 'tblEciLco' || addType === 'tblOvernightStay') {
  //     row = this.fb.group({
  //       id: [,], type: [,], fromHour: ['00:00',], rate: [,], toHour: ['23:59',], active: [,], typeCheck: [,], bizdocId: [,],
  //     });
  //     row.controls['rate'].setValidators(lessThanValidator(2));
  //     row.controls['toHour'].setValidators(timeBeforeValidator(row.controls['fromHour']));
  //     table.push(row);
  //     if (addType === 'tblEciLco') {
  //       init && row.patchValue(init);
  //       this.dsEciLco.data = table.controls;
  //     } else if (addType === 'tblOvernightStay') {
  //       init && row.patchValue(init);
  //       this.dsOvernightStay.data = table.controls;
  //     }
  //   } else if (addType === 'tblDayUse') {
  //     row = this.fb.group({
  //       id: [,], bizdocId: [,], checkinFrom: ['00:00',], checkoutTo: ['23:59',], maxHour: [,], rate: [,], rate1: [,], active: [,],
  //     });
  //     row.controls['checkoutTo'].setValidators(timeBeforeValidator(row.controls['checkinFrom']));
  //     row.controls['maxHour'].setValidators([Validators.min(0), Validators.max(24), Validators.pattern(PATTERN.NUMBER)]);
  //     init && row.patchValue(init);
  //     table.push(row);
  //     this.dsDayUse.data = table.controls;
  //   }
  //   return row;
  // }

  get tblInvoiceDocumentDtl(): FormArray {
    return this.formGroupDetail.get('tblInvoiceDocumentDtl') as FormArray;
  }

  set tblInvoiceDocumentDtl(value: FormArray) {
    this.formGroupDetail.setControl('tblInvoiceDocumentDtl', value);
    this.dsInvoiceDocumentDtl.data = this.tblInvoiceDocumentDtl.controls;
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

  async setReadMode(form: FormGroup) {
    const disableFieldAdd = ['paymentDueDay', 'paymentDueDate', 'bizDocId', 'partnerCode', 'partnerName', 'currency', 'amountFcBeforeVat', 'vatFc', 'amountVndBeforeVat', 'vatVnd', 'totalAmountFc', 'totalAmountVnd', 'version', 'contractServiceType'];
    const disableFieldEdit = ['airportCode', 'paymentDueDay', 'paymentDueDate', 'bizDocId', 'partnerCode', 'partnerName', 'partnerType', 'currency', 'amountFcBeforeVat', 'vatFc', 'amountVndBeforeVat', 'vatVnd', 'totalAmountFc', 'totalAmountVnd', 'version', 'contractServiceType'];
    Object.entries(form.controls).forEach(([k, v]) => {
      if (this.readMode) {
        v.disable();
      } else {
        //add
        if (this.id === 0) {
          if (disableFieldAdd.includes(k)) {
            v.disable();
          }
        }
        //edit
        else {
          if (disableFieldEdit.includes(k)) {
            v.disable();
          }
        }

      }
    });
  }

  calTotal() {
    let jsonValue = this.bodyBuilder();
    let sum = jsonValue.invoiceDocumentDtl?.reduce((prev: any, cur: any) => {
      prev.amountFcBeforeVat += cur.amountFcBeforeVat;
      prev.vatFc += cur.amountFcVat;
      prev.amountVndBeforeVat += cur.amountVndBeforeVat;
      prev.vatVnd += cur.amountVndVat;
      prev.totalAmountFc += cur.amountFcBeforeVat + cur.amountFcVat;
      prev.totalAmountVnd += cur.amountVndBeforeVat + cur.amountVndVat;
      return prev;
    }, {amountFcBeforeVat: 0, vatFc: 0, amountVndBeforeVat: 0, vatVnd: 0, totalAmountFc: 0, totalAmountVnd: 0,});
    this.formGroupDetail.patchValue(sum);
    const inputs = this.totalab.nativeElement.querySelectorAll('input');
    inputs.forEach((inputRef: any) => {
      inputRef.dispatchEvent(new Event('focus'));
      inputRef.dispatchEvent(new Event('blur'));
    });
  }

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

  changeServiceFee(row: any) {
    const data = row.getRawValue();
    row.patchValue({
      serviceName: this.listFeeService.find((s: any) => s.code == data.serviceCode)?.name || null,
      unit: this.listFeeService.find((s: any) => s.code == data.serviceCode)?.unit || null,
    });
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
      let removeNull = this.formGroupDetail.getRawValue().invoiceDocumentDtl?.filter((s: any) => s.serviceCode);
      this.formGroupDetail.patchValue({invoiceDocumentDtl: removeNull});
      this.formGroupDetail.markAllAsTouched();
      if (this.formGroupDetail.invalid) {
        this.findInvalidControls(this.formGroupDetail);
        return;
      }
      const update = !!this.formGroupDetail.getRawValue().id;
      await this.spinner.show();
      let res;
      let req = this.bodyBuilder();
      if (update) {
        res = await this.baseService.update(req);
      } else {
        res = await this.baseService.create(req);
      }
      this.baseService.showSuccess(
        update ? MESSAGE.UPDATE_SUCCESS : MESSAGE.CREATE_SUCCESS,
      );
      this.goBack();
      return res;
    } catch (e: any) {
      console.log(e)
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

  addRow(init?: any) {
    let row: FormGroup = this.fb.group({
      id: ['',],
      serviceCode: ['', [Validators.required]],
      serviceName: ['',],
      unit: ['',],
      periodOccurrence: ['', [Validators.required]],
      nsCode: ['',],
      quantity: ['',],
      unitPrice: ['',],
      amountFcBeforeVat: ['',],
      amountVndBeforeVat: ['',],
      amountFcVat: ['',],
      amountVndVat: ['',],
      vatType: ['',],
      vat: ['',],
    });
    init && row.patchValue(init);
    row.valueChanges.pipe(debounceTime(100)).subscribe(value => {
      this.calTotal();
    });
    this.tblInvoiceDocumentDtl.push(row);
    this.dsInvoiceDocumentDtl.data = this.tblInvoiceDocumentDtl.controls;
    return row;
  }

  async loadListDocumentParent() {
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
    this.formGroupDetail.getRawValue().invoiceDocumentDtl?.forEach((s: any) => {
      this.addRow(s);
    });
    if (!!!id) {
      this.formGroupDetail.patchValue({status: InvoiceDocumentStatusEnum.UNMATCHED});
    }
    this.listDocumentParent = [...this.listDocumentParent,
      {
        id: this.formGroupDetail.getRawValue()._id,
        invoiceNumber: this.formGroupDetail.getRawValue()._invoiceNumber,
        invoiceDate: this.formGroupDetail.getRawValue()._invoiceDate,
      }];
  }

  findContract() {
    this.formGroupDetail.patchValue({
      paymentDueDay: '',
      bizDocId: '',
      partnerCode: '',
      partnerName: '',
      currency: '',
      paymentDueDate: ''
    });
    if (this.formGroupDetail.getRawValue().airportCode &&
      this.formGroupDetail.getRawValue().partnerType &&
      this.formGroupDetail.getRawValue().periodTo
    ) {
      this.baseService.findContract({
        airportCode: this.formGroupDetail.getRawValue().airportCode,
        partnerType: this.formGroupDetail.getRawValue().partnerType,
        periodTo: this.formGroupDetail.getRawValue().periodTo
      }).then((res: any) => {
        if (res.data?.bizDocId) {
          this.formGroupDetail.patchValue({
            paymentDueDay: res.data?.dueDateNumber,
            bizDocId: res.data?.bizDocId,
            partnerCode: res.data?.partnerCode,
            partnerName: res.data?.partnerName,
            currency: res.data?.currency,
          })
          //paymentDueDate
          let invoiceDate = this.formGroupDetail.getRawValue().invoiceDate;
          let _value = (moment(invoiceDate) || invoiceDate)?.add(res.data?.dueDateNumber || 0, 'days')
          this.formGroupDetail.patchValue({
            paymentDueDate: _value?.format('YYYY-MM-DD') || ''
          });
        }
      })
    }
  }

  bodyBuilder() {
    let body = this.formGroupDetail.getRawValue();
    body.invoiceDocumentDtl = this.tblInvoiceDocumentDtl.value;
    return body;
  }
}
