
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
        formula: 'ctz(data.singleRoom) + ctz(data.singleRoomExtra)'
    },
    //Tổng số phòng đôi
    totalDoubleRoom: {
        formula: 'ctz(data.doubleRoom) + ctz(data.doubleRoomExtra)'
    },
    // Thành tiền chưa vat
    totalAmount: {
        formula: '(ctz(data.singleRoom) * ctz(data.priceSingleRoom)) + (ctz(data.doubleRoom) * ctz(data.priceDoubleRoom))'
    },
    // Thành tiền chưa có vat
    totalAmountVat: {
        formula: '(ctz(data.singleRoom) * ctz(data.priceSingleRoomVat)) + (ctz(data.doubleRoom) * ctz(data.priceDoubleRoomVat))'
    },
    totalAmountYearPerformVat: {
        formula: '(ctz(data.singleRoomYearPerform) * ctz(data.priceSingleRoomVat)) + (ctz(data.doubleRoomYearPerform) * ctz(data.priceDoubleRoomVat))'
    }
}


