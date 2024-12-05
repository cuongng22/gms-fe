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
        { column: "totalAmountExVatVnd", visible: true },
        { column: "totalAmountVatVnd", visible: true }
    ]
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}


export const formula: any = {

    //Số lượt xe	= số chuyến bay * 2					
    numberVehicles: {
      formula: 'data.numberFlight * 2',
      // groupFormula: 'aircraftType && periodStart',
    },
    //Thành tiền (ngoại tệ) - Chưa bao gồm VAT	"= (Số lượt xe + extra transfer) * đơn giá trước VAT
    totalAmountForeign: {
      formula: '(data.numberVehicles + data.extraTransfer) * data.unitPrice',
    },
    //Thành tiền (ngoại tệ) - Bao gồm VAT	"= (Số lượt xe + extra transfer) * đơn giá
    totalAmountForeignVat: {
      formula: '(data.numberVehicles + data.extraTransfer) * data.unitPriceVat',
    },
    //Thành tiền VND (Chưa bao gồm VAT) = Thành tiền ngoại tệ chưa bao gồm VAT * tỷ giá theo từng tháng
    totalAmount: {
      formula: 'data.totalAmountForeign * data.rate'
    },
    //Thành tiền VND (Bao gồm VAT) = Thành tiền ngoại tệ bao gồm VAT * tỷ giá theo từng tháng
    totalAmountVat: {
      formula: 'data.totalAmountForeignVat * data.rate'
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