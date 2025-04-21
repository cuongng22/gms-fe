import { CommonModule } from '@angular/common';
import { Component, inject, input, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
	MatExpansionModule,
	MatExpansionPanelContent,
} from '@angular/material/expansion';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink, RouterModule } from '@angular/router';
import moment from 'moment';
import { CharterService } from 'src/app/crew-trip/core/services/charter.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { CategoryEnum } from '../../../budget-procurement/budget-procurement.model';
import { CharterCarRentalComponent } from './component/charter-car-rental/charter-car-rental.component';
import { CharterGeneralComponent } from './component/charter-general/charter-general.component';
import { CharterHotelComponent } from './component/charter-hotel/charter-hotel.component';

@Component({
	selector: 'app-charter-detail',
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
		MatCheckboxModule,
		CommonModule,
		MatTableModule,
		DataTransformPipe,
		RouterLink,
		RouterModule,
		MatMenuModule,
		MatExpansionModule,
		MatExpansionPanelContent,
		CharterGeneralComponent,
		CharterCarRentalComponent,
		CharterHotelComponent,
	],
	templateUrl: './charter-detail.component.html',
	styleUrl: './charter-detail.component.scss',
})
export class CharterDetailComponent extends CommonComponent {
	override baseService = inject(CharterService);
	router = inject(Router);
	@ViewChild('charterGeneral') charterGeneral: CharterGeneralComponent;
	@ViewChild('charterHotel', { static: false })
	charterHotel: CharterHotelComponent;
	@ViewChild('charterCarRental', { static: false })
	charterCarRental: CharterCarRentalComponent;
	CategoryEnum = CategoryEnum;
	id = input<number>();
	viewDetail = input<string>('true', { alias: 'view-detail' });
	category = signal<CategoryEnum>(CategoryEnum.DOMESTIC);
	isCompleted: boolean = false;
	showDialogCreateData: boolean = false;
	_formCharterGeneral: any = {};
	_dataGeneral: any;

	private _planHotel: any = {};
	private _planTransports: any[] = [];

	showDialogClose = false;
	isCreateData = false;

	override formGroupDetail = this.formBuilder.group({
		id: [],
		completed: [false],
	});

	override ngOnInit(): void {
		this.formCharterGeneral = {
			isHotel: true,
			isCarRental: true,
		};
		this.getDetailById(this.id());
	}

	async getDetailById(id: number | undefined) {
		try {
			await this.spinner.show();
			if (id) {
				let resDetail = await this.baseService.detail(this.id());
				this.formGroupDetail.patchValue({ ...resDetail.data });
				this.formGroupDetail.controls.id.setValue(id as any);
				this.dataGeneral = { ...resDetail.data, id: this.id() };
				this.charterGeneral.setData(this.dataGeneral);
				this.airportCodeChange(this.dataGeneral.airportCode);

				resDetail.data.planHotels.single.numberOfNight =
					this.dataGeneral.priceHotel.numberOfNight;
				resDetail.data.planHotels.single.priceRoom =
					this.dataGeneral.priceHotel.priceSingleRoom;
				resDetail.data.planHotels.single.priceRoomECI =
					this.dataGeneral.priceHotel.priceSingleRoomECI;
				resDetail.data.planHotels.single.priceRoomLCO =
					this.dataGeneral.priceHotel.priceSingleRoomLCO;
				resDetail.data.planHotels.single.exchangeRate =
					this.dataGeneral.exchangeRate;
				resDetail.data.planHotels.single.rateVat = this.dataGeneral.rateVat;

				resDetail.data.planHotels.twin.numberOfNight =
					this.dataGeneral.priceHotel.numberOfNight;
				resDetail.data.planHotels.twin.priceRoom =
					this.dataGeneral.priceHotel.priceTwinRoom;
				resDetail.data.planHotels.twin.priceRoomECI =
					this.dataGeneral.priceHotel.priceTwinRoomECI;
				resDetail.data.planHotels.twin.priceRoomLCO =
					this.dataGeneral.priceHotel.priceTwinRoomLCO;
				resDetail.data.planHotels.twin.exchangeRate =
					this.dataGeneral.exchangeRate;
				resDetail.data.planHotels.twin.rateVat = this.dataGeneral.rateVat;
				this.planHotel = { ...resDetail.data.planHotels };

				this.planTransports = [...resDetail.data.planTransports];
				this.planTransports.forEach((element) => {
					const _priceTransport = resDetail.data.priceTransports.find(
						(item: any) => item.carType === element.carType,
					);
					element.unitPrice = _priceTransport.priceIncVat;
					element.exchangeRate = this.dataGeneral.exchangeRate;
					element.rateVat = this.dataGeneral.rateVat;
				});

				this.isCompleted = !!this.formGroupDetail.controls.completed.value;
				if (this.disable) {
					this.formGroupDetail.controls.completed.disable();
					// this.viewDetail ;
				}
			}
		} finally {
			this.spinner.hide();
		}
	}

	createData() {
		this.charterGeneral.formGroupDetail.markAllAsTouched();
		console.log(this.charterGeneral.formGroupDetail);
		const isRequiredTransportation =
			this.charterGeneral.checkRequiredTransportation();
		const _dataGeneral = this.charterGeneral.formGroupDetail.getRawValue();
		if (
			this.charterGeneral.formGroupDetail.invalid ||
			this.charterGeneral.duplicateCarRental()
		) {
			return;
		} else if (
			(_dataGeneral.isCarRental &&
				this.charterGeneral.dataSource.data.length <= 0) ||
			isRequiredTransportation
		) {
			this.showError(
				$localize`:@@cannotSaveDataWithoutTransportationData:Cannot create data without transportation data`,
			);
			return;
		} else if (
			(_dataGeneral.isHotel &&
				this.charterHotel?.dataSource.data &&
				this.charterHotel?.dataSource.data.length > 0) ||
			(_dataGeneral.isCarRental &&
				this.charterCarRental?.dataSource.data &&
				this.charterCarRental?.dataSource.data.length > 0)
		) {
			this.toggleDialogCreateData();
		} else {
			this.confirmCreateData();
		}
	}

	async confirmCreateData() {
		this.showDialogCreateData = false;
		await this.spinner.show();

		let _dataGeneral = this.charterGeneral.formGroupDetail.getRawValue();
		let _priceHotels = _dataGeneral.priceHotel;
		let _priceTransports = [...this.charterGeneral.dataSource.data];

		this.planHotel = {
			single: {
				totalNormalRoom: null,
				totalECIRoom: null,
				totalLCORoom: null,
				numberOfNight: _priceHotels.numberOfNight,
				priceRoom: _priceHotels.priceSingleRoom,
				priceRoomECI: _priceHotels.priceSingleRoomECI,
				priceRoomLCO: _priceHotels.priceSingleRoomLCO,
				exchangeRate: _dataGeneral.exchangeRate,
				rateVat: _dataGeneral.rateVat,
				totalForex: null,
				totalIncVAT: null,
				totalExcVAT: null,
			},
			twin: {
				totalNormalRoom: null,
				totalECIRoom: null,
				totalLCORoom: null,
				numberOfNight: _priceHotels.numberOfNight,
				priceRoom: _priceHotels.priceTwinRoom,
				priceRoomECI: _priceHotels.priceTwinRoomECI,
				priceRoomLCO: _priceHotels.priceTwinRoomLCO,
				exchangeRate: _dataGeneral.exchangeRate,
				rateVat: _dataGeneral.rateVat,
				totalForex: null,
				totalIncVAT: null,
				totalExcVAT: null,
			},
		};

		let _planTransports: any[] = [];
		_priceTransports.forEach((element) => {
			const _planTransport = {
				carType: element.carType,
				numberOfTrip: null,
				unitPrice: element.priceIncVat,
				exchangeRate: _dataGeneral.exchangeRate,
				rateVat: _dataGeneral.rateVat,
				totalAmountForex: null,
				totalAmountIncVat: null,
				totalAmountExcVat: null,
			};
			_planTransports.push(_planTransport);
		});
		this.planTransports = _planTransports;
		this.dataGeneral = { ...this.charterGeneral.formGroupDetail.getRawValue() };
		this.isCreateData = true;
		this.spinner.hide();
	}

	async saveAndProccess() {
		const res = await this.save();
		if (res.data && !this.id()) {
			this.router.navigate([
				'/plan/est-plan/wet-lease-charter/charter-detail',
				res.data,
			]);
		} else if (this.id()) {
			this.getDetailById(this.id());
		}
	}

	async saveAndClose() {
		try {
			await this.save();
			this.router.navigate(['/plan/est-plan/wet-lease-charter'], {
				fragment: 'charter',
			});
		} catch (error: any) {
			console.error(error);
		}
	}

	override async save(): Promise<any> {
		debugger
		const isRequiredTransportation =
			this.charterGeneral.checkRequiredTransportation();
		const _dataGeneral = this.charterGeneral.formGroupDetail.getRawValue();
		this.charterGeneral.formGroupDetail.markAllAsTouched();
		if (
			this.charterGeneral.formGroupDetail.invalid ||
			this.charterGeneral.duplicateCarRental()
		) {
			return;
		} else if (
			(_dataGeneral.isCarRental &&
				this.charterGeneral.dataSource.data.length <= 0) ||
			isRequiredTransportation
		) {
			this.showError(
				$localize`:@@cannotSaveDataWithoutTransportationData:Cannot save data without transportation data`,
			);
			return;
		}

		await this.spinner.show();
		const _priceTransports = this.charterGeneral.dataSource.data;
		const _planHotel = this.charterHotel.dataSource.data;
		const _planTransports = this.charterCarRental.dataSource.data;

		let _body: any = { ..._dataGeneral };
		_body.id = this.formGroupDetail.controls.id.value;
		_body.completed = this.formGroupDetail.controls.completed.value;
		_body.startDate = moment(_dataGeneral.startDate).format(
			this.Constant.LOCAL_DATE_FORMAT,
		);
		_body.endDate = moment(_dataGeneral.endDate).format(
			this.Constant.LOCAL_DATE_FORMAT,
		);
		_body.priceTransports = [..._priceTransports];
		_body.planHotels = {
			...Object.fromEntries(
				_planHotel.map(([key, value]) => [
					key,
					Object.fromEntries(
						Object.entries(value).map(([key, value]) => [key, Number(value)]),
					),
				]),
			),
		};
		_body.planTransports = [..._planTransports];
		_body.totalNumberOfTrip = _planTransports.map((item) => item.numberOfTrip).reduce((acc, value) => acc + value, 0);

		_body.totalForex = [
			..._planHotel.map((item) => item[1].totalForex).flat(),
			..._planTransports.map((item) => item.totalAmountForex).flat(),].reduce((acc, value) => acc + value, 0);

		_body.totalIncVAT = [
			..._planHotel.map((item) => item[1].totalIncVAT).flat(),
			..._planTransports.map((item) => item.totalAmountIncVat).flat(),
		].reduce((acc, value) => acc + value, 0);

		_body.totalExcVAT = [
			..._planHotel.map((item) => item[1].totalExcVAT).flat(),
			..._planTransports.map((item) => item.totalAmountExcVat).flat(),
		].reduce((acc, value) => acc + value, 0);

		console.log(_body);

		try {
			const update = !!this.formGroupDetail.getRawValue().id;
			let res;
			if (update) {
				res = await this.baseService.update(_body);
			} else {
				res = await this.baseService.create(_body);
			}
			this.baseService.showSuccess(
				update ? this.MESSAGE.UPDATE_SUCCESS : this.MESSAGE.CREATE_SUCCESS,
			);
			return res;
		} catch (error: any) {
			console.error(error);
			throw error;
		} finally {
			this.spinner.hide();
		}
	}

	charterGeneralClearData() {
		this.charterHotel.dataSource.data = [];
		this.planHotel = [];

		this.charterCarRental.dataSource.data = [];
		this.planTransports = [];
	}

	async airportCodeChange(event: string) {
		const res = await this._flightMarketService.search({
			code: event,
			option: 0,
		});
		if (res.data.content[0].marketType === CategoryEnum.INTERNATIONAL) {
			this.category.set(CategoryEnum.INTERNATIONAL);
		}
	}

	formCharterGeneralChange($event: any) {
		this.formCharterGeneral = $event;
	}

	get formCharterGeneral() {
		return this._formCharterGeneral;
	}

	set formCharterGeneral(value: any) {
		this._formCharterGeneral = value;
		if (!value.isHotel) {
			this.planHotel = [];
			this.charterHotel.dataSource.data = [];
		}

		if (!value.isCarRental) {
			this.planTransports = [];
			this.charterCarRental.dataSource.data = [];
		}
	}

	get disable(): boolean {
		return this.viewDetail() === 'true' || this.isCompleted;
	}
	toggleDialogCreateData() {
		this.showDialogCreateData = !this.showDialogCreateData;
	}

	get dataGeneral() {
		return this._dataGeneral;
	}

	set dataGeneral(value: any) {
		this._dataGeneral = value;
	}

	get planHotel() {
		return this._planHotel;
	}

	set planHotel(value: any) {
		this._planHotel = value;
	}

	get planTransports() {
		return this._planTransports;
	}

	set planTransports(value: any[]) {
		this._planTransports = value;
	}

	toggleDialogClose() {
		this.showDialogClose = !this.showDialogClose;
	}
}
