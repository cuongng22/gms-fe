import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
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
import { AvesTransportationCostTrackingService } from 'src/app/crew-trip/core/services/aves-transportation-cost-tracking.service';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { DataCalculateTotal } from 'src/app/crew-trip/shared/data-calculate-total';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
	selector: 'app-car-cost-tracking',
	standalone: true,
	imports: [
		FormsModule,
		InputSizeComponent,
		MatButton,
		SelectionSuggestComponent,
		ReactiveFormsModule,
		MatLabel,
		MatFormField,
		MatSelect,
		MatOption,
		MatCardModule,
		MatTable,
		MatHeaderRow,
		MatHeaderRowDef,
		MatColumnDef,
		MatHeaderCell,
		MatHeaderCellDef,
		MatCell,
		MatCellDef,
		MatRowDef,
		MatRow,
		DatePipe,
		DecimalPipe,
		MatFooterRow,
		MatFooterRowDef,
		MatNoDataRow,
		MatFooterCell,
		MatFooterCellDef,
		DataCalculateTotal,
	],
	templateUrl: './car-cost-tracking.component.html',
	styleUrl: './car-cost-tracking.component.scss',
})
export class CarCostTrackingComponent
	extends CommonComponent
	implements OnInit
{
	markets: string[] = [];
	monthSelection: string[] = [];
	listYear: number[] = [];
	fb: FormBuilder = inject(FormBuilder);
	flightMarketService: FlightMarketService = inject(FlightMarketService);
	override baseService = inject(AvesTransportationCostTrackingService);
	displayedColumnsTracking: any[] = [
		{ name: '#', field: '#' },
		{ name: 'fltNo', field: 'Flight No', key: 'flightno' },
		{ name: 'date', field: 'Date', key: 'flightdate' },
		{ name: 'detail', field: 'Detail', key: 'detail' },
		{ name: 'numberOfFc', field: 'Number of FCs', key: 'numberoffcs' },
		{ name: 'numberOfCc', field: 'Number of CCs', key: 'numberofccs' },
		{ name: 'numberOfCrew', field: 'Number of Crews', key: 'numberofcrews' },
		{
			name: 'numberOfVehicle',
			field: 'Number of Vehicle',
			key: 'numberofvehicles',
		},
		{ name: 'unitPrice', field: 'Unit Price', key: 'unitprice' },
		{ name: 'accessBridge', field: 'Access Bridge', key: 'accessbridgefee' },
		{ name: 'toll', field: 'Toll', key: 'tollfee' },
		{ name: 'transitDuty', field: 'Transit Duty', key: 'transitdutyfee' },
		{
			name: 'airportParkFee',
			field: 'Airport Parking Fee',
			key: 'airportparkingfee',
		},
		{ name: 'totalCharge', field: 'Total Charge', key: 'totalcharge' },
		{
			name: 'totalChargeVnd',
			field: 'Total Charge (VND)',
			key: 'totalchargevnd',
		},
	];
	displayedFooterColumns: string[];

	constructor() {
		super();
		this.formGroupSearch = this.fb.group({
			marketCode: [''],
			month: [''],
			year: [],
		});
		this.displayedColumns = this.displayedColumnsTracking.map(
			(item) => item.name,
		);
		this.displayedFooterColumns = [
			'#',
			...this.displayedColumnsTracking
				.filter((item, idx) => {
					return idx > 3;
				})
				.map((item) => item.name),
		];
	}

	override async ngOnInit() {
		await this.spinner.show();
		this.markets = (
			await this.flightMarketService.search({
				option: 1,
				status: 'Operational',
			})
		).data;
		this.formGroupSearch.controls['marketCode'].setValue(this.markets[0]);
		for (let i = 1; i <= 12; i++) {
			this.monthSelection.push(i < 10 ? '0' + i : '' + i);
		}
		//Create list year
		const currentYear = new Date().getFullYear();
		const startYear = Math.floor(currentYear / 100) * 100;
		const endYear = startYear + 99;

		for (let year = startYear; year <= endYear; year++) {
			this.listYear.push(year);
		}

		//default current month
		const month = new Date().getMonth() + 1;
		this.formGroupSearch.controls['month'].setValue(
			month < 10 ? '0' + month : month.toString(),
		);
		//default current year
		this.formGroupSearch.controls['year'].setValue(new Date().getFullYear());
		this.formGroupSearchInit = { ...this.formGroupSearch.value };
		await this.search();
		await this.spinner.hide();
	}

	override async search() {
		await this.spinner.show();
		const { marketCode, month, year } = this.formGroupSearch.value;
		const response = await this.baseService.search({
			marketCode,
			month,
			year,
		});
		this.dataSource.data = response.data;

		await this.spinner.hide();
	}

	async exportDownloadFile() {
		let exportObj = this.formGroupSearch.getRawValue();
		exportObj = { ...exportObj, export: true };
		await this.exportFileOptions(exportObj, 'export-car-cost-tracking.xlsx');
	}
}
