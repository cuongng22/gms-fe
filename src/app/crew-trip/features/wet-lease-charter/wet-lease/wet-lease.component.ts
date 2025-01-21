import { DatePipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import moment from 'moment';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { WetLeaseService } from 'src/app/crew-trip/core/services/wet-lease.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { DataCalculateTotal } from 'src/app/crew-trip/shared/data-calculate-total';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { DATE_FORMAT_DD_MM_YYYY } from 'src/app/crew-trip/shared/utils/constant';

@Component({
  selector: 'app-wet-lease',
  standalone: true,
  imports: [
    FormsModule,
    InputSizeComponent,
    MatCard,
    MatCardContent,
    SelectionSuggestComponent,
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
    MatRow,
    MatRowDef,
    MatCell,
    MatCellDef,
    MatFooterRow,
    MatFooterRowDef,
    MatFooterCell,
    MatFooterCellDef,
    DatePipe,
    DecimalPipe,
    DataCalculateTotal,
    SelectMultipleComponent,
    MatPaginator,
    RouterLink,
  ],
  providers: [
    provideNativeDateAdapter(),
    provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wet-lease.component.html',
  styleUrl: './wet-lease.component.scss',
})
export class WetLeaseComponent extends CommonComponent implements OnInit {
  markets: string[] = [];
  fb: FormBuilder = inject(FormBuilder);
  override baseService: WetLeaseService = inject(WetLeaseService);
  displayedFirst: {
		name: string;
		field: string;
		rowSan: number;
		colSpan: number;
	}[] = [
      { name: 'airportCode', field: 'Airport Code', rowSan: 2, colSpan: 1 },
      {
        name: 'startDate',
        field: 'Start Date',
        rowSan: 2,
        colSpan: 1,
      },
      { name: 'endDate', field: 'End Date', rowSan: 2, colSpan: 1 },
      { name: 'totalQty', field: 'Total rooms', colSpan: 2, rowSan: 1 },
      { name: 'totalNumberOfTrip', field: 'No. of trip', rowSan: 2, colSpan: 1 },
      {
        name: 'totalForex',
        field: 'Total amount (Foreign exchange)',
        rowSan: 2,
        colSpan: 1,
      },
      { name: 'totalVnd', field: 'Total amount (VND)', colSpan: 2, rowSan: 1 },
      { name: 'action', field: 'Action', rowSan: 2, colSpan: 1 },
    ];
  displayedSecond: any[] = [
    { name: 'totalQtySingleRoom', field: 'Single Room' }, //tổng số phòng đơn
    { name: 'totalQtyTwinRoom', field: 'Twin room' }, //tổng số phòng đôi
    { name: 'totalIncVAT', field: 'Including VAT' },
    { name: 'totalExcVAT', field: 'Excluding VAT' },
  ];
  displayedFirstArr: string[];
  displayedSecondArr: string[];
  displayedFooterColumns: string[];

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      airportCodes: [''],
      startDate: [''],
      endDate: [''],
    });
    this.displayedFirstArr = this.displayedFirst.map((item) => item.name);
    this.displayedSecondArr = this.displayedSecond.map((item) => item.name);
    this.displayedColumns = [
      'airportCode',
      'startDate',
      'endDate',
      'totalQtySingleRoom',
      'totalQtyTwinRoom',
      'totalNumberOfTrip',
      'totalForex',
      'totalIncVAT',
      'totalExcVAT',
      'action',
    ];
    this.displayedFooterColumns = [
      'airportCode',
      'totalQtySingleRoom',
      'totalQtyTwinRoom',
      'totalNumberOfTrip',
      'totalForex',
      'totalIncVAT',
      'totalExcVAT',
      'action',
    ];
  }

  override async ngOnInit(): Promise<void> {
    await this.spinner.show();
    super.ngOnInit();

    this.formGroupSearchInit = { ...this.formGroupSearch.value };
    try {
      const marketList = await this._flightMarketService.search({
        option: 1,
        status: 'Operational',
      });
      this.markets = marketList.data;
      const firstDayOfCurrentYear = moment().startOf('year');
      const endDayOfCurrentYear = moment().endOf('year');
      this.formGroupSearch.patchValue({
        startDate: firstDayOfCurrentYear,
        endDate: endDayOfCurrentYear,
      });
      await this.search();
    } catch (error: any) {
      this.showError(error);
    } finally {
      await this.spinner.hide();
    }
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
}
