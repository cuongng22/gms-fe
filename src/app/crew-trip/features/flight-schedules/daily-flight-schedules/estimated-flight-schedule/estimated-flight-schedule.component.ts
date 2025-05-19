import { CommonModule } from '@angular/common';
import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { DailyFlightSchedulesService } from 'src/app/crew-trip/core/services/daily-flight-schedules.service';
import { DailyFlightSchedulesSearchComponent } from '../daily-flight-schedules-search/daily-flight-schedules-search.component';
import { DialogMonthlyFlightScheduleDetailComponent } from '../monthly-flight-schedule/dialog-monthly-flight-schedule-detail/dialog-monthly-flight-schedule-detail.component';
import { HasPermissionDirective } from 'src/app/crew-trip/shared/directive/has-permission.directive';

@Component({
  selector: 'app-estimated-flight-schedule',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, DataTransformPipe,
    SelectionSuggestComponent, DailyFlightSchedulesSearchComponent, HasPermissionDirective
  ],
  templateUrl: './estimated-flight-schedule.component.html',
  styleUrl: './estimated-flight-schedule.component.scss',
  providers: [DataTransformPipe, HasPermissionDirective]
})
export class EstimatedFlightScheduleComponent extends CommonComponent {
  dataTransformPipe = inject(DataTransformPipe);
  override baseService = inject(DailyFlightSchedulesService);
  dailyFlightSchedulesSearch = viewChild.required(DailyFlightSchedulesSearchComponent);



  _displayedColumns: { label: string; value: string, type?: string, format?: string, class?: string }[] = [
    { label: $localize`:@@fltno:FLTNO`, value: 'flightNo', class: 'text-center' },
    { label: $localize`:@@acType:AC TYPE`, value: 'acType', class: 'text-left' },
    { label: $localize`:@@org:ORG`, value: 'org', class: 'text-center' },
    { label: $localize`:@@dst:DST`, value: 'dst', class: 'text-center' },
    { label: $localize`:@@std:STD`, value: 'std', type: this.Constant.DATE, format: this.Constant.DATE_TIME_FORMAT, class: 'text-center' },
    { label: $localize`:@@sta:STA`, value: 'sta', type: this.Constant.DATE, format: this.Constant.DATE_TIME_FORMAT, class: 'text-center' },
    { label: $localize`:@@etd:ETD`, value: 'etd', type: this.Constant.DATE, format: this.Constant.DATE_TIME_FORMAT, class: 'text-center' },
    { label: $localize`:@@eta:ETA`, value: 'eta', type: this.Constant.DATE, format: this.Constant.DATE_TIME_FORMAT, class: 'text-center' },
  ];


  override async ngOnInit() {
    super.ngOnInit();

    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'numberOfCrew', 'action'];
  }
  onSearch(event: any) {
    super.search(event);
  }

  override onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    super.search(this.dailyFlightSchedulesSearch().formGroupSearch.value, true);
  }

  override async exportFile(body?: any, filename?: string) {
    super.exportFile(this.dailyFlightSchedulesSearch().formGroupSearch.value, filename, 'export-flight-crew-plan')
  }

  flightCrewDetail(element: any) {
    this.dialog.open(DialogMonthlyFlightScheduleDetailComponent, {
      minWidth: 1300,
      data: {
        isUpdate: false,
        ...this.dailyFlightSchedulesSearch().formGroupSearch.value,
        ...element
      }
    })
  }

  async syncEstimate() {
    try {
      await this.spinner.show();
      await this.baseService.syncEstimate();
      this.baseService.showSuccess(this.MESSAGE.SYNC_SUCCESS);
    } catch (e: any) {
      this.showError(
        e.error?.data ?? e.error?.error ?? e.error ?? this.MESSAGE.ERROR,
      );
    } finally {
      this.spinner.hide()
    }
  }

}
