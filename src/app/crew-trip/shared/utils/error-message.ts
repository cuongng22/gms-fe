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
