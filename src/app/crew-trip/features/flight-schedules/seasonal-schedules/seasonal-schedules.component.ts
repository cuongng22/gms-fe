import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { SelectComponent } from "../../../../ui-elements/select/select.component";
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { values } from 'lodash';
import { Seasons } from './seasonal-schedules.model';
import { years } from '../../plan/budget-procurement/budget-procurement.model';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink, RouterModule } from '@angular/router';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxControlError } from 'ngxtension/control-error';

@Component({
  selector: 'app-seasonal-schedules',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, SelectionSuggestComponent, DataTransformPipe,
    SelectionComponent
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
  airplanes: any[] = [];
  seasons = Seasons;
  years: any[];

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
    type: [''],
    year: new FormControl<number>(new Date().getFullYear()),
    depApSched: [''],
    acType: ['']
  });

  constructor() {
    super();
  }

  override async ngOnInit() {
    super.ngOnInit();
    this.years = years();
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

  async sync() {
    this.dialog.open(DialogExportSeasonalSchedules, {
      minWidth: 600
    }).afterClosed().subscribe(() => {
      this.search()
    })
  }


}



@Component({
  selector: 'dialog-export-seasonal-schedules',
  templateUrl: 'dialog-export-seasonal-schedules.component.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatCheckboxModule,
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, DataTransformPipe, RouterLink, RouterModule, AsyncPipe,
    FileUploadModule, DigitOnlyModule,
    NgxControlError, SelectionComponent
  ],
})
export class DialogExportSeasonalSchedules extends CommonComponent {
  override baseService = inject(SeasonalSchedulesService);
  seasons = Seasons;
  years: any[];
  override formGroupDetail = this.formBuilder.group({

    year: new FormControl(new Date().getFullYear(), [Validators.required]),
    type: new FormControl('', [Validators.required])
  });


  constructor(
    public dialogRef: MatDialogRef<DialogExportSeasonalSchedules>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super();
  }

  override ngOnInit(): void {
    this.years = years();
  }

  async sync() {
    try {
      this.formGroupDetail.markAllAsTouched();
      if (this.formGroupDetail.invalid) {
        return;
      }
      const res = await this.baseService.synchronize(this.formGroupDetail.getRawValue())
      this.baseService.showSuccess(this.MESSAGE.SYNC_SUCCESS);
      this.close()
    } catch (e: any) {
      return e;
    } finally {
      this.spinner.hide();
    }
  }
  close() {
    this.dialogRef.close()
  }
}