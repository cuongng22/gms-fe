import { Component, EventEmitter, HostListener, inject, Input, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf, TitleCasePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UsersService } from 'src/app/crew-trip/core/services/users-service';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { MatError, MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MESSAGE } from 'src/app/crew-trip/shared/utils/constant';
import { RolesService } from 'src/app/crew-trip/core/services/roles-service';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { NgxEditorModule } from 'ngx-editor';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { FunctionsService } from 'src/app/crew-trip/core/services/functions-service';
import { HasPermissionDirective } from 'src/app/crew-trip/shared/directive/has-permission.directive';


@Component({
  selector: 'app-role-function',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, NgxEditorModule, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, FormsModule,
    HasPermissionDirective
  ],
  templateUrl: './role-function.component.html',
  styleUrl: './role-function.component.scss',
  providers: [HasPermissionDirective]
})


export class RoleFunctionComponent extends CommonComponent implements OnInit {
  override baseService = inject(RolesService);
  usersService = inject(UsersService);
  functionsService = inject(FunctionsService);
  fb = inject(FormBuilder);

  //variable
  @Input() id: any;
  @Input() dataSelected: any;
  @Output() backStep = new EventEmitter<any>();
  listUser: any = [];
  listFunction: any = [];
  listFunctionView: any;
  listRoleFunction: any = [];
  displayedColumnsUser: string[] = [];
  displayedColumnsFunction: string[] = [];
  _displayedColumnsUser: { label: string; value: string, type?: string, format?: string }[] = [{
    label: 'Full Name', value: 'full-name'
  }, { label: 'Active', value: 'isActiveLabel' },];
  _displayedColumnsFunction: { label: string; value: string, type?: string, format?: string }[] = [{
    label: 'Active', value: 'active'
  }, { label: 'ID', value: 'id' }, { label: 'Name', value: 'name' },];
  selectAllChecked = false;
  selectAllIndeterminate = false;

  constructor() {
    super();
  }

  override async ngOnInit() {
    try {
      window.scrollTo(0, 0);
      await this.spinner.show();
      await Promise.all([
        this._detail(),]).then(() => {
        });
      this.displayedColumnsUser = [...this._displayedColumnsUser.map(s => s.value)];
      this.displayedColumnsFunction = ['select', ...this._displayedColumnsFunction.map(s => s.value)];
    } catch (e) {
      console.log(e);
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
            ...s, isActiveLabel: s.active ? $localize`Active` : $localize`Inactive`
          }));
          //role-func
          this.listRoleFunction = res.data['role-function'];

          //func
          const objFunction = res.data.function;
          Object.keys(objFunction).forEach(key => {
            const func = objFunction[key];

            func.functionsDtos.forEach((f: any) => {
              const existsFunction = this.listRoleFunction.some((rf: any) => rf.functionId == f.id);
              f.active = existsFunction;
            });

            this.listFunction = [...this.listFunction, {
              name: key, label: func.label, active: null, child: func.functionsDtos
            }];

            //check indeterminate
            this.listFunction.forEach((s: any) => {
              const has = s.child.some((s: any) => s.active == true);
              const every = s.child.every((s: any) => s.active == true);
              s.indeterminate = has && !every;
              s.active = every;
            });
            const has = this.listFunction.some((s: any) => s.active == true);
            const every = this.listFunction.every((s: any) => s.active == true);
            this.selectAllIndeterminate = has && !every;
            this.selectAllChecked = every;
          });
        } else {
          this.baseService.showWarning(MESSAGE.DATA_EMPTY);
        }
      });
    } catch (e) {
      this.baseService.showWarning(MESSAGE.ERROR);

    }
  }

  checkBoxChange(row?: any, parent?: any) {
    const nextValue = row ? !row.active : this.selectAllChecked;
    if (row?.child) {
      // Trường hợp: Check/uncheck node cha
      row.active = nextValue;
      row.indeterminate = false;
      row.child.forEach((child: any) => {
        child.active = nextValue;
        if (nextValue) {
          // Thêm child vào listRoleFunction nếu chưa tồn tại
          if (!this.listRoleFunction.some((item: any) => item.functionId === child.id)) {
            this.listRoleFunction = [...this.listRoleFunction, {
              roleName: this.dataSelected.roleName,
              functionId: child.id,
              functionName: child.name,
              functionDescription: child.alias
            }];
          }
        } else {
          // Xóa child khỏi listRoleFunction
          this.listRoleFunction = this.listRoleFunction.filter(
            (item: any) => item.functionId !== String(child.id) // Ép kiểu để đảm bảo khớp
          );
        }
      });
      if (!nextValue) {
        this.selectAllChecked = false;
      }
    } else if (row) {
      // Trường hợp: Check/uncheck node con
      row.active = nextValue;
      if (nextValue) {
        // Thêm node con vào listRoleFunction nếu chưa tồn tại
        if (!this.listRoleFunction.some((item: any) => item.functionId === String(row.id))) {
          this.listRoleFunction = [...this.listRoleFunction, {
            roleName: this.dataSelected.roleName,
            functionId: row.id,
            functionName: row.name,
            functionDescription: row.alias
          }];
        }
      } else {
        // Xóa node con khỏi listRoleFunction
        const originalLength = this.listRoleFunction.length;
        this.listRoleFunction = this.listRoleFunction.filter(
          (item: any) => item.functionId !== String(row.id) // Ép kiểu để đảm bảo khớp
        );
        this.selectAllChecked = false;
      }
      // Cập nhật trạng thái node cha
      if (parent) {
        const hasActive = parent.child.some((s: any) => s.active);
        const allActive = parent.child.every((s: any) => s.active);
        parent.indeterminate = hasActive && !allActive;
        parent.active = allActive;
      }
    } else {
      // Trường hợp: Check/uncheck tất cả
      this.selectAllChecked = nextValue;
      this.listRoleFunction = []; // Reset listRoleFunction
      this.listFunction.forEach((item: any) => {
        item.active = nextValue;
        item.indeterminate = false;
        item.child.forEach((child: any) => {
          child.active = nextValue;
          if (nextValue) {
            // Thêm child vào listRoleFunction
            this.listRoleFunction = [...this.listRoleFunction, {
              roleName: this.dataSelected.roleName,
              functionId: child.id,
              functionName: child.name,
              functionDescription: child.alias
            }];
          }
        });
      });
    }
    // Đồng bộ listRoleFunction với trạng thái active
    this.syncListRoleFunction();
  }

  syncListRoleFunction() {
    // Làm trống và xây lại listRoleFunction dựa trên trạng thái active
    this.listRoleFunction = [];
    this.listFunction.forEach((item: any) => {
      item.child.forEach((child: any) => {
        if (child.active) {
          this.listRoleFunction.push({
            roleName: this.dataSelected.roleName,
            functionId: child.id,
            functionName: child.name,
            functionDescription: child.alias
          });
        }
      });
    });
  }

  goBack() {
    this.backStep.emit();
  }

  addFunction() {
    this.spinner.show();
    this.baseService.addRoleFunction(this.id, { data: this.listRoleFunction }).then((res) => {
      this.baseService.showSuccess(MESSAGE.UPDATE_SUCCESS);
      this.goBack();
    }).catch(e => {
      this.baseService.showError(e.error?.data ?? e.error ?? MESSAGE.UPDATE_FAIL);
    }).finally(() => {
      this.spinner.show();
    });
  }

  // @HostListener('window:scroll', ['$event']) onScroll() {
  //   if (window.scrollY > 60) {
  //     this.isSticky = true;
  //   } else {
  //     this.isSticky = false;
  //   }
  // }
}
