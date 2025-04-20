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
import { Constant, removeNullValues } from 'src/app/crew-trip/shared/utils/constant';
import { ListResponse } from 'src/app/crew-trip/shared/models/common.model';
import { HttpStatusCode } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { HasPermissionDirective } from 'src/app/crew-trip/shared/directive/has-permission.directive';
import moment from 'moment';

@Component({
  selector: 'app-monthly-flight-schedule',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, DataTransformPipe,
    SelectionSuggestComponent, DailyFlightSchedulesSearchComponent, RouterLink, MatMenuModule,
    HasPermissionDirective
  ],
  templateUrl: './monthly-flight-schedule.component.html',
  styleUrl: './monthly-flight-schedule.component.scss',
  providers: [DataTransformPipe, HasPermissionDirective]
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
    { label: $localize`:@@std:STD`, value: 'std', type: this.Constant.DATE, format: this.Constant.DATE_TIME_FORMAT, class: 'text-center' },
    { label: $localize`:@@sta:STA`, value: 'sta', type: this.Constant.DATE, format: this.Constant.DATE_TIME_FORMAT, class: 'text-center' },
    { label: $localize`:@@etd:ETD`, value: 'etd', type: this.Constant.DATE, format: this.Constant.DATE_TIME_FORMAT, class: 'text-center' },
    { label: $localize`:@@eta:ETA`, value: 'eta', type: this.Constant.DATE, format: this.Constant.DATE_TIME_FORMAT, class: 'text-center' },
  ];



  override async ngOnInit() {
    super.ngOnInit();

    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'numberOfCrew', 'remark', 'action'];
  }

  async onSearch(event: any, isNextPage?: boolean) {
    const response = await this.search(event, !!isNextPage, this.baseService.searchInMonth.bind(this.baseService));
    if (response.data.content && response.data.content.length > 0) {
      const result = response.data.content.map((item: any) => {
        const _checkinDate = moment(item.std)
        // const _checkoutDate = new Date(item.FLIGHT_DATE_OUT.split(" ")[0])
        const _currDate = moment()
        // const _isShow = _checkinDate < _currDate && _checkoutDate < _currDate
        // Chị Hường (13-04-2025)  theo dõi lịch bay của đối tương khác  cho hiện nút Sửa; xóa với  STD của cột Checkin  > ngày hiện tại thì hiển thị nút sửa/xóa nhé
        const _isShow = _checkinDate.isAfter(_currDate, 'day')
        return { ...item, isShow: _isShow }
      });
      this.dataSource.data = result;
    }
  }

  override onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.onSearch(this.dailyFlightSchedulesSearch().formGroupSearch.value, true);
  }

  override async exportFile(body?: any, filename?: string) {
    super.exportFile(this.dailyFlightSchedulesSearch().formGroupSearch.value, filename, 'export-flight-crew-in-month')
  }
  exportCrewList(filename?: string) {
    super.exportFile(this.dailyFlightSchedulesSearch().formGroupSearch.value, filename, 'export-crew-list')
  }


  getColorByRemark(row: any) {
    if (row) {
      if (row.changeCrew?.toLowerCase().includes('phi công') &&
        row.changeCrew?.toLowerCase().includes('tiếp viên')) {
        return 'bg-purple-100';
      } else if (row.changeCrew?.toLowerCase().includes('phi công')) {
        return 'bg-warning-100';
      } else if (row.changeCrew?.toLowerCase().includes('tiếp viên')) {
        return 'bg-orange-100';
      }
    }
    return null;
  }


  addOther(element: any) {
    this.dialog.open(DialogMonthlyFlightScheduleDetailComponent, {
      minWidth: 1300,
      data: {
        isUpdate: true,
        ...this.dailyFlightSchedulesSearch().formGroupSearch.value,
        ...element
      }
    })
  }

  exportScheduling() {
    this.dialog.open(DialogExportSchedulingDataComponent, {
      minWidth: 500,
      minHeight: 300
    })
  }

  flightCrewDetail(element: any, type?: string) {
    let _label;
    if (type === 'FC') {
      _label = $localize`:@@flightPilotList:Flight Pilot List`
    } else if (type === 'CC') {
      _label = $localize`:@@flightAttendantsList:Flight Attendants list`;
    } else if (type === 'Extra Crew') {
      _label = $localize`:@@extraCrewList:Extra Crew List`;
    }
    this.dialog.open(DialogMonthlyFlightScheduleDetailComponent, {
      minWidth: 1300,
      data: {
        isUpdate: false,
        ...this.dailyFlightSchedulesSearch().formGroupSearch.value,
        ...element,
        label: _label
      }
    })
  }

  async syncMonthly() {
    try {
      await this.spinner.show();
      this.baseService.syncMonthly();
    } catch (e: any) {
      this.showError(
        e.error?.data ?? e.error?.error ?? e.error ?? this.MESSAGE.ERROR,
      );
    } finally {
      this.spinner.hide()
    }
  }

}
