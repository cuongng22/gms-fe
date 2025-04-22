export const contractCode: { [key: string]: string } = {
  required: 'Contract number' + $localize` is required`,
  maxlength: 'Contract number' + $localize` must be less than 50 characters`,
};
export const appendixCode: { [key: string]: string } = {
  required: 'Appendix number' + $localize` is required`,
  maxlength: 'Appendix number' + $localize` must be less than 50 characters`,
};
export const contractNo: { [key: string]: string } = {
  required: 'Contract no' + $localize` is required`,
  maxlength: 'Contract no' + $localize` must be less than 50 characters`,
};
export const appendixNo: { [key: string]: string } = {
  required: 'Appendix no' + $localize` is required`,
  maxlength: 'Appendix no' + $localize` must be less than 50 characters`,
};
export const contractName: { [key: string]: string } = {
  required: 'Contract name' + $localize` is required`,
  maxlength: 'Contract name' + $localize` must be less than 250 characters`,
};
export const appendixName: { [key: string]: string } = {
  required: 'Appendix name' + $localize` is required`,
  maxlength: 'Appendix name' + $localize` must be less than 250 characters`,
};
export const taxCode: { [key: string]: string } = {
  required: 'Tax code' + $localize` is required`,
  maxlength: 'Tax code' + $localize` must be less than 24 characters`,
  pattern: 'Tax code' + $localize` contains only characters`,
};

export const taxRate: { [key: string]: string } = {
  required: 'Tax rate' + $localize` is required`,
  pattern: 'Tax rate' + $localize` must be an integer`,
  min: 'Tax rate' + $localize` must be greater than or equal 0`,
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

export const note: { [key: string]: string } = {
  required: 'Note' + $localize` is required`,
  maxlength: 'Note' + $localize` must be less than 500 characters`,
};
export const notes: { [key: string]: string } = {
  required: 'Remark' + $localize` is required`,
  maxlength: 'Remark' + $localize` must be less than 500 characters`,
};

export const fromDate: { [key: string]: string } = {
  required: 'From date' + $localize` is required`,
  afterValidator: 'From date' + $localize` must be before to date`,
  matDatepickerParse: 'From date' + $localize` invalid format`,
  overlapValidator: 'Already exists in this period',
};
export const toDate: { [key: string]: string } = {
  required: 'To date' + $localize` is required`,
  beforeValidator: 'To date' + $localize` must be after from date`,
  matDatepickerParse: 'To date' + $localize` invalid format`,
  overlapValidator: 'Already exists in this period',

};

export const checkinFrom: { [key: string]: string } = {
  required: 'Checkin from' + $localize` is required`,
  afterValidator: 'Checkin from' + $localize` must be before checkout to`,
  timeAfterValidator: 'Checkin from' + $localize` must be before checkout to`,
  pattern: 'Checkin from' + $localize` must be from 00:00 to 23:59`,

};
export const checkoutTo: { [key: string]: string } = {
  required: 'Checkout to' + $localize` is required`,
  beforeValidator: 'Checkout to' + $localize` must be after checkin from`,
  timeBeforeValidator: 'Checkout to' + $localize` must be after checkin from`,
  pattern: 'Checkout to' + $localize` must be from 00:00 to 23:59`,
};

export const fromHour: { [key: string]: string } = {
  required: 'Hour from' + $localize` is required`,
  timeAfterValidator: 'Hour from' + $localize` must be before hour to`,
  pattern: 'Hour from' + $localize` must be from 00:00 to 23:59`,
};

export const toHour: { [key: string]: string } = {
  required: 'Hour to' + $localize` is required`,
  timeBeforeValidator: 'Hour to' + $localize` must be after hour from`,
  pattern: 'Hour to' + $localize` must be from 00:00 to 23:59`,
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

export const dueDateNumber: { [key: string]: string } = {
  required: 'Due date' + $localize` is required`,
  min: 'Due date' + $localize` must be greater than 0 and less than 100`,
  max: 'Due date' + $localize` must be greater than 0 and less than 100`,
  pattern: 'Due date' + $localize` Due date must be an integer`,
};

export const signedDate: { [key: string]: string } = {
  required: 'Sign date' + $localize` is required`,
  matDatepickerParse: 'Sign date' + $localize` invalid format`,
};

export const effectiveDate: { [key: string]: string } = {
  required: 'Effective date' + $localize` is required`,
  matDatepickerParse: 'Effective date' + $localize` invalid format`,
};
export const expiryDate: { [key: string]: string } = {
  required: 'Expiry date' + $localize` is required`,
  matDatepickerParse: 'Expiry date' + $localize` invalid format`,
};
export const handoverDate: { [key: string]: string } = {
  required: 'Handover date' + $localize` is required`,
  matDatepickerParse: 'Handover date' + $localize` invalid format`,
};

export const invoiceNumber: { [key: string]: string } = {
  required: 'Invoice number' + $localize` is required`,
  maxlength: 'Invoice number' + $localize` must be within 50 characters`,
  pattern: 'Invoice number' + $localize` must contain only unaccented letters and numbers.`,
};
export const invoiceDate: { [key: string]: string } = {
  required: 'Invoice date' + $localize` is required`,
  matDatepickerMax: 'Invoice date' + $localize` must not be later than the current date`,
  beforeValidator: 'Invoice date' + $localize` must be after period date`,
};

export const invoiceReceiveDate: { [key: string]: string } = {
  required: 'Receive date' + $localize` is required`,
  beforeValidator: 'Receive date' + $localize` must be after invoice date`,
  matDatepickerMax: 'Receive date' + $localize` must not be later than the current date`,
};
export const periodFrom: { [key: string]: string } = {
  required: 'Period from' + $localize` is required`,
  afterValidator: 'Period from' + $localize` must be before period to`,
};
export const periodTo: { [key: string]: string } = {
  required: 'Period to' + $localize` is required`,
  beforeValidator: 'Period to' + $localize` must be after period from`,
};
export const exchangeRateDate: { [key: string]: string } = {
  required: 'Exchange rate date' + $localize` is required`,
};
export const description: { [key: string]: string } = {
  required: 'Description' + $localize` is required`,
  maxlength: 'Description' + $localize` must be less than 500 characters`,
};

export const serviceCode: { [key: string]: string } = {
  required: 'Service code' + $localize` is required`,
};

export const serviceName: { [key: string]: string } = {
  required: 'Service name' + $localize` is required`,
};
export const periodOccurrence: { [key: string]: string } = {
  required: 'Period Occurrence' + $localize` is required`,
};

export const nsCode: { [key: string]: string } = {
  required: 'nsCode' + $localize` is required`,
};
export const quantity: { [key: string]: string } = {
  required: 'Quantity' + $localize` is required`,
  min: 'Quantity' + $localize` must be greater than 0`,
  max: 'Quantity' + $localize` must be less than 999`,
  invalidNumber: 'Quantity' + $localize` must be integer`,
  pattern: 'Quantity' + $localize` must be integer`,
};

export const unitPrice: { [key: string]: string } = {
  required: 'Unit price' + $localize` is required`,
  min: 'Unit price' + $localize` must be greater than 0`,
  max: 'Unit price' + $localize` must be less than 999999999`,
  invalidNumber: 'Unit price' + $localize` must be integer`,
  pattern: 'Unit price' + $localize` must be integer`,
};
export const amountFcBeforeVat: { [key: string]: string } = {
  min: 'AmountVndBeforeVat' + $localize` must be greater than 0`,
  invalidNumber: 'AmountVndBeforeVat' + $localize` must be integer`,
  required: 'AmountVndBeforeVat' + $localize` is required`,
};
export const amountVndBeforeVat: { [key: string]: string } = {
  required: 'AmountVndBeforeVat' + $localize` is required`,
  min: 'AmountVndBeforeVat' + $localize` must be greater than 0`,
  invalidNumber: 'AmountVndBeforeVat' + $localize` must be integer`,
};
export const amountFcVat: { [key: string]: string } = {
  required: 'AmountFcVat' + $localize` is required`,
  min: 'AmountFcVat' + $localize` must be greater than 0`,
  invalidNumber: 'AmountFcVat' + $localize` must be integer`,
};
export const amountVndVat: { [key: string]: string } = {
  required: 'AmountVndVat' + $localize` is required`,
  min: 'AmountVndVat' + $localize` must be greater than 0`,
  invalidNumber: 'AmountVndVat' + $localize` must be integer`,
};
export const vatType: { [key: string]: string } = {
  required: 'Vat type' + $localize` is required`,
};
export const vat: { [key: string]: string } = {
  required: 'Vat' + $localize` is required`,
  min: 'Vat' + $localize` must be greater than 0`,
  invalidNumber: 'Vat' + $localize` must be integer`,
};
export const email: { [key: string]: string } = {
  required: 'Email' + $localize` is required`,
  pattern: 'Email' + $localize` invalid`,

};
export const emailSubject: { [key: string]: string } = {
  required: 'Email subject' + $localize` is required`,
  maxlength: 'Email Subject' + $localize` must be less than 250 characters`,

};
export const reimbursementTotalFc: { [key: string]: string } = {
  required: 'Reimbursement total Fc' + $localize` is required`,

};
export const reimbursementTotalVnd: { [key: string]: string } = {
  required: 'Reimbursement total Vnd' + $localize` is required`,
};
export const paymentDueDate: { [key: string]: string } = {
  required: 'Payment Due Date' + $localize` is required`,
};
