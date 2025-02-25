import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import {
	Component,
	ElementRef,
	inject,
	OnInit,
	ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
	MatAutocompleteModule,
	MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NgxEditorModule, Validators } from 'ngx-editor';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { NotificationSetupService } from 'src/app/crew-trip/core/services/notification-setup.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
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
	],
	templateUrl: './notification-setup.component.html',
	styleUrl: './notification-setup.component.scss',
})
export class NotificationSetupComponent
	extends CommonComponent
	implements OnInit
{
	override baseService = inject(NotificationSetupService);
	flightMarketService = inject(FlightMarketService);

	notiSetupType = SelectOptions.NOTI_SETUP_TYPE;
	notiSettingValueType = SelectOptions.NOTI_SETTING_VALUE_TYPE;
	notiRegularType = SelectOptions.NOTI_REGULAR_TYPE;
	listAirrportCode = [];
	filteredOptionsMarket: any[];
	@ViewChild('airportCode') airportCode: ElementRef<HTMLInputElement>;
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

	constructor(public override dialog: MatDialog) {
		super();
		this.formGroupDetail = this.formBuilder.group({
			id: [],
			type: ['', Validators.required],
			notiSettingValueType: [''],
			notiSetting: [''],
			regularType: [''],
			regularNoti: [''],
			airportCode: [''],
			note: [''],
			active: [true],
		});
		this.formGroupDetailInit = { ...this.formGroupDetail.value };
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
		await Promise.all([this.search(), this.getListAirportCode()]).then(
			() => {},
		);
	}

	async getListAirportCode() {
		const res = await this.flightMarketService.search({
			page: 0,
			limit: 99999,
			option: 0,
		});
		this.listAirrportCode = res.data.content.map(
			(item: any) => item.marketCode,
		);
	}

	filterMarket(): void {
		const filterValue = this.airportCode.nativeElement.value.toLowerCase();
		if (!filterValue) {
			this.filteredOptionsMarket = this.listAirrportCode;
		}
		this.filteredOptionsMarket = this.listAirrportCode.filter((market: any) => {
			return market.toLowerCase().includes(filterValue);
		});
	}

	onFocusMarket(): void {
		this.filteredOptionsMarket = this.listAirrportCode;
		this.autocompleteTrigger.openPanel();
	}

	override async save() {
		try {
			await super.save();
		} catch (e: any) {
			if (e.status === HttpStatusCode.Conflict) {
				this.formGroupDetail.controls['type'].setErrors({
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
}
