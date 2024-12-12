// "- Loại hình kế hoạch: Cho phép tìm kiếm theo 1 loại hình. Gồm: Kế hoạch ngân sách, Kế hoạch mua sắm
// + Khi chọn lọc theo ""Kế hoạch ngân sách"", danh sách chỉ hiện các cột:     
// #, Phân loại, Danh mục hàng hóa dịch vụ, Khối, Đơn giá, Chi phí, Ngân sách (bao gồm VAT), % VAT, Sản lượng kế hoạch so với UTH, 
// Tỷ giá kế hoạch so với UTH, Đơn giá năm kế hoạch so với năm trước, Ghi chú, Trạng thái, Hành động
// +  Khi chọn lọc theo ""Kế hoạch mua sắm"", danh sách chỉ hiện các cột:     
// #, Phân loại, Danh mục hàng hóa dịch vụ, Khối, Số, Đơn vị, Giá trị kế hoạch mua sắm (chưa bao gồm VAT), 
// Giá trị kế hoạch mua sắm (bao gồm VAT), Hình thức lựa chọn Nhà cung cấp, Thời điểm dự, Tổng thời gian, Thời gian, % VAT, 
// Ghi chú, Trạng thái, Hành động"
export function getDisplayedColumns(type: string): string[] {
    const columns: { column: string, visible: boolean }[] = [
        { column: "select", visible: true },
        { column: "stt", visible: true },
        { column: "category", visible: true },
        { column: "name", visible: true },
        { column: "division", visible: true },
        { column: "num", visible: !type || type === 'PROCUREMENT' },
        { column: "unit", visible: !type || type === 'PROCUREMENT' },
        { column: "unitPrice", visible: !type || type === 'BUDGET' },
        { column: "cost", visible: !type || type === 'BUDGET' },
        { column: "budget", visible: !type || type === 'BUDGET' },
        { column: "procurementValueExVat", visible: !type || type === 'PROCUREMENT' },
        { column: "procurementValue", visible: !type || type === 'PROCUREMENT' },
        { column: "supplierMethod", visible: !type || type === 'PROCUREMENT' },
        { column: "estimatedTime", visible: !type || type === 'PROCUREMENT' },
        { column: "totalTime", visible: !type || type === 'PROCUREMENT' },
        { column: "time", visible: !type || type === 'PROCUREMENT' },
        { column: "vat", visible: true },
        { column: "planVsEstimate", visible: !type || type === 'BUDGET'  },
        { column: "planVsEstimateRate", visible: !type || type === 'BUDGET'  },
        { column: "unitPriceYear", visible: !type || type === 'BUDGET'  },
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
        { column: "numTotal", visible: !type || type === 'PROCUREMENT' },
        { column: "unitTotal", visible: !type || type === 'PROCUREMENT' },
        { column: "unitPriceTotal", visible: !type || type === 'BUDGET' },
        { column: "costTotal", visible: !type || type === 'BUDGET' },
        { column: "budgetTotal", visible: !type || type === 'BUDGET' },
        { column: "procurementValueExVatTotal", visible: !type || type === 'PROCUREMENT' },
        { column: "procurementValueTotal", visible: !type || type === 'PROCUREMENT' },
        { column: "supplierMethodTotal", visible: !type || type === 'PROCUREMENT' },
        { column: "estimatedTimeTotal", visible: !type || type === 'PROCUREMENT' },
        { column: "totalTimeTotal", visible: !type || type === 'PROCUREMENT' },
        { column: "timeTotal", visible: !type || type === 'PROCUREMENT' },
        { column: "vatTotal", visible: true },
        { column: "planVsEstimateTotal", visible: !type || type === 'BUDGET'  },
        { column: "planVsEstimateRateTotal", visible: !type || type === 'BUDGET'  },
        { column: "unitPriceYearTotal", visible: !type || type === 'BUDGET'  },
        { column: "notesTotal", visible: true },
        { column: "statusTotal", visible: true },
        { column: "actionTotal", visible: true },
    ];
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}