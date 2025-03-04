import {timeAfterValidator} from "src/app/crew-trip/shared/utils/common";

export const contractCode: { [key: string]: string } = {
  required: 'Contract code' + $localize` is required`,
  maxlength: 'Contract code' + $localize` must be less than 50 characters`,
};
export const taxCode: { [key: string]: string } = {
  required: 'Tax code' + $localize` is required`,
  maxlength: 'Tax code' + $localize` must be less than 24 characters`,
  pattern: 'Tax code' + $localize` contains only characters`,
};

export const taxRate: { [key: string]: string } = {
  required: 'Tax rate' + $localize` is required`,
  pattern: 'Tax rate' + $localize` must be number`,
};
export const airportCode: { [key: string]: string } = {
  required: 'Airport code' + $localize` is required`,
  maxlength: 'Airport code' + $localize` must be less than 24 characters`,
  pattern: 'Airport code' + $localize` contains only characters`,
};
export const searchString: { [key: string]: string } = {
  required: 'Airport code' + $localize` is required`,
  maxlength: 'Airport code' + $localize` must be less than 24 characters`,
  pattern: 'Airport code' + $localize` contains only characters`,
};
export const marketName: { [key: string]: string } = {
  required: 'Airport name' + $localize` is required`,
  maxlength: 'Airport name' + $localize` must be less than 250 characters`,
};
export const supplierName: { [key: string]: string } = {
  required: 'Supplier name' + $localize` is required`,
  maxlength: 'Supplier name' + $localize` must be less than 250 characters`,
};
export const supplierPhone: { [key: string]: string } = {
  required: 'Supplier phone' + $localize` is required`,
  maxlength: 'Supplier phone' + $localize` must be less than 20 characters`,
  pattern: 'Supplier phone' + $localize` must be numeric and the characters + ( )`,
};

export const remark: { [key: string]: string } = {
  required: 'Remark' + $localize` is required`,
  maxlength: 'Remark' + $localize` must be less than 500 characters`,
};

export const notes: { [key: string]: string } = {
  required: 'Remark' + $localize` is required`,
  maxlength: 'Remark' + $localize` must be less than 500 characters`,
};

export const fromDate: { [key: string]: string } = {
  required: 'From date' + $localize` is required`,
  afterValidator: 'From date' + $localize` must before to date`,
  dateValidator: 'From date' + $localize` format is invalid`,
  matDatepickerParse: 'invalid format',
  overlapValidator: 'already exists in this period',
};
export const toDate: { [key: string]: string } = {
  required: 'To date' + $localize` is required`,
  beforeValidator: 'To date' + $localize` must after from date`,
  dateValidator: 'To date' + $localize` format is invalid`,
  matDatepickerParse: 'invalid format',
  overlapValidator: 'already exists in this period',

};

export const checkinFrom: { [key: string]: string } = {
  required: 'Checkin from' + $localize` is required`,
  afterValidator: 'Checkin from' + $localize` must before checkout to`,
};
export const checkoutTo: { [key: string]: string } = {
  required: 'Checkout to' + $localize` is required`,
  beforeValidator: 'Checkout to' + $localize` must after checkin from`,
};

export const fromHour: { [key: string]: string } = {
  required: 'Hour from' + $localize` is required`,
  timeAfterValidator: 'Hour from' + $localize` must before hour to`,
};

export const toHour: { [key: string]: string } = {
  required: 'Hour to' + $localize` is required`,
  timeBeforeValidator: 'Hour to' + $localize` must after hour from`,
};

export const rate: { [key: string]: string } = {
  required: 'Ratio' + $localize` is required`,
  invalidNumber: 'Ratio' + $localize` must be number`,
  lessThanValidator: 'Ratio' + $localize` must be greater than or equal to 0 and less than 2`,
  invalidNumberDecimal: 'Ratio' + $localize` invalid`,
};

export const rate1: { [key: string]: string } = {
  required: 'Ratio' + $localize` is required`,
  invalidNumber: 'Ratio' + $localize` must be number`,
  lessThanValidator: 'Ratio' + $localize` must be greater than or equal to 0 and less than 2`,
  invalidNumberDecimal: 'Ratio' + $localize` invalid`,
};

