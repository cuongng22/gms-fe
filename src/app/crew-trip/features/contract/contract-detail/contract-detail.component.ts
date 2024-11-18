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
    FileUploadModule],
  templateUrl: './contract-detail.component.html',
  styleUrl: './contract-detail.component.scss',
})


export class ContractDetailComponent extends CommonComponent implements OnInit {
  override baseService = inject(ContractService);
  fb = inject(FormBuilder);

  //variable
  @Input() id: any;
  @Input() readMode = false;
  @Input() dataObject: any;
  @Output() backStep = new EventEmitter<any>();

  tblAttachedDocument = new MatTableDataSource();
  tblUnitPrice = new MatTableDataSource();
  expandList = new Set<string>(['tab1', 'tab2', 'tab3', 'tab4', 'tab5']);
  formGroupFileUpload!: FormGroup;

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
        this.loadListKhoanMucKhns(),
        this.loadListMaNghiepVu(),
      ]).then(() => {
        this.tblAttachedDocument = new MatTableDataSource(this.formGroupDetail.value.documentsList);
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
    if (this.formGroupFileUpload.value.contractCategory) {
      try {
        let formUpload = new FormData();
        let fileUpload = this.formGroupFileUpload.value.fileUpload[0];
        console.log(fileUpload, 'haha', fileUpload.name)
        // form.append('file', new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type }));

        formUpload.append('file', fileUpload, fileUpload.name);
        formUpload.append('option', this.formGroupFileUpload.value.contractCategory);
        formUpload.append('bizDocId', this.id);
        await this.baseService.uploadFile(formUpload);
      } catch (e) {
        console.log(e);
        this.baseService.showError(MESSAGE.ERROR);
      }
    }
  }

  async editUnitPrice(index: any) {
  }

  async saveUnitPrice(index: any) {
  }

  async deleteUnitPrice(index: any) {
  }

  async cancelUnitPrice(index: any) {
  }

  async deleteFile(index: any) {
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
}
