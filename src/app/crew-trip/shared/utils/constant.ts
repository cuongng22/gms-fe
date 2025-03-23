import { effect, Signal, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export class Constant {

  static DATE_FORMAT = 'DD/MM/YYYY';
  static DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';
  static MONTH_FORMAT = 'MM/YYYY';
  static TIME_FORMAT = 'HH:mm';
  static NUMBER = 'number';
  static DATE = 'date';
  static STRING_FORMAT = 'string_format';
  static PAGE = 0;
  static PAGE_SIZE = 20;
  static TIME_ZONE = 'Asia/Ho_Chi_Minh';
  static DATE_FORMAT_YYYYMMDD = 'YYYY/MM/DD';
  static LOCAL_DATE_FORMAT = 'YYYY-MM-DD'
}

export class MESSAGE {
  static ERROR = $localize`:@@error:Something wrong`;
  static ERROR_CONNECT = $localize`:@@errorConnect:Unable to connect to server`;
  static CREATE_SUCCESS = $localize`:@@createSuccess:Created successfully`;
  static CREATE_FAIL = $localize`:@@createFail:Create fail`;
  static UPDATE_SUCCESS = $localize`:@@updateSuccess:Updated successfully`;
  static UPDATE_FAIL = $localize`:@@updateFail:Update fail`;
  static DATA_EMPTY = $localize`:@@noDataFound:No data found`;
  static DELETE_SUCCESS = $localize`:@@deletedSuccessfully:Deleted successfully`;
  static DELETE_FAIL = $localize`:@@deleteFail:Delete fail`;
  static UPLOAD_SUCCESS = $localize`:@@importedSuccessfully:Imported successfully`;
  static REJECT_SUCCESS = $localize`:@@rejectSuccess:Reject successfully`;
  static REJECT_FAIL = $localize`:@@rejectFail:Reject fail`;
  static REQUIRED = $localize`:@@required:is required`;
  static FORMAT_INVALID = $localize`:@@formatInvalid:invalid format.`;
  static MIN_LENGTH_INVALID = $localize`:@@minLengthInvalid:requires a minimum of %d characters`;
  static MAX_LENGTH_INVALID = $localize`:@@maxLengthInvalid:must be less than %d characters`;
  static MUST_LENGTH_INVALID = $localize`:@@mustLengthInvalid:must be %d characters`;
  static PASSWORD_FORMAT_INVALID = $localize`:@@passwordFormat:must include number, letter and special character.`;
  static ALREADY_EXISTS = $localize`:@@alreadyExists:already exists`;
  static ACTIVE = $localize`:@@active:Active`;
  static INACTIVE = $localize`:@@inactive:Inactive`;
  static ITEMS_PER_PAGE = $localize`:@@itemsPerPage:Items per page`;
  static NEXT_PAGE = $localize`:@@nextPage:Next page`;
  static PRIVIOUS_PAGE = $localize`:@@priviousPage:Privious page`;
  static MAX_FILE_SIZE = $localize`Invalid file`;
  static SEND_EMAIL = $localize`Send email successfully`;
  static FILE_UPLOAD_EMPTY = $localize`The file must not be empty`;
  static FILE_UPLOAD_INVALID = $localize`The file import is not valid`;
  static FILE_UPLOAD_INVALID_XLSX = $localize`File type must be .xlsx`;

  static LABEL_START_DATE = $localize`:@@startDate:Start Date`;
  static MESSAGE_START_DATE_REQUIRED = $localize`:@@startDateRequired:Start Date is required`;

  static LABEL_END_DATE = $localize`:@@endDate:End Date`;
  static MESSAGE_END_DATE_REQUIRED = $localize`:@@endDateRequired:End Date is required`;

  static END_DATE_LESS_THAN_START_DATE = $localize`:@@endDateLessThanStartDate:End Date must be greater than Start Date`;

  static LABEL_ESTIMATED_TIME = $localize`:@@estimatedTime:Estimated Time`;
  static MESSAGE_ESTIMATED_TIME_REQUIRED = $localize`:@@estimatedTimeRequired:Estimated Time is required`;

  static PHONE_NUMBER_INVALID = $localize`:@@phoneNumberFormatInvalid:Phone number must be numeric and the characters + ( )`;

  static HOTEL_CANNOT_BE_DELETED = $localize`:@@hotelCannotBeDeleted:Hotel cannot be deleted. It is being used in a contract.`;
  static CAR_COMPANY_CANNOT_BE_DELETED = $localize`:@@carCompanyCannotBeDeleted:Car company cannot be deleted. It is being used in a contract.`;
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

export function decodeToken(token: string): any {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
}

export const DATE_FORMAT_DD_MM_YYYY = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },

  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY'

  },

};

export class COMMON_CONFIG {
  static TIMEOUT = 20000;
  static MAX_FILE_SIZE = '5MB';
  static FILE_ACCEPT = '.doc,.docx,.pdf,.xls,.xlsx';
  static FILE_ACCEPT_EXCEL = '.xls,.xlsx';
}

export class PATTERN {
  // static PHONE = '^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$' //so () -
  static PHONE = '^[0-9()+]+$'
  static STRING_NUMBER = '^[a-zA-Z0-9]+$' //chu va so
  static EMAIL = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
  static EMAIL_MULTI = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(;\\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})*$';
  static HOUR24 = '^([01]\\d|2[0-3]):([0-5]\\d)$'
  static STRING = '^[a-zA-Z]+$' //chu
  static NUMBER = '^[0-9]+$' //so
  static NUMBER1 = '^[0-9/.]+$' //so '/'
  static NUMBER2 = '^[0-9]+(\\.[0-9]+)?$';//so thap phan
  static STRING_NUMBER1 = '^[a-zA-Z0-9-.]+$' //chu va so . -
}

export function round(data: any | any[], fractionDigits?: number) {
  if (Array.isArray(data) && data.length > 0) {
    data.forEach(item => {
      if (typeof (item) === 'number' || typeof (item) === 'string') {
        if (!isNaN(Number(item))) {
          const _value = Number(item.toString().replace(/,/g, ''))
          item = Math.round(fractionDigits ? Number(_value.toFixed(fractionDigits)) : _value);
        }
      } else if (typeof (item) === 'object') {
        Object.keys(item).forEach(key => {
          if (typeof (item[key]) === 'number' || typeof (item[key]) === 'string') {
            if (!isNaN(Number(item[key]))) {
              const _value = Number(item[key].toString().replace(/,/g, ''));
              item[key] = Math.round(fractionDigits ? Number(_value.toFixed(fractionDigits)) : _value);
            }
          }
        });
      }
    });
    return data;
  } else if (typeof data === 'object' && data && Object.keys(data).length > 0) {
    Object.keys(data).forEach(key => {
      if (typeof (data[key]) === 'number' || typeof (data[key]) === 'string') {
        if (!isNaN(Number(data[key]))) {
          const _value = Number(data[key].toString().replace(/,/g, ''));
          data[key] = Math.round(fractionDigits ? Number(_value.toFixed(fractionDigits)) : _value);
        }
      }
    })
    return data;
  } else if ((typeof data === 'number' || typeof data === 'string') && data) {
    if (!isNaN(Number(data))) {
      const _value = Number(data.toString().replace(/,/g, ''));
      return Math.round(fractionDigits ? Number(_value.toFixed(fractionDigits)) : _value);
    }
  }
  return 0
}


  // convertToZero
  export function ctz(value: any) {
    if (value) {
      return new Number(value.toString().replace(',', '.'));
    }
    return 0;
  }
