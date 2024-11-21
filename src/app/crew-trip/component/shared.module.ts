import {NgModule} from '@angular/core';
import {NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";
import {InputSmComponent} from "src/app/crew-trip/component/input-sm/input-sm.component";

@NgModule({
  declarations: [],
  imports: [
    InputSmComponent,
  ],
  exports: [
    InputSmComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputSmComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: InputSmComponent,
      multi: true,
    },
  ]
})
export class SharedModule {}
