import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import moment from 'moment';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';
import { EmailTrackingService } from 'src/app/crew-trip/core/services/email-tracking.service';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DatepickerComponent } from 'src/app/crew-trip/shared/component/datepicker/datepicker.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { ListResponse } from 'src/app/crew-trip/shared/models/common.model';
import { getCategoryCode, getCategoryName, getEmailDeliveryStatus, getFileName, getSendMailName } from './email-tracking.model';
import { DialogSendMailComponent } from './dialog-send-mail/dialog-send-mail.component';
import { DialogUploadFileComponent } from './dialog-upload-file/dialog-upload-file.component';
import { environment } from 'src/environments/environment';
import { categories } from '../../plan/budget-procurement/budget-procurement.model';

@Component({
	selector: 'app-email-tracking',
	standalone: true,
	imports: [
		MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
		MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
		MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
		MatTableModule, MatPaginatorModule, MatChipsModule, RouterLink, RouterModule, FileUploadModule, NgxTrimDirectiveModule,
		SelectionComponent, SelectionSuggestComponent, DatepickerComponent, DataTransformPipe
	],
	templateUrl: './email-tracking.component.html',
	styleUrl: './email-tracking.component.scss',
	providers: [DataTransformPipe]
})
export class EmailTrackingComponent extends CommonComponent {
	override baseService: BaseService = inject(EmailTrackingService);
	flightMarketService = inject(FlightMarketService)
	dataTransformPipe = inject(DataTransformPipe);
	flightScheduleTypes = [
		{ code: 'ESTIMATED_FLIGHT', value: $localize`:@@estimatedFlightSchedule:Estimated Flight Schedule` },
		{ code: 'MONTHLY_FLIGHT', value: $localize`:@@monthlyFlightSchedule:Monthly Flight Schedule` }
	];
	categorys = categories;
	airports: any[] = [];
	emailSendingStatus = [
		{ code: false, value: $localize`:@@notSent:Not sent` },
		{ code: true, value: $localize`:@@sent:Sent` }
	];
	emailDeliveryStatus = [
		{ code: true, value: $localize`:@@successful:Successful` },
		{ code: false, value: $localize`:@@failed:Failed` }
	]
	getCategoryName = getCategoryName;
	getSendMailName = getSendMailName;
	getEmailDeliveryStatus = getEmailDeliveryStatus;

	override displayedColumns: string[] = [
		'stt', 'marketCode', 'category', 'dataFile',//'fcFile', 'ccFile',
		'totalFile', 'exportTime', 'emailTime', 'isEmailSent', 'isSendSuccess', 'action'
	];

	override formGroupSearch = this.formBuilder.group({
		scheType: ['MONTHLY_FLIGHT'],
		marketType: [''],
		marketCode: [],
		isEmailSent: [],
		isSendSuccess: [],
		exportTime: []
	})

	getFileName = getFileName;

	override ngOnInit(): void {
		Promise.all([
			this.flightMarketService.search<any>({ option: 0, page: 0, size: 999999, limit: 999999 }).then((res: ListResponse<any>) => {
				this.airports = res.data.content.map((item: any) => {
					return {
						marketCode: item.marketCode,
						marketName: item.marketName
					}
				});
			}),
			this.search(),
		]).then(() => {
		});

	}

	showPopSendMail(data: any) {
		if (data.files && data.files.length > 0) {
			data.files = data.files.map((element: string) => environment.baseUrl + '/' + element);
		}

		this.dialog.open(DialogSendMailComponent, {
			minWidth: 900,
			autoFocus: false,
			disableClose: true,
			data: {
				scheType: this.formGroupSearch.controls.scheType.value,
				marketType: getCategoryCode(data.marketType),
				marketCode: data.marketCode,
				id: data.id,
				attachment: data.files
			}
		}).afterClosed().subscribe(res => {
			this.search()
		})
	}

	getArrayFile(file: string) {
		if (file) {
			const arrFile = file?.split(';')
			return arrFile;
		}
		return [];
	}

	showPopUpload(data: any) {
		this.dialog.open(DialogUploadFileComponent, {
			minWidth: 900,
			autoFocus: false,
			disableClose: true,
			data: {
				marketCode: data.marketCode,
				id: data.id,
			}
		}).afterClosed().subscribe(res => {
			this.search()
		})
	}

	override async search<T>(body?: any, isNextPage?: boolean, fnSearch?: ((bodySearch: any) => ListResponse<T> | any) | undefined): Promise<any> {
		const _exportTime = this.formGroupSearch.controls.exportTime.value ? moment(this.formGroupSearch.controls.exportTime.value).format('YYYY-MM-DD') : null
		super.search({ ...this.formGroupSearch.getRawValue(), exportTime: _exportTime }, isNextPage, fnSearch)
	}


}
