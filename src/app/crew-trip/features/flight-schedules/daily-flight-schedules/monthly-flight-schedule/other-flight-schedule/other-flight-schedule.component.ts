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
import { MatPaginatorModule } from '@angular/material/paginator';
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
    id: []
  })


  override ngOnInit(): void {
    this.dataSource.data = [
      {
        extraCrewCode: '4234',
        checkinFltNo: '234234',
        checkoutDate: '32423'
      }
    ]
  }
  onSearch(event: any) {

  }

  add() {
    this.dialog.open(DialogExtraCrewComponent, {
      minWidth: 750,
      minHeight: 500
    })
  }

  edit(item: any) {
    this.dialog.open(DialogExtraCrewComponent, {
      minWidth: 750,
      minHeight: 500
    })
  }
}
