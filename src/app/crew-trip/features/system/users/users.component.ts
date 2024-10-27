import { Component, effect, inject, model, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NgClass, NgIf, TitleCasePipe } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorIntl, MatPaginatorModule } from "@angular/material/paginator";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { UsersService } from "src/app/crew-trip/core/services/users-service";
import { DataTransformPipe } from "src/app/crew-trip/shared/data-transform.pipe";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatOption, MatSelect, MatSelectModule } from "@angular/material/select";
import { MatInput, MatInputModule } from "@angular/material/input";
import { FormBuilder, FormControl, FormsModule, NgModel, ReactiveFormsModule, Validators } from "@angular/forms";
import { MESSAGE } from "src/app/crew-trip/shared/utils/constant";
import { RolesService } from "src/app/crew-trip/core/services/roles-service";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { InputSizeComponent } from '../../../shared/input/input-size.component';
import { ResetPasswordRequest, Role } from './users.model';
import { CustomMatPaginatorIntl } from 'src/app/customizer-settings/paginator-intl.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonComponent } from '../../../shared/common.component';

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


export class UsersComponent extends CommonComponent implements OnInit {
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
  @ViewChild('newPassword') newPassword: NgModel;

  override formGroupDetail = this.fb.group({
    id: [''],
    department: ['', Validators.required],
    fullName: ['', Validators.required],
    gender: [true],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    roles: [<any>[], Validators.required],
    active: [true, [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')]],
    description: ['']
  });


  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      keywords: [''],
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
    { label: $localize`:@@fullName:Full name`, value: 'fullName' },
    { label: $localize`:@@department:Department`, value: 'department' },
    { label: $localize`:@@email:Email`, value: 'email' }
  ]
    ;

  override async ngOnInit() {
    await Promise.all([
      this.getRoles(),
      this.search()
    ]).then(() => {
    });
    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'roles', 'status', 'action'];
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

  async showDetail(id?: any) {
    if (id) {
      try {
        await this.spinner.show();
        let res = await this.baseService.detail(id);
        console.log(res)
        this.formGroupDetail.reset({ ...res.data, roles: res.data?.roles?.map((role: any) => role.id) });
        console.log(this.formGroupDetail.value);
        this.toggleDialogCreate();
      } catch (e) {
        console.log(e);
      } finally {
        this.spinner.hide();
      }
      this.readMode = true;
    } else {
      this.formGroupDetail.reset();
      this.formGroupDetail.markAsPristine();
      this.formGroupDetail.markAsUntouched();
      this.toggleDialogCreate();
    }
  }

  async saveUser() {
    this.formGroupDetail.markAllAsTouched();
    Object.keys(this.formGroupDetail.controls).forEach(key => {
      (this.formGroupDetail.get(key) as FormControl).markAsTouched();
    });
    this.formGroupDetail.controls.password.clearValidators();
    this.formGroupDetail.controls.password.updateValueAndValidity();

    if (this.formGroupDetail.valid) {
      try {
        let selectedRoles: number[] = [];
        this.formGroupDetail.value.roles.forEach((roleId: any) => {
          const selectedRole = this.listRolesForCreate.filter(role => role.roleId == roleId)[0];
          selectedRoles.push(selectedRole.roleId);
        });
        const dataSave = { ...this.formGroupDetail.value, roles: selectedRoles };
        if (dataSave.id) {
          await this.baseService.update(dataSave, 'update');
          this.baseService.showSuccess(MESSAGE.UPDATE_SUCCESS);
        } else {
          await this.baseService.create(dataSave);
          this.baseService.showSuccess(MESSAGE.CREATE_SUCCESS);
        }

        this.search();
      } catch (ex) {
        console.log(ex);
        this.baseService.showError(MESSAGE.ERROR);
      } finally {
        this.toggleDialogCreate();
      }



    }
  }

  override search(): Promise<void> {
    return super.search({
      active: this.formGroupSearch.controls['status'].value,
      s: this.formGroupSearch.controls['keywords'].value,
      role: this.formGroupSearch.controls['role'].value
    });
  }

  openDialogResetPassword(email: string) {
    this.newPassword?.reset();
    this.newPassword?.control.reset();
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
      this.baseService.showSuccess(MESSAGE.UPDATE_SUCCESS);
    } catch (error) {
      console.log(error);

    } finally {
      this.spinner.hide();
      this.dialogResetPassword = false;

    }
  }
}
