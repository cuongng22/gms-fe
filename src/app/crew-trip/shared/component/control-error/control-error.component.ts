import {Component, Input, Optional, SkipSelf} from '@angular/core';
import {AbstractControl, ControlContainer, FormGroup, FormGroupDirective} from '@angular/forms';
import * as ERROR_MESSAGE from "src/app/crew-trip/shared/utils/error-message";
import {MatError} from "@angular/material/form-field";
import {NgxControlError} from "ngxtension/control-error";
@Component({
  selector: 'app-control-error',
  templateUrl: './control-error.component.html',
  standalone: true,
  imports: [
    MatError,NgxControlError
  ]
})
export class ControlErrorComponent {
  @Input() controlName!: string;
  errorMessages: any = ERROR_MESSAGE;
  allErrorTrack = ['invalidNumberDecimal', 'required', 'pattern', 'max', 'min', 'timeBeforeValidator','timeAfterValidator',
    'lessThanValidator', 'maxlength', 'invalidNumber', 'dateValidator', 'beforeValidator', 'afterValidator', 'minlength','matDatepickerParse'];

  constructor(@Optional() @SkipSelf() private controlContainer?: ControlContainer) {
  }

  get control(): AbstractControl {
    const form = (this.controlContainer as FormGroupDirective)?.form as FormGroup;
    return form.controls[this.controlName];
  }

  getErrorMessage(errorKey: string) {
    return this.errorMessages[errorKey];
  }
}
