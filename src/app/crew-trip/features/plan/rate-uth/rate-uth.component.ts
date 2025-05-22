import { Component, inject, OnInit, viewChild } from '@angular/core';
import { FileUploadComponent, FileUploadValidators } from '@iplab/ngx-file-upload';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { MatAnchor, MatButton, MatButtonModule } from '@angular/material/button';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader, MatCardModule,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableModule
} from '@angular/material/table';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { ExchangeRateService } from 'src/app/crew-trip/core/services/exchange-rate.service';
import { Observable, of, take } from 'rxjs';
import { Constant, MESSAGE, removeNullValues } from 'src/app/crew-trip/shared/utils/constant';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CommonModule } from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';
import { HttpStatusCode } from '@angular/common/http';
import { HasPermissionDirective } from 'src/app/crew-trip/shared/directive/has-permission.directive';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';

@Component({
  selector: 'app-rate-uth',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, MatCheckbox, FileUploadComponent, HasPermissionDirective,
    SelectionSuggestComponent
  ],
  templateUrl: './rate-uth.component.html',
  styleUrl: './rate-uth.component.scss',
  providers: [HasPermissionDirective, DataTransformPipe]
})
export class RateUthComponent extends CommonComponent implements OnInit {
  override baseService = inject(ExchangeRateService);
  dataTransformPipe: DataTransformPipe = inject(DataTransformPipe);


  showDialogUpload = false;
  fileUpload = new FormControl<File[]>([], [Validators.required, FileUploadValidators.filesLimit(1)]);
  uploadFileError: { blob?: Blob, fileName?: string, totalErrors?: string } = {};
  listDatasource: Observable<string[]> = of(['Sync', 'Excel']);
  listVersion: any[] = []//Observable<string[]> = of([]);

  version: string | null = null;
  createdDate: string | null = null;

  override formGroupSearch = this.formBuilder.group({
    s: [''], //Keyword Search
    version: ['', Validators.required],
    sourceType: [''],
    export: [false],
    startDate: [],
    endDate: [],
  });

  override async ngOnInit() {
    super.ngOnInit();
    this.displayedColumns = ['stt', 'currencyCode', 'planUth', 'january', 'february', 'march', 'april', 'may'
      , 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'average', 'rateDtTh',// 'version'
    ];
    await this.initSearchVersion();
    await this.search();
    this.fileUpload.valueChanges.subscribe(value => {
      this.uploadFileError = {};
    });
    this.formGroupSearch.controls.startDate.valueChanges.subscribe(() => {
      this.changeCreatedDate();
    });
    this.formGroupSearch.controls.endDate.valueChanges.subscribe(() => {
      this.changeCreatedDate();
    });
  }

  async initSearchVersion(params?: any) {
    await this.baseService.getListVersion({ option: 0, ...removeNullValues(params) }).then(res => {
      this.listVersion = res.data;
      if (this.listVersion) {
        const firstVersion = this.listVersion[0];
        this.formGroupSearch.controls.version.patchValue(firstVersion.version);
       
      }
    });
  }

  override async search(body?: any, isNextPage?: boolean) {
    try {
      await this.spinner.show();
      if (!isNextPage) {
        this.pageIndex = Constant.PAGE;
      }
      this.formGroupSearch.patchValue({ export: false });
      let startDate = this.formGroupSearch.controls.startDate.value;
      let endDate = this.formGroupSearch.controls.endDate.value;
      const res = await this.baseService.uthSearch({
        page: this.pageIndex,
        size: this.pageSize, ...removeNullValues(body) || removeNullValues(this.formGroupSearch.value),
        limit: this.pageSize, ...removeNullValues(body) || removeNullValues(this.formGroupSearch.value),
        startDate: startDate ? this.dataTransformPipe.transform(startDate, ['date', Constant.LOCAL_DATE_FORMAT]) : '',
        endDate: endDate ? this.dataTransformPipe.transform(endDate, ['date', Constant.LOCAL_DATE_FORMAT]) : ''
      });
      if (res) {
        if (res.status === HttpStatusCode.Ok) {
          this.version = this.formGroupSearch.controls.version.value;
          this.createdDate = res.data.createdDate;
          this.dataSource.data = res.data?.pages?.content;
          this.dataSource.data = this.dataSource.data.map((s: any) => ({
            ...s,
            isActiveLabel: s.isActive ? MESSAGE.ACTIVE : MESSAGE.INACTIVE,
            activeLabel: !!s.active || !!s.status ? MESSAGE.ACTIVE : MESSAGE.INACTIVE
          }));
          this.totalElement = res.data?.pages?.totalElements;
        }
        return res;
      }
    } catch (e: any) {
      console.log(e);
      this.baseService.showError(e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }


  async uploadFile() {
    try {
      this.fileUpload.markAllAsTouched();
      if (this.fileUpload.valid && this.fileUpload.value) {
        const form = new FormData();
        const file: File = this.fileUpload.value[0];
        form.append('file', new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type }));
        await this.spinner.show();
        const res = await this.baseService.uploadFileUTH(form);
        this.uploadFileError = res;
        if (!res.totalErrors) {
          this.baseService.showSuccess(this.MESSAGE.UPLOAD_SUCCESS);
          this.toggleDialogUpload();
          this.resetFileUpload();
          await this.initSearchVersion();
          await this.search();
        }
      }
    } finally {
      await this.spinner.hide();
    }
  }

  async downloadFileError() {
    if (this.uploadFileError.blob) {
      this.downloadFile(this.uploadFileError.blob, this.uploadFileError.fileName ?? 'file-error.xlsx');
    }
  }

  toggleDialogUpload() {
    this.showDialogUpload = !this.showDialogUpload;
  }

  override async downloadTemplate(filename?: string) {
    try {
      await this.spinner.show();
      const res = await this.baseService.exportData(null, 'uth/template');
      console.log(res);
      this.downloadFile(res.blob, filename ?? res.fileName);
    } catch (e: any) {
      console.log(e);
      this.baseService.showError(e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  resetFileUpload() {
    this.uploadFileError = {};
    this.fileUpload.setValue([]);
    this.fileUpload.reset();
  }

  async sync() {
    try {
      await this.spinner.show();
      await this.baseService.uthSync();
      this.showSuccess(MESSAGE.SYNC_SUCCESS)
    } catch (e: any) {
      this.showError(e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR)
    } finally {
      this.spinner.hide()
    }
  }

  changeCreatedDate() {
    let startDate = this.formGroupSearch.controls.startDate.value;
    let endDate = this.formGroupSearch.controls.endDate.value;
    if (startDate && endDate) {
      startDate = this.dataTransformPipe.transform(startDate, ['date', Constant.LOCAL_DATE_FORMAT]);
      endDate = this.dataTransformPipe.transform(endDate, ['date', Constant.LOCAL_DATE_FORMAT]);
      this.initSearchVersion({ startDate: startDate, endDate: endDate });
    }
  }
}
