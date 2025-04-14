import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgClass, NgIf, TitleCasePipe } from '@angular/common';
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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { RolesService } from 'src/app/crew-trip/core/services/roles-service';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { RoleFunctionComponent } from 'src/app/crew-trip/features/roles/role-function/role-function.component';
import { NoDataRowOutlet } from '@angular/cdk/table';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { ContractDetailComponent } from 'src/app/crew-trip/features/contract/contract-detail/contract-detail.component';
import { HasPermissionDirective } from '../../shared/directive/has-permission.directive';


@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [RouterLink, CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet, ContractDetailComponent,
    HasPermissionDirective
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
  providers: [HasPermissionDirective]
})


export class RolesComponent extends CommonComponent implements OnInit {
  override baseService = inject(RolesService);
  usersService = inject(UsersService);
  fb = inject(FormBuilder);

  //variable
  step = 1;
  _displayedColumns: { label: string; value: string, type?: string, format?: string }[] = [
    // {label: 'Ngày tạo', value: 'ngayTao', type: Constant.DATE, format: Constant.DATE_FORMAT},
    { label: $localize`Role Name`, value: 'roleName' },
    { label: $localize`Function`, value: 'functionCount' },
    { label: $localize`Account`, value: 'userCount' },
    { label: $localize`Status`, value: 'isActiveLabel' },
  ];


  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      s: ['',],
      a: ['',],
    });
    this.formGroupDetail = this.fb.group({
      id: ['',],
      roleId: ['',],
      name: [''],
      roleName: ['', [Validators.required, Validators.maxLength(250)]],
      active: [true,],
      isActive: [true,],
    });
    this.formGroupSearchInit = { ...this.formGroupSearch.value };
    this.formGroupDetailInit = { ...this.formGroupDetail.value };
  }

  override async ngOnInit() {
    await Promise.all([
      this.search(),
    ]).then(() => {
    });
    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'action'];
  }

  async nextStep(index: number) {
    this.formGroupDetail.patchValue(this.dataSource.data[index] as JSON);
    this.step = 2;
  }

  async backStep() {
    await this.search(),
      this.step = 1;
  }

  override async save(): Promise<any> {
    this.formGroupDetail.patchValue({
      name: this.formGroupDetail.value.roleName,
      active: this.formGroupDetail.value.isActive,
    });
    return super.save();
  }

  override async search(body?: any): Promise<any> {
    await super.search(body);
    this.dataSource.data.forEach((s: any) => s.id = s.roleId);
  }
}
