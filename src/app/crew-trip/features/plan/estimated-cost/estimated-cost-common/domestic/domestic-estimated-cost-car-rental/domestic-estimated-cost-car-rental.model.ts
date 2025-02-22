
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