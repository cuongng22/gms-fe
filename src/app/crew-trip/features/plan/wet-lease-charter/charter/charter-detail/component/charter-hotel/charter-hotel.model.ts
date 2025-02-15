export const planHotels = {
    "single": {
        "totalNormalRoom": 1,
        "totalECIRoom": 2,
        "totalLCORoom": 3,
        "numberOfNight": 4,
        "totalForex": 100000,
        "totalIncVAT": 20000,
        "totalExcVAT": 21122
    },
    "twin": {
        "totalNormalRoom": 1,
        "totalECIRoom": 2,
        "totalLCORoom": 3,
        "numberOfNight": 4,
        "totalForex": 100000,
        "totalIncVAT": 20000,
        "totalExcVAT": 21122
    }
}
export function getHeaderRowDef1(generalData: any): string[] {
    const columns: { column: string, visible: boolean }[] = [
        { column: "roomType", visible: true },
        { column: "totalNormalRoom", visible: true },
        { column: "totalECIRoom", visible: generalData?.isECI },
        { column: "totalLCORoom", visible: generalData?.isLCO },
        { column: "numberOfNight", visible: true },
        { column: "totalForex", visible: true },
        { column: "totalAmount", visible: true },
    ]
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

// 'roomType', 'totalNormalRoom', 'totalECIRoom', 'totalLCORoom', 'numberOfNight', 'totalForex', 'totalExcVAT', 'totalIncVAT',
export function getRowDef(generalData: any): string[] {
    const columns: { column: string, visible: boolean }[] = [
        { column: "roomType", visible: true },
        { column: "totalNormalRoom", visible: true },
        { column: "totalECIRoom", visible: generalData?.isECI },
        { column: "totalLCORoom", visible: generalData?.isLCO },
        { column: "numberOfNight", visible: true },
        { column: "totalForex", visible: true },
        { column: "totalExcVAT", visible: true },
        { column: "totalIncVAT", visible: true },
    ]
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}
