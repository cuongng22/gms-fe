import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardModule } from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
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
import { AvesCostRoomTrackingService } from 'src/app/crew-trip/core/services/aves-cost-room-tracking.service';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { DataCalculateTotal } from 'src/app/crew-trip/shared/data-calculate-total';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
  selector: 'app-hotel-cost-domestic',
  standalone: true,
  imports: [
    FormsModule,
    InputSizeComponent,
    MatButton,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    SelectionSuggestComponent,
    MatLabel,
    MatOption,
    MatSelect,
    MatFormFieldModule,
    MatCardModule,
    MatTable,
    MatCell,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    DatePipe,
    DecimalPipe,
    MatNoDataRow,
    MatFooterRow,
    MatFooterRowDef,
    MatFooterCell,
    MatFooterCellDef,
    DataCalculateTotal,
    CommonModule
  ],
  templateUrl: './hotel-cost-domestic.component.html',
  styleUrl: './hotel-cost-domestic.component.scss',
})
export class HotelCostDomesticComponent
  extends CommonComponent
  implements OnInit
{
  markets: string[] = [];
  monthSelection: string[] = [];
  listYear: number[] = [];
  fb: FormBuilder = inject(FormBuilder);
  flightMarketService = inject(FlightMarketService);
  override baseService = inject(AvesCostRoomTrackingService);
  displayedFirst: {
		name: string;
		field: string;
		rowSpan: number;
		colSpan: number;
		key: string;
	}[] = [
      { name: '#', field: '#', rowSpan: 2, colSpan: 1, key: '' },
      { name: 'checkin', field: 'Check-in', rowSpan: 1, colSpan: 3, key: '' },
      { name: 'checkout', field: 'Check-out', rowSpan: 1, colSpan: 3, key: '' },
      { name: 'quantity', field: 'Quantity', rowSpan: 1, colSpan: 3, key: '' },
      {
        name: 'standardRoom',
        field: 'Standard Room',
        rowSpan: 1,
        colSpan: 3,
        key: '',
      },
      {
        name: 'numberOfNights',
        field: 'Number of Nights',
        rowSpan: 2,
        colSpan: 1,
        key: 'overnightDays',
      },
      {
        name: 'timesStay',
        field: 'Time Stay',
        rowSpan: 2,
        colSpan: 1,
        key: 'timesStay',
      },
      {
        name: 'earlyCheckin',
        field: 'Early Check-in',
        rowSpan: 2,
        colSpan: 1,
        key: 'isEarlyCheckin',
      },
      {
        name: 'lateCheckout',
        field: 'Late Check-out',
        rowSpan: 2,
        colSpan: 1,
        key: 'isLateCheckout',
      },
      {
        name: 'totalNights',
        field: 'Total Nights',
        rowSpan: 2,
        colSpan: 1,
        key: 'totalNight',
      },
      {
        name: 'roomCharge',
        field: 'Room Charge',
        rowSpan: 1,
        colSpan: 3,
        key: '',
      },
      {
        name: 'totalChargeVnd',
        field: 'Total Charge (VND)',
        rowSpan: 2,
        colSpan: 1,
        key: 'totalVndCharge',
      },
    ];
  displayedSecond = [
    { name: 'fltnoIn', field: 'Arr Flt No', key: 'fltnoIn' },
    { name: 'checkinDate', field: 'Date', key: 'checkinDate' },
    { name: 'checkinTime', field: 'Time', key: 'checkinDate' },
    { name: 'fltnoOut', field: 'Dep Flt No', key: 'fltnoOut' },
    { name: 'checkoutDate', field: 'Date', key: 'checkoutDate' },
    { name: 'checkoutTime', field: 'Time', key: 'checkoutDate' },
    { name: 'quantityfc', field: 'FC', key: 'fcCount' },
    { name: 'quantityCcMen', key: 'maleCcCount', field: 'CC Men' },
    { name: 'quantityCcWomen', field: 'CC Women', key: 'femaleCcCount' },
    { name: 'fcSingle', field: 'FC Single', key: 'fcCount' },
    { name: 'ccSingle', field: 'CC Single', key: 'ccSingleRooms' },
    { name: 'ccTwin', field: 'CC Twin', key: 'ccRooms' },
    { name: 'roomChargeFc', field: 'FC Single', key: 'fcOntimeCharge' },
    { name: 'roomChargeCc', field: 'CC Single', key: 'ccSingleOntimeCharge' },
    { name: 'roomChargeTwin', field: 'CC Twin', key: 'ccTwinsOntimeCharge' },
  ];
  displayedFirstArr: string[];
  displayedSecondArr: string[];
  displayedColumnsArr: string[];
  displayedFooterArr: string[];

  constructor() {
    super();
    for (let i = 1; i <= 12; i++) {
      this.monthSelection.push(i + '');
    }
    const currentYear = new Date().getFullYear();
    const startYear = Math.floor(currentYear / 100) * 100;
    const endYear = startYear + 99;

    for (let year = startYear; year <= endYear; year++) {
      this.listYear.push(year);
    }

    this.formGroupSearch = this.fb.group({
      marketCode: [''],
      month: [''],
      year: [],
    });

    this.displayedFirstArr = this.displayedFirst.map((item) => item.name);
    this.displayedSecondArr = this.displayedSecond.map((item) => item.name);
    this.displayedColumnsArr = [
      '#',
      ...this.displayedSecond.slice(0, 12).map((item) => item.name),
      ...this.displayedFirst
        .filter(
          (item) =>
            item.rowSpan === 2 &&
						item.name !== '#' &&
						item.name !== 'totalChargeVnd',
        )
        .map((item) => item.name),
      ...this.displayedSecond.slice(12).map((item) => item.name),
      this.displayedFirst[this.displayedFirst.length - 1].name,
    ];
    this.displayedFooterArr = [
      '#',
      ...this.displayedSecond.slice(6, 12).map((item) => item.name),
      ...this.displayedFirst
        .filter(
          (item) =>
            item.rowSpan === 2 &&
						item.name !== '#' &&
						item.name !== 'totalChargeVnd',
        )
        .map((item) => item.name),
      ...this.displayedSecond.slice(12).map((item) => item.name),
      this.displayedFirst[this.displayedFirst.length - 1].name,
    ];
  }

  override async ngOnInit() {
    await this.spinner.show();
    this.markets = (
      await this.flightMarketService.search({
        option: 1,
        type: 'Domestic',
        status: 'Operational',
      })
    ).data;
    this.formGroupSearch.patchValue({
      marketCode: this.markets[0],
      month: new Date().getMonth() + 1 + '',
      year: new Date().getFullYear(),
    });
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
    await this.exportFileOptions(exportObj);
  }

}
