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
import {HttpClient, HttpStatusCode} from "@angular/common/http";
import {HotelService} from "src/app/crew-trip/core/services/hotel-service";
import {ListResponse} from "src/app/crew-trip/shared/models/common.model";
import {MESSAGE, removeNullValues} from "src/app/crew-trip/shared/utils/constant";

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
  override baseService = inject(RoomBookingService);
  optionsFlightScheduleType = SelectOptions.FLIGHT_SCHEDULE_TYPE;
  optionsServiceApplied = SelectOptions.SERVICE_APPLIED;
  monthSelection: string[] = [];
  fb: FormBuilder = inject(FormBuilder);
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
    this.search();
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


  override async search<T>(body?: any, isNextPage?: boolean, fnSearch?: (bodySearch: any) => (ListResponse<T> | any)) {
    try {
      await this.spinner.show();
      const buildBodySearch = {
        ...removeNullValues(body) || removeNullValues(this.formGroupSearch.value)
      }
      let res;
      if (fnSearch) {
        res = await fnSearch(buildBodySearch);
      } else {
        res = await this.baseService.search<ListResponse<T>>(buildBodySearch);
      }
      if (res) {
        if (res.status === HttpStatusCode.Ok) {
          this.dataSource.data = res.data.content;
          this.dataSource.data = this.dataSource.data.map((s: any) => ({
            ...s,
            isActiveLabel:
              s.isActive === true || !!s.isActive
                ? MESSAGE.ACTIVE
                : MESSAGE.INACTIVE,
            activeLabel:
              s.active === true || !!s.active || s.status === true || !!s.status
                ? MESSAGE.ACTIVE
                : MESSAGE.INACTIVE,
          }));
        }
        return res
      }
    } catch (e: any) {
      this.baseService.showError(
        e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR,
      );
    } finally {
      await this.spinner.hide();
    }
  }
}
