export const formula: any = {

    //giá trị kế hoạch cho Khách sạn
    totalAmountPlanHotel: {
        formula:  '(item.totalSingleRoom * item.singleRoomPrice + item.totalTwinRoom * item.twinRoomPrice ) * (dataGeneral.exchangeRate ?? 1) '
    },
    ft2TotalExcVAT: {
        formula: 'item.totalExcVAT'
    },
    ft2TotalIncVAT: {
        formula: 'item.totalIncVAT'
    },
    ft2TotalCountForeign:{
        formula:'item.totalCountForeign'
    }




}