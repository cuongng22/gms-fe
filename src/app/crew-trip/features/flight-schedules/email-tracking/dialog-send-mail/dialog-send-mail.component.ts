import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
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
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { EmailSupplierService } from 'src/app/crew-trip/core/services/email-supplier-service';
import { EmailTrackingService } from 'src/app/crew-trip/core/services/email-tracking.service';
import { GroupMailService } from 'src/app/crew-trip/core/services/group-mail.service';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { DetailResponse } from 'src/app/crew-trip/shared/models/common.model';
import { Constant, MESSAGE } from 'src/app/crew-trip/shared/utils/constant';
import { DatepickerComponent } from 'src/app/ui-elements/datepicker/datepicker.component';
import { DialogOverviewExampleDialog } from 'src/app/ui-elements/dialog/basic-dialog/basic-dialog.component';

@Component({
  selector: 'app-dialog-send-mail',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, MatChipsModule, RouterLink, RouterModule, FileUploadModule, NgxTrimDirectiveModule,
    SelectionComponent, SelectionSuggestComponent, DataTransformPipe, NgxEditorModule, MatMenuModule, NgxControlError,
    MatIconModule,
  ],
  templateUrl: './dialog-send-mail.component.html',
  styleUrl: './dialog-send-mail.component.scss'
})
export class DialogSendMailComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly formBuilder = inject(FormBuilder);
  readonly emailTrackingService = inject(EmailTrackingService)
  readonly groupMailService = inject(GroupMailService);
  readonly emailSupplierService = inject(EmailSupplierService);
  readonly spinner = inject(NgxSpinnerService);

  MESSAGE = MESSAGE;
  Constant = Constant;

  formGroupDetail = this.formBuilder.group({
    id: [''],
    email: ['', [Validators.required, Validators.maxLength(250)]],
    title: ['', [Validators.required, Validators.maxLength(500)]],
    content: ['', [Validators.required]],
    attachment: ['', [Validators.required]],
  });

  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  async ngOnInit() {
    this.editor = new Editor();
    this.formGroupDetail.controls.id.setValue(this.data.id);
    await this.spinner.show();
    Promise.all([
      this.groupMailService.getEmails(this.data.marketCode).then((res: DetailResponse<string>) => {
        this.formGroupDetail.controls.email.setValue(res.data);
        this.formGroupDetail.controls.email.disable();
      }),
      this.emailSupplierService.content({ emailClass: 'INVOICE_REMINDER', marketCode: this.data.marketCode }).then((res: DetailResponse<any>) => {
        this.formGroupDetail.controls.title.setValue(res.data.title);
        this.formGroupDetail.controls.content.setValue(res.data.content);
        this.formGroupDetail.controls.attachment.setValue(this.data.attachment);
      })
    ]).finally(() => {
      this.spinner.hide()
    })
  }

  close() {
    this.dialogRef.close()
  }

  async save() {
    console.log(this.formGroupDetail.getRawValue())
    this.formGroupDetail.markAllAsTouched();
    if (this.formGroupDetail.valid) {
      try {
        await this.spinner.show();
        const body = {
          ...this.formGroupDetail.getRawValue(),
          attachment: this.fileAttachment
        }
        this.emailTrackingService.update(body).then(res => {
          this.close()
        });
      } catch (error) {

      } finally {
        this.spinner.hide();
      }
    }


  }

  removeAttachment(file: string) {
    const array = this.fileAttachment;
    const index = array.findIndex((item: any) => item === file);
    const attachment = array && array.length > 1 ? array.slice(index, 1) as any[] : [];
    this.formGroupDetail.controls.attachment.setValue(attachment && attachment.length > 0 ? attachment.join(';') : null);
    this.formGroupDetail.controls.attachment.updateValueAndValidity();
    this.formGroupDetail.controls.attachment.markAsTouched()
  }

  get fileAttachment() {
    const value = this.formGroupDetail.controls.attachment.value;
    if (value) {
      return value.split(';')
    }
    return [];
  }
}
