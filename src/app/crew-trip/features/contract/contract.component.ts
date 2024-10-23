import {Component, inject, Input, OnInit} from '@angular/core';
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
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {RolesService} from "src/app/crew-trip/core/services/roles-service";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {RoleFunctionComponent} from "src/app/crew-trip/features/roles/role-function/role-function.component";
import {NoDataRowOutlet} from "@angular/cdk/table";
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {ContractService} from "src/app/crew-trip/core/services/contract-service";
import {ContractDetailComponent} from "src/app/crew-trip/features/contract/contract-detail/contract-detail.component";


@Component({
  selector: 'app-contract',
  standalone: true,
  imports: [RouterLink, CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet, ContractDetailComponent],
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss',
})


export class ContractComponent extends CommonComponent implements OnInit {
  override baseService = inject(ContractService);
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
  @Input() contractId: any;

  showPopupAnnex = false;

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({

    });
    this.formGroupDetail = this.fb.group({

    });
    this.formGroupSearchInit = {...this.formGroupSearch.value}
    this.formGroupDetailInit = {...this.formGroupDetail.value}
  }

  override async ngOnInit() {
    await Promise.all([
      // this.search(),
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

  async showAnnex(id:any){
    /**
     * todo: api chi tiet hop dong
     * gan vao formDetail
     *
     *
     */
    this.showPopupAnnex = true;
  }
}
