import {Component, inject, OnInit} from '@angular/core';
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {SelectionComponent} from "src/app/crew-trip/shared/component/selection/selection.component";
import {
  SelectionSuggestComponent
} from "src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component";
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {SelectOptions} from "src/app/crew-trip/shared/select-option";
import {RoomBookingService} from "src/app/crew-trip/core/services/room-booking.service";
import {HttpClient, HttpStatusCode} from "@angular/common/http";
import {
  MatCell,
  MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow,
  MatRowDef, MatTable
} from "@angular/material/table";
import {NgForOf, NgIf} from "@angular/common";
import {ListResponse} from "src/app/crew-trip/shared/models/common.model";
import {MESSAGE, removeNullValues} from "src/app/crew-trip/shared/utils/constant";
import {Validators} from "ngx-editor";
import {TransportBookingService} from "src/app/crew-trip/core/services/transport-booking.service";

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
    SelectionSuggestComponent,
    MatCardHeader,
    MatCardSubtitle,
    MatCell,
    MatCellDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    NgForOf,
    MatColumnDef,
    MatHeaderCellDef,
    NgIf,
    MatNoDataRow
  ],
  templateUrl: './car-booking.component.html',
  styleUrl: './car-booking.component.scss'
})
export class CarBookingComponent extends CommonComponent implements OnInit {
  override baseService = inject(TransportBookingService);
  optionsFlightScheduleType = SelectOptions.FLIGHT_SCHEDULE_TYPE;
  optionsServiceApplied = SelectOptions.SERVICE_APPLIED;
  transportType = SelectOptions.TRANSPORT_TYPE;
  monthSelection: string[] = [];
  fb: FormBuilder = inject(FormBuilder);
  markets: string[] = [];
  listYear: number[] = [];
  sheetIndex: number;
  excelFile: Blob | null = null;

  constructor(private http: HttpClient) {
    super();
    for (let i = 1; i <= 12; i++) {
      this.monthSelection.push(i + '');
    }
    //Create list year
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1 + '';
    const startYear = 2020;
    const endYear = startYear + 20;
    for (let year = startYear; year <= endYear; year++) {
      this.listYear.push(year);
    }
    this.formGroupSearch = this.fb.group({
      scheduleType: [null,[Validators.required]],
      marketCode: [null,[Validators.required]],
      month: [currentMonth,[Validators.required]],
      year: [currentYear,[Validators.required]],
      type: [null,[Validators.required]],
      timezone:['CC',[Validators.required]],
      transportType: [null,[Validators.required]]
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
    // this.search();
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


  override async search<T>(body?: any, isNextPage?: boolean, fnSearch?: (bodySearch: any) => (ListResponse<T> | any)) {
    try {
      this.formGroupSearch.markAllAsTouched();
      if (this.formGroupSearch.invalid) {
        this.findInvalidControls(this.formGroupSearch);
        return;
      }
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
          this.displayedColumns = res.data.columns;
          console.log(this.displayedColumns)
          this.dataSource.data = res.data.data;
          this.dataSource.data = this.dataSource.data.map(row => {
            const rowData: any = {};
            this.displayedColumns.forEach((col, index) => {
              rowData[col] = row[index] || '';
            });
            rowData.isMergedRow = this.isMergedRow(rowData);
            return rowData;
          });
          console.log("  this.dataSource.data:",  this.dataSource.data)
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
  isMergedRow(row: any): boolean {
    return Object.values(row).slice(1).every(value => value === "");
  }


  formatNewLine(value: string): string {
    if (value) {
      return value.replace(/\n/g, '<br/>');
    }
    return value;
  }
}
