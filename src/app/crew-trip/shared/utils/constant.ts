import { effect, Signal, signal } from "@angular/core";

export class Constant {
  static DATE_FORMAT = 'DD/MM/YYYY';
  static DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';
  static TIME_FORMAT = 'HH:mm';
  static NUMBER = 'number';
  static DATE = 'date';
  static STRING_FORMAT = 'string_format';
  static PAGE = 0;
  static PAGE_SIZE = 20;
}

export class MESSAGE {
  static ERROR = $localize`:@@error:Something wrong`
  static ERROR_CONNECT = $localize`:@@errorConnect:Unable to connect to server`
  static CREATE_SUCCESS = $localize`:@@createSuccess:Create success`
  static CREATE_FAIL = $localize`:@@createFail:Create fail`
  static UPDATE_SUCCESS = $localize`:@@updateSuccess:Update success`
  static UPDATE_FAIL = $localize`:@@updateFail:Update fail`
  static DATA_EMPTY = $localize`:@@noDataFound:No data found`
  static DELETE_SUCCESS = $localize`:@@deleteSuccess:Delete success`
  static DELETE_FAIL = $localize`:@@deleteFail:Delete fail`
  static UPLOAD_SUCCESS = $localize`:@@uploadSuccess:Upload success`
  static REQUIRED = $localize`:@@required:is required`
  static FORMAT_INVALID = $localize`:@@formatInvalid:is not in correct format.`
  static MIN_LENGTH_INVALID = $localize`:@@minLengthInvalid:must be greater than %d characters`
  static PASSWORD_FORMAT_INVALID = $localize`:@@passwordFormat:must include number, letter and special character`
  static ALREADY_EXISTS = $localize`:@@alreadyExists:already exists`
  static ACTIVE = $localize`:@@active:Active`
  static INACTIVE = $localize`:@@inactive:Inactive`
  static ITEMS_PER_PAGE = $localize`:@@itemsPerPage:Items per page`
  static NEXT_PAGE = $localize`:@@nextPage:Next page`
  static PRIVIOUS_PAGE = $localize`:@@priviousPage:Privious page`
}

export class LOCALE {
  static VN = 'vi-VN';
  static EN = 'en-US';
}

export function removeNullValues(obj: any): any {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      delete obj[key];
    }
  }
  return obj;
}

export function debouncedSignal<T>(input: Signal<T>, timeOutMs = 0): Signal<T> {
  const debounceSignal = signal(input());
  effect(() => {
    const value = input();
    const timeout = setTimeout(() => {
      debounceSignal.set(value);
    }, timeOutMs);
    return () => {
      clearTimeout(timeout);
    };
  });
  return debounceSignal;
}
