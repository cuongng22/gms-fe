import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, NO_ERRORS_SCHEMA, OnInit} from '@angular/core';
import {CommonModule, NgClass, NgIf, TitleCasePipe} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
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
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {NoDataRowOutlet} from '@angular/cdk/table';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {RoleFunctionComponent} from 'src/app/crew-trip/features/roles/role-function/role-function.component';
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {Constant} from "src/app/crew-trip/shared/utils/constant";
import {FiveYearPlanService} from "src/app/crew-trip/core/services/five-year-plan-service";


@Component({
  imports: [RouterLink, CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  selector: 'app-five-year-plan',
  standalone: true,
  styleUrl: 'five-year-plan.component.scss',
  templateUrl: 'five-year-plan.component.html'
})


export class FiveYearPlanComponent extends CommonComponent implements OnInit {
  override baseService = inject(FiveYearPlanService);
  fb = inject(FormBuilder);

  //variable
  displayedColumns1: string[] = [];
  displayedColumns2: string[] = [];
  _displayedColumns: {
    label: string;
    value: string,
    type?: string,
    format?: string,
    rowspan?: string,
    colspan?: string
  }[] = [// {label: 'Ngày tạo', value: 'ngayTao', type: Constant.DATE, format: Constant.DATE_FORMAT},
    {label: $localize`Year`, value: 'year', rowspan: '2'},
    {label: $localize`Total International`, value: 'totalInternational', type: Constant.NUMBER},
    {label: $localize`Rate InternationalLast`, value: 'rateInternationalLast', type: Constant.NUMBER},
    {label: $localize`Total Domestic`, value: 'totalDomestic', type: Constant.NUMBER},
    {label: $localize`Rate DomesticLast`, value: 'rateDomesticLast', type: Constant.NUMBER},
    {label: $localize`Total`, value: 'total', type: Constant.NUMBER},
    {label: $localize`Rate Total Last`, value: 'rateTotalLast', type: Constant.NUMBER},
    {label: $localize`Notes`, value: 'notes', rowspan: '2'},
    {label: $localize`Active`, value: "activeLabel", rowspan: '2'},
  ];

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      s: ['',], active: ['',], area: ['',],
    });
    this.formGroupDetail = this.fb.group({
      id: ['',],
      area: ['', [Validators.required]],
      code: ['', [Validators.required]],
      vniName: ['', [Validators.required]],
      engName: ['', [Validators.required]],
      currencyCode: ['', [Validators.required]],
      curCode: ['', [Validators.required]],
      active: [true,]
    });
    this.formGroupSearchInit = {...this.formGroupSearch.value}
    this.formGroupDetailInit = {...this.formGroupDetail.value}
  }

  override async ngOnInit() {
    await Promise.all([this.search(),]).then(() => {
      console.log(this.dataSource)
    });
    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'action'];
    this.displayedColumns1 = ['stt', 'year', 'international', 'domestic', 'totalOutput','notes','activeLabel', 'action'];
    this.displayedColumns2 = ['totalInternational', 'rateInternationalLast', 'totalDomestic', 'rateDomesticLast', 'total', 'rateTotalLast'];
  }

}
