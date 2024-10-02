import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgClass, NgIf, TitleCasePipe} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {HeaderListBaseComponent} from "src/app/crew-trip/shared/header-list-base.component";
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
import {HttpStatusCode} from "@angular/common/http";
import lodash from "lodash";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {v4 as uuidv4} from 'uuid';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';


@Component({
  selector: 'app-role-function',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, NgxEditorModule, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, FormsModule],
  templateUrl: './role-function.component.html',
  styleUrl: './role-function.component.scss',
})


export class RoleFunctionComponent extends HeaderListBaseComponent implements OnInit {
  override baseService = inject(RolesService);
  usersService = inject(UsersService);
  functionsService = inject(UsersService);
  fb = inject(FormBuilder);

  //variable
  @Input() id: any;
  @Output() backStep = new EventEmitter<any>();
  listUser: any = [];
  listFunction: any = [];
  listFunctionView: any;
  listRoleFunction: any = [];
  displayedColumnsUser: string[] = [];
  displayedColumnsFunction: string[] = [];
  _displayedColumnsUser: { label: string; value: string, type?: string, format?: string }[] = [
    {label: "Full Name", value: "full-name"},
    {label: "Active", value: "isActiveLabel"},
  ];
  _displayedColumnsFunction: { label: string; value: string, type?: string, format?: string }[] = [
    {label: "Active", value: "active"},
    {label: "ID", value: "id"},
    {label: "Name", value: "name"},
  ];
  selectAllValue: boolean = false;

  constructor() {
    super();
  }

  override async ngOnInit() {
    await Promise.all([
      this._detail(),
    ]).then(() => {
      this.buildView();
      this.watch();
    });
    this.displayedColumnsUser = [...this._displayedColumnsUser.map(s => s.value)];
    this.displayedColumnsFunction = ['select', ...this._displayedColumnsFunction.map(s => s.value)];
  }

  watch() {
    let currentCheck = this.listFunction.filter((s: any) => s.active === true);
    this.selectAllValue = currentCheck.length === this.listFunction.length;
  }

  async _detail() {
    try {
      await this.baseService.detail(this.id).then(res => {
        if (res.data && res.status == HttpStatusCode.Ok) {
          this.listUser = res.data.user.map((s: any) => ({
            ...s,
            isActiveLabel: !!s.active ? $localize`Active` : $localize`Inactive`
          }));
          if (res.data.function && res.data.function.length > 0) {
            this.listFunction = res.data.function;
            this.listFunction = this.listFunction.map((s: any) => {
              const parent = s.name.split('-')[0];
              return {
                ...s,
                parent: parent,
                uuid: uuidv4()
              }
            });
          }
          if (res.data['role-function'] && res.data['role-function'].length > 0) {
            this.listRoleFunction = res.data['role-function'];
            this.listRoleFunction.forEach((rf: any) => {
              let existsFunction = this.listFunction.find((f: any) => rf.functionId == f.id);
              existsFunction.active = true;
            });
          }
        } else {
          this.baseService.showWarning(MESSAGE.DATA_EMPTY)
        }
      })
    } catch (e) {
      this.baseService.showWarning(MESSAGE.ERROR)

    }
  }

  async buildView() {
    this.listFunctionView = lodash.chain(this.listFunction).groupBy("parent").map((v: any, k) => {
      let currrent = this.listFunction.find((s: any) => s.parent === k);
      return {
        name: k,
        active: currrent.active,
        id: currrent.id,
        uuid: currrent.uuid,
        child: v
      }
    }).value();
    console.log(this.listFunctionView)
  }

  checkBoxChange(row?: any) {
    let nextValue = !row?.active;
    if (row && row.child) {
      row.child.forEach((s: any) => {
        let row = this.listFunction.find((s1: any) => s.uuid === s1.uuid);
        row.active = nextValue;
      });
    } else if (row) {
      let cur = this.listFunction.find((s: any) => s.uuid === row.uuid);
      cur.active = nextValue;
    } else {
      this.listFunction.forEach((s: any) => s.active = this.selectAllValue);
    }
    this.buildView();
    this.watch();
  }

  goBack() {
    this.backStep.emit();
  }

  addFunction() {
    let bodyReq = this.listFunction.filter((s: any) => s.active === true).map((s: any) => ({functionId: s.id}));
    this.baseService.addFunction(this.id, {data: bodyReq}).then((res) => {
      if (res && res.status == HttpStatusCode.Ok) {
        this.baseService.showSuccess(MESSAGE.UPDATE_SUCCESS);
      } else if (res.status == HttpStatusCode.BadRequest) {
        this.baseService.showWarning('Chức năng không được để trống');
      } else {
        this.baseService.showError(MESSAGE.ERROR);
      }
    }).catch(reason => {
      console.log(reason);
      this.baseService.showError(MESSAGE.ERROR);
    }).finally(() => this.goBack())
  }
}
