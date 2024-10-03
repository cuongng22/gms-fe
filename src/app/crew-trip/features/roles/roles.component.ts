import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {CommonModule, NgClass, NgIf, TitleCasePipe} from "@angular/common";
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
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MESSAGE} from "src/app/crew-trip/shared/utils/constant";
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {RolesService} from "src/app/crew-trip/core/services/roles-service";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {RoleFunctionComponent} from "src/app/crew-trip/features/roles/role-function/role-function.component";
import {NoDataRowOutlet} from "@angular/cdk/table";
import {CommonComponent} from "src/app/crew-trip/shared/common.component";


@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [RouterLink, CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})


export class RolesComponent extends CommonComponent implements OnInit {
  override baseService = inject(RolesService);
  usersService = inject(UsersService);
  fb = inject(FormBuilder);

  //variable
  step = 1;
  _displayedColumns: { label: string; value: string, type?: string, format?: string }[] = [
    // {label: 'Ngày tạo', value: 'ngayTao', type: Constant.DATE, format: Constant.DATE_FORMAT},
    {label: $localize`Role Name`, value: "roleName"},
    {label: $localize`Function`, value: "functionCount"},
    {label: $localize`Account`, value: "userCount"},
    {label: $localize`Status`, value: "isActiveLabel"},
  ];
  // New Popup Trigger
  classAppliedFunction = false;

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      s: ['',],
      a: ['',],
    });
    this.formGroupDetail = this.fb.group({
      id: ['',],
      roleId: ['',],
      roleName: ['', [Validators.required]],
      name: [''],
      isActive: [true,],
    });
    this.formGroupSearchInit = {...this.formGroupSearch.value}
    this.formGroupDetailInit = {...this.formGroupDetail.value}
  }

  override async ngOnInit() {
    await Promise.all([
      this.search(),
    ]).then(() => {
    });
    this.displayedColumns = ['select', 'stt', ...this._displayedColumns.map(s => s.value), 'action'];
  }

 /* override async save() {
    //fix tam
    data.name = this.formGroupDetail.value.roleName
    data.id = this.formGroupDetail.value.roleId

    this.formGroupDetail.markAllAsTouched();
    if (this.formGroupDetail.invalid) {
      return;
    }
    super.save().then(res => {
      //todo check de tra ve thong bao
      this.baseService.showSuccess(data.id ? MESSAGE.UPDATE_SUCCESS : MESSAGE.CREATE_SUCCESS);
      this.closeDetail();
    });
  }*/

  async _detail(index: number) {
    this.formGroupDetail.patchValue(this.dataSource.data[index] as JSON);
    this.toggleDialogCreate();
  }

  async nextStep(index: number) {
    this.formGroupDetail.patchValue(this.dataSource.data[index] as JSON);
    this.step = 2;
  }

  //

  async backStep() {
    this.search(),
      this.step = 1;
  }

  toggleClassFunction() {
    this.classAppliedFunction = !this.classAppliedFunction;
  }
}
