import { PlanCategoryEnum, ServiceType } from "../../../budget-procurement/budget-procurement.model";


// Ghi chú, Trạng thái, Hành động"
export function getDisplayedColumns(type: string): string[] {
    const columns: { column: string, visible: boolean }[] = [
        { column: "select", visible: true },
        { column: "stt", visible: true },
        { column: "category", visible: true },
        { column: "name", visible: true },
        { column: "unitPrice", visible: !type || type === PlanCategoryEnum.BUDGET },
        { column: "cost", visible: !type || type === PlanCategoryEnum.BUDGET },
        { column: "budget", visible: !type || type === PlanCategoryEnum.BUDGET },
        { column: "vat", visible: true },
        { column: "notes", visible: true },
        { column: "status", visible: true },
        { column: "action", visible: true },
    ];
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getDisplayedColumnTotals(type: string): string[] {
    const columns: { column: string, visible: boolean }[] = [
        { column: "total", visible: true },
        { column: "unitPriceTotal", visible: !type || type === PlanCategoryEnum.BUDGET },
        { column: "costTotal", visible: !type || type === PlanCategoryEnum.BUDGET },
        { column: "budgetTotal", visible: !type || type === PlanCategoryEnum.BUDGET },
        { column: "vatTotal", visible: true },
        { column: "notesTotal", visible: true },
        { column: "statusTotal", visible: true },
        { column: "actionTotal", visible: true },
    ];
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getControlTotal(control: string, serviceType: string): string {
    switch (control) {
        case 'cost':
            return serviceType === ServiceType.HOTEL ? 'costHotel' : 'costCar';
        case 'budget':
            return serviceType === ServiceType.HOTEL ? 'budgetVatHotel' : 'budgetVatCar';
        default:
            return '';
    }
}