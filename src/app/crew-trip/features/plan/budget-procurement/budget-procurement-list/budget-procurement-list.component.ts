import { CommonModule, AsyncPipe } from '@angular/common';
import { Component, DestroyRef, ElementRef, Inject, inject, model, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { debounceTime, startWith, Subject } from 'rxjs';
import { AlreadyExistsValidator } from 'src/app/crew-trip/core/validator/already-exists';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { MESSAGE } from 'src/app/crew-trip/shared/utils/constant';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { PlanBudgetProcurementService } from 'src/app/crew-trip/core/services/plan-budget-procurement.service';
import { HttpStatusCode } from '@angular/common/http';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxControlError } from 'ngxtension/control-error';
import { PlanTypeEnum, Statuses, years } from '../budget-procurement.model';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';

@Component({
  selector: 'app-budget-procurement-list',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, DataTransformPipe, RouterLink, RouterModule, AsyncPipe, FileUploadModule,
    SelectionSuggestComponent, SelectionComponent, NgxControlError, DigitOnlyModule, SelectMultipleComponent],
  templateUrl: './budget-procurement-list.component.html',
  styleUrl: './budget-procurement-list.component.scss'
})
export class BudgetProcurementListComponent extends CommonComponent implements OnInit {

  private readonly destroyRef = inject(DestroyRef);
  override baseService = inject(PlanBudgetProcurementService);

  versions = model<any[]>([]);
  statuses = Statuses;
  years = model<any[]>([]);

  override formGroupSearch = this.formBuilder.group({
    s: new FormControl(''),
    year: new FormControl(''),
    version: new FormControl(''),
    status: new FormControl([])
  });

  override formGroupDetail = this.formBuilder.group({
    id: new FormControl('')
  });

  formGroupReject = this.formBuilder.group({
    id: new FormControl(''),
    reason: new FormControl('', Validators.required)
  });


  showDialogReject = false;

  constructor() {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();
    this.years.set(years());
    this.baseService.versions().then(res => {
      this.versions.set(res.data);
    });
    this.search();

    // -----------------List Budget Shopping-------------
    this.displayedColumns = ['select', 'name', 'year', 'version', 'versionProd', 'versionRate', 'time', 'status', 'action'];
  }

  async showConfirmReject(id: any) {
    this.formGroupReject.patchValue({ id: id });
    this.toggleDialogReject();
  }

  async reject() {
    this.formGroupReject.markAllAsTouched();
    if (this.formGroupReject.invalid) {
      return;
    }
    try {
      await this.spinner.show();
      const body = {
        id: this.formGroupReject.value.id,
        status: 'rejected',
        reason: this.formGroupReject.value.reason
      }
      let res = await this.baseService.updateStatus(body);
      this.baseService.showSuccess(MESSAGE.REJECT_SUCCESS);
      await this.search();
      return res;
    } catch (e: any) {
      console.log(e);
      this.baseService.showError((e.error?.error) ?? (e.error?.error?.code) ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
      await this.closeConfirmReject();
    }
  }

  async closeConfirmReject() {
    this.formGroupReject.reset({});
    this.formGroupReject.markAsUntouched();
    this.formGroupReject.markAsPristine();
    this.formGroupReject.updateValueAndValidity();

    this.toggleDialogReject();
  }

  checkBoxTable(row: any) {
    this.selection.clear();
    this.selection.toggle(row);
  }

  override async showDialogDetail(isCreate: boolean, id?: any) {
    let budgetProcurementDetail;
    if (id != null) {
      let res = this.dataSource.data.find((x: any) => x.id == id);
      budgetProcurementDetail = res;
    }
    const dialogDetailRef = this.dialog.open(DialogBudgetProcurementDetail, {
      data: { isCreate: isCreate, budgetProcurementDetail: budgetProcurementDetail },
    });
    dialogDetailRef.afterClosed().subscribe(async (res) => {
      if (res) {
        await this.search();
      }
    });

  }
  async changeStatus(id: any, status: string) {
    console.log(status)
    try {
      await this.spinner.show();
      const body = {
        id: id,
        status: status
      }
      let res = await this.baseService.updateStatus(body);
      this.baseService.showSuccess(MESSAGE.UPDATE_SUCCESS);
      await this.search(null, true);
      return res;
    } catch (e: any) {
      console.log(e);
      this.baseService.showError((e.error?.error) ?? (e.error?.error?.code) ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }
  override async search<T>(body?: any, isNextPage?: boolean) {
    let bodySearch = {
      ...this.formGroupSearch.value, status: this.formGroupSearch.value.status?.map((x: any) => x).join(','),
      type: PlanTypeEnum.KHNS
    };
    super.search(bodySearch, isNextPage);
  }

  toggleDialogReject() {
    this.showDialogReject = !this.showDialogReject;
  }
}


@Component({
  selector: 'dialog-budget-procurement-detail',
  templateUrl: 'dialog-budget-procurement-detail.component.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatCheckboxModule,
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, DataTransformPipe, RouterLink, RouterModule, AsyncPipe, FileUploadModule, DigitOnlyModule,
    NgxControlError
  ],
})
export class DialogBudgetProcurementDetail extends CommonComponent {
  override baseService = inject(PlanBudgetProcurementService);

  override formGroupDetail = this.formBuilder.group({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    year: new FormControl('', Validators.required),
    version: new FormControl('', {
      validators: [Validators.required],
    }),
    versionProd: new FormControl(''),
    versionRate: new FormControl(''),
    updateBudgetPlan: new FormControl(false)
  });

  isCreate = model<boolean>(false);


  constructor(
    public dialogRef: MatDialogRef<DialogBudgetProcurementDetail>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super();
  }

  override ngOnInit(): void {
    if (this.data) {
      console.log(this.data);
      this.isCreate.set(this.data.isCreate);
      this.baseService.isUpdate = !this.data.isCreate || !!this.formGroupDetail.controls.id.value;
      if (this.baseService.isUpdate) {
        this.formGroupDetail.controls.versionProd.disable();
        this.formGroupDetail.controls.versionRate.disable();
      }

      if (this.data.budgetProcurementDetail) {
        console.log(this.data.budgetProcurementDetail);
        this.formGroupDetail.patchValue(this.data.budgetProcurementDetail);
      }
    }
  }

  override async save() {
    try {
      this.formGroupDetail.markAllAsTouched();
      if (this.formGroupDetail.invalid) {
        return;
      }
      const update = !!this.formGroupDetail.value.id;
      await this.spinner.show();
      let res;
      if (update) {
        res = await this.baseService.update({ ...this.formGroupDetail.value, type: PlanTypeEnum.KHNS });
      } else {
        res = await this.baseService.create({ ...this.formGroupDetail.value, type: PlanTypeEnum.KHNS });
      }
      console.log(res)
      this.baseService.showSuccess(update ? MESSAGE.UPDATE_SUCCESS : MESSAGE.CREATE_SUCCESS);
      this.dialogRef.close('OK');
    } catch (e: any) {
      if ((e.status != HttpStatusCode.Conflict) && !(e.status == HttpStatusCode.InternalServerError && e.error?.error.includes('UNIQUE'))) {
        this.baseService.showError(e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR);
      }
      return e;
    } finally {
      this.spinner.hide();
    }
  }
}
