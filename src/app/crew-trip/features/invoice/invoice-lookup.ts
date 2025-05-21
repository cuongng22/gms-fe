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

export enum InvoiceDocumentEmailTypeEnum {
  CONFIRM = 'CONFIRM',
  REMIND = 'REMIND',
}

export const InvoiceDocumentStatusPayment = [
  {key: 'NEGOTIABLE', value: $localize`NEGOTIABLE`},
  {key: 'CLEARED', value: $localize`CLEARED`},
  {key: 'CLEARED BUT UNACCOUNTED', value: $localize`CLEARED BUT UNACCOUNTED`},
  {key: 'RECONCILED', value: $localize`RECONCILED`},
  {key: 'RECONCILED UNACCOUNTED', value: $localize`RECONCILED UNACCOUNTED`},
  {key: 'PAID', value: $localize`PAID`},
  {key: 'VOIDED', value: $localize`VOIDED`},
  {key: 'UNPAID', value: $localize`UNPAID`},
];

export enum InvoiceDocumentExportType {
  DOCUMENT_LIST = 'DOCUMENT_LIST',
  DOCUMENT_REVIEW = 'DOCUMENT_REVIEW',
  DOCUMENT_REVIEW_DETAIL = 'DOCUMENT_REVIEW_DETAIL',
};

export const ServiceCodeColumnToData: any = {
  singleRoomFcCharge: 'TTDHKT.00001',
  singleRoomCcCharge: 'TTDHKT.00002',
  twinRoomCcCharge: 'TTDHKT.00004',
  numberOfNights: 'TTDHKT.00003',
  eciSingleRoomFcCharge: 'TTDHKT.00005',
  eciSingleRoomCcCharge: 'TTDHKT.00006',
  eciTwinRoomCcCharge: 'TTDHKT.00007',
  lcoSingleRoomFcCharge: 'GMS.00001',
  lcoSingleRoomCcCharge: 'GMS.00002',
  lcoTwinRoomCcCharge: 'GMS.00003',
  breakfastFcCharge: 'TTDHKT.00065',
  breakfastCcCharge: 'TTDHKT.00066',
  cityTaxFcCharge: 'TTDHKT.00075',
  cityTaxCcCharge: 'TTDHKT.00074',
  serviceTaxFcCharge: 'TTDHKT.00076',
  serviceTaxCcCharge: 'TTDHKT.00077',
  accommodationTaxFcCharge: 'TTDHKT.00022',
  accommodationTaxCcCharge: 'TTDHKT.00023',
  OUTBOUND_VEHICLE: 'TTDHKT.00042',
  INBOUND_VEHICLE: 'TTDHKT.00043',
  ACCESS_BRIDGE: 'F22233',
  TOLL: 'F23',
  TRANSIT_DUTY: '213',
  AIRPORT_PARKING_FEE: 'TTDHKT.00009',
  totalCharge: 'totalCharge',
  totalCharges: 'totalCharges',
}

export const InvoicePartnerType = [
  {key: 'HOTEL', value: $localize`HOTEL`},
  {key: 'TRANSPORTATION', value: $localize`TRANSPORTATION`},
];
