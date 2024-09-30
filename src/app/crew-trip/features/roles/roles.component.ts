import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {CommonModule, NgClass, NgIf, TitleCasePipe} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {HeaderListBaseComponent} from "src/app/crew-trip/shared/header-list-base.component";
import {UsersService} from "src/app/crew-trip/core/services/users-service";
import {DataTransformPipe} from "src/app/crew-trip/shared/data-transform.pipe";
import {MatError, MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {Constant, MESSAGE} from "src/app/crew-trip/shared/utils/constant";
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {RolesService} from "src/app/crew-trip/core/services/roles-service";
import {HttpStatusCode} from "@angular/common/http";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {RoleFunctionComponent} from "src/app/crew-trip/features/roles/role-function/role-function.component";
import {NoDataRowOutlet} from "@angular/cdk/table";


@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [RouterLink,CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})


export class RolesComponent extends HeaderListBaseComponent implements OnInit {
  override baseService = inject(RolesService);
  usersService = inject(UsersService);
  fb = inject(FormBuilder);

  //variable
  step = 1;

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

  _displayedColumns: { label: string; value: string, type?: string, format?: string }[] = [
    // {label: 'Ngày tạo', value: 'ngayTao', type: Constant.DATE, format: Constant.DATE_FORMAT},
    {label: "Tên nhóm quyền", value: "roleName"},
    {label: "Quyền", value: "functionCount"},
    {label: "Tài khoản", value: "userCount"},
    {label: "Trạng thái", value: "isActiveLabel"},
  ];

  override async ngOnInit() {
    await Promise.all([
      this.search(),
    ]).then(() => {
      this.dataSource.data = this.dataSource.data.map((s:any)=>({...s,isActiveLabel:!!s.isActive?'Hoạt động':'Không hoạt động'}))
    });
    this.displayedColumns = ['select', 'stt', ...this._displayedColumns.map(s => s.value), 'action'];
  }

  override async save(data: any) {
    //fix tam
    data.name = this.formGroupDetail.value.roleName
    data.id = this.formGroupDetail.value.roleId

    this.formGroupDetail.markAllAsTouched();
    if (this.formGroupDetail.invalid) {
      return;
    }
    super.save(data).then(res => {
      //todo check de tra ve thong bao
      this.baseService.showSuccess(data.id?MESSAGE.UPDATE_SUCCESS:MESSAGE.CREATE_SUCCESS)
      this.search();
      this.closeDetail();
    });
  }

  override async delete(id: any) {
    super.delete(id).then(res => {
      //todo: check res thanh cong thi thong bao
      this.search();
    });
  }

  async _detail(index: number) {
    this.formGroupDetail.patchValue(this.dataSource.data[index] as JSON);
    this.toggleClass()
  }

  async nextStep(index: number) {
    this.formGroupDetail.patchValue(this.dataSource.data[index] as JSON);
    this.step = 2;
  }
  async backStep() {
    this.search(),
    this.step = 1;
  }

  //
  // New Popup Trigger
  classAppliedFunction = false;

  toggleClassFunction() {
    this.classAppliedFunction = !this.classAppliedFunction;
  }
}
