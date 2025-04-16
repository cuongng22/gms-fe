import { PlanCategoryEnum } from "../../../budget-procurement.model"

export function getHeaderRowDef1(planCategoryType:PlanCategoryEnum): string[] {
    const columns = [
        { column: "month", visible: true },
        { column: "numberOfFlights", visible: true },
        { column: "numberVehicles", visible: true },
        { column: "extraTransfer", visible: true },
        { column: "unitPrice", visible: true },
        { column: "unitPriceExtra", visible: planCategoryType === PlanCategoryEnum.PROCUREMENT },
        { column: "totalAmountForeignGroup", visible: true },
        { column: "totalAmountVnd", visible: true },
    ]
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getHeaderRowDef2(planCategoryType:PlanCategoryEnum): string[] {
    const columns = [
        { column: "totalAmountForeign", visible: true },
        { column: "totalAmountForeignVat", visible: true },
        { column: "totalAmountExVatVnd", visible: true },
        { column: "totalAmountVatVnd", visible: true }
    ]
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getRowDef(planCategoryType:PlanCategoryEnum): string[] {
    const columns = [
        { column: "month", visible: true },
        { column: "numberOfFlights", visible: true },
        { column: "numberVehicles", visible: true },
        { column: "extraTransfer", visible: true },
        { column: "unitPrice", visible: true },
        { column: "unitPriceExtra", visible: planCategoryType === PlanCategoryEnum.PROCUREMENT },
        { column: "totalAmountForeign", visible: true },
        { column: "totalAmountForeignVat", visible: true },
        { column: "totalAmountExVatVnd", visible: true },
        { column: "totalAmountVatVnd", visible: true }
    ]
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}


export const formula: any = {
    // số chuyên bay
    // numberFlight: {
    //     formula: '',
    //     formulaProcurement: 'ctz(data.noOfFlightByPeriod) * ctz(data.flightOvernightRate) / 100',
    // },

    //Số lượt xe	= số chuyến bay * 2					
    numberVehicles: {
        formula: 'ctz(data.numberFlight) * 2',
        formulaProcurement: '',
        // groupFormula: 'aircraftType && periodStart',
    },
    // //Thành tiền (ngoại tệ) - Chưa bao gồm VAT	"= (Số lượt xe + extra transfer) * đơn giá trước VAT
    // totalAmountForeign: {
    //     formula: '(ctz(data.numberVehicles) + ctz(data.extraTransfer)) * ctz(data.unitPrice)',
    // },
    //Thành tiền (ngoại tệ) - Bao gồm VAT	"= (Số lượt xe * đơn giá có vat + extra transfer * đơn giá Extra) 
    totalAmountForeignVat: {
        formula: '(ctz(data.numberVehicles) * ctz(data.unitPriceVat) + ctz(data.extraTransfer) * ctz(data.unitPriceExtra)) ',
    },
    //Thành tiền (ngoại tệ) - Chưa bao gồm VAT	"= (Số lượt xe + extra transfer) * đơn giá trước VAT
    totalAmountForeign: {
        // formula: '(ctz(data.totalAmountForeignVat) / (1 + (ctz(data.taxRate)/100)))',
        formula: '(ctz(data.numberVehicles) * ctz(data.unitPrice) + ctz(data.extraTransfer) * ctz(data.unitPriceExtraNoVat)) ',
    },
    //Thành tiền VND (Chưa bao gồm VAT) = Thành tiền ngoại tệ chưa bao gồm VAT * tỷ giá theo từng tháng
    totalAmount: {
        formula: 'ctz(data.totalAmountForeign) * ctz(data.rateInPeriod)'
    },
    //Thành tiền VND (Bao gồm VAT) = Thành tiền ngoại tệ bao gồm VAT * tỷ giá theo từng tháng
    totalAmountVat: {
        formula: 'ctz(data.totalAmountForeignVat) * ctz(data.rateInPeriod)'
    }

}

