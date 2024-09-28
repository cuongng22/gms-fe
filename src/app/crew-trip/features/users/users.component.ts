import { Component, effect, inject, model, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NgClass, NgIf, TitleCasePipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorIntl, MatPaginatorModule } from "@angular/material/paginator";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { HeaderListBaseComponent } from "src/app/crew-trip/shared/header-list-base.component";
import { UsersService } from "src/app/crew-trip/core/services/users-service";
import { DataTransformPipe } from "src/app/crew-trip/shared/data-transform.pipe";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatOption, MatSelect, MatSelectModule } from "@angular/material/select";
import { MatInput, MatInputModule } from "@angular/material/input";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MESSAGE } from "src/app/crew-trip/shared/utils/constant";
import { InputSizeComponent } from "src/app/crew-trip/shared/input/input-size.component";
import { RolesService } from "src/app/crew-trip/core/services/roles-service";
import { Response, Role, User } from './users.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CustomMatPaginatorIntl } from 'src/app/customizer-settings/paginator-intl.service';

export interface PeriodicElement {
  projectName: string;
  deadline: string;
  status: any;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule,
    NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption,
    MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatInputModule, MatSelectModule, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, FormsModule, MatFormFieldModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers:[
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl } 
  ]
})


export class UsersComponent extends HeaderListBaseComponent implements OnInit {
  override baseService = inject(UsersService);
  rolesService = inject(RolesService);
  fb = inject(FormBuilder);

  //variable
  override dataSource: User[] = [];
  listRolesRaw: Role[] = [];
  listRoles: Role[] = [];

  searchRole = model<string>('');
  readMode = false;

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      keySearch: [''],
      status: [''],
      role: ['']
    });
    this.formGroupDetail = this.fb.group({
      email: ['', Validators.required],
    });

    effect(() => {
      // trigger cho phần search role
      const _searchRole = this.searchRole();
      this.listRoles = this.listRolesRaw.filter(role => role.roleName.toLowerCase().includes(_searchRole.toLowerCase()));
    });
  }

  _displayedColumns: { label: string; value: string, type?: string, format?: string }[] = [
    { label: 'Tên tài khoản', value: 'fullName' },
    { label: 'Đơn vị', value: 'department' },
    { label: 'Email', value: 'email' },
  ]
    ;

  override async ngOnInit() {
    await Promise.all([
      this.getRoles(),
      this.getUsers(),
    ]).then(() => {
    });
    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'roles', 'active', 'action'];



  }

  async getRoles() {
    try {
      await this.spinner.show();
      let res = await this.rolesService.getRoles({
        page: this.pageIndex+1,
        size: this.pageSize
      });
      console.log(res)
      this.listRoles = res.data.content;
      this.listRolesRaw = res.data.content;
    } catch (e) {
      console.log(e);
      this.baseService.showError(MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async getUsers() {
    try {
      await this.spinner.show();
      let response: Response<User> = await this.baseService.getUsers({
        page: this.pageIndex,
        size: this.pageSize
      });
      this.dataSource = response.data.content;
      this.totalElement = response.data.totalElements;
    } catch (e) {
      console.log(e);
      this.baseService.showError(MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  override async save(data: any) {
    super.save(data).then(res => {
      console.log(res)
      /*todo: check res thanh cong thi thong bao*/
      this.search();
      this.closeDetail();
    });
  }

  override async delete(id: any) {
    super.delete(id).then(res => {
      console.log(res)
      //todo: check res thanh cong thi thong bao
      this.search();
    });
  }

  async _detail(id: any, mode: boolean) {
    super.showDetail(id).then(res => {
      console.log(res)
      this.readMode = mode;
      this.formGroupDetail[mode ? 'disable' : 'enable']();
    });
  }
  
  getRoleName(roles: any[]) {
    return roles.map(role => role.name).join('; ');
  }
}
