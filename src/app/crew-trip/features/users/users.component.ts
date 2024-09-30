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
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from "@angular/forms";
import { Constant, DEFAULT_LANGUAGE, MESSAGE } from "src/app/crew-trip/shared/utils/constant";
import { RolesService } from "src/app/crew-trip/core/services/roles-service";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { InputSizeComponent } from '../../shared/input/input-size.component';
import { ResetPasswordRequest, Response, Role, User } from './users.model';
import { CustomMatPaginatorIntl } from 'src/app/customizer-settings/paginator-intl.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    MatNativeDateModule, NgxMaterialTimepickerModule, FormsModule, MatFormFieldModule,
    TranslateModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }
  ]
})


export class UsersComponent extends HeaderListBaseComponent implements OnInit {
  override baseService = inject(UsersService);
  rolesService = inject(RolesService);
  fb = inject(FormBuilder);

  //variable
  listRolesRaw: Role[] = [];
  listRoles: Role[] = [];
  listRolesForCreate: Role[] = [];

  searchRole = model<string>('');
  searchRoleForCreate = model<string>('');
  readMode = false;
  dialogResetPassword = false;
  passwordInputType = 'password';
  changePassword: ResetPasswordRequest = new ResetPasswordRequest('', '');

  override formGroupDetail = this.fb.group({
    id: [''],
    department: ['', Validators.compose([Validators.required])],
    fullName: ['', Validators.required],
    gender: [true],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    roles: [],
    active: ['true', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')]],
    description: ['']
  });


  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      keySearch: [''],
      status: [''],
      role: ['']
    });

    effect(() => {
      // trigger cho phần search role
      const _searchRole = this.searchRole();
      this.listRoles = this.listRolesRaw.filter(role => role.roleName.toLowerCase().includes(_searchRole.toLowerCase()));
    });

    effect(() => {
      // trigger cho phần search role
      const _searchRoleForCreate = this.searchRoleForCreate();
      this.listRolesForCreate = this.listRolesRaw.filter(role => role.roleName.toLowerCase().includes(_searchRoleForCreate.toLowerCase()));
    });
  }

  _displayedColumns: { label: string; value: string, type?: string, format?: string }[] = [
    { label: 'Full name', value: 'fullName' },
    { label: 'Department', value: 'department' },
    { label: 'Email', value: 'email' },
  ]
    ;

  override async ngOnInit() {
    await Promise.all([
      this.getRoles(),
      this.search()
    ]).then(() => {
    });
    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'roles', 'active', 'action'];



  }

  async getRoles() {
    try {
      await this.spinner.show();
      let res = await this.rolesService.search({
        page: this.pageIndex,
        size: this.pageSize
      });
      this.listRoles = res.data.content;
      this.listRolesRaw = res.data.content;
      this.listRolesForCreate = res.data.content;
    } finally {
      await this.spinner.hide();
    }
  }

  override async showDetail(id?: any) {
    if (id) {
      try {
        await this.spinner.show();
        let res = await this.baseService.detail(id);
        console.log(res)
        this.formGroupDetail.patchValue({ ...res.data, roles: res.data.roles.map((role: any) => role.id) });
        console.log(this.formGroupDetail.value);
        this.toggleClass();
      } catch (e) {
        console.log(e);
      } finally {
        this.spinner.hide();
      }
      this.readMode = true;
    } else {
      this.formGroupDetail.reset({ active: 'true' });
      Object.keys(this.formGroupDetail.controls).forEach(key => {
        (this.formGroupDetail.controls as any)[key].setErrors(null);
      });
      this.toggleClass();
    }
  }

  async saveUser() {
    this.formGroupDetail.markAllAsTouched;
    this.formGroupDetail.controls.password.clearValidators();
    this.formGroupDetail.controls.password.updateValueAndValidity();

    if (this.formGroupDetail.valid) {
      try {
        let selectedRoles: Role[] = [];
        (this.formGroupDetail.value.roles as unknown as any[]).forEach(roleId => {
          selectedRoles.push(this.listRolesForCreate.filter(role => role.roleId == roleId)[0]);
        });

        await super.save({ ...this.formGroupDetail.value, roles: selectedRoles }, 'auth/register');
        if (this.formGroupDetail.value.id) {
          this.baseService.showSuccess(MESSAGE.UPDATE_SUCCESS);
        } else {
          this.baseService.showSuccess(MESSAGE.CREATE_SUCCESS);
        }
        this.search();
      } finally {
        this.toggleClass();
      }



    }
  }

  getRoleName(roles: any[]) {
    if (roles) {
      return roles.map(role => role.name).join('; ');
    }
    return '';
  }

  override search(): Promise<void> {
    return super.search({
      active: this.formGroupSearch.controls['status'].value,
      s: this.formGroupSearch.controls['keySearch'].value,
      role: this.formGroupSearch.controls['role'].value
    });
  }

  openDialogResetPassword(email: string) {
    this.changePassword = new ResetPasswordRequest('', email);
    console.log(this.changePassword);
  }

  async confirmResetPassword(newPassword: NgModel) {
    console.log(newPassword);
    newPassword.control.markAllAsTouched();
    if (newPassword.control.invalid) {
      return;
    }
    try {
      this.spinner.show();
      await this.baseService.resetPassword(this.changePassword);

    } catch (error) {
      console.log(error);

    } finally {
      this.spinner.hide();
      this.dialogResetPassword = false;

    }
  }
}
