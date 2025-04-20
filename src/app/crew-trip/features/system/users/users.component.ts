import { Component, effect, inject, model, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UsersService } from 'src/app/crew-trip/core/services/users-service';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect, MatSelectModule } from '@angular/material/select';
import { MatInput, MatInputModule } from '@angular/material/input';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { MESSAGE } from 'src/app/crew-trip/shared/utils/constant';
import { RolesService } from 'src/app/crew-trip/core/services/roles-service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { InputSizeComponent } from '../../../shared/input/input-size.component';
import { ResetPasswordRequest, Role } from './users.model';
import { CustomMatPaginatorIntl } from 'src/app/customizer-settings/paginator-intl.service';
import { CommonComponent } from '../../../shared/common.component';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { ifValidator } from 'ngxtension/if-validator';
import { HttpStatusCode } from '@angular/common/http';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HasPermissionDirective } from 'src/app/crew-trip/shared/directive/has-permission.directive';

export interface PeriodicElement {
  projectName: string;
  deadline: string;
  status: any;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule,
    MatCheckboxModule, DataTransformPipe, NgClass, MatSelect, MatOption,
    MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatInputModule, MatSelectModule, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, FormsModule, MatFormFieldModule, CommonModule, MatTooltipModule,
    NgxTrimDirectiveModule, NgxControlError, SelectMultipleComponent, HasPermissionDirective],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl, },
    HasPermissionDirective
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
  isValidatePassword = false;
  emailExists = false;
  emailExistsMessage = '';

  override formGroupDetail = this.fb.group({
    id: [''],
    department: ['', [Validators.required, Validators.maxLength(250)]],
    fullName: ['', [Validators.required, Validators.maxLength(250)]],
    gender: [],
    email: ['', [
      Validators.required,
      Validators.maxLength(250), Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
      this.emailExistsValidator.bind(this)
    ]],
    phone: ['', [Validators.maxLength(20), Validators.pattern('^[0-9()+ ]+$')]],
    roles: [([] as any)],
    active: [true, [Validators.required]],
    password: [new FormControl('',
      ifValidator(
        () => this.isValidatePassword,
        [Validators.required, Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')
        ]))],
    description: ['', Validators.maxLength(500)]
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
      this.listRoles = this.listRolesRaw
        .filter(role => role.roleName.toLowerCase().includes(_searchRole.toLowerCase()));
    });

    effect(() => {
      // trigger cho phần search role
      const _searchRoleForCreate = this.searchRoleForCreate();
      this.listRolesForCreate = this.listRolesRaw
        .filter(role => role.roleName.toLowerCase().includes(_searchRoleForCreate.toLowerCase()));
    });
  }

  _displayedColumns: { label: string; value: string, type?: string, format?: string }[] = [
    { label: $localize`:@@fullName:Full name`, value: 'fullName' },
    { label: $localize`:@@department:Department`, value: 'department' },
    { label: $localize`:@@email:Email`, value: 'email' }
  ];

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
      const res = await this.rolesService.search({
        page: this.pageIndex,
        limit: 9999
      });
      this.listRoles = res.data.content;
      this.listRolesRaw = res.data.content;
      this.listRolesForCreate = res.data.content;
    } finally {
      await this.spinner.hide();
    }
  }


  getSelectedRolesSearch(): string {
    const selectedRoles = this.formGroupSearch.get('role')?.value || [];
    return selectedRoles
      .map((roleId: number) => this.listRoles.find(role => role.roleId === roleId)?.roleName)
      .filter((name: any) => name)
      .join('; ') || 'Select roles';
  }

  getSelectedRolesDetail(): string {
    const selectedRoles = this.formGroupDetail.get('roles')?.value || [];
    return selectedRoles
      .map((roleId: number) => this.listRoles.find(role => role.roleId === roleId)?.roleName)
      .filter((name: any) => name)
      .join('; ') || 'Select roles';
  }

  async showDetail(id?: any) {
    if (id) {
      try {
        await this.spinner.show();
        const res = await this.baseService.detail(id);
        this.formGroupDetail.reset({ ...res.data, roles: res.data?.roles?.map((role: any) => role.id) });
        this.toggleDialogCreate();
      } catch (e) {
      } finally {
        await this.spinner.hide();
      }
      this.readMode = true;
      this.formGroupDetail.controls.email.disable();
    } else {
      this.formGroupDetail.reset();
      this.formGroupDetail.controls.active.setValue(true);
      this.formGroupDetail.markAsPristine();
      this.formGroupDetail.markAsUntouched();
      this.formGroupDetail.controls.email.enable();
      this.toggleDialogCreate();
    }
  }

  async saveUser() {
    this.formGroupDetail.markAllAsTouched();
    Object.keys(this.formGroupDetail.controls).forEach(key => {
      (this.formGroupDetail.get(key) as FormControl).markAsTouched();
    });
    if (this.formGroupDetail.controls.id.value) {
      this.isValidatePassword = true;
      this.formGroupDetail.controls.password.updateValueAndValidity();
    }

    if (this.formGroupDetail.valid) {
      await this.spinner.show();
      try {
        const selectedRoles: number[] = [];
        if (this.formGroupDetail.value.roles) {
          this.formGroupDetail.value.roles.forEach((roleId: any) => {
            const selectedRole = this.listRolesForCreate.filter(role => role.roleId == roleId)[0];
            selectedRoles.push(selectedRole.roleId);
          });
        }
        const dataSave = { ...this.formGroupDetail.value, roles: selectedRoles };
        if (dataSave.id) {
          await this.baseService.update(dataSave, 'update');
          this.baseService.showSuccess(MESSAGE.UPDATE_SUCCESS);
        } else {
          await this.baseService.create(dataSave);
          this.baseService.showSuccess(MESSAGE.CREATE_SUCCESS);
        }

        this.toggleDialogCreate();
        this.search();
      } catch (err: any) {
        if (err.status === HttpStatusCode.BadRequest && err?.error?.error?.password) {
          this.baseService.showError(err?.error?.error?.password);
        }
        if (err.status === HttpStatusCode.Conflict) {
          this.emailExists = true;
          this.formGroupDetail.controls.email.updateValueAndValidity();
          this.emailExistsMessage = err?.error?.error
            ?? $localize`:@@emailAlreadyExists:Email ${MESSAGE.ALREADY_EXISTS}`;
          this.emailExists = false;
        }
      } finally {
        await this.spinner.hide();
      }
    }
  }

  override search(body?: any, isNextPage?: boolean): Promise<void> {
    return super.search({
      active: this.formGroupSearch.controls['status'].value,
      s: this.formGroupSearch.controls['keywords'].value,
      role: this.formGroupSearch.controls['role'].value
    }, isNextPage);
  }

  openDialogResetPassword(email: string) {
    this.newPassword?.reset();
    this.newPassword?.control.reset();
    this.changePassword = new ResetPasswordRequest('', email);
  }

  async confirmResetPassword(newPassword: NgModel) {
    newPassword.control.markAllAsTouched();
    if (newPassword.control.invalid) {
      return;
    }
    try {
      await this.spinner.show();
      await this.baseService.resetPassword(this.changePassword);
      this.baseService.showSuccess(MESSAGE.UPDATE_SUCCESS);
    } catch (error) {

    } finally {
      await this.spinner.hide();
      this.dialogResetPassword = false;

    }
  }

  emailExistsValidator(control: AbstractControl): ValidationErrors | null {
    return this.emailExists ? { emailExists: true } : null;
  }
}
