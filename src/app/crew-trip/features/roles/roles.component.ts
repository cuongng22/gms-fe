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
import {InputComponent} from "src/app/crew-trip/shared/input/input.component";
import {RolesService} from "src/app/crew-trip/core/services/roles-service";


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputComponent, MatError, MatPrefix, MatSuffix],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})


export class RolesComponent extends HeaderListBaseComponent implements OnInit {
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
      roleName: ['', [Validators.required]],
    });
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
      // this.search(),
      // this.loadListUsers(),
    ]).then(() => {
    });

    this.dataSource.data=[
      {
        "userCount": 1,
        "roleId": 1,
        "roleName": "admin",
        "functionCount": 4,
        "isActive": 1
      },
      {
        "userCount": 1,
        "roleId": 2,
        "roleName": "manager",
        "functionCount": 3,
        "isActive": 1
      },
      {
        "userCount": 0,
        "roleId": 21,
        "roleName": "Thêm mới 1",
        "functionCount": 2,
        "isActive": 0
      },
      {
        "userCount": 0,
        "roleId": 22,
        "roleName": "Thêm mới 2",
        "functionCount": 1,
        "isActive": 0
      }
    ]
    this.displayedColumns = ['select', 'stt', ...this._displayedColumns.map(s => s.value), 'action'];
  }

  async loadListUsers() {
    let res = await this.usersService.search({page: -1});
    if (res) {
      this.listUsers = res;
    }
  }

  override async save(data: any) {
    /*super.save(data).then(res => {
      console.log(res)
      /!*todo: check res thanh cong thi thong bao*!/
      this.search();
      this.closeDetail();
    });*/
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
}
