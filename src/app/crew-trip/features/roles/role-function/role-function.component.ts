import {Component, inject, OnInit} from '@angular/core';
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
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {Constant} from "src/app/crew-trip/shared/utils/constant";
import {RolesService} from "src/app/crew-trip/core/services/roles-service";
import {HttpStatusCode} from "@angular/common/http";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';


@Component({
  selector: 'app-role-function',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup],
  templateUrl: './role-function.component.html',
  styleUrl: './role-function.component.scss',
})


export class RoleFunctionComponent extends HeaderListBaseComponent implements OnInit {
  override baseService = inject(RolesService);
  usersService = inject(UsersService);
  fb = inject(FormBuilder);

  //variable
  listUsers = [];
  readMode = false;

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      s: ['',],
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
    {label: "Trạng thái", value: "isActive"},
  ];

  override async ngOnInit() {
    await Promise.all([
      this.search({page: 1}),
      // this.loadListUsers(),
    ]).then(() => {
    });
    this.displayedColumns = ['select', 'stt', ...this._displayedColumns.map(s => s.value), 'action'];
  }

  async loadListUsers() {
    let res = await this.usersService.search({page: -1});
    if (res) {
      this.listUsers = res;
    }
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
      this.search({page: 1});
      this.closeDetail();
    });
  }

  override async delete(id: any) {
    super.delete(id).then(res => {
      console.log(res, 92)
      //todo: check res thanh cong thi thong bao
      this.search();
    });
  }

  async _detail(index: number) {
    this.formGroupDetail.patchValue(this.dataSource.data[index] as JSON);
    this.toggleClass()
  }

  //
  // New Popup Trigger
  classAppliedFunction = false;

  toggleClassFunction() {
    this.classAppliedFunction = !this.classAppliedFunction;
  }
}
