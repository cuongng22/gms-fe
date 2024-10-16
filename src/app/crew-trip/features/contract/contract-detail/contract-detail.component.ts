import {Component, EventEmitter, HostListener, inject, Input, OnInit, Output} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgClass, NgIf, TitleCasePipe} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {UsersService} from "src/app/crew-trip/core/services/users-service";
import {DataTransformPipe} from "src/app/crew-trip/shared/data-transform.pipe";
import {MatError, MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MESSAGE} from "src/app/crew-trip/shared/utils/constant";
import {RolesService} from "src/app/crew-trip/core/services/roles-service";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {NgxEditorModule} from "ngx-editor";
import {
  MatAccordion,
  MatExpansionPanel, MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {FunctionsService} from "src/app/crew-trip/core/services/functions-service";


@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, NgxEditorModule, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, FormsModule, MatExpansionPanelDescription],
  templateUrl: './contract-detail.component.html',
  styleUrl: './contract-detail.component.scss',
})


export class ContractDetailComponent extends CommonComponent implements OnInit {
  override baseService = inject(RolesService);
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

  constructor() {
    super();
  }

  override async ngOnInit() {
    try {
      window.scrollTo(0, 0)
      await this.spinner.show();
      await Promise.all([]);
      this.displayedColumnsUser = [...this._displayedColumnsUser.map(s => s.value)];
      this.displayedColumnsFunction = ['select', ...this._displayedColumnsFunction.map(s => s.value)];
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
