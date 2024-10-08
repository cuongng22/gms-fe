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
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {FunctionsService} from "src/app/crew-trip/core/services/functions-service";


@Component({
  selector: 'app-role-function',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, NgxEditorModule, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, FormsModule],
  templateUrl: './role-function.component.html',
  styleUrl: './role-function.component.scss',
})


export class RoleFunctionComponent extends CommonComponent implements OnInit {
  override baseService = inject(RolesService);
  usersService = inject(UsersService);
  functionsService = inject(FunctionsService);
  fb = inject(FormBuilder);

  //variable
  @Input() id: any;
  @Input() roleObject: any;
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
      await Promise.all([
        this._detail(),]).then(() => {
      });
      this.displayedColumnsUser = [...this._displayedColumnsUser.map(s => s.value)];
      this.displayedColumnsFunction = ['select', ...this._displayedColumnsFunction.map(s => s.value)];
    } catch (e) {
      console.log(e)
    } finally {
      await this.spinner.hide();
    }
  }

  async _detail() {
    try {
      await this.baseService.detailRoleFunction(this.id).then(res => {
        if (res.data) {
          //user
          this.listUser = res.data.user.map((s: any) => ({
            ...s, isActiveLabel: !!s.active ? $localize`Active` : $localize`Inactive`
          }));
          //role-func
          this.listRoleFunction = res.data['role-function'];

          //func
          let objFunction = res.data.function;
          Object.keys(objFunction).forEach(key => {
            let func = objFunction[key];

            func.functionsDtos.forEach((f: any) => {
              let existsFunction = this.listRoleFunction.some((rf: any) => rf.functionId == f.id);
              f.active = existsFunction;
            });

            this.listFunction = [...this.listFunction, {
              name: key, label: func.label, active: null, child: func.functionsDtos
            }];

            //check indeterminate
            this.listFunction.forEach((s: any) => {
              let has = s.child.some((s: any) => s.active == true);
              let every = s.child.every((s: any) => s.active == true);
              s.indeterminate = has && !every;
              s.active = every;
            });
            let has = this.listFunction.some((s: any) => s.active == true);
            let every = this.listFunction.every((s: any) => s.active == true);
            this.selectAllIndeterminate = has && !every;
            this.selectAllChecked = every;
          })
        } else {
          this.baseService.showWarning(MESSAGE.DATA_EMPTY)
        }
      })
    } catch (e) {
      this.baseService.showWarning(MESSAGE.ERROR)

    }
  }

  checkBoxChange(row?: any, parent?: any) {
    console.log(this.listFunction, this.listRoleFunction)
    let nextValue = row ? !row.active : this.selectAllChecked;
    if (row?.child) {//cap cha
      if (nextValue) {
        row.child.forEach((s: any) => {
          this.listRoleFunction = [...this.listRoleFunction, {
            roleName: this.roleObject.roleName, functionId: s.id, functionName: s.name, functionDescription: s.alias
          }];
          s.active = nextValue;
        });
      } else {
        row.child.forEach((s: any) => {
          this.listRoleFunction.pop((s1: any) => s1.functionId == s.id);
          s.active = nextValue;
        });
        this.selectAllChecked = false;
      }
      row.active = nextValue;
      row.indeterminate = false;
    } else if (row) {//cap con
      if (nextValue) {
        this.listRoleFunction = [...this.listRoleFunction, {
          roleName: this.roleObject.roleName, functionId: row.id, functionName: row.name, functionDescription: row.alias
        }];
      } else {
        this.listRoleFunction.pop((s: any) => s.functionId == row.id);
        this.selectAllChecked = false;
      }
      row.active = nextValue;

      //check indeterminate
      let has = parent.child.some((s: any) => s.active == true);
      let every = parent.child.every((s: any) => s.active == true);
      parent.indeterminate = has && !every;
      parent.active = every;
    } else {//select all
      if (nextValue) {
        this.listFunction.forEach((item: any) => {
          item.child.forEach((s: any) => {
            this.listRoleFunction = [...this.listRoleFunction, {
              roleName: this.roleObject.roleName, functionId: s.id, functionName: s.name, functionDescription: s.alias
            }];
            s.active = nextValue;
          });
          item.indeterminate = false;
          item.active = nextValue;
        });
      } else {
        this.listFunction.forEach((item: any) => {
          item.child.forEach((s: any) => {
            this.listRoleFunction.pop((s1: any) => s1.functionId == s.id);
            s.active = nextValue;
          });
          item.active = nextValue;
        })
      }
    }
  }

  goBack() {
    this.backStep.emit();
  }

  addFunction() {
    this.spinner.show();
    this.baseService.addRoleFunction(this.id, {data: this.listRoleFunction}).then((res) => {
      this.baseService.showSuccess(MESSAGE.UPDATE_SUCCESS);
      this.goBack();
    }).catch(e => {
      this.baseService.showError(e.error?.data ?? e.error ?? MESSAGE.UPDATE_FAIL);
    }).finally(() => {
      this.spinner.show();
    });
  }

  @HostListener('window:scroll', ['$event']) onScroll() {
    if (window.scrollY > 60) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }
}
