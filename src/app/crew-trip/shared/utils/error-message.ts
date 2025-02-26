export const contractCode: { [key: string]: string } = {
  required: 'Contract code' + $localize` is required`,
  maxlength: 'Contract code' + $localize` must be less than 50 characters`,
};
export const taxCode: { [key: string]: string } = {
  required: 'Tax code' + $localize` is required`,
  maxlength: 'Tax code' + $localize` must be less than 24 characters`,
  pattern: 'Tax code' + $localize` contains only characters`,

};
