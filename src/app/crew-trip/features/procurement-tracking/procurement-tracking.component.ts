import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAnchor, MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatDatepickerActions,
  MatDatepickerApply,
  MatDatepickerCancel,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import {
  MatError,
  MatFormFieldModule,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { DATE_FORMAT_DD_MM_YYYY } from 'src/app/crew-trip/shared/utils/constant';

@Component({
  selector: 'app-procurement-tracking',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    SelectMultipleComponent,
    SelectionComponent,
    MatButton,
    MatDateRangeInput,
    NgxTrimDirectiveModule,
    MatDatepickerToggle,
    MatDatepickerCancel,
    MatDatepickerActions,
    MatDateRangePicker,
    MatSuffix,
    MatDatepickerApply,
    NgxControlError,
    MatEndDate,
    MatFormFieldModule,
    MatLabel,
    MatError,
    InputSizeComponent,
    MatStartDate,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatAnchor,
    RouterLink,
  ],
  templateUrl: './procurement-tracking.component.html',
  styleUrl: './procurement-tracking.component.scss',
  providers: [
    provideNativeDateAdapter(),
    provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),
  ],
})
export class ProcurementTrackingComponent
  extends CommonComponent
  implements OnInit
{
  optionsType = [
    { name: 'Hotel', value: 'HOTEL' },
    { name: 'Car Rental', value: 'CAR' },
  ];
  fb: FormBuilder = inject(FormBuilder);

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      airportCodes: [''],
      type: [''],
      field: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  override async ngOnInit(): Promise<void> {
    await this.spinner.show();
    this.formGroupSearchInit = { ...this.formGroupSearch.value };
    const listMarket = await this._flightMarketService.search({
      option: 1,
      status: 'Operational',
    });
    this.listFlightMarket = listMarket.data;
    await this.spinner.hide();
  }
}
