import {DecimalPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {HttpStatusCode} from '@angular/common/http';
import {
  AfterContentInit, Component, EventEmitter, OnInit, Output, inject,
} from '@angular/core';
import {
  FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,
} from '@angular/forms';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import {
  MatAutocomplete, MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {
  MatCheckboxChange, MatCheckboxModule,
} from '@angular/material/checkbox';
import {MatNativeDateModule} from '@angular/material/core';
import {
  MatDatepicker, MatDatepickerModule, MatDatepickerToggle,
} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {
  MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader,
} from '@angular/material/expansion';
import {
  MatError, MatFormFieldModule, MatHint, MatLabel, MatSuffix,
} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatRadioModule} from '@angular/material/radio';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FileUploadModule} from '@iplab/ngx-file-upload';
import {cloneDeep, debounce} from 'lodash';
import {NgxEditorModule} from 'ngx-editor';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {NgxControlError} from 'ngxtension/control-error';
import {ContractService} from 'src/app/crew-trip/core/services/contract-service';
import {NationService} from 'src/app/crew-trip/core/services/nation-service';
import {ServiceFeeService} from 'src/app/crew-trip/core/services/service-fee-service';
import * as ContractLookup from 'src/app/crew-trip/features/contract/contract-lookup';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {SelectionSuggestComponent} from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import {ConfirmDialog} from 'src/app/crew-trip/shared/dialog/confirm-dialog/confirm-dialog';
import {ThousandsSeparatorDirective} from 'src/app/crew-trip/shared/directive/thousand-separator.directive';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {PdfViewerComponent} from 'src/app/crew-trip/shared/pdf-viewer/pdf-viewer.component';
import {
  afterValidator,
  beforeValidator, lessThanValidator, timeAfterValidator, timeBeforeValidator,
} from 'src/app/crew-trip/shared/utils/common';
import {
  DATE_FORMAT_DD_MM_YYYY, MESSAGE, PATTERN,
} from 'src/app/crew-trip/shared/utils/constant';
import {ControlErrorComponent} from "src/app/crew-trip/shared/component/control-error/control-error.component";
import {NgxMatTimepickerComponent, NgxMatTimepickerToggleComponent} from "ngx-mat-timepicker";
import {airportCode} from "src/app/crew-trip/shared/utils/error-message";

@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [FormsModule, InputSizeComponent, MatFormFieldModule, MatAccordion, MatButtonModule, MatCardModule, MatCheckboxModule, MatError, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatInput, MatLabel, MatMenuModule, MatOption, MatPaginatorModule, MatRadioModule, MatSelect, MatSuffix, MatTableModule, NgClass, NgIf, NgxEditorModule, ReactiveFormsModule, MatHint, MatDatepickerModule, MatDatepicker, MatDatepickerToggle, MatNativeDateModule, FileUploadModule, MatAutocomplete, MatAutocompleteTrigger, NgxTrimDirectiveModule, NgxMaterialTimepickerModule, NgForOf, NgxMaterialTimepickerModule, MatTooltipModule, MatDialogModule, NgxControlError, SelectionSuggestComponent, ConfirmDialog, ThousandsSeparatorDirective, ControlErrorComponent,],
  templateUrl: './contract-detail.component.html',
  styleUrl: './contract-detail.component.scss',
  providers: [provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY), DecimalPipe],
})
export class ContractDetailComponent extends CommonComponent implements OnInit, AfterContentInit {
  override baseService = inject(ContractService);
  nationService = inject(NationService);
  serviceFeeService = inject(ServiceFeeService);
  fb = inject(FormBuilder);
  isHiddenPdf: boolean;
  documentId: number;
  id: any;
  viewType: any;
  readMode: any;
  action: any;
  dataObject: any;
  contractObj: any;
  @Output() backStep = new EventEmitter<any>();
  tblAttachedDocument = new MatTableDataSource();
  expandList = new Set<string>(['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6',]);
  formGroupFileUpload!: FormGroup;
  curFile: any;
  showDialogDeleteFile = false;
  listMaNghiepVu: any = [];
  listKhoanMucKhns: any = [];
  listQuocGia: any = [];
  listContractSpec = ContractLookup.ContractSpec;
  listContractType = ContractLookup.ContractType;
  listContractForm = ContractLookup.ContractForm;
  listCheckType = ContractLookup.CheckType;
  listCompetence = ContractLookup.Competence;
  listNegotiateCompetence = ContractLookup.NegotiateCompetence;
  listFieldCode2 = ContractLookup.FieldCode2;
  listBudgetCode = ContractLookup.BudgetCode;
  listFlightGroup = ContractLookup.FlightGroup;
  listStatusUsage = ContractLookup.StatusUsage;
  listBankCharge = ContractLookup.BankCharge;
  marketCodeChangeBrake: any;
  //debounce
  marketCodeChangeDebounce = debounce(async (value: any) => {
    this.formGroupDetail.controls['marketCode'].setValidators([Validators.maxLength(3), Validators.minLength(3),]);
    if (value && !this.marketCodeChangeBrake) {
      try {
        // await this.spinner.show();
        this.formGroupDetail.patchValue({
          marketName: '', nation: '', marketType: '', flightGroup: '', statusUsage: '', carType: '',
        });
        await this.baseService
          .getMarket({marketCode: value.toUpperCase()})
          .then((res) => {
            const fieldContract = ['marketName', 'nationId', 'marketType', 'flightGroup',];
            if (res.status == HttpStatusCode.Ok) {
              //Kiểm tra thị trường nếu là quốc tế mà mã tiền tệ là VND thì báo lỗi
              if (res.data.marketType == 'International' && this.formGroupDetail.getRawValue()['currency'] === 'VND') {
                this.formGroupDetail.controls['marketCode'].setErrors({
                  invalid: true,
                });
                return;
              }
              this.formGroupDetail.patchValue(res.data);
              this.nationSelected(res.data.nationId);
              this.marketCodeChangeBrake = true;

              Object.entries(this.formGroupDetail.controls).forEach(([k, v]) => {
                if (fieldContract.includes(k)) {
                  v.disable();
                }
              },);
            } else if (res.status == HttpStatusCode.NotFound) {
              Object.entries(this.formGroupDetail.controls).forEach(([k, v]) => {
                if (fieldContract.includes(k)) {
                  v.enable();
                }
              },);
            }
          });
      } catch (e) {
      } finally {
        await this.spinner.hide();
      }
    }
  }, 500);
  partnerChangeBrake: any;
  partnerChangeDebounce = debounce(async (value: any) => {
    if (value && !this.partnerChangeBrake) {
      try {
        // await this.spinner.show();
        await this.baseService
          .getPartnerInfo({
            partnerCode: value.toUpperCase(), isHotel: this.formGroupDetail.getRawValue().isHotel, isVehicle: this.formGroupDetail.getRawValue().isVehicle,
          })
          .then((res) => {
            if (res.status == HttpStatusCode.Ok) {
              this.formGroupDetail.patchValue(res.data);
              this.partnerChangeBrake = true;
            }
          });
      } catch (e) {
      } finally {
        await this.spinner.hide();
      }
    }
  }, 500);
  _showDialogDelete = false;
  deleteObj: any;
  dsPriceUnit = new MatTableDataSource<any>([]);
  dsEciLco = new MatTableDataSource<any>([]);
  dsOvernightStay = new MatTableDataSource<any>([]);
  dsDayUse = new MatTableDataSource<any>([]);


  constructor(private readonly numberPipe: DecimalPipe) {
    super();
    this.isHiddenPdf = true;
    window.scrollTo({top: 0, behavior: 'instant'});
    const navigation = this._router.getCurrentNavigation();
    const state = navigation?.extras.state as { data: any };
    let data: any;
    if (state?.data) {
      data = JSON.parse(state.data);
    } else {
      data = JSON.parse(localStorage.getItem('detail')!);
    }
    if (data) {
      this.id = data.bizDocId;
      this.readMode = data.readMode;
      this.action = data.action;
      this.contractObj = data.contractObj;
      this.dataObject = data.dataObject;
      this.viewType = data.viewType;
    } else {
      this._router.navigate(['/category/contract']);
    }
    this.formGroupDetail = this.fb.group({
      doiTuongDichVu: ['', Validators.required],
      contractSpec: [], //tab4
      marketCode: ['', [Validators.minLength(3), Validators.maxLength(3), Validators.pattern(PATTERN.STRING_NUMBER),],],
      marketName: ['', [Validators.maxLength(250)]],
      marketType: [],
      nation: [],
      nationId: [0, Validators.required],
      classification: [],
      flightGroup: [],
      statusUsage: [],
      supplierName: ['', [Validators.maxLength(250)]],
      supplierPhone: ['', [Validators.maxLength(20), Validators.pattern(PATTERN.PHONE)],],
      supplierEmail: ['', [Validators.maxLength(250), Validators.pattern(PATTERN.EMAIL)],],
      email: [],
      carType: ['', [Validators.maxLength(150)]],
      standardCheckIn: ['', [Validators.pattern(PATTERN.HOUR24)]],
      standardCheckOut: [],
      standardCheckout: [],
      notes: ['', [Validators.maxLength(500)]],
      isTaxHotelRevert: [true],
      isTaxCarRevert: [],
      tempp: [],
      id: [],
      bizDocId: [],
      bizDocIdC1: [],
      contractCode: ['', [Validators.maxLength(50)]],
      contractNo: ['', [Validators.maxLength(50)]],
      currency: [],
      currencyCode: [],
      exchangeRate: [],
      signedDate: [],
      effectiveDate: [],
      expiryDate: [],
      contractType: [],
      contractForm: [],
      hdPlRoot: [],
      contractName: ['', [Validators.maxLength(250)]],
      partnerCode: [],
      partnerName: [],
      partnerAddress: [],
      negotiateCompetence: [],
      competence: [],
      employeeSigned: [],
      signedDepartmentName: [],
      budgetDepartmentName: [],
      proceedDepartmentName: [],
      paidDepartmentName: [],
      employeeId: [],
      employeeName: [],
      paymentType: [],
      budgetCode: [],
      fieldCode2: [],
      dueDateNumber: [],
      handoverDate: [],
      documentsList: [],
      bankAccountNoB: ['', [Validators.maxLength(40), Validators.pattern(PATTERN.STRING_NUMBER)],],
      peopleName: ['', [Validators.maxLength(250)]],
      bankNameB: ['', [Validators.maxLength(190)]],
      bankAddressB: ['', [Validators.maxLength(512)]],
      cityB: ['', [Validators.maxLength(45)]],
      bankBranchNameB: ['', [Validators.maxLength(190)]],
      bankLocalCode: ['', [Validators.maxLength(190)]],
      swiftCodeB: ['', [Validators.maxLength(190)]],
      bankCharge: [],
      bankCharge1: [],
      bankAccountNoB1: [[Validators.maxLength(40), Validators.pattern(PATTERN.STRING_NUMBER)],],
      bankNameB1: ['', [Validators.maxLength(190)]],
      swiftCodeB1: ['', [Validators.maxLength(190)]],
      iban: ['', [Validators.maxLength(120)]],
      isHotel: [],
      isVehicle: [],
      hotel: [],
      vehicle: [],
      priceUnitInfo: [],
      priceUnitNotAllDay: [],
      dayUses: [],
      appendixCode: [],
      appendixName: [],
      appendixNo: [],
      signedAppendix: [],
      effectiveAppendix: [],
      expiryAppendix: [],
      notesAppendix: [],

      //table
      tblPriceUnit: this.fb.array([]),
      tblEciLco: this.fb.array([]),
      tblOvernightStay: this.fb.array([]),
      tblDayUse: this.fb.array([]),
    });
    // this.addRow(this.tblPriceUnit);
    // this.addRow(this.tblEciLco);
    // this.addRow(this.tblOvernightStay);
    // this.addRow(this.tblDayUse);
    this.formGroupFileUpload = this.fb.group({
      fileUpload: [],
    });

  }

  get tblPriceUnit(): FormArray {
    return this.formGroupDetail.get('tblPriceUnit') as FormArray;
  }

  set tblPriceUnit(value: FormArray) {
    this.formGroupDetail.setControl('tblPriceUnit', value);
    this.dsPriceUnit.data = this.tblPriceUnit.controls;
  }

  get tblEciLco(): FormArray {
    return this.formGroupDetail.get('tblEciLco') as FormArray;
  }

  set tblEciLco(value: FormArray) {
    this.formGroupDetail.setControl('tblEciLco', value);
    this.dsEciLco.data = this.tblEciLco.controls;
  }

  get tblOvernightStay(): FormArray {
    return this.formGroupDetail.get('tblOvernightStay') as FormArray;
  }

  set tblOvernightStay(value: FormArray) {
    this.formGroupDetail.setControl('tblOvernightStay', value);
    this.dsOvernightStay.data = this.tblOvernightStay.controls;
  }

  get tblDayUse(): FormArray {
    return this.formGroupDetail.get('tblDayUse') as FormArray;
  }

  set tblDayUse(value: FormArray) {
    this.formGroupDetail.setControl('tblDayUse', value);
    this.dsDayUse.data = this.tblDayUse.controls;
  }

  addRow(table: any, addType: any, init?: any) {
    let row: FormGroup = this.fb.group({});
    if (addType === 'tblPriceUnit') {
      row = this.fb.group({
        id: [],
        serviceCode: [this.listFeeService[0]?.code, [Validators.required]],
        vnaTransId: ['', [Validators.maxLength(50)]],
        expenseCatgId: ['', [Validators.maxLength(50)]],
        priceNoTax: [],
        taxCode: [],
        taxRate: [, [Validators.pattern(PATTERN.NUMBER)]],
        originalAmount3: [],
        priceWithTax: [],
        notes: ['', [Validators.maxLength(250)]],
        bizDocId: [],
        fromDate: [this.formGroupDetail.getRawValue().effectiveDate || ''],
        toDate: [this.formGroupDetail.getRawValue().expiryDate || ''],
        active: [true],
        serviceName: [this.listFeeService[0]?.name],
        serviceUnit: [this.listFeeService[0]?.unit],
      });
      row.controls['fromDate'].setValidators([afterValidator(row.controls['toDate']),]);
      row.controls['toDate'].setValidators([beforeValidator(row.controls['fromDate']),]);
      row.controls['taxCode'].setValidators([Validators.maxLength(24), Validators.pattern(PATTERN.STRING),]);
      init && row.patchValue(init);
      if (row.getRawValue().active) {
        table.push(row);
      }
      this.dsPriceUnit.data = table.controls;
    } else if (addType === 'tblEciLco' || addType === 'tblOvernightStay') {
      row = this.fb.group({
        id: [], type: [], fromHour: ['00:00'], rate: [], toHour: ['23:59'], active: [true], typeCheck: [], bizdocId: [],
      });
      row.controls['rate'].setValidators(lessThanValidator(2));
      row.controls['fromHour'].setValidators(timeAfterValidator(row.controls['toHour']),);
      row.controls['toHour'].setValidators(timeBeforeValidator(row.controls['fromHour']),);
      init && row.patchValue(init);
      if (row.getRawValue().active) {
        table.push(row);
      }
      if (addType === 'tblEciLco') {
        this.dsEciLco.data = table.controls;
      } else if (addType === 'tblOvernightStay') {
        this.dsOvernightStay.data = table.controls;
      }
    } else if (addType === 'tblDayUse') {
      row = this.fb.group({
        id: [], bizdocId: [], checkinFrom: ['00:00'], checkoutTo: ['23:59'], maxHour: [], rate: [], rate1: [], active: [true],
      });
      row.controls['checkinFrom'].setValidators(timeAfterValidator(row.controls['checkoutTo']),);
      row.controls['checkoutTo'].setValidators(timeBeforeValidator(row.controls['checkinFrom']),);
      row.controls['maxHour'].setValidators([Validators.min(0), Validators.max(24), Validators.pattern(PATTERN.NUMBER),]);

      init && row.patchValue(init);
      if (row.getRawValue().active) {
        table.push(row);
      }
      this.dsDayUse.data = table.controls;
    }
    return row;
  }

  override async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([this.detail(this.id),
        this.loadListQuocGia(),
        this.loadListFeeService(),
        this.loadListFlightMarket(),
        this.loadListMaNghiepVu(),
        this.loadListKhoanMucKhns()
      ]).then((res) => {
        if (this.formGroupDetail.getRawValue().isHotel && this.formGroupDetail.getRawValue().isVehicle) {
          this.formGroupDetail.patchValue({
            doiTuongDichVu: '3',
          });
        } else if (this.formGroupDetail.getRawValue().isHotel) {
          this.formGroupDetail.patchValue({
            doiTuongDichVu: '1',
          });
        } else if (this.formGroupDetail.getRawValue().isVehicle) {
          this.formGroupDetail.patchValue({
            doiTuongDichVu: '2',
          });
        }
        this.formGroupDetail.patchValue({
          contractType: this.listContractType.find((s) => s.value == this.formGroupDetail.getRawValue().contractType,)?.key,
          contractForm: this.listContractForm.find((s) => s.value == this.formGroupDetail.getRawValue().contractForm,)?.key,
          negotiateCompetence: this.listNegotiateCompetence.find((s) => s.value == this.formGroupDetail.getRawValue().negotiateCompetence,)?.key,
          competence: this.listCompetence.find((s) => s.value == this.formGroupDetail.getRawValue().competence,)?.key,
          fieldCode2: this.listFieldCode2.find((s) => s.value == this.formGroupDetail.getRawValue().fieldCode2,)?.key,
          budgetCode: this.listBudgetCode.find((s) => s.value == this.formGroupDetail.getRawValue().budgetCode,)?.key,
          flightGroup: this.listFlightGroup.find((s) => s.value == this.formGroupDetail.getRawValue().flightGroup,)?.key,
          statusUsage: this.listStatusUsage.find((s) => s.value == this.formGroupDetail.getRawValue().statusUsage,)?.key,
          bankCharge: this.listBankCharge.find((s) => s.value == this.formGroupDetail.getRawValue().bankCharge,)?.key,
          bankCharge1: this.listBankCharge.find((s) => s.value == this.formGroupDetail.getRawValue().bankCharge1,)?.key,
          standardCheckOut: this.formGroupDetail.getRawValue().standardCheckout, //exchangeRate: this.numberPipe.transform(this.formGroupDetail.getRawValue().exchangeRate,),
        });

        this.getPartnerInfo();
        this.tblAttachedDocument = new MatTableDataSource(this.formGroupDetail.getRawValue().documentsList ?? [],);
        this.setReadModeDtl();

        //debounce
        this.marketCodeChangeBrake = true;
        this.partnerChangeBrake = true;
      });
    } catch (e) {
      // console.log(e);
    } finally {
      await this.spinner.hide();
    }
  }

  async ngAfterContentInit() {
    await this.setReadMode(this.formGroupDetail);
  }

  getContractForm(key: string) {
    return this.listContractForm.find((s) => s.key == key)?.value;
  }

  async closeConfirmDeleteFile() {
    this.showDialogDeleteFile = false;
  }

  async _closeConfirmDelete() {
    this._showDialogDelete = false;
  }

  goBack() {
    this.backStep.emit();
    window.scrollTo({top: 0, behavior: 'instant'});
    this._router.navigate(['/category/contract']);
    localStorage.removeItem('detail');
  }

  async actionUpload() {
    if (this.formGroupFileUpload.value.fileUpload.length > 0) {
      try {
        await this.spinner.show();
        const formUpload = new FormData();
        const fileUpload = this.formGroupFileUpload.value.fileUpload[0];
        const bizDocIdBlob = new Blob([this.formGroupDetail.getRawValue().bizDocId], {type: 'application/json'},);
        //validate
        // if(!fileUpload.name.includes(this.COMMON_CONFIG.FILE_ACCEPT.split(',')) || fileUpload.size > 5 * 1048576){
        if (fileUpload.size > 10 * 1048576) {
          this.baseService.showError(MESSAGE.MAX_FILE_SIZE);
          return;
        }
        formUpload.append('file', fileUpload, fileUpload.name);
        formUpload.append('bizDocId', bizDocIdBlob);
        await this.baseService.uploadFile(formUpload).then((res) => {
          if (res.status == HttpStatusCode.Ok) {
            this.tblAttachedDocument.data = [...this.tblAttachedDocument.data, {
              id: res.data.id, fileName: res.data.filename, fileUrl: `source/${res.data.url}`, isManual: true,
            },];
          }
        });
        this.formGroupFileUpload.patchValue({fileUpload: []});
      } catch (e: any) {
        this.baseService.showError(e.error?.error?.file ?? e.error?.error ?? e.error?.error?.code ?? MESSAGE.ERROR,);
      } finally {
        await this.spinner.hide();
      }
    }
  }

  async _doDelete() {
    try {
      if (this.deleteObj?.deleteType == 'file') {
        // await this.baseService
        // 	.deleteFile(this.deleteObj.fileName, this.id)
        // 	.then((res: any) => {
        // 		if (res.status == HttpStatusCode.Ok) {
        // 			this.baseService.showSuccess('Delete file successfully.');
        // 		}
        // 	});
        this.tblAttachedDocument.data = this.tblAttachedDocument.data.filter((item: any) => item.fileName !== this.curFile.fileName,);
      } else if (this.deleteObj?.deleteType == 'tblPriceUnit') {
        this.tblPriceUnit.removeAt(this.deleteObj.index);
        this.dsPriceUnit.data = this.tblPriceUnit.controls;
        this.formGroupDetail.getRawValue().priceUnitInfo.forEach((s: any) => {
          console.log(s.id, this.deleteObj.id)
          if (s.id == this.deleteObj.id) {
            s.active = false;
          }
        });
        console.log(this.formGroupDetail.getRawValue())
      } else if (this.deleteObj.deleteType == 'tblEciLco') {
        this.tblEciLco.removeAt(this.deleteObj.index);
        this.dsEciLco.data = this.tblEciLco.controls;
      } else if (this.deleteObj.deleteType == 'tblOvernightStay') {
        this.tblOvernightStay.removeAt(this.deleteObj.index);
        this.dsOvernightStay.data = this.tblOvernightStay.controls;
      } else if (this.deleteObj.deleteType == 'tblDayUse') {
        this.tblDayUse.removeAt(this.deleteObj.index);
        this.dsDayUse.data = this.tblDayUse.controls;
      }
    } catch (e) {
    } finally {
      this._showDialogDelete = false;
      this.showDialogDeleteFile = false;
    }
  }

  async _confirmDelete(element?: any, index?: any, type?: any) {
    this.deleteObj = {...element.value, deleteType: type, index: index};
    this._showDialogDelete = true;
  }

  async confirmDeleteFile(element: any, id: number) {
    this.curFile = element;
    this.documentId = id;
    this.showDialogDeleteFile = true;
  }

  async deleteFile() {
    await this.baseService
      .deleteFile(this.curFile.fileName, this.id, this.documentId)
      .then((res: any) => {
        if (res.status == HttpStatusCode.Ok) {
          this.baseService.showSuccess('Delete file successfully.');
        }
      });
    this.tblAttachedDocument.data = this.tblAttachedDocument.data.filter((item: any) => item.fileName !== this.curFile.fileName,);
    this.showDialogDeleteFile = false;
  }

  async loadListMaNghiepVu() {
    await this.baseService.listMaNghiepVu().then((res) => {
      if (res.data) {
        this.listMaNghiepVu = res.data;
      }
    });
  }

  async loadListQuocGia() {
    await this.nationService.search({page: 0, limit: 999}).then((res) => {
      if (res.data) {
        this.listQuocGia = res.data.content;
      }
    });
  }

  async loadListKhoanMucKhns() {
    await this.baseService.listKhoanMucKhns().then((res) => {
      if (res.data) {
        this.listKhoanMucKhns = res.data;
      }
    });
  }

  editCellUP(row: any, cell: any) {
    if (!this.readMode) {
      const cur = new Set(row.cellEdit);
      cur.add(cell);
      row.cellEdit = Array.from(cur);
    }
  }

  readCellUP(row: any, cell: any) {
    const cur = new Set(row.cellEdit);
    if (!this.validField(row, cell)) {
      cur.delete(cell);
      row.cellEdit = Array.from(cur);
    } else {
      if (['priceBeforeTax', 'totalVatTax', 'priceAfterTax'].includes(cell)) {
        row[cell] = this.numberPipe.transform(row[cell]);
      }
    }
  }

  checkCellUP(row: any, cell: any) {
    return row.cellEdit?.some((s: any) => s == cell) ?? false;
  }

  filterNation(nationId: number) {
  }

  async nationSelected(event: any) {
    const nation = this.listQuocGia.find((s: any) => s.id === (event?.value || event),);
    this.formGroupDetail.patchValue({
      // nationId: nation?.id,
      nation: nation?.code, marketType: (nation?.code === 'VN' ? 'Domestic' : 'International') || '',
    });
  }

  async getPartnerInfo() {
    await this.baseService
      .getPartnerInfo({
        partnerCode: this.formGroupDetail.getRawValue().partnerCode,
        isHotel: this.formGroupDetail.getRawValue().isHotel,
        isVehicle: this.formGroupDetail.getRawValue().isVehicle,
      })
      .then((res) => {
        if (res.status == HttpStatusCode.Ok && res.data) {
          const data = res.data;
          this.formGroupDetail.patchValue({
            marketType: data.marketType,
            marketCode: data.marketCode,
            marketName: data.marketName,
            nation: data.nation,
            nationId: data.nationId,
            classification: data.classification,
            flightGroup: data.flightGroup,
            statusUsage: data.statusUsage,
            supplierName: data.peopleName,
            supplierPhone: data.phoneNumber,
            supplierEmail: data.email,
            carType: data.carType,
            notes: data.notes,
          });
        }
      });
  }

  async setReadMode(form: FormGroup) {
    const fieldContract = ['marketCode', 'marketName', 'nation', 'classification', 'flightGroup', 'statusUsage', 'supplierName', 'supplierPhone', 'supplierEmail', 'carType', 'standardCheckIn', 'standardCheckOut', 'notes', 'doiTuongDichVu', 'contractSpec', 'marketType',];
    const fieldAnnex = ['partnerName', 'partnerAddress', 'currency', 'hdPlRoot', 'signedDepartmentName', 'budgetDepartmentName', 'proceedDepartmentName', 'paidDepartmentName', 'paymentType', 'budgetCode', 'fieldCode2',];
    Object.entries(form.controls).forEach(([k, v]) => {
      if (this.readMode) {
        v.disable();
      } else if (this.isHD() && !fieldContract.includes(k)) {
        v.disable();
      } else if (this.isPL() && fieldAnnex.includes(k)) {
        v.disable();
      }
    });
  }

  async setReadModeDtl(formArrays?: any) {
    if (!formArrays) {
      formArrays = [this.tblPriceUnit, this.tblEciLco, this.tblOvernightStay, this.tblDayUse,];
    }
    formArrays.forEach((formArray: any) => {
      if (!this.readMode) return;
      const groups = formArray.controls as FormGroup[];
      groups.forEach((fGroup) => {
        Object.values(fGroup.controls).forEach((control) => {
          control.disable();
        });
      });
    });
  }

  override async detail(id: any): Promise<void> {
    if (id) {
      await super.detail(id);
    } else if (this.isPL()) {
      const resContract = await this.baseService.detail(this.contractObj.bizDocId,);
      const bizDocIdContract = cloneDeep(resContract.data.bizDocId);
      ['contractCode', 'contractName', 'contractNo', 'signedDate', 'dueDateNumber', 'handoverDate', 'priceUnitInfo',].forEach((key) => delete resContract.data[key]);
      this.formGroupDetail.patchValue({
        ...(resContract?.data || resContract), hdPlRoot: bizDocIdContract,
      });
    } else {
      this.formGroupDetail.patchValue({});
    }
    const hotel = this.formGroupDetail.getRawValue().hotel;
    const vehicle = this.formGroupDetail.getRawValue().vehicle;
    this.formGroupDetail.patchValue({
      supplierName: hotel ? hotel.hotelName : vehicle?.name || '',
      supplierPhone: hotel ? hotel.phone : vehicle?.phone || '',
      supplierEmail: hotel ? hotel.email : vehicle?.email || '',
    });

    this.formGroupDetail.getRawValue().priceUnitInfo?.forEach((s: any) => {
      s = {
        ...s, //serviceFeeCode: s.serviceCode,
        serviceName: this.listFeeService.find((s1: any) => s1.code === s.serviceCode,)?.name,
        serviceUnit: this.listFeeService.find((s1: any) => s1.code === s.serviceCode,)?.unit,
      };
      this.addRow(this.tblPriceUnit, 'tblPriceUnit', s);
    });

    this.formGroupDetail.getRawValue().priceUnitNotAllDay?.forEach((s: any) => {
      let row: FormGroup = this.fb.group({});
      if (s.type === '1') {
        row = this.addRow(this.tblEciLco, 'tblEciLco', s);
      } else if (s.type === '2') {
        row = this.addRow(this.tblOvernightStay, 'tblOvernightStay', s);
      }
    });

    this.formGroupDetail.getRawValue().dayUses?.forEach((s: any) => {
      const row = this.addRow(this.tblDayUse, 'tblDayUse', s);
    });
  }

  override async save() {
    try {
      //xoa bản ghi trang
      /*let group = this.tblPriceUnit.controls as FormGroup[];
      let filter = group.filter((fGroup) => fGroup.getRawValue().serviceCode);
      this.tblPriceUnit = new FormArray<any>(filter);
      group = this.tblEciLco.controls as FormGroup[];
      filter = group.filter((fGroup) => fGroup.getRawValue().fromHour);
      this.tblEciLco = new FormArray<any>(filter);
      group = this.tblOvernightStay.controls as FormGroup[];
      filter = group.filter((fGroup) => fGroup.getRawValue().fromHour);
      this.tblOvernightStay = new FormArray<any>(filter);
      group = this.tblDayUse.controls as FormGroup[];
      filter = group.filter(fGroup => fGroup.getRawValue().checkinFrom);
      this.tblDayUse = new FormArray<any>(filter);*/

      this.formGroupDetail.patchValue({
        appendixCode: this.formGroupDetail.getRawValue().contractCode,
        appendixName: this.formGroupDetail.getRawValue().contractName,
        appendixNo: this.formGroupDetail.getRawValue().contractNo,
        signedAppendix: this.formGroupDetail.getRawValue().signedDate,
        effectiveAppendix: this.formGroupDetail.getRawValue().effectiveDate,
        expiryAppendix: this.formGroupDetail.getRawValue().expiryDate,
        notesAppendix: this.formGroupDetail.getRawValue().notes,
        currencyCode: this.formGroupDetail.getRawValue().currency,
        isHotel: this.formGroupDetail.getRawValue().doiTuongDichVu == 1 || this.formGroupDetail.getRawValue().doiTuongDichVu == 3,
        isVehicle: this.formGroupDetail.getRawValue().doiTuongDichVu == 2 || this.formGroupDetail.getRawValue().doiTuongDichVu == 3,
        email: this.formGroupDetail.getRawValue().supplierEmail,
      });
      this.formGroupDetailInit = {...this.formGroupDetail.getRawValue()};
      this.formGroupDetail.markAllAsTouched();
      if (this.formGroupDetail.invalid) {
        this.findInvalidControls(this.formGroupDetail);
        return;
      }

      await this.spinner.show();
      let res;
      if (this.action == 'edit') {
        this.formGroupDetail.patchValue({
          id: this.formGroupDetail.getRawValue().bizDocId,
        });
        const body = this.bodyBuilder();
        res = await this.baseService.update(body);
      } else {
        const body = this.bodyBuilder();
        res = await this.baseService.create(body);
      }
      await this.search();
      this.baseService.showSuccess(this.action == 'edit' ? MESSAGE.UPDATE_SUCCESS : MESSAGE.CREATE_SUCCESS,);
      await this.closeDetail();
      if (res === null) {
        this.goBack();
      }
    } catch (e: any) {
      // console.log(e);
      this.baseService.showError(e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR,);
      return e;
    } finally {
      await this.spinner.hide();
    }
  }

  validField(row: any, cell: any, inputRef?: any) {
    if (!inputRef) return 'none';
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
      const from = +row['col612'].replace(':', '');
      const to = +row['col613'].replace(':', '');
      if (to < from) {
        inputRef.control.setErrors({invalid: true});
        return 'Must after from';
      }
    } else if (cell == 'col623') {
      const from = +row['col622'].replace(':', '');
      const to = +row['col623'].replace(':', '');
      if (to < from) {
        inputRef.control.setErrors({invalid: true});
        return 'Must after from';
      }
    } else if (cell == 'col632') {
      const from = +row['col631'].replace(':', '');
      const to = +row['col632'].replace(':', '');
      if (to < from) {
        inputRef.control.setErrors({invalid: true});
        return 'Must after from';
      }
    }
    return '';
  }

  async onChangeHHDV(row: any) {
    const data = row.getRawValue();
    row.patchValue({
      serviceName: this.listFeeService.find((s: any) => s.code == data.serviceCode)?.name || null,
      serviceUnit: this.listFeeService.find((s: any) => s.code == data.serviceCode)?.unit || null,
    });
  }

  serviceTypeChange($event: any) {
    if ($event) {
      if ($event.value == 1) {
        this.formGroupDetail.patchValue({
          isHotel: true, isVehicle: false, isTaxHotelRevert: true, isTaxCarRevert: false,
        });
      } else if ($event.value == 2) {
        this.formGroupDetail.patchValue({
          isHotel: false, isVehicle: true, isTaxCarRevert: true, isTaxHotelRevert: false,
        });
        this.setReadModeDtl([this.tblEciLco, this.tblOvernightStay, this.tblDayUse,]);
      } else if ($event.value == 3) {
        this.formGroupDetail.patchValue({
          isHotel: true, isVehicle: true, isTaxCarRevert: true, isTaxHotelRevert: true,
        });
      }
      this.getPartnerInfo();
    }
  }

  onChangeTaxHotel(event: MatCheckboxChange) {
    if (event.checked) {
      this.formGroupDetail.patchValue({
        isTaxHotelRevert: true,
      });
    } else {
      this.formGroupDetail.patchValue({
        isTaxHotelRevert: false,
      });
    }
  }

  onChangeTaxCar(event: MatCheckboxChange) {
    if (event.checked) {
      this.formGroupDetail.patchValue({
        isTaxCarRevert: true,
      });
    } else {
      this.formGroupDetail.patchValue({
        isTaxCarRevert: false,
      });
    }
  }

  pdfViewer(url: string) {
    const dialogRef = this.dialog.open(PdfViewerComponent, {
      height: '90vh', minHeight: '90vh', minWidth: '80vw', data: {pdfSrc: url},
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  isHD() {
    return this.viewType === 'HD';
  }

  isPL() {
    return this.viewType === 'PL';
  }

  isHotel() {
    return this.formGroupDetail.getRawValue().isHotel;
  }

  isVehicle() {
    return this.formGroupDetail.getRawValue().isVehicle;
  }

  bodyBuilder() {
    let body = this.formGroupDetail.getRawValue();
    body.priceUnitNotAllDay = {
      type1: this.tblEciLco.value, type2: this.tblOvernightStay.value,
    };
    body.dayUses = this.tblDayUse.value[0] || null;
    body.dayUses && (body.dayUses.lengthTime = body.dayUses?.maxHour || 0);
    let priceUnitInfoInactive = this.formGroupDetail.getRawValue().priceUnitInfo?.filter((s: any) => s.active == false) || [];
    body.priceUnitInfo = [...this.tblPriceUnit.value, ...priceUnitInfoInactive];
    body.priceUnitInfo.forEach((s: any) => {
      s.priceBeforeTax = s.priceNoTax;
      s.priceAfterTax = s.priceWithTax;
      s.serviceFeeCode = s.serviceCode;
      s.codeNghiepVu = s.vnaTransId;
      s.codeKHNS = s.expenseCatgId;
      s.totalVatTax = s.originalAmount3;
    });
    body.isTaxHotel = body.isTaxHotelRevert;
    body.isTaxVehicle = body.isTaxCarRevert;
    // console.log(body, 'body');
    return body;
  }

  fieldUpdateValueAndValidity(row: FormGroup) {
    Object.values(row.controls).forEach((control) => {
      control.updateValueAndValidity()
    });
  }

  airportCodeChange(value: any) {
    this.listFlightMarket = this.listFlightMarket.filter((s: any) => s.includes(value.toUpperCase()));
  }

  airportCodeForcus() {
    this.listFlightMarket = cloneDeep(this.listFlightMarketAll)
  }
}
