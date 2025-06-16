import { CommonModule } from '@angular/common';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import {
	FormBuilder,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardModule } from '@angular/material/card';
import {
	MatCell,
	MatCellDef,
	MatColumnDef,
	MatHeaderCell,
	MatHeaderCellDef,
	MatHeaderRow,
	MatHeaderRowDef,
	MatNoDataRow,
	MatRow,
	MatRowDef,
	MatTable,
} from '@angular/material/table';
import moment from 'moment';
import { RoomBookingService } from 'src/app/crew-trip/core/services/room-booking.service';
import { BaseImport } from 'src/app/crew-trip/shared/base-import';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { ListResponse } from 'src/app/crew-trip/shared/models/common.model';
import { SelectOptions } from 'src/app/crew-trip/shared/select-option';
import {
	DATE_FORMAT_DD_MM_YYYY,
	MESSAGE,
	removeNullValues,
} from 'src/app/crew-trip/shared/utils/constant';

@Component({
	selector: 'app-room-booking',
	standalone: true,
	imports: [
		CommonModule,
		MatCard,
		FormsModule,
		InputSizeComponent,
		ReactiveFormsModule,
		MatCardContent,
		SelectionComponent,
		SelectionSuggestComponent,
		MatButton,
		MatCardModule,
		MatTable,
		MatColumnDef,
		MatHeaderCell,
		MatCell,
		MatHeaderRow,
		MatRow,
		MatHeaderCellDef,
		MatCellDef,
		MatHeaderRowDef,
		MatRowDef,
		MatNoDataRow,
		BaseImport,
	],
	providers: [
		// provideMomentDateAdapter(),
		provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),
	],
	templateUrl: './room-booking.component.html',
	styleUrl: './room-booking.component.scss',
})
export class RoomBookingComponent extends CommonComponent implements OnInit {
	override baseService = inject(RoomBookingService);
	optionsFlightScheduleType = SelectOptions.FLIGHT_SCHEDULE_TYPE;
	optionsServiceApplied = SelectOptions.SERVICE_APPLIED;
	monthSelection: string[] = [];
	fb: FormBuilder = inject(FormBuilder);
	markets: string[] = [];
	listYear: number[] = [];
	excelFile: Blob | null = null;
	override displayedColumns: string[] = [];

	constructor(private http: HttpClient) {
		super();
		this.formGroupSearch = this.fb.group({
			scheduleType: ['2', [Validators.required]],
			marketCode: ['', [Validators.required]],
			// month: [currentMonth, [Validators.required]],
			// year: [currentYear, [Validators.required]],
			type: ['FC', [Validators.required]],
			timezone: ['FC'],
			export: [false],
			startDate: [''],
			endDate: [''],
		});
	}

	override async ngOnInit(): Promise<void> {
		await this.spinner.show();
		try {
			const marketCodes = await this._flightMarketService.search({
				option: 1,
				status: 'Operational',
			});
			this.markets = marketCodes.data;
			this.formGroupSearch.patchValue({
				marketCode: this.markets[0],
				startDate: moment().startOf('month').format('YYYY/MM/DD'),
				endDate: moment().endOf('month').format('YYYY/MM/DD'),
			});
		} catch (error: any) {
			console.log('Error fetching market codes:', error);
			this.showError(error);
		}
		await this.search();
		await this.spinner.hide();
	}

	loadExcelFile(url: any): void {
		this.http.get(url, { responseType: 'blob' }).subscribe(
			(fileBlob: Blob) => {
				this.excelFile = fileBlob;
			},
			(error) => {
				console.error('Error loading Excel file:', error);
			},
		);
	}

	// override async search() {
	//   await this.spinner.show();
	//   try {
	//     let urlFilePath = 'http://192.168.10.68:8081/source/documents/crew_overnight_stays.xlsx';
	//     this.loadExcelFile(urlFilePath);
	//   } catch (error: any) {
	//     this.showError(error);
	//     await this.spinner.hide();
	//   }
	//   await this.spinner.hide();
	// }

	override async search<T>(
		body?: any,
		isNextPage?: boolean,
		fnSearch?: (bodySearch: any) => ListResponse<T> | any,
	) {
		try {
			this.formGroupSearch.patchValue({
				export: false,
			});
			this.formGroupSearch.markAllAsTouched();
			if (this.formGroupSearch.getRawValue().startDate) {
				this.formGroupSearch.patchValue({
					startDate: moment(
						this.formGroupSearch.getRawValue().startDate,
					).format('YYYY-MM-DD'),
				});
			}
			if (this.formGroupSearch.getRawValue().endDate) {
				this.formGroupSearch.patchValue({
					endDate: moment(this.formGroupSearch.getRawValue().endDate).format(
						'YYYY-MM-DD',
					),
				});
			}
			if (this.formGroupSearch.invalid) {
				this.findInvalidControls(this.formGroupSearch);
				return;
			}
			await this.spinner.show();
			const buildBodySearch = {
				...(removeNullValues(body) ||
					removeNullValues(this.formGroupSearch.value)),
			};
			let res;
			if (fnSearch) {
				res = await fnSearch(buildBodySearch);
			} else {
				res = await this.baseService.search<ListResponse<T>>(buildBodySearch);
			}
			if (res) {
				if (res.status === HttpStatusCode.Ok) {
					this.displayedColumns = res.data.columns;
					this.dataSource.data = res.data.data;
					this.dataSource.data = this.dataSource.data.map((row) => {
						const rowData: any = {};
						this.displayedColumns.forEach((col, index) => {
							rowData[col] = row[index] || '';
						});
						return rowData;
					});
				}
				return res;
			}
		} catch (e: any) {
			console.log(e);
			this.baseService.showError(
				e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR,
			);
		} finally {
			await this.spinner.hide();
		}
	}

	formatNewLine(value: string): string {
		if (value) {
			return value.replace(/\n/g, '<br/>');
		}
		return value;
	}

	override async exportFileOptions(
		body?: any,
		filename?: string,
		sourcePath?: string,
	) {
		try {
			await this.spinner.show();
			this.formGroupSearch.markAllAsTouched();
			if (this.formGroupSearch.invalid) {
				this.findInvalidControls(this.formGroupSearch);
				return;
			}
			this.formGroupSearch.patchValue({
				export: true,
			});
			const res = await this.baseService.exportDataOptions(
				{
					...(removeNullValues(body) ||
						removeNullValues(this.formGroupSearch.value)),
				},
				sourcePath,
			);
			this.downloadFile(res.blob, filename ?? res.fileName);
		} catch (e: any) {
			this.baseService.showError(e.error?.error?.code ?? MESSAGE.ERROR);
		} finally {
			await this.spinner.hide();
		}
	}
}
