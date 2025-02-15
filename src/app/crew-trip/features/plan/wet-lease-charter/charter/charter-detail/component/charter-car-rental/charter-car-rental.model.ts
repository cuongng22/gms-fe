export const formula: any = {

    //giá trị kế hoạch cho Khách sạn
    totalAmountForex: {
        formula: ' item.numberOfTrip * item.unitPrice '
    },
    totalAmountIncVat: {
        formula: 'item.numberOfTrip * item.unitPrice * (item?.exchangeRate ?? 1)'
    },
    totalAmountExcVat: {
        formula: 'item.totalAmountIncVat - (item.totalAmountIncVat * (item?.rateVat ?? 0) / 100)'
    },




}