import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  LOCALE_ID,
  model,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
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
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule} from '@angular/material/core';
import {FileUploadModule} from "@iplab/ngx-file-upload";
import {DATE_FORMAT_DD_MM_YYYY, LOCALE, MESSAGE} from "src/app/crew-trip/shared/utils/constant";
import {ClickOutside} from "ngxtension/click-outside";
import {HttpStatusCode} from "@angular/common/http";
import {NationService} from "src/app/crew-trip/core/services/nation-service";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {NgxMatTimepickerFieldComponent} from "ngx-mat-timepicker";
import {debounce} from 'lodash';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import * as ContractLookup from "src/app/crew-trip/features/contract/contract-lookup";
import {NegotiateCompetence} from "src/app/crew-trip/features/contract/contract-lookup";
import {CheckType} from "src/app/crew-trip/features/contract/contract-lookup";


@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [DataTransformPipe, FormsModule, InputSizeComponent, MatAccordion, MatButtonModule, MatCardModule, MatCheckboxModule, MatError, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle, MatFormField, MatInput, MatLabel, MatMenuModule, MatOption, MatPaginatorModule, MatPrefix, MatRadioModule, MatSelect, MatSuffix, MatTab, MatTabGroup, MatTableModule, NgClass, NgIf, NgxEditorModule, ReactiveFormsModule, RouterLink, TitleCasePipe, MatHint, MatDatepickerModule, MatDatepicker, MatDatepickerToggle, MatNativeDateModule, FileUploadModule, ClickOutside, MatAutocomplete, MatAutocompleteTrigger, NgxTrimDirectiveModule, NgxMaterialTimepickerModule, NgxMatTimepickerFieldComponent, NgForOf, NgxMaterialTimepickerModule],
  templateUrl: './contract-detail.component.html',
  styleUrl: './contract-detail.component.scss',
  providers: [
    provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),

  ]
})


export class ContractDetailComponent extends CommonComponent implements OnInit {
  override baseService = inject(ContractService);
  nationService = inject(NationService);
  fb = inject(FormBuilder);

  //control
  @ViewChild('nationName') nationName: ElementRef<HTMLInputElement>;
  filteredNation = model<any[]>([]);

  //variable
  @Input() id: any;
  @Input() viewType: any;
  @Input() readMode: any;
  @Input() dataObject: any;
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
  listContractSpec = ContractLookup.ContractSpec;
  listContractType = ContractLookup.ContractType;
  listContractForm = ContractLookup.ContractForm;
  listCheckType = ContractLookup.CheckType;
  listCompetence = ContractLookup.Competence;
  listNegotiateCompetence = ContractLookup.NegotiateCompetence;
  //debounce
  brake: any;
  marketCodeChangeDebounce: any;
  protected readonly LOCALE = LOCALE;

  // private filesControl = new FormControl(null, );
  constructor() {
    super();
    window.scrollTo(0, 0);
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
      supplierEmail: [],
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
      // deletePriceUnitInfo: [],
      iban: [],
      appendixCode: [],
      appendixName: [],
      appendixNo: [],
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
        this.loadListQuocGia(),
        this.setReadMode(this.formGroupDetail)
      ]).then(() => {
        if (this.formGroupDetail.getRawValue().isHotel && this.formGroupDetail.getRawValue().isVehicle) {
          this.formGroupDetail.patchValue({doiTuongDichVu: '3'});
        } else if (this.formGroupDetail.getRawValue().isHotel) {
          this.formGroupDetail.patchValue({doiTuongDichVu: '1'});
        } else if (this.formGroupDetail.getRawValue().isVehicle) {
          this.formGroupDetail.patchValue({doiTuongDichVu: '2'});
        }
        this.formGroupDetail.patchValue(
          {
            //fix tam
            swiftCodeB1: '12345',
            //
            contractType: this.listContractType.find(s => s.value == this.formGroupDetail.getRawValue().contractType)?.key,
            contractForm: this.listContractForm.find(s => s.value == this.formGroupDetail.getRawValue().contractForm)?.key,
            negotiateCompetence: this.listNegotiateCompetence.find(s => s.value == this.formGroupDetail.getRawValue().negotiateCompetence)?.key,
            competence: this.listCompetence.find(s => s.value == this.formGroupDetail.getRawValue().competence)?.key,
            standardCheckOut: this.formGroupDetail.getRawValue().standardCheckout
          });

        this.getPartnerInfo();
        this.tblAttachedDocument = new MatTableDataSource(this.formGroupDetail.getRawValue().documentsList ?? []);

        let priceUnitInfo = this.formGroupDetail.getRawValue().priceUnitInfo.map((s: any) => ({
          ...s,
          serviceFeeCode: s.serviceCode
        }));
        this.tblUnitPrice = new MatTableDataSource(priceUnitInfo);

        //debounce
        this.brake = true;
        this.marketCodeChangeDebounce = debounce(async (value: any) => {
          if (value && !this.brake) {
            try {
              await this.spinner.show();
              await this.baseService.getMarket({marketCode: value.toUpperCase()}).then(res => {
                if (res.status == HttpStatusCode.Ok) {
                  // delete res.data.marketCode;
                  this.formGroupDetail.patchValue(res.data);
                  this.brake = true;
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
  }

  async actionUpload() {
    if (this.formGroupFileUpload.value.fileUpload.length > 0) {
      try {
        await this.spinner.show();
        let formUpload = new FormData();
        let fileUpload = this.formGroupFileUpload.value.fileUpload[0];
        let bizDocIdBlob = new Blob([this.formGroupDetail.getRawValue().bizDocId], {type: 'application/json'});
        //validate
        // if(!fileUpload.name.includes(this.COMMON_CONFIG.FILE_ACCEPT.split(',')) || fileUpload.size > 5 * 1048576){
        if (fileUpload.size > 5 * 1048576) {
          this.baseService.showError(MESSAGE.MAX_FILE_SIZE);
          return;
        }
        formUpload.append('file', fileUpload, fileUpload.name);
        formUpload.append('bizDocId', bizDocIdBlob);
        await this.baseService.uploadFile(formUpload).then(res => {
          if (res.status == HttpStatusCode.Ok) {
            this.tblAttachedDocument.data = [...this.tblAttachedDocument.data, {
              // documentType: this.formGroupFileUpload.value.documentType == 1 ? 'Contract/annex or appendix' : 'Other documents of contract',
              fileName: fileUpload.name,
              fileUrl: res.data,
              isManual: true
            }];
          }
        });
        this.formGroupFileUpload.patchValue({fileUpload: []})
      } catch (e: any) {
        console.log(e);
        this.baseService.showError((e.error?.error?.file) ?? (e.error?.error) ?? (e.error?.error?.code) ?? MESSAGE.ERROR);
      } finally {
        await this.spinner.hide();
      }
    }
  }

  async addUnitPrice() {
    this.tblUnitPrice.data = [...this.tblUnitPrice.data, {action: 'ADD'}];
  }

  async addTbl61() {
    this.tbl61.data = [...this.tbl61.data, {action: 'ADD'}];
  }

  async addTbl62() {
    this.tbl62.data = [...this.tbl62.data, {action: 'ADD'}];
  }

  async addTbl63() {
    this.tbl63.data = [...this.tbl63.data, {action: 'ADD'}];
  }

  async editUnitPrice(index: any) {
  }

  async saveUnitPrice(index: any) {
  }

  async deleteUnitPrice(index: any) {
  }

  async cancelUnitPrice(index: any) {
  }

  async confirmDeleteFile(element: any) {
    this.curFile = element;
    this.showDialogDeleteFile = true;
  }

  async deleteFile() {
    await this.baseService.deleteFile(this.curFile.fileName, this.id).then((res: any) => {
      if (res.status == HttpStatusCode.Ok) {
        this.baseService.showSuccess("Delete file successfully.");
      }
    });
    this.tblAttachedDocument.data = this.tblAttachedDocument.data.filter((item: any) => item.fileName !== this.curFile.fileName);
    this.showDialogDeleteFile = false;
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

  async loadListKhoanMucKhns() {
    await this.baseService.listKhoanMucKhns().then(res => {
      if (res.data) {
        this.listKhoanMucKhns = res.data;
      }
    });
  }

  editCellUP(row: any, cell: any) {
    let cur = new Set(row.cellEdit);
    cur.add(cell);
    row.cellEdit = Array.from(cur);
  }

  readCellUP(row: any, cell: any) {
    let cur = new Set(row.cellEdit);
    if (!this.validField(row,cell)) {
      cur.delete(cell);
      row.cellEdit = Array.from(cur);
    }
  }

  checkCellUP(row: any, cell: any) {
    return row.cellEdit?.some((s: any) => s == cell) ?? false;
  }

  async test() {
    console.log(this.formGroupDetail.getRawValue(), 'this.formGroupDetail.getRawValue()')
    console.log(this.tblUnitPrice.data)
  }

  async filterNation() {

  }

  async nationSelected(event: any) {
    let nation = this.listQuocGia.find((s: any) => s.id === event.option.value);
    this.formGroupDetail.patchValue({nationId: nation?.id, nation: nation?.engName});
  }

  async getPartnerInfo() {
    await this.baseService.getPartnerInfo({
      partnerCode: this.formGroupDetail.getRawValue().partnerCode,
      isHotel: this.formGroupDetail.getRawValue().isHotel,
      isVehicle: this.formGroupDetail.getRawValue().isVehicle
    }).then(res => {
      if (res.status == HttpStatusCode.Ok && res.data) {
        let data = res.data;
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
        })
      }
    });
  }

  async setReadMode(form: FormGroup) {
    let fieldContract = ['marketCode', 'marketName', 'nation',
      'classification', 'flightGroup', 'statusUsage', 'supplierName',
      'supplierPhone', 'supplierEmail', 'carType', 'standardCheckIn',
      'standardCheckOut', 'notes',
      'doiTuongDichVu', 'contractSpec'];
    let fieldAnnex = [''];
    Object.entries(form.controls).forEach(([k, v]) => {
      if (this.readMode) {
        v.disable();
      } else if (this.viewType == 'HD' && !fieldContract.includes(k)) {
        v.disable();
      }
    });
  }

  override async detail(id: any): Promise<void> {
    if (id) {
      await super.detail(id);
    } else {
      this.formGroupDetail.patchValue({})
    }
  }

  override async save() {
    this.formGroupDetail.patchValue({
      id: this.formGroupDetail.getRawValue().bizDocId,
      appendixCode: this.formGroupDetail.getRawValue().contractCode,
      appendixName: this.formGroupDetail.getRawValue().contractName,
      appendixNo: this.formGroupDetail.getRawValue().bizDocId,
      isHotel: (this.formGroupDetail.getRawValue().doiTuongDichVu == 1 || this.formGroupDetail.getRawValue().doiTuongDichVu == 3),
      isVehicle: (this.formGroupDetail.getRawValue().doiTuongDichVu == 2 || this.formGroupDetail.getRawValue().doiTuongDichVu == 3),
      email: this.formGroupDetail.getRawValue().supplierEmail,
      priceUnitInfo: this.tblUnitPrice.data,
      insertPriceUnitInfo: this.tblUnitPrice.data.filter((s: any) => s.action == 'ADD'),
      updatePriceUnitInfo: this.tblUnitPrice.data.filter((s: any) => s.action != 'ADD'),
      // deletePriceUnitInfo: this.tblUnitPrice.data,
    });
    this.formGroupDetailInit = {...this.formGroupDetail.getRawValue()};
    let res = await super.save();
    if (res == null) {
      this.goBack();
    }
  }


  validField(row:any,cell:any,inputRef?:any){
    if(!row[cell]){
      return 'Not empty';
    }
    else if(cell == 'col614' && row[cell]>2){
      inputRef.control.setErrors({ invalid: true });
      return 'Must less than 2';
    }
    return '';
  }
}
