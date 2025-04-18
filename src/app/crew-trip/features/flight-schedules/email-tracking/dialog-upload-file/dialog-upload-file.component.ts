import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { FileUploadModule, FileUploadValidators } from '@iplab/ngx-file-upload';
import { NgxEditorModule } from 'ngx-editor';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';
import { EmailTrackingService } from 'src/app/crew-trip/core/services/email-tracking.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { Constant, MESSAGE } from 'src/app/crew-trip/shared/utils/constant';

@Component({
  selector: 'app-dialog-upload-file',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, MatChipsModule, RouterLink, RouterModule, FileUploadModule, NgxTrimDirectiveModule,
    SelectionComponent, SelectionSuggestComponent, DataTransformPipe, NgxEditorModule, MatMenuModule, NgxControlError,
    MatIconModule, MatRadioModule
  ],
  templateUrl: './dialog-upload-file.component.html',
  styleUrl: './dialog-upload-file.component.scss'
})
export class DialogUploadFileComponent extends CommonComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<DialogUploadFileComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  override baseService: BaseService = inject(EmailTrackingService);


  override formGroupDetail = this.formBuilder.group({
    id: [''],
    marketCode: ['', [Validators.required, Validators.maxLength(250)]],
    fileType: ['', [Validators.required, Validators.maxLength(500)]],
    file: new FormControl<File[]>([], [Validators.required, FileUploadValidators.filesLimit(1)]),
    scheType: ['']
  });

  override ngOnInit(): void {
    this.formGroupDetail.patchValue({ ...this.data });
    this.formGroupDetail.controls.marketCode.disable();
  }

  close() {
    this.dialogRef.close()
  }

  async uploadFile() {
    try {
      this.formGroupDetail.markAllAsTouched();
      if (this.formGroupDetail.valid) {
        const form = new FormData();
        const filesControl = this.formGroupDetail.controls.file.value;
        if (filesControl && filesControl.length > 0) {
          const file: File = filesControl[0];
          form.append('file', new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type }));
          form.append('fileType', this.formGroupDetail.controls.fileType.value ?? '');
          form.append('scheType', this.formGroupDetail.controls.scheType.value ?? '');
          form.append('marketCode', this.formGroupDetail.controls.marketCode.value ?? '');
          await this.spinner.show();
          const res = await this.baseService.uploadFile(form);
          this.baseService.showSuccess(this.MESSAGE.UPLOAD_SUCCESS);
          this.close()
        }

      }

    } finally {
      await this.spinner.hide();
    }
  }
}
