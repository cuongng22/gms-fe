import {Component, inject, OnInit} from '@angular/core';
import {FileUploadComponent, FileUploadValidators} from '@iplab/ngx-file-upload';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MatAnchor, MatButton, MatButtonModule} from '@angular/material/button';
import {MatAutocomplete, MatAutocompleteModule, MatAutocompleteTrigger} from '@angular/material/autocomplete';
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
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {ExchangeRateService} from 'src/app/crew-trip/core/services/exchange-rate.service';
import {Observable, of, take} from 'rxjs';
import {Constant, MESSAGE, removeNullValues} from 'src/app/crew-trip/shared/utils/constant';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {CommonModule} from '@angular/common';
import {MatCheckbox} from '@angular/material/checkbox';
import {HttpStatusCode} from '@angular/common/http';

@Component({
  selector: 'app-rate-uth',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, MatCheckbox, FileUploadComponent
  ],
  templateUrl: './rate-uth.component.html',
  styleUrl: './rate-uth.component.scss'
})
export class RateUthComponent extends CommonComponent implements OnInit {
  override baseService = inject(ExchangeRateService);

  formBuilder = inject(FormBuilder);
  showDialogUpload = false;
  fileUpload = new FormControl<File[]>([], [Validators.required, FileUploadValidators.filesLimit(1)]);
  uploadFileError: { blob?: Blob, fileName?: string, totalErrors?: string } = {};
  listDatasource: Observable<string[]> = of(['Sync', 'Excel']);
  listVersion: Observable<string[]> = of([]);

  override formGroupSearch = this.formBuilder.group({
    s: [''], //Keyword Search
    version: ['', Validators.required],
    sourceType: [''],
    export: [false],
  });

  override async ngOnInit() {
    super.ngOnInit();
    this.displayedColumns = ['stt', 'currencyCode', 'planUth', 'january', 'february', 'march', 'april', 'may'
      , 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'average', 'rateDtTh', 'version'
    ];
    await this.initSearchVersion();
    await this.search();
  }

  async initSearchVersion() {
    await this.baseService.getListVersion({option: 0}).then(res => {
      this.listVersion = of(res.data.map((it: any) => it.version));
      if (this.listVersion) {
        this.listVersion.pipe(take(1)).subscribe(versions => {
          const firstVersion = versions[0];
          this.formGroupSearch.patchValue({version: firstVersion});
        });
      }
    });
  }

  override async search(body?: any,isNextPage?: boolean) {
    try {
      await this.spinner.show();
      if (!isNextPage) {
        this.pageIndex = Constant.PAGE;
      }
      this.formGroupSearch.patchValue({export: false})
      const res = await this.baseService.uthSearch({
        page: this.pageIndex,
        size: this.pageSize, ...removeNullValues(body) || removeNullValues(this.formGroupSearch.value),
        limit: this.pageSize, ...removeNullValues(body) || removeNullValues(this.formGroupSearch.value)
      });
      console.log(res);
      if (res) {
        if (res.status === HttpStatusCode.Ok) {
          this.dataSource.data = res.data.content;
          this.dataSource.data = this.dataSource.data.map((s: any) => ({
            ...s,
            isActiveLabel: s.isActive ? MESSAGE.ACTIVE : MESSAGE.INACTIVE,
            activeLabel: !!s.active || !!s.status ? MESSAGE.ACTIVE : MESSAGE.INACTIVE
          }));
          this.totalElement = res.data.totalElements;
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
        form.append('file', new Blob([new Uint8Array(await file.arrayBuffer())], {type: file.type}));
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
    } catch (e: any) {
      this.baseService.showError(e.error?.error ?? e.error?.error?.code ?? MESSAGE.ERROR);
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
    this.fileUpload.reset()
  }
}
