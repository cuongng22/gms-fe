import { NoDataRowOutlet } from '@angular/cdk/table';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import {
	Component,
	ElementRef,
	inject,
	OnInit,
	ViewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
	MatAutocomplete,
	MatAutocompleteTrigger,
	MatOption,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
	MatError,
	MatFormField,
	MatFormFieldModule,
	MatLabel,
	MatPrefix,
	MatSuffix,
} from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { FlightCrewService } from 'src/app/crew-trip/core/services/flight-crew-service';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { InfoPlaneService } from 'src/app/crew-trip/core/services/InfoPlaneService.service';
import { UsersService } from 'src/app/crew-trip/core/services/users-service';
import { ConfigOvernightRateComponent } from 'src/app/crew-trip/features/category/flight-crew/config-overnight-rate/config-overnight-rate.component';
import { FlightCrewDetailComponent } from 'src/app/crew-trip/features/category/flight-crew/flight-crew-detail/flight-crew-detail.component';
import { OtherCrewComponent } from 'src/app/crew-trip/features/category/flight-crew/other-crew/other-crew.component';
import { RoleFunctionComponent } from 'src/app/crew-trip/features/roles/role-function/role-function.component';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { SelectOptions } from 'src/app/crew-trip/shared/select-option';
import { InputComponent } from 'src/app/ui-elements/input/input.component';

@Component({
	selector: 'app-flight-crew',
	standalone: true,
	imports: [
		CommonModule,
		MatCardModule,
		MatFormFieldModule,
		MatButtonModule,
		MatMenuModule,
		MatTableModule,
		MatPaginatorModule,
		NgIf,
		MatCheckboxModule,
		NgClass,
		MatFormField,
		MatSelect,
		MatOption,
		MatInput,
		MatLabel,
		ReactiveFormsModule,
		MatError,
		MatPrefix,
		MatSuffix,
		MatTab,
		MatTabGroup,
		RoleFunctionComponent,
		NoDataRowOutlet,
		InputComponent,
		NgxTrimDirectiveModule,
		OtherCrewComponent,
		ConfigOvernightRateComponent,
		MatAutocomplete,
		MatAutocompleteTrigger,
		SelectionComponent,
		InputSizeComponent,
		SelectMultipleComponent,
		MatIconModule,
	],

	templateUrl: './flight-crew.component.html',
	styleUrl: './flight-crew.component.scss',
})
export class FlightCrewComponent extends CommonComponent implements OnInit {
	override baseService = inject(FlightCrewService);
	flightMarketService = inject(FlightMarketService);
	infoPlaneService = inject(InfoPlaneService);
	usersService = inject(UsersService);
	fb = inject(FormBuilder);
	statusOptions = SelectOptions.STATUS;
	@ViewChild('marketCode') marketCode: ElementRef<HTMLInputElement>;
	@ViewChild(MatAutocompleteTrigger)
	autocompleteTrigger!: MatAutocompleteTrigger;
	markets: string[] = [];
	filteredOptionsMarket: any[];
	listActype: any[] = [];
  activeTab = 0;

	override formGroupDetail = this.fb.group({
		id: [''],
		marketCode: ['', [Validators.required]],
		acType: ['', [Validators.required]],
		pilotNumber: [
			'',
			[Validators.required, Validators.min(1), Validators.max(99)],
		],
		numberAttendant: [
			'',
			[Validators.required, Validators.min(1), Validators.max(99)],
		],
		notes: ['', [Validators.maxLength(500)]],
		status: [true],
	});
	override formGroupSearch = this.formBuilder.group({
		s: [''], //Keyword Search
		marketCode: [''],
		status: [''],
		acType: [''],
		export: [false],
	});

	constructor() {
		super();
	}

	override async ngOnInit() {
		super.ngOnInit();
		this.displayedColumns = [
			'stt',
			'market',
			'acType',
			'pilotNumber',
			'attendantNumber',
			'remark',
			'status',
			'action',
		];
		await Promise.all([
			this.getActypes(),
			this.getListAirport(),
			this.search(),
		]).then(() => { });
	}

	getListAirport() {
		this.flightMarketService
			.search({ page: 0, limit: 99999, option: 0 })
			.then((res) => {
				this.markets = res.data.content.map((item: any) => item.marketCode);
			});
	}

	filterMarket(): void {
		const filterValue = this.marketCode.nativeElement.value.toLowerCase();
		if (!filterValue) {
			this.filteredOptionsMarket = this.markets;
		}
		this.filteredOptionsMarket = this.markets.filter((market) =>
			market.toLowerCase().includes(filterValue),
		);
	}

	onFocusMarket(): void {
		this.filteredOptionsMarket = this.markets;
		this.autocompleteTrigger.openPanel();
	}

	async getActypes() {
		try {
			await this.spinner.show();
			const res = await this.infoPlaneService.search({
				page: this.pageIndex,
				limit: 9999,
			});
			const setAcGroup = new Set();
			this.listActype = res.data.content.filter((item: any) => {
				if (!setAcGroup.has(item.acgroup)) {
					setAcGroup.add(item.acgroup);
					return true;
				}
				return false;
			});
		} finally {
			await this.spinner.hide();
		}
	}

	async flightCrewDetail(id?: any) {
		let item = {};
		if (id) {
			const response = await this.baseService.detail(id);
			item = { ...response.data };
		}
		const markets = this.markets;
		const acTypes = this.listActype;
		const dialogRef = this.dialog.open(FlightCrewDetailComponent, {
			data: { item, markets, acTypes },
			disableClose: true,
			autoFocus: false,
		});
		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.search();
			}
		});
	}

	onTabChange(event: MatTabChangeEvent): void {
		this.activeTab = event.index;
	}
}
