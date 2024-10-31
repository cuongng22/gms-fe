import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgClass, NgIf, TitleCasePipe} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {DataTransformPipe} from "src/app/crew-trip/shared/data-transform.pipe";
import {MatError, MatFormField, MatHint, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {NgxEditorModule} from "ngx-editor";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {MatRadioModule} from "@angular/material/radio";
import {ContractService} from "src/app/crew-trip/core/services/contract-service";
import {MatDatepicker, MatDatepickerModule, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";


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
    MatNativeDateModule ],
  templateUrl: './contract-detail.component.html',
  styleUrl: './contract-detail.component.scss',
})


export class ContractDetailComponent extends CommonComponent implements OnInit {
  override baseService = inject(ContractService);
  fb = inject(FormBuilder);

  //variable
  @Input() id: any;
  @Input() readMode: boolean = false;
  @Input() dataObject: any;
  @Output() backStep = new EventEmitter<any>();
  listUser: any = [];
  listFunction: any = [];
  listFunctionView: any;
  listRoleFunction: any = [];
  displayedColumnsUser: string[] = [];
  displayedColumnsFunction: string[] = [];
  _displayedColumnsUser: { label: string; value: string, type?: string, format?: string }[] = [{
    label: "Full Name", value: "full-name"
  }, {label: "Active", value: "isActiveLabel"},];
  _displayedColumnsFunction: { label: string; value: string, type?: string, format?: string }[] = [{
    label: "Active", value: "active"
  }, {label: "ID", value: "id"}, {label: "Name", value: "name"},];
  selectAllChecked: boolean = false;
  selectAllIndeterminate: boolean = false;
  isSticky: boolean = false;
  expandList = new Set<string>(['tab1', 'tab2', 'tab3', 'tab4', 'tab5']);

  constructor() {
    super();
    this.formGroupDetail = this.fb.group({
      tempp:[],
      id: [],
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
  }

  override async ngOnInit() {
    try {
      window.scrollTo(0, 0)
      await this.spinner.show();
      await Promise.all([
        this.detail(2)
      ]);

    } catch (e) {
      console.log(e)
    } finally {
      await this.spinner.hide();
    }
  }

  goBack() {
    this.backStep.emit();
  }
}
