export function getHeaderRowDef1(): string[] {
    const columns = [
        { column: "month", visible: true },
        { column: "numberOfFlights", visible: true },
        { column: "numberVehicles", visible: true },
        { column: "extraTransfer", visible: true },
        { column: "unitPrice", visible: true },
        { column: "totalAmountForeign", visible: true },
        { column: "totalAmountVnd", visible: true },
    ]
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getHeaderRowDef2(): string[] {
    const columns = [
        { column: "totalAmountExVatVnd", visible: true },
        { column: "totalAmountVatVnd", visible: true }
    ]
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getRowDef(): string[] {
    const columns = [
        { column: "month", visible: true },
        { column: "numberOfFlights", visible: true },
        { column: "numberVehicles", visible: true },
        { column: "extraTransfer", visible: true },
        { column: "unitPrice", visible: true },
        { column: "totalAmountForeign", visible: true },
        { column: "totalAmountVnd", visible: true },
        { column: "totalAmountExVatVnd", visible: true },
        { column: "totalAmountVatVnd", visible: true }
    ]
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}