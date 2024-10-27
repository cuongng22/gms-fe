import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from "@angular/common";
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {MatAnchor, MatButton, MatButtonModule} from "@angular/material/button";
import {
  MatCardModule,
} from "@angular/material/card";
import {
  MatTableModule
} from "@angular/material/table";
import {
  MatDatepickerModule,
} from "@angular/material/datepicker";
import {MatFormField, MatFormFieldModule, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ExchangeRateService} from "src/app/crew-trip/core/services/exchange-rate.service";
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {MatSelectModule} from "@angular/material/select";
import {MatNativeDateModule} from "@angular/material/core";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatCheckbox} from "@angular/material/checkbox";
import {FileUploadComponent, FileUploadValidators} from "@iplab/ngx-file-upload";
import {MESSAGE} from "src/app/crew-trip/shared/utils/constant";
import {debounceTime, map, Observable, of, startWith, take} from "rxjs";

@Component({
  selector: 'app-rate-planned',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, MatCheckbox, FileUploadComponent
  ],
  templateUrl: './rate-planned.component.html',
  styleUrl: './rate-planned.component.scss'
})
export class RatePlannedComponent extends CommonComponent implements OnInit {
  override baseService = inject(ExchangeRateService);

  formBuilder = inject(FormBuilder);
  showDialogUpload: boolean = false;
  fileUpload = new FormControl<File[]>([], [Validators.required, FileUploadValidators.filesLimit(1)]);
  uploadFileError: { blob?: Blob, fileName?: string, totalErrors?: string } = {};
  listDatasource: Observable<string[]> = of(['sync', 'excel']);
  listYear: Observable<number[]> = of(Array.from({ length: 10 }, (v, i) => 2024 + i));
  listVersion: Observable<string[]> = of([]);

  override formGroupSearch = this.formBuilder.group({
    s: [null], //Keyword Search
    version: ['', Validators.required],
    sourceType: [''],
    export: [false],
  });

  override async ngOnInit() {
    super.ngOnInit();
    this.displayedColumns = ['stt','currencyCode','uthLastYear','january','february','march', 'april','may'
      ,'june','july','august','september','october','november','december','average','rateUth','version'
    ];
    await  this.baseService.getListVersion({ option: 1 }).then(res => {
      this.listVersion = of(res.data.map((it: any) => it.version));
      if(this.listVersion){
        this.listVersion.pipe(take(1)).subscribe(versions => {
          const firstVersion = versions[0];
          this.formGroupSearch.patchValue({ version: firstVersion });
        });
      }
    });
    await this.search();
  }

  async uploadFile() {
    try {
      this.fileUpload.markAllAsTouched();
      if (this.fileUpload.valid && this.fileUpload.value) {
        const form = new FormData();
        const file: File = this.fileUpload.value[0];
        form.append('file', new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type }));
        await this.spinner.show();
        const res = await this.baseService.uploadFile(form);
        this.uploadFileError = res;
        if (!res.totalErrors) {
          this.baseService.showSuccess(this.MESSAGE.UPLOAD_SUCCESS);
          this.search();
          this.toggleDialogUpload();
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

  override  async downloadTemplate(filename?: string) {
    try {
      await this.spinner.show();
      let res = await this.baseService.exportData(null, 'template');
      console.log(res)
      this.downloadFile(res.blob, filename ?? res.fileName);
    } catch (e: any) {
      console.log(e);
      this.baseService.showError(e.error?.data ?? e.error ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

}
