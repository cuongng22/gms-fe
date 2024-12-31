export function getHeaderRowDef1(contractData: any, type: string): string[] {
    const columns = [
        { column: "content", visible: true },
        { column: "year", visible: true },
    ]
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getHeaderRowDef2(contractData: any, type: string): string[] {
    const columns = [
        { column: "totalRoom", visible: true },
        { column: "price", visible: true },
        { column: "priceVat", visible: true },
        { column: "totalAmount", visible: true },
        { column: "totalAmountVat", visible: true },
    ]
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getRowDef(contractData: any, type: string): string[] {
    const columns = [
        { column: "content", visible: true },
        { column: "totalRoom", visible: true },
        { column: "price", visible: true },
        { column: "priceVat", visible: true },
        { column: "totalAmount", visible: true },
        { column: "totalAmountVat", visible: true },
    ]
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export const formula: any = {

    //Thành tiền chưa Vat
    totalAmount: {
        formula: 'data.totalRoom * data.price'
    },
    totalAmountVat:{
        formula: 'data.totalRoom * data.priceVat'
    }

}
