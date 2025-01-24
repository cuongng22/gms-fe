import { CommonModule } from '@angular/common';
import { Component, inject, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { DailyFlightSchedulesSearchComponent } from '../../daily-flight-schedules-search/daily-flight-schedules-search.component';
import { DialogExtraCrewComponent } from '../dialog-extra-crew/dialog-extra-crew.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-other-flight-schedule',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, DataTransformPipe,
    SelectionSuggestComponent, DailyFlightSchedulesSearchComponent, RouterLink
  ],
  templateUrl: './other-flight-schedule.component.html',
  styleUrl: './other-flight-schedule.component.scss',
  providers: [DataTransformPipe]
})
export class OtherFlightScheduleComponent extends CommonComponent {
  dataTransformPipe = inject(DataTransformPipe);
  override baseService = inject(DailyFlightSchedulesService);
  dailyFlightSchedulesSearch = viewChild.required(DailyFlightSchedulesSearchComponent);

  headerRowDef1 = [
    'stt', 'extraCrewCode', 'extraCrewName', 'type', 'checkin', 'checkout', 'action'
  ];
  headerRowDef2 = [
    'checkinFltNo', 'checkinAcType', 'checkinFlightLeg', 'checkinDate', 'checkoutFltNo', 'checkoutAcType', 'checkoutFlightLeg', 'checkoutDate'
  ];
  rowDef = [
    'stt', 'extraCrewCode', 'extraCrewName', 'type', 'checkinFltNo', 'checkinAcType', 'checkinFlightLeg', 'checkinDate', 'checkoutFltNo', 'checkoutAcType', 'checkoutFlightLeg', 'checkoutDate', 'action'
  ]

  override formGroupDetail = this.formBuilder.group({
    fltIdIn: [],
    fltIdOut: [],
    persCode: []
  })


  truncMonth = new Date((new Date().getFullYear()), (new Date().getMonth()), 1);

  override ngOnInit(): void {
  }
  onSearch(event: any) {
    this.search(event, false, this.baseService.searchExtraCrews.bind(this.baseService));
  }

  override onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.search(this.dailyFlightSchedulesSearch().formGroupSearch.value, true, this.baseService.searchExtraCrews.bind(this.baseService));
  }

  add() {
    this.dailyFlightSchedulesSearch().formGroupSearch.markAllAsTouched();
    if (this.dailyFlightSchedulesSearch().formGroupSearch.valid) {
      this.dialog.open(DialogExtraCrewComponent, {
        minWidth: 750,
        minHeight: 500,
        data: this.dailyFlightSchedulesSearch().formGroupSearch.value
      })
    }

  }

  edit(item: any) {
    this.dialog.open(DialogExtraCrewComponent, {
      minWidth: 750,
      minHeight: 500,
      data: {
        dataUpdate: item
      }
    })
  }

  visibleAdd() {
    const year = this.dailyFlightSchedulesSearch().formGroupSearch.controls.year.value || 0;
    const month = new Number(this.dailyFlightSchedulesSearch().formGroupSearch.controls.month.value);
    const selectDate = new Date(year, +month - 1, 1);
    if (selectDate >= this.truncMonth) {
      return true;
    }
    return false;
  }

  override async showConfirmDelete(element: any) {
    this.formGroupDetail.patchValue({ ...element });
    this.toggleDialogDelete();
  }

  override  async delete() {
    try {
      await this.spinner.show();
      const res = await this.baseService.deleteCrewsExtra(this.formGroupDetail.getRawValue());
      this.baseService.showSuccess(this.MESSAGE.DELETE_SUCCESS);
      await this.search();
      return res;
    } catch (e: any) {
      this.baseService.showError((e.error?.error) ?? (e.error?.error?.code) ?? this.MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
      await this.closeConfirmDelete();
    }
  }
}
