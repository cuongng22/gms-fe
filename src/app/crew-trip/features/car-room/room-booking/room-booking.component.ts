import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardModule} from '@angular/material/card';
import * as wjcXlsx from '@mescius/wijmo.xlsx';
import {RoomBookingService} from 'src/app/crew-trip/core/services/room-booking.service';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {
  SelectionSuggestComponent
} from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import {SelectionComponent} from 'src/app/crew-trip/shared/component/selection/selection.component';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {SelectOptions} from 'src/app/crew-trip/shared/select-option';
import {ExcelViewerComponent} from "src/app/crew-trip/shared/component/excel-viewer/excel-viewer.component";
import {CommonModule} from "@angular/common";

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
    ExcelViewerComponent,
  ],
  templateUrl: './room-booking.component.html',
  styleUrl: './room-booking.component.scss',
})
export class RoomBookingComponent extends CommonComponent implements OnInit {
  optionsFlightScheduleType = SelectOptions.FLIGHT_SCHEDULE_TYPE;
  optionsServiceApplied = SelectOptions.SERVICE_APPLIED;
  monthSelection: string[] = [];
  fb: FormBuilder = inject(FormBuilder);
  roomBookingService: RoomBookingService = inject(RoomBookingService);
  markets: string[] = [];
  listYear: number[] = [];
  workbook: wjcXlsx.Workbook;
  sheetIndex: number;

  constructor() {
    super();
    for (let i = 1; i <= 12; i++) {
      this.monthSelection.push(i + '');
    }
    //Create list year
    const currentYear = new Date().getFullYear();
    const startYear = Math.floor(currentYear / 100) * 100;
    const endYear = startYear + 99;

    for (let year = startYear; year <= endYear; year++) {
      this.listYear.push(year);
    }
    this.formGroupSearch = this.fb.group({
      flightScheduleType: [''],
      serviceApplied: [''],
      marketCode: [''],
      month: [''],
      year: [],
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
    } catch (error: any) {
      this.showError(error);
    }
    await this.spinner.hide();
  }

  override async search() {
    await this.spinner.show();
    const data = await this.roomBookingService.getFile(
      'documents/crew_overnight_stays_in.xlsx',
    );
    // this._loadWorkbook(data);
    await this.spinner.hide();
  }
}
