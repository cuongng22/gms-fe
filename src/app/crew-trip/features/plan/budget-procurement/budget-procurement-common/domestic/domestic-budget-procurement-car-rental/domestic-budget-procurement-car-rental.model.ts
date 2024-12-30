import { PlanCategoryEnum } from "../../../budget-procurement.model";

export function getHeaderRowDef1(contractData: any, type: PlanCategoryEnum): string[] {
    const columns: { column: string, visible: boolean }[] = [
        { column: "month", visible: true },
        { column: "numberVehicles", visible: type === PlanCategoryEnum.PROCUREMENT },
        { column: "noOfTripsYearPerform", visible: type === PlanCategoryEnum.BUDGET },
        { column: "noOfTrip", visible: type === PlanCategoryEnum.BUDGET },
        { column: "unitPrice", visible: true },
        { column: "totalAmount", visible: true }
    ]
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getHeaderRowDef2(contractData: any, type: PlanCategoryEnum): string[] {
    const columns: { column: string, visible: boolean }[] = [
        { column: "unitPriceExcludingVAT", visible: true },
        { column: "unitPriceIncludingVAT", visible: true },
        { column: "totalAmountExcludingVat", visible: true },
        { column: "totalAmountIncludingVAT", visible: true },
    ];
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getRowDef(contractData: any, type: PlanCategoryEnum): string[] {
    const columns = [
        { column: "month", visible: true },
        { column: "numberVehicles", visible: type === PlanCategoryEnum.PROCUREMENT },
        { column: "noOfTripsYearPerform", visible: type === PlanCategoryEnum.BUDGET },
        { column: "noOfTrip", visible: type === PlanCategoryEnum.BUDGET },
        { column: "unitPriceExcludingVAT", visible: true },
        { column: "unitPriceIncludingVAT", visible: true },
        { column: "totalAmountExcludingVat", visible: true },
        { column: "totalAmountIncludingVAT", visible: true },
    ];
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}