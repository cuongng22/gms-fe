// "- Loại hình kế hoạch: Cho phép tìm kiếm theo 1 loại hình. Gồm: Kế hoạch ngân sách, Kế hoạch mua sắm
// + Khi chọn lọc theo ""Kế hoạch ngân sách"", danh sách chỉ hiện các cột:     
// #, Phân loại, Danh mục hàng hóa dịch vụ, Khối, Đơn giá, Chi phí, Ngân sách (bao gồm VAT), % VAT, Sản lượng kế hoạch so với UTH, 
// Tỷ giá kế hoạch so với UTH, Đơn giá năm kế hoạch so với năm trước, Ghi chú, Trạng thái, Hành động
// +  Khi chọn lọc theo ""Kế hoạch mua sắm"", danh sách chỉ hiện các cột:     
// #, Phân loại, Danh mục hàng hóa dịch vụ, Khối, Số, Đơn vị, Giá trị kế hoạch mua sắm (chưa bao gồm VAT), 
// Giá trị kế hoạch mua sắm (bao gồm VAT), Hình thức lựa chọn Nhà cung cấp, Thời điểm dự, Tổng thời gian, Thời gian, % VAT, 

import { CategoryEnum, HOTEL, PlanCategoryEnum, ServiceType } from "../../budget-procurement.model";

// Ghi chú, Trạng thái, Hành động"
export function getDisplayedColumns(type: string, categoryType?: CategoryEnum): string[] {
    const columns: { column: string, visible: boolean }[] = [
        { column: "select", visible: !!categoryType },
        { column: "stt", visible: true },
        { column: "category", visible: true },
        { column: "name", visible: true },
        { column: "division", visible: true },
        { column: "num", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
        { column: "unit", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
        { column: "unitPrice", visible: !type || type === PlanCategoryEnum.BUDGET },
        { column: "cost", visible: !type || type === PlanCategoryEnum.BUDGET },
        { column: "budget", visible: !type || type === PlanCategoryEnum.BUDGET },
        { column: "procurementValueExVat", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
        { column: "procurementValue", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
        { column: "supplierMethod", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
        { column: "estimatedTime", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
        { column: "totalTime", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
        { column: "time", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
        // { column: "vat", visible: true },
        { column: "planVsEstimate", visible: !type || type === PlanCategoryEnum.BUDGET },
        { column: "planVsEstimateRate", visible: !type || type === PlanCategoryEnum.BUDGET },
        { column: "unitPriceYear", visible: !type || type === PlanCategoryEnum.BUDGET },
        { column: "notes", visible: true },
        { column: "status", visible: true },
        { column: "action", visible: true },
    ];
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getDisplayedColumnTotals(type: string): string[] {
    const columns: { column: string, visible: boolean }[] = [
        { column: "total", visible: true },
        { column: "divisionTotal", visible: true },
        { column: "numTotal", visible: true },
        { column: "unitTotal", visible: true },
        { column: "unitPriceTotal", visible: true },
        { column: "costTotal", visible: true },
        { column: "budgetTotal", visible: true },
        { column: "procurementValueExVatTotal", visible: true },
        { column: "procurementValueTotal", visible: true },
        { column: "supplierMethodTotal", visible: true },
        { column: "estimatedTimeTotal", visible: true },
        { column: "totalTimeTotal", visible: true },
        { column: "timeTotal", visible: true },
        // { column: "vatTotal", visible: true },
        { column: "planVsEstimateTotal", visible: true },
        { column: "planVsEstimateRateTotal", visible: true },
        { column: "unitPriceYearTotal", visible: true },
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
        case 'procurementValueExVat':
            return serviceType === ServiceType.HOTEL ? 'procurementValueHotel' : 'procurementValueCar';
        case 'procurementValue':
            return serviceType === ServiceType.HOTEL ? 'procurementValueVatHotel' : 'procurementValueVatCar';
        default:
            return '';
    }
}




// // Ghi chú, Trạng thái, Hành động"
// export function getDisplayedColumns(type: string, categoryType?: CategoryEnum): string[] {
//     const columns: { column: string, visible: boolean }[] = [
//         { column: "select", visible: !!categoryType },
//         { column: "stt", visible: true },
//         { column: "category", visible: true },
//         { column: "name", visible: true },
//         { column: "division", visible: true },
//         { column: "num", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
//         { column: "unit", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
//         { column: "unitPrice", visible: !type || type === PlanCategoryEnum.BUDGET },
//         { column: "cost", visible: !type || type === PlanCategoryEnum.BUDGET },
//         { column: "budget", visible: !type || type === PlanCategoryEnum.BUDGET },
//         { column: "procurementValueExVat", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
//         { column: "procurementValue", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
//         { column: "supplierMethod", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
//         { column: "estimatedTime", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
//         { column: "totalTime", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
//         { column: "time", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
//         // { column: "vat", visible: true },
//         { column: "planVsEstimate", visible: !type || type === PlanCategoryEnum.BUDGET },
//         { column: "planVsEstimateRate", visible: !type || type === PlanCategoryEnum.BUDGET },
//         { column: "unitPriceYear", visible: !type || type === PlanCategoryEnum.BUDGET },
//         { column: "notes", visible: true },
//         { column: "status", visible: true },
//         { column: "action", visible: true },
//     ];
//     return columns.filter((column: any) => column.visible).map((column: any) => column.column)
// }

// export function getDisplayedColumnTotals(type: string): string[] {
//     const columns: { column: string, visible: boolean }[] = [
//         { column: "total", visible: true },
//         { column: "divisionTotal", visible: true },
//         { column: "numTotal", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
//         { column: "unitTotal", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
//         { column: "unitPriceTotal", visible: !type || type === PlanCategoryEnum.BUDGET },
//         { column: "costTotal", visible: !type || type === PlanCategoryEnum.BUDGET },
//         { column: "budgetTotal", visible: !type || type === PlanCategoryEnum.BUDGET },
//         { column: "procurementValueExVatTotal", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
//         { column: "procurementValueTotal", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
//         { column: "supplierMethodTotal", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
//         { column: "estimatedTimeTotal", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
//         { column: "totalTimeTotal", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
//         { column: "timeTotal", visible: !type || type === PlanCategoryEnum.PROCUREMENT },
//         // { column: "vatTotal", visible: true },
//         { column: "planVsEstimateTotal", visible: !type || type === PlanCategoryEnum.BUDGET },
//         { column: "planVsEstimateRateTotal", visible: !type || type === PlanCategoryEnum.BUDGET },
//         { column: "unitPriceYearTotal", visible: !type || type === PlanCategoryEnum.BUDGET },
//         { column: "notesTotal", visible: true },
//         { column: "statusTotal", visible: true },
//         { column: "actionTotal", visible: true },
//     ];
//     return columns.filter((column: any) => column.visible).map((column: any) => column.column)
// }