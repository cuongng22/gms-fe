import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, output } from '@angular/core';
import {
	FormBuilder,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { FlightMarketStatusEnum } from '../../../category/flight-market/flight-market.model';
import { getYear, months } from '../daily-flight-schedules.model';

@Component({
	selector: 'app-daily-flight-schedules-search',
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
		MatNativeDateModule,
		MatAutocompleteModule,
		CommonModule,
		SelectionSuggestComponent,
		SelectionComponent,
	],
	templateUrl: './daily-flight-schedules-search.component.html',
	styleUrl: './daily-flight-schedules-search.component.scss',
})
export class DailyFlightSchedulesSearchComponent implements OnInit {
	flightMarketService = inject(FlightMarketService);
	search = output<any>();
	formBuilder = inject(FormBuilder);

	airports: any[] = [];
	months: any[] = [];
	years: any[] = [];

	formGroupSearch = this.formBuilder.group({
		airport: ['', Validators.required],
		month: '',
		year: 0,
		timeZone: '',
	});

	async ngOnInit() {
		const airportResponse = await this.flightMarketService.search<any>({
			option: 0,
			page: 0,
			size: 999999,
			limit: 999999,
			status: FlightMarketStatusEnum.OPERATIONAL,
		});
		this.airports = [
			...airportResponse.data.content.map((item: any) => {
				return {
					marketCode: item.marketCode,
					marketName: item.marketName,
					timezone: item.timezone,
				};
			}),
		];
		this.months = months;
		this.years = getYear();

		this.formGroupSearch.controls.airport.setValue(this.airports[0].marketCode);
		this.formGroupSearch.controls.timeZone.setValue(this.airports[0].timezone);

		const currentMonth = new Date().getMonth() + 1;
		this.formGroupSearch.controls.month.setValue(
			currentMonth < 10
				? '0' + currentMonth.toString()
				: currentMonth.toString(),
		);
		this.formGroupSearch.controls.year.setValue(new Date().getFullYear());

		this.onSearch();
	}

	airportChange(value: any) {
		const airportFilter = this.airports.find(
			(item) => item.marketCode === value.value,
		);
		this.formGroupSearch.controls.timeZone.setValue(airportFilter?.timezone);
	}

	onSearch() {
		this.formGroupSearch.markAllAsTouched();
		if (this.formGroupSearch.invalid) {
			return;
		}
		const bodySearch = {
			...this.formGroupSearch.value,
			timezone: this.airports.find(
				(item: any) => item.marketCode === this.formGroupSearch.value.airport,
			)?.timezone,
		};
		console.log(bodySearch);
		this.search.emit(this.formGroupSearch.value);
	}
}
