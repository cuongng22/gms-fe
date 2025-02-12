import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AirplaneService } from 'src/app/crew-trip/core/services/airplane-service';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { HotelService } from 'src/app/crew-trip/core/services/hotel-service';
import { SeasonalSchedulesService } from 'src/app/crew-trip/core/services/seasonal-schedules.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { Constant, DATE_FORMAT_DD_MM_YYYY, removeNullValues } from 'src/app/crew-trip/shared/utils/constant';

@Component({
  selector: 'app-seasonal-schedules',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, SelectionSuggestComponent, DataTransformPipe
  ],
  templateUrl: './seasonal-schedules.component.html',
  styleUrl: './seasonal-schedules.component.scss',
  providers: [
    DataTransformPipe
  ],
})
export class SeasonalSchedulesComponent extends CommonComponent {
  override baseService = inject(SeasonalSchedulesService);
  flightMarketService = inject(FlightMarketService);
  dataTransformPipe = inject(DataTransformPipe);
  airplaneService = inject(AirplaneService);
  flightMarkets: any[] = [];
  airplanes: any[] = []

  _displayedColumns: { label: string; value: string, type?: string, format?: string, class?: string }[] = [
    // { label: $localize`:@@pid:PID`, value: 'pid' },
    { label: $localize`:@@flightNumber:Flight Number`, value: 'flightNo', class: 'text-left' },
    { label: $localize`:@@startDate:Start date`, value: 'startTime', type: Constant.DATE, format: Constant.DATE_FORMAT, class: 'text-right' },
    { label: $localize`:@@endDate:End date`, value: 'endTime', type: Constant.DATE, format: Constant.DATE_FORMAT, class: 'text-right' },
    { label: $localize`:@@operationDate:Operation Date`, value: 'dayOfWeek', class: 'text-center' },
    { label: $localize`:@@weeklyFrequency:Weekly Frequency`, value: 'weeklyFrequency', class: 'text-right' },
    { label: $localize`:@@aircraft:Aircraft`, value: 'acGroup', class: 'text-left' },
    { label: $localize`:@@departureAirport:Departure Airport`, value: 'depApSched', class: 'text-left' },
    { label: $localize`:@@arrivalAirport:Arrival Airport`, value: 'arrApSched', class: 'text-left' },
    { label: $localize`:@@departureTime:Departure Time`, value: 'depTime', class: 'text-right' },
    { label: $localize`:@@arrivalTime:Arrival Time`, value: 'arrTime', class: 'text-right' }
  ];


  override formGroupSearch = this.formBuilder.group({
    depApSched: [''],
    arrApSched: [''],
    acType: ['']
  });

  constructor() {
    super();
  }

  override async ngOnInit() {
    super.ngOnInit();
    // this.displayedColumns = ['stt', 'market', 'code', 'name', 'address', 'contactDetails', 'active', 'notes'];
    this.displayedColumns = [...this._displayedColumns.map(s => s.value)];
    this.flightMarketService.search({ option: 1 }).then((res: any) => {
      this.flightMarkets = res.data;
    });

    this.airplaneService.listAirplanes('AC_TYPE').then((res: any) => {
      this.airplanes = res.data;
    })
    this.search();

  }

  override async exportFile() {
    const body: any = {
      page: this.pageIndex,
      size: this.pageSize,
      limit: this.pageSize,
      ...removeNullValues(this.formGroupSearch.value),
      export: true
    }
    super.exportFile(body, 'Seasonal Schedules.xlsx')
  }


  // override search(body?: any, isNextPage?: boolean): any {
  //   const searchValue = {
  //     ...this.formGroupSearch.value
  //   };
  //   super.search(searchValue, isNextPage);
  // }

}
