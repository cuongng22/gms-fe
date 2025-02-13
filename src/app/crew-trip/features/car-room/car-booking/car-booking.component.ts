import {Component, inject, OnInit} from '@angular/core';
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {SelectionComponent} from "src/app/crew-trip/shared/component/selection/selection.component";
import {
  SelectionSuggestComponent
} from "src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component";
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {SelectOptions} from "src/app/crew-trip/shared/select-option";
import {RoomBookingService} from "src/app/crew-trip/core/services/room-booking.service";
import * as wjcXlsx from "@mescius/wijmo.xlsx";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-car-booking',
  standalone: true,
  imports: [
    InputSizeComponent,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardTitle,
    ReactiveFormsModule,
    SelectionComponent,
    SelectionSuggestComponent
  ],
  templateUrl: './car-booking.component.html',
  styleUrl: './car-booking.component.scss'
})
export class CarBookingComponent extends CommonComponent implements OnInit {
  optionsFlightScheduleType = SelectOptions.FLIGHT_SCHEDULE_TYPE;
  optionsServiceApplied = SelectOptions.SERVICE_APPLIED;
  monthSelection: string[] = [];
  fb: FormBuilder = inject(FormBuilder);
  roomBookingService: RoomBookingService = inject(RoomBookingService);
  markets: string[] = [];
  listYear: number[] = [];
  workbook: wjcXlsx.Workbook;
  sheetIndex: number;
  excelFile: Blob | null = null;

  constructor(private http: HttpClient) {
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
      // this.loadExcelFile();
    } catch (error: any) {
      this.showError(error);
    }
    await this.spinner.hide();
  }

  loadExcelFile(url: any): void {
    this.http
      .get(url, {responseType: 'blob'})
      .subscribe(
        (fileBlob: Blob) => {
          this.excelFile = fileBlob;
        },
        (error) => {
          console.error('Error loading Excel file:', error);
        }
      );
  }

  override async search() {
    await this.spinner.show();
    try {
      let urlFilePath = 'http://192.168.10.68:8081/source/documents/Pickup_FC_HOTEL_CXR_202411.xlsx';
      this.loadExcelFile(urlFilePath);
    } catch (error: any) {
      this.showError(error);
      await this.spinner.hide();
    }
    await this.spinner.hide();
  }
}
