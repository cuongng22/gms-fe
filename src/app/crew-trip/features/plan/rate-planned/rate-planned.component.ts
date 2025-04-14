import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
	FormControl,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
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
import { Observable, of, take } from 'rxjs';
import { ExchangeRateService } from 'src/app/crew-trip/core/services/exchange-rate.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { HasPermissionDirective } from 'src/app/crew-trip/shared/directive/has-permission.directive';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import {
	Constant,
	MESSAGE,
	removeNullValues,
} from 'src/app/crew-trip/shared/utils/constant';

@Component({
	selector: 'app-rate-planned',
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
		HasPermissionDirective
	],
	templateUrl: './rate-planned.component.html',
	styleUrl: './rate-planned.component.scss',
	providers: [HasPermissionDirective]
})
export class RatePlannedComponent extends CommonComponent implements OnInit {
	override baseService = inject(ExchangeRateService);

	showDialogUpload = false;
	fileUpload = new FormControl<File[]>(
		[],
		[Validators.required, FileUploadValidators.filesLimit(1)],
	);
	uploadFileError: { blob?: Blob; fileName?: string; totalErrors?: string } =
		{};
	listDatasource: Observable<string[]> = of(['Sync', 'Excel']);
	listYear: Observable<number[]> = of(
		Array.from({ length: 10 }, (v, i) => 2024 + i),
	);
	listVersion: Observable<string[]> = of([]);

	override formGroupSearch = this.formBuilder.group({
		s: [null], //Keyword Search
		version: ['', Validators.required],
		sourceType: [''],
		export: [false],
	});

	override async ngOnInit() {
		super.ngOnInit();
		this.displayedColumns = [
			'stt',
			'currencyCode',
			'uthLastYear',
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
			'rateUth',
			'version',
		];
		await this.initSearchVersion();
		await this.search();
		this.fileUpload.valueChanges.subscribe((value) => {
			this.uploadFileError = {};
		});
	}

	async initSearchVersion() {
		await this.baseService.getListVersion({ option: 1 }).then((res) => {
			this.listVersion = of(res.data.map((it: any) => it.version));
			if (this.listVersion) {
				this.listVersion.pipe(take(1)).subscribe((versions) => {
					const firstVersion = versions[0];
					this.formGroupSearch.patchValue({ version: firstVersion });
				});
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
			const res = await this.baseService.search({
				page: this.pageIndex,
				size: this.pageSize,
				...(removeNullValues(body) ||
					removeNullValues(this.formGroupSearch.value)),
				limit: this.pageSize,
				...(removeNullValues(body) ||
					removeNullValues(this.formGroupSearch.value)),
			});
			if (res) {
				if (res.status === HttpStatusCode.Ok) {
					this.dataSource.data = res.data.content;
					this.dataSource.data = this.dataSource.data.map((s: any) => ({
						...s,
						isActiveLabel: s.isActive ? MESSAGE.ACTIVE : MESSAGE.INACTIVE,
						activeLabel:
							!!s.active || !!s.status ? MESSAGE.ACTIVE : MESSAGE.INACTIVE,
					}));
					this.totalElement = res.data.totalElements;
				}
				return res;
			}
		} catch (e: any) {
			// console.log(e);
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
				const res = await this.baseService.uploadFile(form);
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
			const res = await this.baseService.exportData(null, 'template');
			// console.log(res);
			this.downloadFile(res.blob, filename ?? res.fileName);
		} catch (e: any) {
			// console.log(e);
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
			await this.baseService.sync();
			this.showSuccess(MESSAGE.SYNC_SUCCESS)
		} catch (e: any) {
			this.showError(e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR)
		} finally {
			this.spinner.hide()
		}
	}
}
