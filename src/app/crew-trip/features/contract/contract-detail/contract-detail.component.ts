import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
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
import {MESSAGE} from "src/app/crew-trip/shared/utils/constant";
import {ClickOutside} from "ngxtension/click-outside";


@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [DataTransformPipe,
    FormsModule,
    InputSizeComponent,
    MatAccordion,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatError,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatMenuModule,
    MatOption,
    MatPaginatorModule,
    MatPrefix,
    MatRadioModule,
    MatSelect,
    MatSuffix,
    MatTab,
    MatTabGroup,
    MatTableModule,
    NgClass,
    NgIf,
    NgxEditorModule,
    ReactiveFormsModule,
    RouterLink,
    TitleCasePipe,
    MatHint,
    MatDatepickerModule,
    MatDatepicker,
    MatDatepickerToggle,
    MatNativeDateModule,
    FileUploadModule,
    ClickOutside],
  templateUrl: './contract-detail.component.html',
  styleUrl: './contract-detail.component.scss',
})


export class ContractDetailComponent extends CommonComponent implements OnInit {
  override baseService = inject(ContractService);
  fb = inject(FormBuilder);

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
  expandList = new Set<string>(['tab1', 'tab2', 'tab3', 'tab4', 'tab5','tab6']);
  formGroupFileUpload!: FormGroup;
  curFile: any;
  showDialogDeleteFile = false;

  // private filesControl = new FormControl(null, );
  constructor() {
    super();
    this.formGroupDetail = this.fb.group({
      tempp: [],
      id: [],
      bizDocId: [],
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
      iban: [],
    });
    this.formGroupFileUpload = this.fb.group({
      contractCategory: ['1'],
      fileUpload: []
    });
  }

  override async ngOnInit() {
    try {
      window.scrollTo(0, 0);
      await this.spinner.show();
      await Promise.all([
        this.detail(this.id),
        // this.loadListKhoanMucKhns(),
        // this.loadListMaNghiepVu(),
      ]).then(() => {
        this.tblAttachedDocument = new MatTableDataSource(this.formGroupDetail.value.documentsList);
        this.tblUnitPrice = new MatTableDataSource(this.formGroupDetail.value.priceUnitInfo);
        this.tblUnitPrice = new MatTableDataSource<any>([
          {
            "id": 10001,
            "serviceCode": "SVC12345",
            "vnaTransId": 20002,
            "priceNoTax": 1500.5,
            "taxCode": "TAX24",
            "taxRate": 1.1,
            "originalAmount3": 1650.55,
            "priceWithTax": 1650.55,
            "notes": "Sample transaction",
            "bizDocId": "14463221C1",
            "expenseCatgId": 30003
          },
          {
            "id": 10001,
            "serviceCode": "SVC12345",
            "vnaTransId": 20002,
            "priceNoTax": 1500.5,
            "taxCode": "TAX24",
            "taxRate": 1.1,
            "originalAmount3": 1650.55,
            "priceWithTax": 1650.55,
            "notes": "Sample transaction",
            "bizDocId": "14463221C1",
            "expenseCatgId": 30003
          },
          {
            "id": 10001,
            "serviceCode": "SVC12345",
            "vnaTransId": 20002,
            "priceNoTax": 1500.5,
            "taxCode": "TAX24",
            "taxRate": 1.1,
            "originalAmount3": 1650.55,
            "priceWithTax": 1650.55,
            "notes": "Sample transaction",
            "bizDocId": "14463221C1",
            "expenseCatgId": 30003
          }
        ]);

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
    if (this.formGroupFileUpload.value.contractCategory) {
      try {
        let formUpload = new FormData();
        let fileUpload = this.formGroupFileUpload.value.fileUpload[0];
        let optionBlob = new Blob([this.formGroupFileUpload.value.contractCategory], {type: 'application/json'});
        let bizDocIdBlob = new Blob([this.formGroupDetail.value.bizDocId], {type: 'application/json'});
        formUpload.append('file', fileUpload, fileUpload.name);
        formUpload.append('option', optionBlob);
        formUpload.append('bizDocId', bizDocIdBlob);
        await this.baseService.uploadFile(formUpload);
        this.tblAttachedDocument.data = [...this.tblAttachedDocument.data, {
          documentType: this.formGroupFileUpload.value.documentType == 1 ? 'Contract/annex or appendix' : 'Other documents of contract',
          fileName: fileUpload.name,
          isManual: true
        }];
      } catch (e) {
        console.log(e);
        this.baseService.showError(MESSAGE.ERROR);
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
    await this.baseService.deleteFile(this.curFile.fileName, this.id);
    this.tblAttachedDocument.data = this.tblAttachedDocument.data.filter((item: any) => item.fileName !== this.curFile.fileName);
    this.showDialogDeleteFile = false;
  }

  async closeConfirmDeleteFile() {
    this.showDialogDeleteFile = false;
  }

  listMaNghiepVu = [];
  listKhoanMucKhns = [];

  async loadListMaNghiepVu() {
    await this.baseService.listMaNghiepVu().then(res => {
      if (res.data) {
        this.listMaNghiepVu = res.data;
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
    console.log('aaaa')
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
  test(){
    console.log(this.tblUnitPrice.data)
  }
}
