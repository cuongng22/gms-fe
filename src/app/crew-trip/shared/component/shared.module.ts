import {NgModule} from '@angular/core';
import {NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';
import {InputComponent} from 'src/app/crew-trip/shared/component/input/input.component';
import {SelectionComponent} from 'src/app/crew-trip/shared/component/selection/selection.component';

@NgModule({
  declarations: [],
  imports: [
    InputComponent,
    SelectionComponent
  ],
  exports: [
    InputComponent,
    SelectionComponent
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: [InputComponent, SelectionComponent],
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: [InputComponent, SelectionComponent],
      multi: true,
    },
  ]
})
export class SharedModule {
}
