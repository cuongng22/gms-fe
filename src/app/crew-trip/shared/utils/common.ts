import {AbstractControl, FormControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import moment from "moment";

export const truncateDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};
export const truncateDateUTC = (date: Date): Date => {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

export function lessThanValidator(number: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value !== null && (value >= number || value < 0)) {
      return {lessThanValidator: true};
    }
    return null;
  };
}

export function beforeValidator(from: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let fromMoment = moment(from.value) || null;
    let toMoment = moment(control.value) || null;
    if (fromMoment && toMoment && toMoment.isBefore(fromMoment)) {
      return {beforeValidator: true};
    }
    return null;
  };
}

export function afterValidator(to: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let fromMoment = moment(control.value) || null;
    let toMoment = moment(to.value) || null;
    if (fromMoment && toMoment && fromMoment.isAfter(toMoment)) {
      return {afterValidator: true};
    }
    return null;
  };
}

export function timeAfterValidator(to: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let fromNumber = +to.value?.replace(':', '') || null
    let toNumber = +control.value?.replace(':', '') || null
    if (fromNumber && toNumber && toNumber > fromNumber) {
      return {timeAfterValidator: true};
    }
    return null;
  };
}

export function timeBeforeValidator(from: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let fromNumber = +from.value?.replace(':', '') || null
    let toNumber = +control.value?.replace(':', '') || null
    if (fromNumber && toNumber && toNumber < fromNumber) {
      return {timeBeforeValidator: true};
    }
    return null;
  };
}
