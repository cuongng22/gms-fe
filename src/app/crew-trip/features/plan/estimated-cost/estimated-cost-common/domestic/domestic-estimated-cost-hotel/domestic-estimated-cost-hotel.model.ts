
export function getHeaderRowDef1(contractData: any): string[] {
    const columns: { column: string, visible: boolean }[] = [
        { column: "month", visible: true },
        { column: "totalRoomsInCurrentYear", visible: true },
        { column: "estimatedRoomsInPlannedYear", visible: true },
        { column: "totalAmount", visible: true },
    ]
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getHeaderRowDef2(contractData: any): string[] {
    const columns: { column: string, visible: boolean }[] = [
        { column: "singleRoomYearPerform", visible: true },
        { column: "doubleRoomYearPerform", visible: true },
        { column: "singleRoom", visible: true }, // Số phòng đơn
        { column: "doubleRoom", visible: true }, // Số phòng đôi

        { column: "totalAmountExcludingVat", visible: true },
        { column: "totalAmountIncludingVAT", visible: true },
    ];
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getRowDef(contractData: any): string[] {
    const columns = [
        { column: "month", visible: true },
        { column: "singleRoomYearPerform", visible: true },
        { column: "doubleRoomYearPerform", visible: true },
        { column: "singleRoom", visible: true },
        { column: "doubleRoom", visible: true },
        { column: "totalAmountExcludingVat", visible: true },
        { column: "totalAmountIncludingVAT", visible: true },
    ];
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export const formula: any = {

    //Tổng số phòng đơn
    totalSingleRoom: {
        formula: 'data.singleRoom + data.singleRoomExtra'
    },
    //Tổng số phòng đôi
    totalDoubleRoom: {
        formula: 'data.doubleRoom + data.doubleRoomExtra'
    },
    // Thành tiền chưa vat
    totalAmount: {
        formula: '(data.totalSingleRoom * data.priceSingleRoom) + (data.totalDoubleRoom * data.priceDoubleRoom)'
    },
    // Thành tiền chưa có vat
    totalAmountVat: {
        formula: '(data.totalSingleRoom * data.priceSingleRoomVat) + (data.totalDoubleRoom * data.priceDoubleRoomVat)'
    },
    totalAmountYearPerformVat: {
        formula: '(data.singleRoomYearPerform * data.priceSingleRoomVat) + (data.doubleRoomYearPerform * data.priceDoubleRoomVat)'
    }
}


