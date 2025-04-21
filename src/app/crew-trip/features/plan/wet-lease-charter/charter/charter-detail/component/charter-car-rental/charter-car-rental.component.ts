import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { ClickOutside } from 'ngxtension/click-outside';
import { NgxControlError } from 'ngxtension/control-error';
import { Subscription } from 'rxjs';
import { CharterService } from 'src/app/crew-trip/core/services/charter.service';
import { CategoryEnum } from 'src/app/crew-trip/features/plan/budget-procurement/budget-procurement.model';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DatepickerYearMonthComponent } from 'src/app/crew-trip/shared/component/datepicker-year-month/datepicker-year-month.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { SeparatorDirective } from 'src/app/crew-trip/shared/directive/separator.directive';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { round } from 'src/app/crew-trip/shared/utils/constant';
import { DatepickerComponent } from 'src/app/ui-elements/datepicker/datepicker.component';
import { formula } from './charter-car-rental.model';
@Component({
	selector: 'app-charter-car-rental',
	standalone: true,
	imports: [
		MatCardModule,
		FormsModule,
		ReactiveFormsModule,
		MatSelectModule,
		MatButtonModule,
		MatFormFieldModule,
		MatFormField,
		MatInputModule,
		InputSizeComponent,
		MatCheckboxModule,
		CommonModule,
		MatTableModule,
		DataTransformPipe,
		RouterLink,
		RouterModule,
		MatMenuModule,
		MatAutocompleteModule,
		NgxControlError,
		DatepickerYearMonthComponent,
		DigitOnlyModule,
		SeparatorDirective,
		SelectionSuggestComponent,
		DatepickerComponent,
		MatDatepickerModule,
		NgxControlError,
		ClickOutside,
	],
	templateUrl: './charter-car-rental.component.html',
	styleUrl: './charter-car-rental.component.scss',
})
export class CharterCarRentalComponent extends CommonComponent {
	override baseService = inject(CharterService);
	CategoryEnum = CategoryEnum;
	headerRowDef1 = [
		'carType',
		'numberOfTrip',
		'totalAmountForex',
		'totalAmount',
	];
	headerRowDef2 = ['totalAmountExcVat', 'totalAmountIncVat'];
	rowDef = [
		'carType',
		'numberOfTrip',
		'totalAmountForex',
		'totalAmountExcVat',
		'totalAmountIncVat',
	];
	totalRowDef = [
		'total',
		'totalAmountForex',
		'totalAmountExcVat',
		'totalAmountIncVat',
	];

	disabled = input<boolean>(false);
	data = input<any[]>();
	category = input.required<CategoryEnum>(); // quốc tế hoặc quốc nội
	round = round;
	constructor() {
		super();
		effect(() => {
			if (this.data() && (this.data()?.length ?? 0) > 0) {
				this.setDataSource(this.data() ?? []);
			}
		});
	}
	exchangeRateSubscription: Subscription;
	rateVatSubscription: Subscription;
	transportsSubscription: Subscription;

	override ngOnInit(): void {
		this.exchangeRateSubscription = this.baseService.exchangeRate$.subscribe(
			(data) => {
				if (data) {
					const _exchangeRate = Number(data);
					this.dataSource.data.forEach((element) => {
						element.exchangeRate = _exchangeRate;
						this.calculation('totalAmountForex', element);
						this.calculation('totalAmountIncVat', element);
						this.calculation('totalAmountExcVat', element);
					});
				}
			},
		);

		this.rateVatSubscription = this.baseService.rateVat$.subscribe((data) => {

			const _rateVat = Number(data ?? 0);
			this.dataSource.data.forEach((element) => {
				element.rateVat = _rateVat;
				this.calculation('totalAmountForex', element);
				this.calculation('totalAmountIncVat', element);
				this.calculation('totalAmountExcVat', element);
			});

		});
		this.transportsSubscription = this.baseService.transports$.subscribe(data => {
			this.dataSource.data.forEach((element) => {
				if (element.carType === data.carType) {
					element.unitPrice = Number(data.priceIncVat);
					this.calculation('totalAmountForex', element);
					this.calculation('totalAmountIncVat', element);
					this.calculation('totalAmountExcVat', element);
				}
			});
		})
	}

	setDataSource(value: any[]) {
		this.dataSource.data = [...value];
		this.dataSource.data.forEach((element) => {
			this.calculation('totalAmountForex', element);
			this.calculation('totalAmountIncVat', element);
			this.calculation('totalAmountExcVat', element);
		});
	}
	calWithFormula(formula: string, item: any) {
		const formulaFunction = new Function('item', `return ${formula};`);
		return formulaFunction(item);
	}

	calculation(control: string, item: any) {
		const _formula = formula[control].formula;
		item[control] = this.calWithFormula(_formula, item);
	}

	getTotal(control: string) {
		return Math.round(
			this.dataSource.data
				.map((item: any) => {
					return Number(this.calWithFormula(`item.${control}`, item));
				})
				.reduce((acc, value) => acc + value, 0),
		);
	}

	clickEdit(data: any, control: string) {
		data[control] = true;
	}
	clickOutside(data: any, control: string) {
		data[control] = false;
		this.calculation('totalAmountForex', data);
		this.calculation('totalAmountIncVat', data);
		this.calculation('totalAmountExcVat', data);
	}
}
