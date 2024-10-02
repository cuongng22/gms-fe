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
  static ERROR = $localize`:@@error:Có lỗi xảy ra`
  static CREATE_SUCCESS = $localize`:@@createSuccess:Thêm mới thành công`
  static CREATE_FAIL = $localize`:@@createFail:Thêm mới thất bại`
  static UPDATE_SUCCESS = $localize`:@@updateSuccess:Cập nhật thành công`
  static UPDATE_FAIL = $localize`:@@updateFail:Cập nhật thất bại`
  static DATA_EMPTY = $localize`Không tìm thấy dữ liệu`

  static REQUIRED = $localize`:@@required:is required`
  static FORMAT_INVALID = $localize`:@@formatInvalid:is not in correct format.`
  static MIN_LENGTH_INVALID = $localize`:@@minLengthInvalid:must be greater than %d characters`
  static PASSWORD_FORMAT_INVALID = $localize`:@@passwordFormat:must include number, letter and special character`
  static ACTIVE = $localize`:@@active:Active`
  static INACTIVE = $localize`:@@inactive:Inactive`
}

export const DEFAULT_LANGUAGE = 'en';

