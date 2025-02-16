export const formula: any = {

    //giá trị kế hoạch cho Khách sạn
    totalAmountForex: {
        formula: ' item.numberOfTrip * item.unitPrice '
    },
    totalAmountIncVAT: {
        formula: 'item.numberOfTrip * item.unitPrice * (dataGeneral.exchangeRate ?? 1)'
    },
    totalAmountExcVAT: {
        formula: 'item.totalAmountIncVAT - (item.totalAmountIncVAT * dataGeneral.rateVat / 100)'
    },




}