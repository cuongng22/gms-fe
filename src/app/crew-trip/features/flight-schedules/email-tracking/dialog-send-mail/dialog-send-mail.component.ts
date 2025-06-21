import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
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
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { DetailResponse } from 'src/app/crew-trip/shared/models/common.model';
import { Constant, MESSAGE } from 'src/app/crew-trip/shared/utils/constant';
import { DialogOverviewExampleDialog } from 'src/app/ui-elements/dialog/basic-dialog/basic-dialog.component';
import { environment } from 'src/environments/environment';
import { getFileName } from '../email-tracking.model';

@Component({
	selector: 'app-dialog-send-mail',
	standalone: true,
	imports: [
		MatCardModule,
		FormsModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		MatSelectModule,
		MatButtonModule,
		MatInputModule,
		InputSizeComponent,
		MatDatepickerModule,
		MatNativeDateModule,
		NgxMaterialTimepickerModule,
		MatAutocompleteModule,
		CommonModule,
		MatTableModule,
		MatPaginatorModule,
		MatChipsModule,
		RouterModule,
		FileUploadModule,
		NgxTrimDirectiveModule,
		SelectionSuggestComponent,
		NgxEditorModule,
		MatMenuModule,
		NgxControlError,
		MatIconModule,
		SelectionSuggestComponent,
	],
	templateUrl: './dialog-send-mail.component.html',
	styleUrl: './dialog-send-mail.component.scss',
})
export class DialogSendMailComponent implements OnInit {
	readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
	readonly data = inject<any>(MAT_DIALOG_DATA);
	readonly formBuilder = inject(FormBuilder);
	readonly emailTrackingService = inject(EmailTrackingService);
	readonly groupMailService = inject(GroupMailService);
	readonly emailSupplierService = inject(EmailSupplierService);
	readonly spinner = inject(NgxSpinnerService);

	MESSAGE = MESSAGE;
	Constant = Constant;
	groupMails = [];
	listTitle: any[];

	formGroupDetail = this.formBuilder.group({
		id: [''],
		groupMailId: ['', [Validators.required, Validators.maxLength(250)]],
		title: ['', [Validators.required, Validators.maxLength(500)]],
		content: ['', [Validators.required]],
		attachment: new FormControl<string[]>([], Validators.required),
		scheType: [],
		marketCode: [],
		marketType: [],
		exportTime: [],
		exportBy: [],
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

	getFileName = getFileName;
	environment = environment;

	async ngOnInit() {
		this.editor = new Editor();

		this.formGroupDetail.patchValue({ ...this.data });
		await this.spinner.show();
		const emailClass =
			this.data.scheType === 'ESTIMATED_FLIGHT'
				? 'ESTIMATED_SCHEDULE'
				: 'CHANGED_SCHEDULE';
		Promise.all([
			this.groupMailService
				.getEmails(this.data.marketCode)
				.then((res: DetailResponse<any>) => {
					this.groupMails = res.data;
					// this.formGroupDetail.controls.email.setValue(res.data);
					// this.formGroupDetail.controls.email.disable();
				}),
			this.emailSupplierService
				.content({
					emailClass: emailClass,
					marketCode: this.data.marketCode,
					fileType: this.data.fileType ? this.data.fileType : '',
				})
				.then((res: DetailResponse<any>) => {
					this.listTitle = res.data;
				}),
		]).finally(() => {
			this.spinner.hide();
		});
	}

	onChangeTitle(event: any) {
		if (event.value) {
			this.formGroupDetail.patchValue({
				title: event.value,
				content: event.value.content,
			});
		}
	}

	close() {
		this.dialogRef.close();
	}

	async save() {
		this.formGroupDetail.markAllAsTouched();
		if (this.formGroupDetail.valid) {
			try {
				await this.spinner.show();
				const data = this.formGroupDetail.getRawValue().title as any;

				const body = {
					...this.formGroupDetail.getRawValue(),
					attachment: this.fileAttachment,
					title: data.title,
				};
				await this.emailTrackingService.create(body);
				this.close();
			} catch (error) {
				console.error('Error sending email:', error);
			} finally {
				this.spinner.hide();
			}
		}
	}

	removeAttachment(file: string) {
		const array = this.fileAttachment;
		const index = array.findIndex((item: any) => item === file);
		array.splice(index, 1);
		this.formGroupDetail.controls.attachment.setValue(array);
		this.formGroupDetail.controls.attachment.updateValueAndValidity();
		this.formGroupDetail.controls.attachment.markAsTouched();
	}

	get fileAttachment() {
		return this.formGroupDetail.controls.attachment.value ?? [];
	}
}
