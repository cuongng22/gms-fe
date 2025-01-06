// "- Loại hình kế hoạch: Cho phép tìm kiếm theo 1 loại hình. Gồm: Kế hoạch ngân sách, Kế hoạch mua sắm
// + Khi chọn lọc theo ""Kế hoạch ngân sách"", danh sách chỉ hiện các cột:     
// #, Phân loại, Danh mục hàng hóa dịch vụ, Khối, Đơn giá, Chi phí, Ngân sách (bao gồm VAT), % VAT, Sản lượng kế hoạch so với UTH, 
// Tỷ giá kế hoạch so với UTH, Đơn giá năm kế hoạch so với năm trước, Ghi chú, Trạng thái, Hành động
// +  Khi chọn lọc theo ""Kế hoạch mua sắm"", danh sách chỉ hiện các cột:     
// #, Phân loại, Danh mục hàng hóa dịch vụ, Khối, Số, Đơn vị, Giá trị kế hoạch mua sắm (chưa bao gồm VAT), 
// Giá trị kế hoạch mua sắm (bao gồm VAT), Hình thức lựa chọn Nhà cung cấp, Thời điểm dự, Tổng thời gian, Thời gian, % VAT, 

import { HOTEL, PlanCategoryEnum, ServiceType } from "../../budget-procurement.model";

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
        case PlanCategoryEnum.BUDGET:
            return serviceType === ServiceType.HOTEL ? 'budgetVatHotel' : 'budgetVatCar';
        case 'procurementValueExVat':
            return serviceType === ServiceType.HOTEL ? 'procurementValueHotel' : 'procurementValueCar';
        case 'procurementValue':
            return serviceType === ServiceType.HOTEL ? 'procurementValueVatHotel' : 'procurementValueVatCar';
        default:
            return '';
    }
}