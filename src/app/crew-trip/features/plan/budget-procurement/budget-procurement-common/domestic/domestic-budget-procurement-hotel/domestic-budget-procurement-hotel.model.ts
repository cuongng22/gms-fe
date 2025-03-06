import { PlanCategoryEnum } from "../../../budget-procurement.model";



export function getHeaderRowDef1(contractData: any, type: PlanCategoryEnum): string[] {
    const columns: { column: string, visible: boolean }[] = [
        { column: "month", visible: true },
        { column: "totalRoomsInCurrentYear", visible: type === PlanCategoryEnum.BUDGET },
        { column: "estimatedRoomsInPlannedYear", visible: type === PlanCategoryEnum.BUDGET },
        { column: "numberOfRoom", visible: type === PlanCategoryEnum.PROCUREMENT }, // số phòng
        { column: "extraRoom", visible: true },
        { column: "totalNumberOfRooms", visible: true },
        { column: "singleRoomRate", visible: type === PlanCategoryEnum.PROCUREMENT }, // Giá phòng đơn
        { column: "twinRoomRate", visible: type === PlanCategoryEnum.PROCUREMENT }, // Giá phòng đôi
    
        { column: "totalAmount", visible: true },
    ]
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getHeaderRowDef2(contractData: any, type: PlanCategoryEnum): string[] {
    const columns: { column: string, visible: boolean }[] = [
        { column: "singleRoomYearPerform", visible: type === PlanCategoryEnum.BUDGET },
        { column: "doubleRoomYearPerform", visible: type === PlanCategoryEnum.BUDGET },
        { column: "singleRoom", visible: true }, // Số phòng đơn
        { column: "doubleRoom", visible: true }, // Số phòng đôi
        { column: "singleRoomExtra", visible: true },
        { column: "doubleRoomExtra", visible: true },
        { column: "totalSingleRoom", visible: true },
        { column: "totalDoubleRoom", visible: true },

        { column: "priceSingleRoom", visible: type === PlanCategoryEnum.PROCUREMENT },
        { column: "priceSingleRoomVat", visible: type === PlanCategoryEnum.PROCUREMENT },
        { column: "priceDoubleRoom", visible: type === PlanCategoryEnum.PROCUREMENT },
        { column: "priceDoubleRoomVat", visible: type === PlanCategoryEnum.PROCUREMENT },

        { column: "totalAmountExcludingVat", visible: true },
        { column: "totalAmountIncludingVAT", visible: true },
    ];
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getRowDef(contractData: any, type: PlanCategoryEnum): string[] {
    const columns = [
        { column: "month", visible: true },
        { column: "singleRoomYearPerform", visible: type === PlanCategoryEnum.BUDGET },
        { column: "doubleRoomYearPerform", visible: type === PlanCategoryEnum.BUDGET },
        { column: "singleRoom", visible: true },
        { column: "doubleRoom", visible: true },
        { column: "singleRoomExtra", visible: true },
        { column: "doubleRoomExtra", visible: true },
        { column: "totalSingleRoom", visible: true },
        { column: "totalDoubleRoom", visible: true },

        { column: "priceSingleRoom", visible: type === PlanCategoryEnum.PROCUREMENT },
        { column: "priceSingleRoomVat", visible: type === PlanCategoryEnum.PROCUREMENT },
        { column: "priceDoubleRoom", visible: type === PlanCategoryEnum.PROCUREMENT },
        { column: "priceDoubleRoomVat", visible: type === PlanCategoryEnum.PROCUREMENT },

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
        formula: '(ctz(data.totalSingleRoom) * ctz(data.priceSingleRoom)) + (ctz(data.totalDoubleRoom) * ctz(data.priceDoubleRoom))'
    },
    // Thành tiền  có vat
    totalAmountVat: {
        formula: '(ctz(data.totalSingleRoom) * ctz(data.priceSingleRoomVat)) + (ctz(data.totalDoubleRoom) * ctz(data.priceDoubleRoomVat))'
    },
    // thành tiền có vat của tháng 12 năm ngoái (12/2024 cho kế hoạch 2025)
    totalAmountVatLastYear: {
        formula: '(ctz(data.singleRoom) * ctz(data.priceSingleRoomVat)) + (ctz(data.doubleRoom) * ctz(data.priceDoubleRoomVat))'
    },
    totalAmountYearPerformVat: {
        formula: '(ctz(data.singleRoomYearPerform) * ctz(data.priceSingleRoomPerformVat)) + (ctz(data.doubleRoomYearPerform) * ctz(data.priceDoubleRoomPerformVat))'
    }
}


