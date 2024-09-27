import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {BaseService} from "src/app/crew-trip/core/services/base-service";


@Injectable({
  providedIn: 'root'
})

export class HelperService {
  mywindow: any;

  constructor(
    private httpClient: HttpClient,
    private baseService: BaseService,
  ) {
    this.mywindow = window;
  }

  async markFormGroupTouched(formGroup: FormGroup, ignoreFields: Array<string> = []): Promise<void> {
    Object.keys(formGroup.controls).forEach(field => {
      if (!ignoreFields.includes(field)) {
        const control = formGroup.get(field);
        if (control) {
          control.markAsTouched({ onlySelf: true });
        }
      }
    });
  }



  bidingDataInFormGroup(formGroup: FormGroup, dataBinding: any) {
    if (dataBinding) {
      for (const name in dataBinding) {
        if (formGroup.controls.hasOwnProperty(name)) {
          formGroup.controls[name].setValue(dataBinding[name]);
        }
      }
    }
  }

  setIndexArray(array: any[]) {
    if (array && array.length > 0) {
      array.forEach((item, index) => {
        item.idx = index;
      })
    }
  }

  public removeValidators(form: FormGroup) {
    for (const key in form.controls) {
      form.get(key)!.clearValidators();
    }
  }

  async ignoreRequiredForm(formGroup: FormGroup, ignore?: any[]) {
    if (!ignore) {
      ignore = [];
    }
    for (let controlsKey in formGroup.controls) {
      const control = formGroup.controls[controlsKey];
      if (control.validator && !ignore.includes(controlsKey)) {
        control.setValidators(Validators.nullValidator);
      }
    }
  }

  async restoreRequiredForm(formGroup: FormGroup) {
    for (let controlsKey in formGroup.controls) {
      const control = formGroup.controls[controlsKey];
      if (control.validator) {
        control.setValidators(Validators.required);
      }
    }
  }

  bidingDataInFormGroupAndIgnore(formGroup: FormGroup, dataBinding: any, ignoreFields: Array<string> = []) {
    if (dataBinding) {
      for (const name in dataBinding) {
        if (formGroup.controls.hasOwnProperty(name) && !ignoreFields.includes(name)) {
          formGroup.controls[name].setValue(dataBinding[name]);
        }
      }
    }
  }

  bidingDataInFormGroupAndNotTrigger(formGroup: FormGroup, dataBinding: any, fiedlNotTrigger: Array<string> = []) {
    if (dataBinding) {
      for (const name in dataBinding) {
        if (formGroup.controls.hasOwnProperty(name)) {
          if (fiedlNotTrigger.includes(name)) {
            formGroup.controls[name].setValue(dataBinding[name], {emitEvent: false});
          } else {
            formGroup.controls[name].setValue(dataBinding[name]);
          }
        }
      }
    }
  }

  findInvalidControls(formData: FormGroup) {
    const invalid = [];
    const controls = formData.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    if (invalid.length > 0) {
      this.baseService.showNotification("Vui lòng điền đầy đủ thông tin","right");
      console.log(invalid, ' invalid');
    }
  }
}
