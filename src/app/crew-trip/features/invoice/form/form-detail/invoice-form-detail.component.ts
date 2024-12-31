import {Component, ElementRef, EventEmitter, inject, Input, model, OnInit, Output, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgClass, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
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
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {MatRadioModule} from '@angular/material/radio';
import {ContractService} from 'src/app/crew-trip/core/services/contract-service';
import {MatDatepicker, MatDatepickerModule, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {FileUploadModule} from '@iplab/ngx-file-upload';
import {DATE_FORMAT_DD_MM_YYYY, LOCALE, MESSAGE} from 'src/app/crew-trip/shared/utils/constant';
import {ClickOutside} from 'ngxtension/click-outside';
import {HttpStatusCode} from '@angular/common/http';
import {NationService} from 'src/app/crew-trip/core/services/nation-service';
import {MatAutocomplete, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {NgxMatTimepickerFieldComponent} from 'ngx-mat-timepicker';
import {debounce, isEqual, remove} from 'lodash';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import * as ContractLookup from 'src/app/crew-trip/features/contract/contract-lookup';
import {ServiceFeeService} from 'src/app/crew-trip/core/services/service-fee-service';


@Component({
  selector: 'app-invoice-form-detail',
  standalone: true,
  imports: [DataTransformPipe, FormsModule, InputSizeComponent, MatAccordion, MatButtonModule, MatCardModule, MatCheckboxModule, MatError, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle, MatFormField, MatInput, MatLabel, MatMenuModule, MatOption, MatPaginatorModule, MatPrefix, MatRadioModule, MatSelect, MatSuffix, MatTab, MatTabGroup, MatTableModule, NgClass, NgIf, NgxEditorModule, ReactiveFormsModule, RouterLink, TitleCasePipe, MatHint, MatDatepickerModule, MatDatepicker, MatDatepickerToggle, MatNativeDateModule, FileUploadModule, ClickOutside, MatAutocomplete, MatAutocompleteTrigger, NgxTrimDirectiveModule, NgxMaterialTimepickerModule, NgxMatTimepickerFieldComponent, NgForOf, NgxMaterialTimepickerModule],
  templateUrl: './invoice-form-detail.component.html',
  styleUrl: './invoice-form-detail.component.scss',
  providers: [provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),

  ]
})


export class InvoiceFormDetailComponent extends CommonComponent implements OnInit {
  override baseService = inject(ContractService);
  nationService = inject(NationService);
  serviceFeeService = inject(ServiceFeeService);
  fb = inject(FormBuilder);

  //control
  @ViewChild('nationName') nationName: ElementRef<HTMLInputElement>;
  filteredNation = model<any[]>([]);

  //variable
  @Input() id: any;
  @Input() viewType: any;
  @Input() readMode: any;
  @Input() action: any;
  @Input() dataObject: any;
  @Input() contractObj: any;
  @Output() backStep = new EventEmitter<any>();

  tblAttachedDocument = new MatTableDataSource();
  tblUnitPrice = new MatTableDataSource();
  tbl61 = new MatTableDataSource();
  tbl62 = new MatTableDataSource();
  tbl63 = new MatTableDataSource();
  expandList = new Set<string>(['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6']);
  formGroupFileUpload!: FormGroup;
  curFile: any;
  showDialogDeleteFile = false;
  listMaNghiepVu: any = [];
  listKhoanMucKhns: any = [];
  listQuocGia: any = [];
  listHHDV: any = [];
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
  //debounce
  marketCodeChangeDebounce: any;
  marketCodeChangeBrake: any;
  partnerChangeDebounce: any;
  partnerChangeBrake: any;
  _showDialogDelete = false;
  confirmDeleteMessage = '';
  deleteObj: any;
  deletePriceUnitInfo: any = [];
  deleteNotAllDay: any = [];
  deleteDayUse: any = [];
  protected readonly LOCALE = LOCALE;

  // private filesControl = new FormControl(null, );
  constructor() {
    super();
    window.scrollTo({top: 0, behavior: 'instant'});
    this.formGroupDetail = this.fb.group({
      doiTuongDichVu: [],
      contractSpec: [],

      //tab4
      marketCode: [],
      marketName: [],
      marketType: [],
      nation: [],
      nationId: [],
      classification: [],
      flightGroup: [],
      statusUsage: [],
      supplierName: [],
      supplierPhone: [],
      supplierEmail: [, [Validators.email]],
      email: [],
      carType: [],
      standardCheckIn: [],
      standardCheckOut: [],
      standardCheckout: [],
      notes: [],

      tempp: [],
      id: [],
      bizDocId: [],
      bizDocIdC1: [],
      contractCode: [],
      contractNo: [],
      currency: [],
      currencyCode: [],
      exchangeRate: [],
      signedDate: [],
      effectiveDate: [],
      expiryDate: [],
      contractType: [],
      contractForm: [],
      hdPlRoot: [],
      contractName: [],
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
      bankAccountNoB: [],
      peopleName: [],
      bankNameB: [],
      bankAddressB: [],
      cityB: [],
      bankBranchNameB: [],
      bankLocalCode: [],
      swiftCodeB: [],
      bankCharge: [],
      bankCharge1: [],
      bankAccountNoB1: [],
      bankNameB1: [],
      swiftCodeB1: [],
      isHotel: [],
      isVehicle: [],
      hotel: [],
      vehicle: [],
      priceUnitInfo: [],
      insertPriceUnitInfo: [],
      updatePriceUnitInfo: [],
      deletePriceUnitInfo: [],
      priceUnitNotAllDay: [],
      priceUnitInfoRequests: [],
      priceNotAllDayRequests: [],
      insertNotAllDay: [],
      updateNotAllDay: [],
      deleteNotAllDay: [],
      dayUses: [],
      insertDayUse: [],
      updateDayUse: [],
      deleteDayUse: [],
      iban: [],

      appendixCode: [],
      appendixName: [],
      appendixNo: [],
      signedAppendix: [],
      effectiveAppendix: [],
      expiryAppendix: [],
      notesAppendix: [],
    });
    this.formGroupFileUpload = this.fb.group({
      fileUpload: []
    });
  }

  override async ngOnInit() {
    try {
      await this.spinner.show();
      await Promise.all([this.detail(this.id), // this.loadListKhoanMucKhns(),
        // this.loadListMaNghiepVu(),
        // this.loadListQuocGia(),
        // this.loadListHHDV(),
        this.setReadMode(this.formGroupDetail)
      ]).then(() => {
        if (this.formGroupDetail.getRawValue().isHotel && this.formGroupDetail.getRawValue().isVehicle) {
          this.formGroupDetail.patchValue({doiTuongDichVu: '3'});
        } else if (this.formGroupDetail.getRawValue().isHotel) {
          this.formGroupDetail.patchValue({doiTuongDichVu: '1'});
        } else if (this.formGroupDetail.getRawValue().isVehicle) {
          this.formGroupDetail.patchValue({doiTuongDichVu: '2'});
        } else {
          this.formGroupDetail.patchValue({doiTuongDichVu: '1'});
        }
        this.formGroupDetail.patchValue({
          //fix tam
          swiftCodeB1: '12345',
          //
          contractType: this.listContractType.find(s => s.value == this.formGroupDetail.getRawValue().contractType)?.key,
          contractForm: this.listContractForm.find(s => s.value == this.formGroupDetail.getRawValue().contractForm)?.key,
          negotiateCompetence: this.listNegotiateCompetence.find(s => s.value == this.formGroupDetail.getRawValue().negotiateCompetence)?.key,
          competence: this.listCompetence.find(s => s.value == this.formGroupDetail.getRawValue().competence)?.key,
          fieldCode2: this.listFieldCode2.find(s => s.value == this.formGroupDetail.getRawValue().fieldCode2)?.key,
          budgetCode: this.listBudgetCode.find(s => s.value == this.formGroupDetail.getRawValue().budgetCode)?.key,
          flightGroup: this.listFlightGroup.find(s => s.value == this.formGroupDetail.getRawValue().flightGroup)?.key,
          statusUsage: this.listStatusUsage.find(s => s.value == this.formGroupDetail.getRawValue().statusUsage)?.key,
          standardCheckOut: this.formGroupDetail.getRawValue().standardCheckout
        });

        this.getPartnerInfo();
        this.tblAttachedDocument = new MatTableDataSource(this.formGroupDetail.getRawValue().documentsList ?? []);

        const priceUnitInfo = this.formGroupDetail.getRawValue()?.priceUnitInfo?.map((s: any) => ({
          ...s,
          serviceFeeCode: s.serviceCode,
          serviceFeeName: this.listHHDV.find((s: any) => s.serviceFeeCode === s.serviceFeeCode)?.name,
          serviceFeeUnit: this.listHHDV.find((s: any) => s.serviceFeeCode === s.serviceFeeCode)?.unit,
        }));
        this.tblUnitPrice = new MatTableDataSource(priceUnitInfo);

        //debounce
        this.marketCodeChangeBrake = true;
        this.marketCodeChangeDebounce = debounce(async (value: any) => {
          if (value && !this.marketCodeChangeBrake) {
            try {
              await this.spinner.show();
              await this.baseService.getMarket({marketCode: value.toUpperCase()}).then(res => {
                if (res.status == HttpStatusCode.Ok) {
                  // delete res.data.marketCode;
                  this.formGroupDetail.patchValue(res.data);
                  this.marketCodeChangeBrake = true;
                }
              });
            } catch (e) {
              console.log(e);
            } finally {
              await this.spinner.hide();
            }
          }
        }, 1000);

        this.partnerChangeBrake = true;
        this.partnerChangeDebounce = debounce(async (value: any) => {
          if (value && !this.partnerChangeBrake) {
            try {
              await this.spinner.show();
              await this.baseService.getPartnerInfo({
                partnerCode: value.toUpperCase(),
                isHotel: this.formGroupDetail.getRawValue().isHotel,
                isVehicle: this.formGroupDetail.getRawValue().isVehicle
              }).then(res => {
                if (res.status == HttpStatusCode.Ok) {
                  this.formGroupDetail.patchValue(res.data);
                  this.partnerChangeBrake = true;
                }
              });
            } catch (e) {
              console.log(e);
            } finally {
              await this.spinner.hide();
            }
          }
        }, 1000);
      });
    } catch (e) {
      console.log(e);
    } finally {
      await this.spinner.hide();
    }
  }

  goBack() {
    this.backStep.emit();
    window.scrollTo({top: 0, behavior: 'instant'});
  }

  async closeConfirmDeleteFile() {
    this.showDialogDeleteFile = false;
  }

  async loadListMaNghiepVu() {
    await this.baseService.listMaNghiepVu().then(res => {
      if (res.data) {
        this.listMaNghiepVu = res.data;
      }
    });
  }

  async loadListQuocGia() {
    await this.nationService.search({page: 0, limit: 99999}).then(res => {
      if (res.data) {
        this.listQuocGia = res.data.content;
      }
    });
  }

  async loadListHHDV() {
    await this.serviceFeeService.search({page: 0, limit: 99999}).then(res => {
      if (res.data) {
        this.listHHDV = res.data.content;
      }
    });
  }

  async loadListKhoanMucKhns() {
    await this.baseService.listKhoanMucKhns().then(res => {
      if (res.data) {
        this.listKhoanMucKhns = res.data;
      }
    });
  }


  async nationSelected(event: any) {
    const nation = this.listQuocGia.find((s: any) => s.id === event.option.value);
    this.formGroupDetail.patchValue({nationId: nation?.id, nation: nation?.engName});
  }

  async getPartnerInfo() {
    await this.baseService.getPartnerInfo({
      partnerCode: this.formGroupDetail.getRawValue().partnerCode,
      isHotel: this.formGroupDetail.getRawValue().isHotel,
      isVehicle: this.formGroupDetail.getRawValue().isVehicle
    }).then(res => {
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
    Object.entries(form.controls).forEach(([k, v]) => {
      if (this.readMode) {
        v.disable();
      }
    });
  }
}
