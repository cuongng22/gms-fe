export const InvoiceDocumentType = [
  {key: 'STANDARD', value: $localize`STANDARD`},
  {key: 'PREPAYMENT', value: $localize`PREPAYMENT`},
  {key: 'CREDIT', value: $localize`CREDIT`},
  {key: 'DEBIT', value: $localize`DEBIT`},
  {key: 'MIXED', value: $localize`MIXED`},
  {key: 'RECEIPT', value: $localize`RECEIPT`},
];

export enum InvoiceDocumentTypeEnum {
  STANDARD = 'STANDARD',
  PREPAYMENT = 'PREPAYMENT',
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  MIXED = 'MIXED',
  RECEIPT = 'RECEIPT'
};

export const InvoiceDocumentStatus = [
  {key: 'UNVERIFIED', value: $localize`UNVERIFIED`},
  {key: 'VERIFIED', value: $localize`VERIFIED`},
  {key: 'MATCHED', value: $localize`MATCHED`},
  {key: 'UNMATCHED', value: $localize`UNMATCHED`},
  {key: 'FINISHED', value: $localize`FINISHED`},
];

export enum InvoiceDocumentStatusEnum {
  UNVERIFIED = 'UNVERIFIED',
  VERIFIED = 'VERIFIED',
  MATCHED = 'MATCHED',
  UNMATCHED = 'UNMATCHED',
  FINISHED = 'FINISHED'
}

export const InvoiceDocumentStatusEmail = [
  {key: 'SEND', value: $localize`SEND`},
  {key: 'UNSEND', value: $localize`UNSEND`},
];
export const InvoiceDocumentStatusPayment = [
  {key: 'NEGOTIABLE', value: $localize`NEGOTIABLE`},
  {key: 'CLEARED', value: $localize`CLEARED`},
  {key: 'CLEARED BUT UNACCOUNTED', value: $localize`CLEARED BUT UNACCOUNTED`},
  {key: 'RECONCILED', value: $localize`RECONCILED`},
  {key: 'RECONCILED UNACCOUNTED', value: $localize`RECONCILED UNACCOUNTED`},
  {key: 'PAID', value: $localize`PAID`},
  {key: 'VOIDED', value: $localize`VOIDED`},

];
