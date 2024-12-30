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


