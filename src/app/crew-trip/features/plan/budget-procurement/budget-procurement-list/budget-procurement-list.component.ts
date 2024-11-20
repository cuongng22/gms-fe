import { CommonModule, AsyncPipe } from '@angular/common';
import { Component, DestroyRef, ElementRef, Inject, inject, model, ViewChild } from '@angular/core';
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
import { BudgetProcurementPlanService } from 'src/app/crew-trip/core/services/budget-procurement-plan.service';
import { AlreadyExistsValidator } from 'src/app/crew-trip/core/validator/already-exists';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { MESSAGE } from 'src/app/crew-trip/shared/utils/constant';

@Component({
  selector: 'app-budget-procurement-list',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, DataTransformPipe, RouterLink, RouterModule, AsyncPipe, FileUploadModule],
  templateUrl: './budget-procurement-list.component.html',
  styleUrl: './budget-procurement-list.component.scss'
})
export class BudgetProcurementListComponent extends CommonComponent {

  private readonly destroyRef = inject(DestroyRef);
  override baseService = inject(BudgetProcurementPlanService);

  formBuilder = inject(FormBuilder);


  @ViewChild('version') version: ElementRef<HTMLInputElement>;
  versionList: string[] = []; // danh sách chọn phiên bản
  filteredOptionsVersion = model<string[]>([]); // filtered Des
  keySearchVersion = new Subject<string>();

  //Bản nháp, Hoàn thành KH quốc tế, Hoàn thành KH quốc nội, Từ chối, Đã duyệt, Xác nhận
  statusList: { code: string, value: string }[] = [
    { code: '1', value: 'Bản nháp' },
    { code: '2', value: 'Hoàn thành KH quốc tế' },
    { code: '3', value: 'Hoàn thành KH quốc nội' },
    { code: '4', value: 'Từ chối' },
    { code: '5', value: 'Đã duyệt' },
    { code: '6', value: 'Xác nhận' }
  ]

  override formGroupSearch = this.formBuilder.group({
    s: new FormControl(''),
    year: new FormControl(''),
    versionId: new FormControl(''),
    status: new FormControl('')
  });

  override formGroupDetail = this.formBuilder.group({
    id: new FormControl('')
  });

  formGroupReject = this.formBuilder.group({
    id: new FormControl(''),
    reason: new FormControl('', Validators.required)
  });


  showDialogReject = false;

  constructor(public dialog: MatDialog) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.dataSource.data = [
      {
        id: '1',
        name: 'Budget Plan A',
        year: 2023,
        version: 'v1.0',
        versionProd: 'v1.0-prod',
        versionRate: 'v1.0-rate',
        status: 'Đã duyệt',
        completionDate: new Date('2023-01-15'),
        confirmationDate: new Date('2023-01-20'),
        approvalDate: new Date('2023-01-25'),
        rejectionDate: new Date('2023-02-25'),
        reason: 'test',
        notes: 'Initial budget plan',
        updateBudgetPlan: false,
        createdDate: new Date('2023-01-01'),
        createdBy: 'User A',
        updatedBy: 'User B',
        updatedDate: new Date('2023-01-10')
      },
      {
        id: '2',
        name: 'Budget Plan B',
        year: 2023,
        version: 'v2.0',
        versionProd: 'v2.0-prod',
        versionRate: 'v2.0-rate',
        status: 'Từ chối',
        completionDate: new Date('2023-02-15'),
        confirmationDate: new Date('2023-02-20'),
        approvalDate: new Date('2023-01-25'),
        rejectionDate: new Date('2023-02-25'),
        reason: 'Insufficient funds',
        notes: 'Second budget plan',
        updateBudgetPlan: true,
        createdDate: new Date('2023-02-01'),
        createdBy: 'User C',
        updatedBy: 'User D',
        updatedDate: new Date('2023-02-10')
      }
    ];


    // --------------------handle valueChange for filterd-----------------
    this.keySearchVersion.pipe(
      debounceTime(500),
      startWith(''))
      .subscribe(value => {
        if (!value) {
          this.filteredOptionsVersion.set(this.versionList);
          return;
        }
        const filterValue = value.toLowerCase();
        this.filteredOptionsVersion.set(this.versionList.filter(version => version?.toString().toLowerCase().includes(filterValue)));
      });

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
      let res = await this.baseService.reject(this.formGroupReject.value.id);
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


  filterVersion(): void {
    this.keySearchVersion.next(this.version.nativeElement.value);
  }

  checkBoxTable(row: any) {
    this.selection.clear();
    this.selection.toggle(row);
  }

  override async showDialogDetail(isCreate: boolean, id?: any) {
    let budgetProcurementDetail;
    if (id != null) {
      let res = await this.baseService.detail(id);
      budgetProcurementDetail = res
    }
    this.dialog.open(DialogBudgetProcurementDetail, {
      data: { isCreate: isCreate, budgetProcurementDetail: budgetProcurementDetail },
    })

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
    MatTableModule, MatPaginatorModule, DataTransformPipe, RouterLink, RouterModule, AsyncPipe, FileUploadModule
  ],
})
export class DialogBudgetProcurementDetail extends CommonComponent {
  formBuilder = inject(FormBuilder);
  override baseService = inject(BudgetProcurementPlanService);

  override formGroupDetail = this.formBuilder.group({
    id: new FormControl(''),
    checkBox: new FormControl(false),
    planName: new FormControl('', Validators.required),
    year: new FormControl('', Validators.required),
    version: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [AlreadyExistsValidator.existsVersion(this.baseService)],
      updateOn: 'blur'
    }),
    versionOfProduction: new FormControl(''),
    versionOfExchangeRate: new FormControl(''),
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
      this.isCreate.set(this.data.isCreate)
      this.baseService.isUpdate = !this.data.isCreate || !!this.formGroupDetail.controls.id.value;

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
      let update = !!this.formGroupDetail.value.id;
      await this.spinner.show();
      let res;
      if (update) {
        res = await this.baseService.update(this.formGroupDetail.value);
      } else {
        res = await this.baseService.create(this.formGroupDetail.value);
      }
      console.log(res)
      await this.search();
      this.baseService.showSuccess(update ? MESSAGE.UPDATE_SUCCESS : MESSAGE.CREATE_SUCCESS);
      this.dialogRef.close();
    } catch (e: any) {
      this.baseService.showError(e.error?.data ?? JSON.stringify(e.error) ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }
}