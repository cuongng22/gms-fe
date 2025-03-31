import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
	MatDateRangeInput,
	MatDateRangePicker,
	MatDatepickerActions,
	MatDatepickerApply,
	MatDatepickerCancel,
	MatDatepickerModule,
	MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import {
	MatCell,
	MatCellDef,
	MatColumnDef,
	MatFooterCell,
	MatFooterCellDef,
	MatFooterRow,
	MatFooterRowDef,
	MatHeaderCell,
	MatHeaderCellDef,
	MatHeaderRow,
	MatHeaderRowDef,
	MatNoDataRow,
	MatRow,
	MatRowDef,
	MatTable,
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import moment from 'moment';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { CharterService } from 'src/app/crew-trip/core/services/charter.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import { DataCalculateTotal } from 'src/app/crew-trip/shared/data-calculate-total';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import {
	DATE_FORMAT_DD_MM_YYYY,
	round,
} from 'src/app/crew-trip/shared/utils/constant';

@Component({
	selector: 'app-charter',
	standalone: true,
	imports: [
		FormsModule,
		InputSizeComponent,
		MatCard,
		MatCardContent,
		ReactiveFormsModule,
		MatDateRangeInput,
		MatDateRangePicker,
		MatLabel,
		MatFormFieldModule,
		MatDatepickerToggle,
		NgxTrimDirectiveModule,
		MatButton,
		MatDatepickerCancel,
		MatDatepickerActions,
		MatDatepickerApply,
		NgxControlError,
		MatDatepickerModule,
		MatCardModule,
		MatAnchor,
		MatTable,
		MatColumnDef,
		MatHeaderCell,
		MatHeaderCellDef,
		MatHeaderRow,
		MatHeaderRowDef,
		MatNoDataRow,
		MatRow,
		MatRowDef,
		MatCell,
		MatCellDef,
		MatFooterRow,
		MatFooterRowDef,
		MatFooterCell,
		MatFooterCellDef,
		DecimalPipe,
		DataCalculateTotal,
		SelectMultipleComponent,
		MatPaginator,
		RouterLink,
		DataTransformPipe,
	],
	templateUrl: './charter.component.html',
	styleUrl: './charter.component.scss',
	providers: [
		provideNativeDateAdapter(),
		provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),
		DataTransformPipe,
	],
})
export class CharterComponent extends CommonComponent {
	override baseService: CharterService = inject(CharterService);

	headerRowDef1 = [
		'airportCode',
		'startDate',
		'endDate',
		'totalRoom',
		'totalRoomElc',
		'totalRoomLco',
		'totalNumberOfTrip',
		'totalForex',
		'totalAmount',
		'action',
	];

	headerRowDef2 = [
		'totalSingleRoom',
		'totalTwinRoom',
		'totalSingleEICRoom',
		'totalTwinEICRoom',
		'totalSingleLCORoom',
		'totalTwinLCORoom',
		'totalExcVAT',
		'totalIncVAT',
	];

	rowDef = [
		'airportCode',
		'startDate',
		'endDate',
		'totalSingleRoom',
		'totalTwinRoom',
		'totalSingleEICRoom',
		'totalTwinEICRoom',
		'totalSingleLCORoom',
		'totalTwinLCORoom',
		'totalNumberOfTrip',
		'totalForex',
		'totalExcVAT',
		'totalIncVAT',
		'action',
	];

	footerRowDef = [
		'total',
		'totalSingleRoom',
		'totalTwinRoom',
		'totalSingleEICRoom',
		'totalTwinEICRoom',
		'totalSingleLCORoom',
		'totalTwinLCORoom',
		'totalNumberOfTrip',
		'totalForex',
		'totalExcVAT',
		'totalIncVAT',
		'action',
	];

	override formGroupDetail: FormGroup<any> = this.formBuilder.group({
		id: [],
	});

	constructor() {
		super();
		this.formGroupSearch = this.formBuilder.group({
			airportCodes: [''],
			startDate: [''],
			endDate: [''],
		});
	}
	override ngOnInit(): void {
		this.loadListFlightMarket({});
		const firstDayOfCurrentYear = moment().startOf('year');
		const endDayOfCurrentYear = moment().endOf('year');
		this.formGroupSearch.patchValue({
			startDate: firstDayOfCurrentYear,
			endDate: endDayOfCurrentYear,
		});
		this.search();
	}

	async exportFileExcel(fileName: string) {
		const { airportCodes, startDate, endDate } =
			this.formGroupSearch.getRawValue();
		const searchParams = {
			airportCodes,
			startDate,
			endDate,
			export: true,
		};
		await this.exportFileOptions(searchParams, fileName);
	}

	protected readonly round = round;
	protected readonly Math = Math;
}
