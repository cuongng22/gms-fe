import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
	FormControl,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {
	FileUploadComponent,
	FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { Observable, of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ExchangeRateService } from 'src/app/crew-trip/core/services/exchange-rate.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { HasPermissionDirective } from 'src/app/crew-trip/shared/directive/has-permission.directive';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import {
	Constant,
	DATE_FORMAT_DD_MM_YYYY,
	MESSAGE,
	removeNullValues,
} from 'src/app/crew-trip/shared/utils/constant';

@Component({
	selector: 'app-rate-uth',
	standalone: true,
	imports: [
		MatCardModule,
		FormsModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		MatSelectModule,
		MatButtonModule,
		MatFormField,
		MatInputModule,
		InputSizeComponent,
		MatDatepickerModule,
		MatNativeDateModule,
		NgxMaterialTimepickerModule,
		MatAutocompleteModule,
		CommonModule,
		MatTableModule,
		MatPaginatorModule,
		FileUploadComponent,
		HasPermissionDirective,
		SelectionSuggestComponent,
	],
	templateUrl: './rate-uth.component.html',
	styleUrl: './rate-uth.component.scss',
	providers: [
		HasPermissionDirective,
		DataTransformPipe,
		provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),
	],
})
export class RateUthComponent extends CommonComponent implements OnInit {
	override baseService = inject(ExchangeRateService);
	dataTransformPipe: DataTransformPipe = inject(DataTransformPipe);
	cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

	showDialogUpload = false;
	fileUpload = new FormControl<File[]>(
		[],
		[Validators.required, FileUploadValidators.filesLimit(1)],
	);
	uploadFileError: { blob?: Blob; fileName?: string; totalErrors?: string } =
		{};
	listDatasource: Observable<string[]> = of(['Sync', 'Excel']);
	listVersion: any[] = []; //Observable<string[]> = of([]);

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
		this.displayedColumns = [
			'stt',
			'currencyCode',
			'planUth',
			'january',
			'february',
			'march',
			'april',
			'may',
			'june',
			'july',
			'august',
			'september',
			'october',
			'november',
			'december',
			'average',
			'rateDtTh', // 'version'
		];
		await this.initSearchVersion();
		await this.search();
		this.fileUpload.valueChanges.subscribe((value) => {
			this.uploadFileError = {};
		});

		// Add debounce time of 500ms to startDate valueChanges
		this.formGroupSearch.controls.startDate.valueChanges
			.pipe(debounceTime(800)) // Wait 500ms after the last change
			.subscribe(async () => {
				if (!this.export) {
					this.changeCreatedDate();
				}
			});

		// Add debounce time of 500ms to endDate valueChanges
		this.formGroupSearch.controls.endDate.valueChanges
			.pipe(debounceTime(800)) // Wait 500ms after the last change
			.subscribe(async () => {
				if (!this.export) {
					this.changeCreatedDate();
				}
			});
	}

	async initSearchVersion(params?: any) {
		const data = await this.baseService.getListVersion({
			option: 0,
			...removeNullValues(params),
		});
		this.listVersion = data.data;
		if (this.listVersion && this.listVersion.length > 0) {
			const firstVersion = this.listVersion[0];
			this.formGroupSearch.patchValue({ version: firstVersion.version });
			this.cdr.detectChanges();
		} else {
			this.formGroupSearch.controls.version.patchValue('');
			this.cdr.detectChanges();
		}
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
				size: this.pageSize,
				...(removeNullValues(body) ||
					removeNullValues(this.formGroupSearch.value)),
				limit: this.pageSize,
				...(removeNullValues(body) ||
					removeNullValues(this.formGroupSearch.value)),
				startDate: startDate
					? this.dataTransformPipe.transform(startDate, [
							'date',
							Constant.LOCAL_DATE_FORMAT,
						])
					: '',
				endDate: endDate
					? this.dataTransformPipe.transform(endDate, [
							'date',
							Constant.LOCAL_DATE_FORMAT,
						])
					: '',
			});
			if (res) {
				if (res.status === HttpStatusCode.Ok) {
					this.version = this.formGroupSearch.controls.version.value;
					this.createdDate = res.data.createdDate;
					this.dataSource.data = res.data?.pages?.content;
					this.dataSource.data = this.dataSource.data.map((s: any) => ({
						...s,
						isActiveLabel: s.isActive ? MESSAGE.ACTIVE : MESSAGE.INACTIVE,
						activeLabel:
							!!s.active || !!s.status ? MESSAGE.ACTIVE : MESSAGE.INACTIVE,
					}));
					this.totalElement = res.data?.pages?.totalElements;
				}
				return res;
			}
		} catch (e: any) {
			console.log(e);
			this.baseService.showError(
				e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR,
			);
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
				form.append(
					'file',
					new Blob([new Uint8Array(await file.arrayBuffer())], {
						type: file.type,
					}),
				);
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
			this.downloadFile(
				this.uploadFileError.blob,
				this.uploadFileError.fileName ?? 'file-error.xlsx',
			);
		}
	}

	toggleDialogUpload() {
		this.showDialogUpload = !this.showDialogUpload;
	}

	override async downloadTemplate(filename?: string) {
		try {
			await this.spinner.show();
			const res = await this.baseService.exportData(null, 'uth/template');
			this.downloadFile(res.blob, filename ?? res.fileName);
		} catch (e: any) {
			console.log(e);
			this.baseService.showError(
				e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR,
			);
		} finally {
			await this.spinner.hide();
		}
	}
	export = false;
	override async exportFileOptions(
		body?: any,
		filename?: string,
		sourcePath?: string,
	) {
		try {
			await this.spinner.show();
			this.export = true;
			let startDate = this.formGroupSearch.controls.startDate.value;
			let endDate = this.formGroupSearch.controls.endDate.value;
			if (startDate) {
				startDate = this.dataTransformPipe.transform(startDate, [
					'date',
					Constant.LOCAL_DATE_FORMAT,
				]);
			}
			if (endDate) {
				endDate = this.dataTransformPipe.transform(endDate, [
					'date',
					Constant.LOCAL_DATE_FORMAT,
				]);
			}
			this.formGroupSearch.patchValue({
				startDate: startDate,
				endDate: endDate,
				export: true,
			});
			const res = await this.baseService.exportData(
				removeNullValues(body) || removeNullValues(this.formGroupSearch.value),
				sourcePath ?? 'uth',
			);
			this.downloadFile(res.blob, filename ?? res.fileName);
		} catch (e: any) {
			console.log(e);
			this.baseService.showError(
				e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR,
			);
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
			this.showSuccess(MESSAGE.SYNC_SUCCESS);
		} catch (e: any) {
			this.showError(
				e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR,
			);
		} finally {
			this.spinner.hide();
		}
	}

	async changeCreatedDate() {
		let startDate = this.formGroupSearch.controls.startDate.value;
		let endDate = this.formGroupSearch.controls.endDate.value;
		if (startDate && endDate) {
			await this.initSearchVersion({
				startDate: this.dataTransformPipe.transform(startDate, [
					'date',
					Constant.LOCAL_DATE_FORMAT,
				]),
				endDate: this.dataTransformPipe.transform(endDate, [
					'date',
					Constant.LOCAL_DATE_FORMAT,
				]),
			});
		} else if (startDate) {
			await this.initSearchVersion({
				startDate: this.dataTransformPipe.transform(startDate, [
					'date',
					Constant.LOCAL_DATE_FORMAT,
				]),
			});
		} else if (endDate) {
			await this.initSearchVersion({
				endDate: this.dataTransformPipe.transform(endDate, [
					'date',
					Constant.LOCAL_DATE_FORMAT,
				]),
			});
		}
	}
}
