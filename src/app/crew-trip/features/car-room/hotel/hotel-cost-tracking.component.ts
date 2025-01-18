import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
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
import { AvesCostRoomTrackingService } from 'src/app/crew-trip/core/services/aves-cost-room-tracking.service';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { DataCalculateTotal } from 'src/app/crew-trip/shared/data-calculate-total';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
  selector: 'app-hotel-cost-tracking',
  standalone: true,
  templateUrl: './hotel-cost-tracking.component.html',
  styleUrls: ['./hotel-cost-tracking.component.scss'],
  imports: [
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    InputSizeComponent,
    MatFormFieldModule,
    SelectionSuggestComponent,
    MatSelect,
    MatOption,
    MatButton,
    MatCardTitle,
    MatCardHeader,
    MatCardSubtitle,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    DecimalPipe,
    MatFooterRow,
    MatFooterRowDef,
    MatFooterCellDef,
    MatFooterCell,
    DataCalculateTotal,
    DatePipe,
    MatNoDataRow,
  ],
})
export class HotelCostTrackingComponent
  extends CommonComponent
  implements OnInit
{
  flightMarketService = inject(FlightMarketService);
  override baseService = inject(AvesCostRoomTrackingService);
  markets: string[] = [];
  monthSelection = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ];
  listYear: number[] = [];

  displayedFirst: string[] = [
    '#',
    'checkin',
    'checkout',
    'quantity',
    'standardRoom',
    'numberOfNights',
    'earlyCheckIn',
    'lateCheckOut',
    'onTime',
    'earlyCheckInGroup',
    'lateCheckoutGroup',
    'onTimeGroup',
    'breakfast',
    'earlyCheckInChargeGroup',
    'lateCheckoutChargeGroup',
    'onTimeChargeGroup',
    'breakfastChargeGroup',
    'cityTaxCharge',
    'serviceTaxCharge',
    'accommodationTaxCharge',
    'totalCharge',
    'totalChargeVnd',
  ];
  displayedSecond: string[] = [
    'fltnoIn',
    'checkinDate',
    'checkinTime',
    'fltnoOut',
    'checkoutDate',
    'checkoutTime',
    'quantityfc',
    'quantityCcMen',
    'quantityCcWomen',
    'fcSingle',
    'ccSingle',
    'ccTwin',
    'earlyCheckInGroupFc',
    'earlyCheckInGroupCc',
    'earlyCheckInGroupTwin',
    'lateCheckoutGroupFc',
    'lateCheckoutGroupCc',
    'lateCheckoutGroupTwin',
    'onTimeGroupFc',
    'onTimeGroupCc',
    'onTimeGroupTwin',
    'breakfastFc',
    'breakfastCc',
    'earlyCheckInChargeGroupFc',
    'earlyCheckInChargeGroupCc',
    'earlyCheckInChargeGroupTwin',
    'lateCheckoutChargeGroupFc',
    'lateCheckoutChargeGroupCc',
    'lateCheckoutChargeGroupTwin',
    'onTimeChargeFc',
    'onTimeChargeCc',
    'onTimeChargeTwin',
    'breakfastChargeGroupFc',
    'breakfastChargeGroupCc',
    'cityTaxChargeFc',
    'cityTaxChargeCc',
    'serviceTaxChargeFc',
    'serviceTaxChargeCc',
    'accommodationTaxChargeFc',
    'accommodationTaxChargeCc',
  ];
  override displayedColumns: string[] = [
    '#',
    'fltnoIn',
    'checkinDate',
    'checkinTime',
    'fltnoOut',
    'checkoutDate',
    'checkoutTime',
    'quantityfc',
    'quantityCcMen',
    'quantityCcWomen',
    'fcSingle',
    'ccSingle',
    'ccTwin',
    'numberOfNights',
    'earlyCheckIn',
    'lateCheckOut',
    'onTime',
    'earlyCheckInGroupFc',
    'earlyCheckInGroupCc',
    'earlyCheckInGroupTwin',
    'lateCheckoutGroupFc',
    'lateCheckoutGroupCc',
    'lateCheckoutGroupTwin',
    'onTimeGroupFc',
    'onTimeGroupCc',
    'onTimeGroupTwin',
    'breakfastFc',
    'breakfastCc',
    'earlyCheckInChargeGroupFc',
    'earlyCheckInChargeGroupCc',
    'earlyCheckInChargeGroupTwin',
    'lateCheckoutChargeGroupFc',
    'lateCheckoutChargeGroupCc',
    'lateCheckoutChargeGroupTwin',
    'onTimeChargeFc',
    'onTimeChargeCc',
    'onTimeChargeTwin',
    'breakfastChargeGroupFc',
    'breakfastChargeGroupCc',
    'cityTaxChargeFc',
    'cityTaxChargeCc',
    'serviceTaxChargeFc',
    'serviceTaxChargeCc',
    'accommodationTaxChargeFc',
    'accommodationTaxChargeCc',
    'totalCharge',
    'totalChargeVnd',
  ];
  tableData: any[] = [];
	@Input()
	  type: 'International' | 'Domestic' = 'International';

	constructor(private fb: FormBuilder) {
	  super();
	  this.formGroupSearch = this.fb.group({
	    marketCode: [''],
	    month: [''],
	    year: [],
	  });
	}

	override async ngOnInit() {
	  await this.spinner.show();
	  this.markets = (
	    await this.flightMarketService.search({
	      option: 1,
	      type: this.type,
	      status: 'Operational',
	    })
	  ).data;
	  this.formGroupSearch.controls['marketCode'].setValue(this.markets[0]);
	  //Create list year
	  const currentYear = new Date().getFullYear();
	  const startYear = Math.floor(currentYear / 100) * 100;
	  const endYear = startYear + 99;

	  for (let year = startYear; year <= endYear; year++) {
	    this.listYear.push(year);
	  }

	  //default current month
	  this.formGroupSearch.controls['month'].setValue(
	    new Date().getMonth() + 1 + '',
	  );
	  //default current year
	  this.formGroupSearch.controls['year'].setValue(new Date().getFullYear());
	  this.formGroupSearchInit = { ...this.formGroupSearch.value };
	  //Get list Data
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
	  this.tableData = response.data;
	  await this.spinner.hide();
	}

	async exportDownloadFile() {
	  let exportObj = this.formGroupSearch.getRawValue();
	  exportObj = { ...exportObj, export: true };
	  await this.exportFileOptions(exportObj);
	}
}
