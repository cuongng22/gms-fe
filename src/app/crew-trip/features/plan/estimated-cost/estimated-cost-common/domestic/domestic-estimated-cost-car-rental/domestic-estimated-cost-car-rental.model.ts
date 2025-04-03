
export function getHeaderRowDef1(): string[] {
    const columns: { column: string, visible: boolean }[] = [
        { column: "month", visible: true },
        { column: "noOfTripsYearPerform", visible: true },
        { column: "noOfTrip", visible: true },
        { column: "unitPrice", visible: true },
        { column: "totalAmount", visible: true }
    ]
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getHeaderRowDef2(): string[] {
    const columns: { column: string, visible: boolean }[] = [
        { column: "unitPriceExcludingVAT", visible: true },
        { column: "unitPriceIncludingVAT", visible: true },
        { column: "totalAmountExcludingVat", visible: true },
        { column: "totalAmountIncludingVAT", visible: true },
    ];
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getRowDef(): string[] {
    const columns = [
        { column: "month", visible: true },
        { column: "noOfTripsYearPerform", visible: true },
        { column: "noOfTrip", visible: true },
        { column: "unitPriceExcludingVAT", visible: true },
        { column: "unitPriceIncludingVAT", visible: true },
        { column: "totalAmountExcludingVat", visible: true },
        { column: "totalAmountIncludingVAT", visible: true },
    ];
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}



export const formula: any = {

    // Thành tiền chưa vat
    totalAmount: {
        formula: '(ctz(data.numberVehicles) * ctz(data.unitPrice))',
    },
    // Thành tiền  có vat
    totalAmountVat: {
        formula: '(ctz(data.numberVehicles) * ctz(data.unitPriceVat))',
    },

    // Thành tiền chưa vat
    totalAmountPerform: {
        formula: '(ctz(data.numberVehiclesYearPerform) * ctz(data.unitPricePerform))',
    },
    // Thành tiền  có vat
    totalAmountVatPerform: {
        formula: '(ctz(data.numberVehiclesYearPerform) * ctz(data.unitPricePerformVat))',
    }
}

