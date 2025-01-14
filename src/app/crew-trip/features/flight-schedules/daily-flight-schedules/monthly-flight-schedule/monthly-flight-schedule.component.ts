import { CommonModule } from '@angular/common';
import { Component, inject, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DailyFlightSchedulesService } from 'src/app/crew-trip/core/services/daily-flight-schedules.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { DailyFlightSchedulesSearchComponent } from '../daily-flight-schedules-search/daily-flight-schedules-search.component';
import { DialogExtraCrewComponent } from './dialog-extra-crew/dialog-extra-crew.component';
import { DialogExportSchedulingDataComponent } from './dialog-export-scheduling-data/dialog-export-scheduling-data.component';
import { RouterLink } from '@angular/router';
import { DialogMonthlyFlightScheduleDetailComponent } from './dialog-monthly-flight-schedule-detail/dialog-monthly-flight-schedule-detail.component';

@Component({
  selector: 'app-monthly-flight-schedule',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, DataTransformPipe,
    SelectionSuggestComponent, DailyFlightSchedulesSearchComponent, RouterLink
  ],
  templateUrl: './monthly-flight-schedule.component.html',
  styleUrl: './monthly-flight-schedule.component.scss',
  providers: [DataTransformPipe]
})
export class MonthlyFlightScheduleComponent extends CommonComponent {
  dataTransformPipe = inject(DataTransformPipe);
  override baseService = inject(DailyFlightSchedulesService);
  dailyFlightSchedulesSearch = viewChild.required(DailyFlightSchedulesSearchComponent);



  _displayedColumns: { label: string; value: string, type?: string, format?: string, class?: string }[] = [
    { label: $localize`:@@fltno:FLTNO`, value: 'flightNo', class: 'text-center' },
    { label: $localize`:@@acType:AC TYPE`, value: 'acType', class: 'text-left' },
    { label: $localize`:@@org:ORG`, value: 'org', class: 'text-center' },
    { label: $localize`:@@dst:DST`, value: 'dst', class: 'text-center' },
    { label: $localize`:@@std:STD`, value: 'std', class: 'text-center' },
    { label: $localize`:@@sta:STA`, value: 'sta', class: 'text-center' },
    { label: $localize`:@@etd:ETD`, value: 'etd', class: 'text-center' },
    { label: $localize`:@@eta:ETA`, value: 'eta', class: 'text-center' },
  ];



  override async ngOnInit() {
    super.ngOnInit();

    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'numberOfCrew', 'remark', 'action'];
    this.dataSource.data = [
      {
        flightNo: 'ABC',
        acType: 'ABC'
      }
    ]
  }
  onSearch(event: any) {
    super.search(event);
  }

  override onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    // super.search(this.dailyFlightSchedulesSearch().formGroupSearch.value, true);

  }

  addOther() {
    this.dialog.open(DialogExtraCrewComponent, {
      minWidth: 750,
      minHeight: 500
    })
  }

  exportScheduling() {
    this.dialog.open(DialogExportSchedulingDataComponent, {
      minWidth: 500,
      minHeight: 300
    })
  }

  flightCrewDetail(){
    this.dialog.open(DialogMonthlyFlightScheduleDetailComponent, {
      minWidth: 900,
      minHeight: 300
    })
  }
}
