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
        { column: "totalAmountForeignExVat", visible: true },
        { column: "totalAmountForeignVat", visible: true },
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
        { column: "totalAmountForeignExVat", visible: true },
        { column: "totalAmountForeignVat", visible: true },
        { column: "totalAmountExVatVnd", visible: true },
        { column: "totalAmountVatVnd", visible: true }
    ]
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}


export const formula: any = {
    // số chuyên bay
    numberFlight: {
        formula: '',
        formulaProcurement: 'ctz(data.noOfFlightByPeriod) * ctz(data.flightOvernightRate) / 100',
    },

    //Số lượt xe	= số chuyến bay * 2					
    numberVehicles: {
        formula: 'ctz(data.numberFlight) * 2',
        formulaProcurement: '',
        // groupFormula: 'aircraftType && periodStart',
    },
    //Thành tiền (ngoại tệ) - Chưa bao gồm VAT	"= (Số lượt xe + extra transfer) * đơn giá trước VAT
    totalAmountForeign: {
        formula: '(ctz(data.numberVehicles) + ctz(data.extraTransfer)) * ctz(data.unitPrice)',
    },
    //Thành tiền (ngoại tệ) - Bao gồm VAT	"= (Số lượt xe + extra transfer) * đơn giá
    totalAmountForeignVat: {
        formula: '(ctz(data.numberVehicles) + ctz(data.extraTransfer)) * ctz(data.unitPriceVat)',
    },
    //Thành tiền VND (Chưa bao gồm VAT) = Thành tiền ngoại tệ chưa bao gồm VAT * tỷ giá theo từng tháng
    totalAmount: {
        formula: 'ctz(data.totalAmountForeign) * ctz(data.rate)'
    },
    //Thành tiền VND (Bao gồm VAT) = Thành tiền ngoại tệ bao gồm VAT * tỷ giá theo từng tháng
    totalAmountVat: {
        formula: 'ctz(data.totalAmountForeignVat) * ctz(data.rate)'
    }

}

export const exampleData =
    [
        // ID,
        // PLAN_BUDGET_PROC_SUMMARY_ID,
        // TYPE,
        // PERIOD_START,
        // PERIOD_END,
        // NUMBER_FLIGHT,
        // NUMBER_VEHICLES,
        // EXTRA_TRANSFER,
        // UNIT_PRICE,
        // TOTAL_AMOUNT_FOREIGN,
        // TOTAL_AMOUNT,
        // TOTAL_AMOUNT_VAT
        {
            id: 1,
            planBudgetProcSummaryId: 101,
            type: "Car Rental",
            periodStart: "2024-12-01",
            periodEnd: "2023-01-31",
            numberFlight: 10,
            numberVehicles: 5,
            extraTransfer: 2,
            unitPrice: 100,
            unitPriceVat: 100,
            totalAmountForeign: 500,
            totalAmount: 550,
            totalAmountVat: 50,
            rate: 25000
        },
        {
            id: 2,
            planBudgetProcSummaryId: 102,
            type: "Car Rental",
            periodStart: "2025-01-01",
            periodEnd: "2023-02-28",
            numberFlight: 8,
            numberVehicles: 4,
            extraTransfer: 1,
            unitPrice: 120,
            unitPriceVat: 100,
            totalAmountForeign: 480,
            totalAmount: 528,
            totalAmountVat: 48,
            rate: 25000
        },
        {
            id: 3,
            planBudgetProcSummaryId: 102,
            type: "Car Rental",
            periodStart: "2025-02-01",
            periodEnd: "2023-02-28",
            numberFlight: 8,
            numberVehicles: 4,
            extraTransfer: 1,
            unitPrice: 120,
            unitPriceVat: 100,
            totalAmountForeign: 480,
            totalAmount: 528,
            totalAmountVat: 48,
            rate: 25000
        },
        {
            id: 4,
            planBudgetProcSummaryId: 102,
            type: "Car Rental",
            periodStart: "2025-03-01",
            periodEnd: "2023-02-28",
            numberFlight: 8,
            numberVehicles: 4,
            extraTransfer: 1,
            unitPrice: 120,
            unitPriceVat: 100,
            totalAmountForeign: 480,
            totalAmount: 528,
            totalAmountVat: 48,
            rate: 25000
        },
        {
            id: 5,
            planBudgetProcSummaryId: 102,
            type: "Car Rental",
            periodStart: "2025-04-01",
            periodEnd: "2023-02-28",
            numberFlight: 8,
            numberVehicles: 4,
            extraTransfer: 1,
            unitPrice: 120,
            unitPriceVat: 100,
            totalAmountForeign: 480,
            totalAmount: 528,
            totalAmountVat: 48,
            rate: 25000
        },
        {
            id: 6,
            planBudgetProcSummaryId: 102,
            type: "Car Rental",
            periodStart: "2025-05-01",
            periodEnd: "2023-02-28",
            numberFlight: 8,
            numberVehicles: 4,
            extraTransfer: 1,
            unitPrice: 120,
            unitPriceVat: 100,
            totalAmountForeign: 480,
            totalAmount: 528,
            totalAmountVat: 48,
            rate: 25000
        }
    ];

export const planFlightByOvernight = [
    {
        numberOfOvernight: 1,
        flightRate: 20
    },
    {
        numberOfOvernight: 2,
        flightRate: 30
    },
    {
        numberOfOvernight: 3,
        flightRate: 40
    }
];

export const planFlightPeriodList = [
    {
        "id": null,
        "periodStart": "2025-01-01",
        "periodEnd": "2025-12-01",
        "aircraftType": "320",
        "numberOfFlight": 2503,
        "planBudgetProcurementId": null,
        "periodStartStr": "T1/2025",
        "periodEndStr": "T12/2025"
    },
    {
        "id": null,
        "periodStart": "2025-01-01",
        "periodEnd": "2025-12-01",
        "aircraftType": "321",
        "numberOfFlight": 20230,
        "planBudgetProcurementId": null,
        "periodStartStr": "T1/2025",
        "periodEndStr": "T12/2025"
    },
    {
        "id": null,
        "periodStart": "2025-01-01",
        "periodEnd": "2025-12-01",
        "aircraftType": "350",
        "numberOfFlight": 3242,
        "planBudgetProcurementId": null,
        "periodStartStr": "T1/2025",
        "periodEndStr": "T12/2025"
    },
    {
        "id": null,
        "periodStart": "2025-01-01",
        "periodEnd": "2025-12-01",
        "aircraftType": "787",
        "numberOfFlight": 6530,
        "planBudgetProcurementId": null,
        "periodStartStr": "T1/2025",
        "periodEndStr": "T12/2025"
    },
    {
        "id": null,
        "periodStart": "2026-01-01",
        "periodEnd": "2026-12-01",
        "aircraftType": "320",
        "numberOfFlight": 2503,
        "planBudgetProcurementId": null,
        "periodStartStr": "T1/2026",
        "periodEndStr": "T12/2026"
    },
    {
        "id": null,
        "periodStart": "2026-01-01",
        "periodEnd": "2026-12-01",
        "aircraftType": "321",
        "numberOfFlight": 20230,"planBudgetProcurementId": null,
        "periodStartStr": "T1/2026",
        "periodEndStr": "T12/2026"
    },
    {
        "id": null,
        "periodStart": "2026-01-01",
        "periodEnd": "2026-12-01",
        "aircraftType": "350",
        "numberOfFlight": 3242,
        "planBudgetProcurementId": null,
        "periodStartStr": "T1/2026",
        "periodEndStr": "T12/2026"
    },
    {
        "id": null,
        "periodStart": "2026-01-01",
        "periodEnd": "2026-12-01",
        "aircraftType": "787",
        "numberOfFlight": 6530,
        "planBudgetProcurementId": null,
        "periodStartStr": "T1/2026",
        "periodEndStr": "T12/2026"
    },
    {
        "id": null,
        "periodStart": "2027-01-01",
        "periodEnd": "2027-04-01",
        "aircraftType": "320",
        "numberOfFlight": 208,
        "planBudgetProcurementId": null,
        "periodStartStr": "T1/2027",
        "periodEndStr": "T4/2027"
    },
    {
        "id": null,
        "periodStart": "2027-01-01",
        "periodEnd": "2027-04-01",
        "aircraftType": "321",
        "numberOfFlight": 1685,
        "planBudgetProcurementId": null,
        "periodStartStr": "T1/2027",
        "periodEndStr": "T4/2027"
    },
    {
        "id": null,
        "periodStart": "2027-01-01",
        "periodEnd": "2027-04-01",
        "aircraftType": "350",
        "numberOfFlight": 270,
        "planBudgetProcurementId": null,
        "periodStartStr": "T1/2027",
        "periodEndStr": "T4/2027"
    },
    {
        "id": null,
        "periodStart": "2027-01-01",
        "periodEnd": "2027-04-01",
        "aircraftType": "787",
        "numberOfFlight": 544,
        "planBudgetProcurementId": null,
        "periodStartStr": "T1/2027",
        "periodEndStr": "T4/2027"
    }
]