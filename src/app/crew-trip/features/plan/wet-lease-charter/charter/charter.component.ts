import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButton, MatAnchor } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDateRangeInput, MatDateRangePicker, MatDatepickerToggle, MatDatepickerCancel, MatDatepickerActions, MatDatepickerApply, MatDatepickerModule } from '@angular/material/datepicker';
import { MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatCell, MatCellDef, MatFooterRow, MatFooterRowDef, MatFooterCell, MatFooterCellDef } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import moment from 'moment';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { CharterService } from 'src/app/crew-trip/core/services/charter.service';
import { WetLeaseService } from 'src/app/crew-trip/core/services/wet-lease.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { DataCalculateTotal } from 'src/app/crew-trip/shared/data-calculate-total';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { DATE_FORMAT_DD_MM_YYYY } from 'src/app/crew-trip/shared/utils/constant';

@Component({
  selector: 'app-charter',
  standalone: true,
  imports: [
    FormsModule, InputSizeComponent, MatCard, MatCardContent, SelectionSuggestComponent, ReactiveFormsModule,
    MatDateRangeInput, MatDateRangePicker, MatLabel, MatFormFieldModule, MatDatepickerToggle, NgxTrimDirectiveModule,
    MatButton, MatDatepickerCancel, MatDatepickerActions, MatDatepickerApply, NgxControlError, MatDatepickerModule,
    MatCardModule, MatAnchor, MatTable, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef,
    MatRow, MatRowDef, MatCell, MatCellDef, MatFooterRow, MatFooterRowDef, MatFooterCell, MatFooterCellDef,
    DatePipe, DecimalPipe, DataCalculateTotal, SelectMultipleComponent, MatPaginator, RouterLink,
  ],
  templateUrl: './charter.component.html',
  styleUrl: './charter.component.scss',
  providers: [
    provideNativeDateAdapter(),
    provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),
  ],
})
export class CharterComponent extends CommonComponent {
  override baseService: CharterService = inject(CharterService);


  headerRowDef1 = ['airportCode', 'startDate', 'endDate', 'totalRoom', 'totalRoomElc', 'totalRoomLco'];
  headerRowDef2 = ['totalSingleRoom', 'totalTwinRoom'];
  rowDef = []
  footerRowDef = []

  constructor() {
    super()
    this.formGroupSearch = this.formBuilder.group({
      airportCodes: [''],
      startDate: [''],
      endDate: [''],
    });
  }
  override ngOnInit(): void {
    this.loadListFlightMarket({ status: 'Operational' });
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

}
