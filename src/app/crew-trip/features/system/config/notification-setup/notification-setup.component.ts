import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
	MatAutocompleteModule,
	MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
	MAT_DIALOG_DATA,
	MatDialogActions,
	MatDialogClose,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxEditorModule } from 'ngx-editor';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { NotificationSetupService } from 'src/app/crew-trip/core/services/notification-setup.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { HasPermissionDirective } from 'src/app/crew-trip/shared/directive/has-permission.directive';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { SelectOptions } from 'src/app/crew-trip/shared/select-option';

@Component({
	selector: 'app-notification-setup',
	standalone: true,
	imports: [
		MatCardModule,
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
		DataTransformPipe,
		RouterModule,
		MatCheckbox,
		NgxEditorModule,
		NgxTrimDirectiveModule,
		HasPermissionDirective,
		DigitOnlyModule,
		SelectionSuggestComponent,
		NgxControlError,
		SelectionComponent,
	],
	templateUrl: './notification-setup.component.html',
	styleUrl: './notification-setup.component.scss',
	providers: [HasPermissionDirective],
})
export class NotificationSetupComponent
	extends CommonComponent
	implements OnInit
{
	override baseService = inject(NotificationSetupService);
	flightMarketService = inject(FlightMarketService);
	notiSetupType = SelectOptions.NOTI_SETUP_TYPE;

	listAirrportCode = [];
	filteredOptionsMarket: any[];
	// @ViewChild('airportCode') airportCode: ElementRef<HTMLInputElement>;
	@ViewChild(MatAutocompleteTrigger)
	autocompleteTrigger!: MatAutocompleteTrigger;

	_displayedColumns: {
		label: string;
		value: string;
		type?: string;
		format?: string;
	}[] = [
		{ label: $localize`:@@name:Type`, value: 'type' },
		{
			label: $localize`:@@airportCode:Notification settings`,
			value: 'notiSetting',
		},
		{ label: $localize`:@@note:Regular notification`, value: 'regularNoti' },
		{ label: $localize`:@@note:Airport Code`, value: 'airportCode' },
		{ label: $localize`:@@note:Remark`, value: 'note' },
		{ label: $localize`:@@status:Status`, value: 'active' },
	];

	override formGroupDetail = this.formBuilder.group({
		id: [],
	});

	constructor() {
		super();
	}

	override formGroupSearch = this.formBuilder.group({
		s: [''], //Keyword Search
		active: [''],
	});

	override async ngOnInit() {
		super.ngOnInit();
		this.displayedColumns = [
			'stt',
			...this._displayedColumns.map((s) => s.value),
			'action',
		];
		await Promise.all([this.search()]).then(() => {});
	}

	override async showDialogDetail(id?: any, type?: string) {
		const dialogDetailRef = this.dialog.open(DialogNotificationSetupDetail, {
			data: { id: id },
			minWidth: 700,
		});
		dialogDetailRef.afterClosed().subscribe(async (res) => {
			await this.search();
		});
	}

	override async delete() {
		try {
			await super.delete(this.MESSAGE.UPDATE_SUCCESS);
		} catch (error) {
			console.error(error);
		}
	}

	// {
	// 	label: 'No. of day', code: 'NUMBER_OF_DAY'
	//   }, {
	// 	label: 'No. of year', code: 'NUMBER_OF_YEAR'
	//   }, {
	// 	label: 'Per.(%)', code: 'PERCENT'
	//   }
	getNotiSettingUnit(value: any) {
		if (value === 'No. of day') {
			return 'Ngày';
		} else if (value === 'No. of year') {
			return 'Năm';
		} else if (value === 'Per.(%)') {
			return '%';
		}
		return '';
	}

	// NOTI_REGULAR_TYPE: [
	// 	{
	// 	  label: 'Day in month', code: 'DAY_IN_MONTH'
	// 	}, {
	// 	  label: 'Month', code: 'MONTH'
	// 	}
	//   ],
	getRegularNotiUnit(value: any, notiRegularType: any) {
		if (
			notiRegularType &&
			notiRegularType.toUpperCase() === 'Day in month'.toUpperCase()
		) {
			return value + ' hàng tháng ';
		} else if (
			notiRegularType &&
			notiRegularType.toUpperCase() === 'Month'.toUpperCase()
		) {
			return 'Tháng ' + value;
		}
		return ''; // Default return value
	}
}

@Component({
	selector: 'dialog-notification-setup-detail',
	templateUrl: 'dialog-notification-setup-detail.component.html',
	standalone: true,
	imports: [
		MatDialogTitle,
		MatDialogContent,
		MatDialogActions,
		MatDialogClose,
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
		DataTransformPipe,
		RouterModule,
		DigitOnlyModule,
		NgxControlError,
		SelectionSuggestComponent,
		MatCheckbox,
	],
})
export class DialogNotificationSetupDetail extends CommonComponent {
	notiSetupType = SelectOptions.NOTI_SETUP_TYPE;
	notiSettingValueType = SelectOptions.NOTI_SETTING_VALUE_TYPE;
	notiRegularType = SelectOptions.NOTI_REGULAR_TYPE;
	override baseService = inject(NotificationSetupService);
	override formGroupDetail = this.formBuilder.group({
		id: [],
		type: ['', Validators.required],
		notiSettingValueType: [''],
		notiSetting: [''],
		regularType: [''],
		regularNoti: [''],
		airportCode: [''],
		note: ['', Validators.maxLength(500)],
		active: [true],
	});
	isShowAirportCode = false;
	regularNotiMax = 0;

	constructor(
		public dialogRef: MatDialogRef<DialogNotificationSetupDetail>,
		@Inject(MAT_DIALOG_DATA) public data: any,
	) {
		super();
	}

	override async ngOnInit() {
		super.ngOnInit();
		this.loadListFlightMarket({
			status: null,
		});
		if (this.data?.id) {
			await this.detail(this.data?.id);
			this.formGroupDetail.controls.type.disable();
		}
		this.typeValueChanges({ value: this.formGroupDetail.controls.type.value });
		this.setRegularNotiMax(this.formGroupDetail.controls.regularType.value);
		this.formGroupDetail.controls.regularType.valueChanges.subscribe(
			(value) => {
				this.setRegularNotiMax(value);
			},
		);
	}

	setRegularNotiMax(value: any) {
		if (value && value === 'DAY_IN_MONTH') {
			this.regularNotiMax = 31;
		} else {
			this.regularNotiMax = 12;
		}
		if (
			Number(this.formGroupDetail.controls.regularNoti.value) >=
			this.regularNotiMax
		) {
			this.formGroupDetail.controls.regularNoti.setValue(null);
		}
	}
	override async save() {
		try {
			console.log(this.formGroupDetail.value);
			await super.save();
			this.close();
		} catch (e: any) {
			if (e.status === HttpStatusCode.Conflict) {
				this.formGroupDetail.controls.type.setErrors({
					conflict: true,
					message:
						e.error?.data?.message ??
						e.error?.error?.message ??
						e.error?.message ??
						'Error',
				});
			}
		}
	}

	typeValueChanges(event: any) {
		if (event?.value != 'SEND_ESTIMATED_SCHEDULE') {
			this.formGroupDetail.controls.airportCode.setValue(null);
			this.formGroupDetail.controls.airportCode.updateValueAndValidity();
			this.isShowAirportCode = false;
		} else {
			this.isShowAirportCode = true;
		}
	}

	close() {
		this.dialogRef.close();
	}
}
