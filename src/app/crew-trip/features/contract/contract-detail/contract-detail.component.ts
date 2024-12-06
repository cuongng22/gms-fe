import {Component, ElementRef, EventEmitter, inject, Input, model, OnInit, Output, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgClass, NgIf, TitleCasePipe} from '@angular/common';
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
import {MatNativeDateModule} from '@angular/material/core';
import {FileUploadModule} from "@iplab/ngx-file-upload";
import {LOCALE, MESSAGE} from "src/app/crew-trip/shared/utils/constant";
import {ClickOutside} from "ngxtension/click-outside";
import {HttpStatusCode} from "@angular/common/http";
import {NationService} from "src/app/crew-trip/core/services/nation-service";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {NgxMatTimepickerFieldComponent} from "ngx-mat-timepicker";
import {debounce} from 'lodash';


@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [DataTransformPipe, FormsModule, InputSizeComponent, MatAccordion, MatButtonModule, MatCardModule, MatCheckboxModule, MatError, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle, MatFormField, MatInput, MatLabel, MatMenuModule, MatOption, MatPaginatorModule, MatPrefix, MatRadioModule, MatSelect, MatSuffix, MatTab, MatTabGroup, MatTableModule, NgClass, NgIf, NgxEditorModule, ReactiveFormsModule, RouterLink, TitleCasePipe, MatHint, MatDatepickerModule, MatDatepicker, MatDatepickerToggle, MatNativeDateModule, FileUploadModule, ClickOutside, MatAutocomplete, MatAutocompleteTrigger, NgxTrimDirectiveModule, NgxMaterialTimepickerModule, NgxMatTimepickerFieldComponent],
  templateUrl: './contract-detail.component.html',
  styleUrl: './contract-detail.component.scss',
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

  //debounce
  brake: any;
  marketCodeChangeDebounce: any;
  protected readonly LOCALE = LOCALE;

  // private filesControl = new FormControl(null, );
  constructor() {
    super();
    window.scrollTo(0, 0);
  }

  override async ngOnInit() {
    try {
      //declare
      this.formGroupDetail = this.fb.group({
        doiTuongDichVu: [{value: '', disabled: this.readMode}],
        phanLoaiHopDong: [{value: '', disabled: this.readMode}],

        //tab4
        marketCode: [{value: '', disabled: this.readMode}],
        marketName: [{value: '', disabled: this.readMode}],
        nation: [{value: '', disabled: this.readMode}],
        classification: [{value: '', disabled: this.readMode}],
        flightGroup: [{value: '', disabled: this.readMode}],
        statusUsage: [{value: '', disabled: this.readMode}],
        supplierName: [{value: '', disabled: this.readMode}],
        supplierPhone: [{value: '', disabled: this.readMode}],
        supplierEmail: [{value: '', disabled: this.readMode}],
        carType: [{value: '', disabled: this.readMode}],
        standardCheckIn: [{value: '', disabled: this.readMode}],
        standardCheckOut: [{value: '', disabled: this.readMode}],
        notes: [{value: '', disabled: this.readMode}],

        tempp: [{value: '', disabled: this.readMode}],
        id: [{value: '', disabled: this.readMode}],
        bizDocId: [{value: '', disabled: this.readMode}],
        contractCode: [{value: '', disabled: this.readMode}],
        contractNo: [{value: '', disabled: this.readMode}],
        currency: [{value: '', disabled: this.readMode}],
        exchangeRate: [{value: '', disabled: this.readMode}],
        signedDate: [{value: '', disabled: this.readMode}],
        effectiveDate: [{value: '', disabled: this.readMode}],
        expiryDate: [{value: '', disabled: this.readMode}],
        contractType: [{value: '', disabled: this.readMode}],
        contractForm: [{value: '', disabled: this.readMode}],
        hdPlRoot: [{value: '', disabled: this.readMode}],
        contractName: [{value: '', disabled: this.readMode}],
        partnerCode: [{value: '', disabled: this.readMode}],
        partnerName: [{value: '', disabled: this.readMode}],
        partnerAddress: [{value: '', disabled: this.readMode}],
        negotiateCompetence: [{value: '', disabled: this.readMode}],
        competence: [{value: '', disabled: this.readMode}],
        employeeSigned: [{value: '', disabled: this.readMode}],
        signedDepartmentName: [{value: '', disabled: this.readMode}],
        budgetDepartmentName: [{value: '', disabled: this.readMode}],
        proceedDepartmentName: [{value: '', disabled: this.readMode}],
        paidDepartmentName: [{value: '', disabled: this.readMode}],
        employeeId: [{value: '', disabled: this.readMode}],
        employeeName: [{value: '', disabled: this.readMode}],
        paymentType: [{value: '', disabled: this.readMode}],
        budgetCode: [{value: '', disabled: this.readMode}],
        fieldCode2: [{value: '', disabled: this.readMode}],
        dueDateNumber: [{value: '', disabled: this.readMode}],
        handoverDate: [{value: '', disabled: this.readMode}],
        documentsList: [{value: '', disabled: this.readMode}],
        bankAccountNoB: [{value: '', disabled: this.readMode}],
        peopleName: [{value: '', disabled: this.readMode}],
        bankNameB: [{value: '', disabled: this.readMode}],
        bankAddressB: [{value: '', disabled: this.readMode}],
        cityB: [{value: '', disabled: this.readMode}],
        bankBranchNameB: [{value: '', disabled: this.readMode}],
        bankLocalCode: [{value: '', disabled: this.readMode}],
        swiftCodeB: [{value: '', disabled: this.readMode}],
        bankCharge: [{value: '', disabled: this.readMode}],
        bankCharge1: [{value: '', disabled: this.readMode}],
        bankAccountNoB1: [{value: '', disabled: this.readMode}],
        bankNameB1: [{value: '', disabled: this.readMode}],
        swiftCodeB1: [{value: '', disabled: this.readMode}],
        isHotel: [{value: '', disabled: this.readMode}],
        isVehicle: [{value: '', disabled: this.readMode}],
        hotel: [{value: '', disabled: this.readMode}],
        vehicle: [{value: '', disabled: this.readMode}],
        priceUnitInfo: [{value: '', disabled: this.readMode}],
        iban: [{value: '', disabled: this.readMode}],
      });
      this.formGroupFileUpload = this.fb.group({
        contractCategory: ['1'], fileUpload: []
      });


      await this.spinner.show();
      await Promise.all([this.detail(this.id), // this.loadListKhoanMucKhns(),
        // this.loadListMaNghiepVu(),
        this.loadListQuocGia(),]).then(() => {
        if (this.formGroupDetail.getRawValue().isHotel && this.formGroupDetail.getRawValue().isVehicle) {
          this.formGroupDetail.patchValue({doiTuongDichVu: '3'});
        } else if (this.formGroupDetail.getRawValue().isHotel) {
          this.formGroupDetail.patchValue({doiTuongDichVu: '1'});
        } else if (this.formGroupDetail.getRawValue().isVehicle) {
          this.formGroupDetail.patchValue({doiTuongDichVu: '2'});
        }

        this.getPartnerInfo();
        this.tblAttachedDocument = new MatTableDataSource(this.formGroupDetail.getRawValue().documentsList ?? []);
        this.tblUnitPrice = new MatTableDataSource(this.formGroupDetail.getRawValue().priceUnitInfo);

        //debounce
        this.brake = true;
        this.marketCodeChangeDebounce = debounce(async (value: any) => {
          console.log(value && !this.brake, value, this.brake, 'value && !this.brake')
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
      console.log(this.tblAttachedDocument, 'tblAttachedDocument')
    }
  }

  goBack() {
    this.backStep.emit();
  }

  async actionUpload() {
    if (this.formGroupFileUpload.value.contractCategory && this.formGroupFileUpload.value.fileUpload.length > 0) {
      try {
        await this.spinner.show();
        let formUpload = new FormData();
        let fileUpload = this.formGroupFileUpload.value.fileUpload[0];
        let optionBlob = new Blob([this.formGroupFileUpload.value.contractCategory], {type: 'application/json'});
        let bizDocIdBlob = new Blob([this.formGroupDetail.getRawValue().bizDocId], {type: 'application/json'});
        //validate
        // if(!fileUpload.name.includes(this.COMMON_CONFIG.FILE_ACCEPT.split(',')) || fileUpload.size > 5 * 1048576){
        if (fileUpload.size > 5 * 1048576) {
          this.baseService.showError(MESSAGE.MAX_FILE_SIZE);
          return;
        }
        formUpload.append('file', fileUpload, fileUpload.name);
        formUpload.append('option', optionBlob);
        formUpload.append('bizDocId', bizDocIdBlob);
        await this.baseService.uploadFile(formUpload).then(res => {
          if (res.status == HttpStatusCode.Ok) {
            this.tblAttachedDocument.data = [...this.tblAttachedDocument.data, {
              documentType: this.formGroupFileUpload.value.documentType == 1 ? 'Contract/annex or appendix' : 'Other documents of contract',
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
    this.tblUnitPrice.data = [...this.tblUnitPrice.data, {}];
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
    console.log(row)
  }

  readCellUP(row: any, cell: any) {
    let cur = new Set(row.cellEdit);
    cur.delete(cell);
    row.cellEdit = Array.from(cur);
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
          marketCode: data.marketCode,
          marketName: data.marketName,
          nation: data.nation,
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
}
