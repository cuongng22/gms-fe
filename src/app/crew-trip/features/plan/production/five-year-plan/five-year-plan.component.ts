import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, NO_ERRORS_SCHEMA, OnInit} from '@angular/core';
import {CommonModule, NgClass, NgIf, TitleCasePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatError, MatFormField, MatLabel, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {DataTransformPipe} from 'src/app/crew-trip/shared/data-transform.pipe';
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
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {Constant, MESSAGE, removeNullValues} from 'src/app/crew-trip/shared/utils/constant';
import {FiveYearPlanService} from 'src/app/crew-trip/core/services/five-year-plan.service';
import {SelectionComponent} from "src/app/crew-trip/shared/component/selection/selection.component";
import {HttpStatusCode} from "@angular/common/http";
import {InputComponent} from "src/app/crew-trip/shared/component/input/input.component";


@Component({
  imports: [CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, MatError, InputSizeComponent, InputComponent],
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
    {label: $localize`Production`, value: 'totalInternational', type: Constant.NUMBER},
    {label: $localize`Compared to last year`, value: 'rateInternationalLast', type: Constant.NUMBER},
    {label: $localize`Production`, value: 'totalDomestic', type: Constant.NUMBER},
    {label: $localize`Compared to last year`, value: 'rateDomesticLast', type: Constant.NUMBER},
    {label: $localize`Production`, value: 'total', type: Constant.NUMBER},
    {label: $localize`Compared to last year`, value: 'rateTotalLast', type: Constant.NUMBER},
    {label: $localize`Remark`, value: 'notes', rowspan: '2'},
    {label: $localize`Status`, value: 'activeLabel', rowspan: '2'},
  ];
  listYear: any = [];
  currentYear = new Date().getFullYear();
  existYear: boolean = false;

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      s: ['',], active: ['',], area: ['',],
    });
    this.formGroupDetail = this.fb.group({
      id: ['',],
      year: ['', [Validators.required, this.existYearValidator.bind(this)]],
      totalInternational: ['', [Validators.required, Validators.min(1)]],
      totalDomestic: ['', [Validators.required, Validators.min(1)]],
      total: [{value: '', disabled: true}],
      notes: ['', Validators.maxLength(500)],
      active: [true,]
    });
    this.formGroupSearchInit = {...this.formGroupSearch.value};
    this.formGroupDetailInit = {...this.formGroupDetail.value};
  }

  override async ngOnInit() {
    this.currentYear = new Date().getFullYear();
    this.listYear = Array.from({length: this.currentYear - 2020 + 11}, (_, i) => (2020 + i).toString());
    await Promise.all([this.search(),]).then(() => {
      console.log(this.dataSource);
    });
    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'action'];
    this.displayedColumns1 = ['stt', 'year', 'international', 'domestic', 'totalOutput', 'notes', 'activeLabel', 'action'];
    this.displayedColumns2 = ['totalInternational', 'rateInternationalLast', 'totalDomestic', 'rateDomesticLast', 'total', 'rateTotalLast'];
  }

  calculator() {
    if (this.formGroupDetail.value.totalInternational && this.formGroupDetail.value.totalDomestic) {
      this.formGroupDetail.patchValue({
        total: (this.formGroupDetail.value.totalInternational + this.formGroupDetail.value.totalDomestic * 100) / 100
      });
    }
  }

  override async exportFile(body?: any, filename?: string) {
    try {
      await this.spinner.show();
      this.baseService.export({...this.formGroupSearch.value, export: true}).then(res => {
        this.downloadFile(res, filename ?? res.fileName);
      });
    } catch (e: any) {
      console.log(e);
      this.baseService.showError((e.error?.error?.code) ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  override async save(): Promise<any> {
    super.save().then(res => {
      if (res.status == HttpStatusCode.Conflict) {
        this.existYear = true;
        this.formGroupDetail.controls['year'].updateValueAndValidity();
        this.existYear = false;
      } else if (res.status == HttpStatusCode.InternalServerError && res.error?.error.includes('SERVICE_CODE_UNIQUE')) {
        this.existYear = true;
        this.formGroupDetail.controls['year'].updateValueAndValidity();
        this.existYear = false;
      }
    });
  }

  override async showDialogDetail(id?: any, type?: string) {
    this.formGroupDetail.get('year')?.enable();
    if (id != null && type === 'index') {
      this.formGroupDetail.get('year')?.disable();
      this.formGroupDetail.patchValue(this.dataSource.data[id] as JSON);
    } else if (id != null) {
      await this.detail(id);
    }
    this.toggleDialogCreate();
  }

  existYearValidator(control: AbstractControl): ValidationErrors | null {
    return this.existYear ? {existYear: true} : null
  }
}
