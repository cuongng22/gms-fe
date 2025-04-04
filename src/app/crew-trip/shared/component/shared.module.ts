import { NgModule } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputComponent } from 'src/app/crew-trip/shared/component/input/input.component';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { SelectionSuggestComponent } from './selection-suggest/selection-suggest.component';
import { DatepickerYearMonthComponent } from './datepicker-year-month/datepicker-year-month.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { HasPermissionDirective } from '../directive/has-permission.directive';

@NgModule({
  declarations: [],
  imports: [
    InputComponent,
    SelectionComponent,
    DatepickerYearMonthComponent,
    SelectionSuggestComponent,
    HasPermissionDirective
  ],
  exports: [
    InputComponent,
    SelectionComponent,
    DatepickerYearMonthComponent,
    SelectionSuggestComponent,
    HasPermissionDirective
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: [InputComponent, SelectionComponent, SelectionSuggestComponent, DatepickerYearMonthComponent, DatepickerComponent,

      ],
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: [InputComponent, SelectionComponent, SelectionSuggestComponent, DatepickerYearMonthComponent, DatepickerComponent,

      ],
      multi: true,
    },
  ]
})
export class SharedModule {
}
