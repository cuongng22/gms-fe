import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, NO_ERRORS_SCHEMA, OnInit} from '@angular/core';
import {CommonModule, NgClass, NgIf, TitleCasePipe} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {HeaderListBaseComponent} from "src/app/crew-trip/shared/header-list-base.component";
import {UsersService} from "src/app/crew-trip/core/services/users-service";
import {MatError, MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NationService} from "src/app/crew-trip/core/services/nation-service";
import {DataTransformPipe} from "src/app/crew-trip/shared/data-transform.pipe";
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInput} from '@angular/material/input';
import {InputSizeComponent} from '../../shared/input/input-size.component';
import {NoDataRowOutlet} from '@angular/cdk/table';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {RoleFunctionComponent} from '../roles/role-function/role-function.component';


@Component({
  imports: [RouterLink, CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  selector: 'app-nation',
  standalone: true,
  styleUrl: './nation.component.scss',
  templateUrl: './nation.component.html'
})


export class NationComponent extends HeaderListBaseComponent implements OnInit {
  override baseService = inject(NationService);
  usersService = inject(UsersService);
  fb = inject(FormBuilder);

  //variable

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
    // {label: "Tên nhóm quyền", value: "roleName"},
    // {label: "Quyền", value: "functionCount"},
    // {label: "Tài khoản", value: "userCount"},
    // {label: "Trạng thái", value: "isActiveLabel"},
  ];

  override async ngOnInit() {
    await Promise.all([
      this.search(),
    ]).then(() => {
    });
    this.displayedColumns = ['select', 'stt', ...this._displayedColumns.map(s => s.value), 'action'];
  }

  async _detail(index: number) {
    this.formGroupDetail.patchValue(this.dataSource.data[index] as JSON);
    this.toggleClass();
  }
}
