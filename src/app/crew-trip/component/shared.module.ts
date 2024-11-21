import {NgModule} from '@angular/core';
import {NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";
import {InputSmComponent} from "src/app/crew-trip/component/input-sm/input-sm.component";
import {SelectionComponent} from "src/app/crew-trip/component/selection/selection.component";

@NgModule({
  declarations: [],
  imports: [
    InputSmComponent,
    SelectionComponent
  ],
  exports: [
    InputSmComponent,
    SelectionComponent
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: [InputSmComponent,SelectionComponent],
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: [InputSmComponent,SelectionComponent],
      multi: true,
    },
  ]
})
export class SharedModule {}
