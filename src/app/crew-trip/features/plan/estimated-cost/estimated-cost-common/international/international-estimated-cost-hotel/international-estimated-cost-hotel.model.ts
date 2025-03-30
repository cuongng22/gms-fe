import { PlanCategoryEnum } from "../../../../budget-procurement/budget-procurement.model";

export const formula: any = {

    //Số chuyến bay theo tàu (công thức của kế hoạch mua sắm)
    // totalFlightByAircraft: {
    //     formula: 'ctz(data.planFlightPeriod) * ctz(data.flightOvernightRate)'
    // },

    numberOfFlights: {
        formula: 'ctz(data.totalFlightByAircraft) * (ctz(data.flightOvernightRate)/100)',
        formulaProcurement: 'ctz(data.planFlightPeriod) * (ctz(data.flightOvernightRate)/100)'
    },

    //Tổng tiền xe chở tổ bay (ngoại tệ)
    totalAmountForeignTransport: {
        formula: '(generalData.crewTransportFeeFlag ? (ctz(data.numberOfFlights) * 2 * ctz(data.priceCrewTransport)) : 0)',
        groupFormula: 'aircraftTypeGroup',
    },
    //Tổng tiền xe chở tổ bay (ngoại tệ) có vat
    totalAmountForeignTransVat: {
        // formula: 'ctz(data.numberOfFlights) * 2 * ctz(data.priceCrewTransportVat)',
        formula: '(generalData.crewTransportFeeFlag ? (ctz(data.numberOfFlights) * 2 * ctz(data.priceCrewTransportVat)) : 0)',
        groupFormula: 'aircraftTypeGroup',
    },
    //Số phòng đơn
    singleRoom: {
        formula: 'ctz(data.overnight) * ctz(data.numberOfFlights) * ctz(data.pilotNumber) + (ctz(data.attendantNumber) % 2 === 0 ? 0 : ctz(data.numberOfFlights))',
    },
    //Số phòng đôi
    doubleRoom: {
        formula: 'ctz(data.overnight) * ctz(data.numberOfFlights) * (ctz(data.attendantNumber) % 2 === 0 ? (ctz(data.attendantNumber)/2) : ((ctz(data.attendantNumber) - 1)/2)) ',
    },
    //Số phòng đơn dự phòng do lẻ nam nữ
    singleRoomReserved: {
        formula: 'ctz(data.singleRoom) * (ctz(generalData.rateForSingle)/100)'
    },
    //Số phòng đơn early-checkin dự kiến
    singleRoomEarly: {
        formula: '1 * ctz(data.totalFlightEarlyCheckin) * ctz(data.pilotNumber) + (ctz(data.attendantNumber) % 2 === 0 ? 0 : ctz(data.totalFlightEarlyCheckin))'
    },
    //Số phòng đôi early-checkin dự kiến
    doubleRoomEarly: {
        formula: '1 * ctz(data.totalFlightEarlyCheckin) * (ctz(data.attendantNumber) % 2 === 0 ? (ctz(data.attendantNumber)/2) : ((ctz(data.attendantNumber) - 1)/2))'
    },
    //Số phòng đơn early-checkin dự kiến do lẻ nam nữ
    singleRoomEarlyReserved: {
        formula: 'ctz(data.singleRoomEarly) * (ctz(generalData.rateForSingle)/100)'
    },
    //Số phòng đơn late checkout dự kiến
    singleRoomLate: {
        formula: '1 * ctz(data.totalFlightLateCheckout) * ctz(data.pilotNumber) + (ctz(data.attendantNumber) % 2 === 0 ? 0 : ctz(data.totalFlightLateCheckout))'
    },
    //Số phòng đôi late checkout dự kiến
    doubleRoomLate: {
        formula: '1 * ctz(data.totalFlightLateCheckout) * (ctz(data.attendantNumber) % 2 === 0 ? (ctz(data.attendantNumber)/2) : ((ctz(data.attendantNumber) - 1)/2))'
    },
    //Số phòng đơn late checkout dự kiến do lẻ nam nữ
    singleRoomLateReserved: {
        formula: 'ctz(data.singleRoomLate) * (ctz(generalData.rateForSingle)/100)'
    },
    //Tổng số phòng đơn
    totalSingleRoom: {
        formula: 'ctz(data.singleRoom)/data.noOfFlightOvernight + ctz(data.singleRoomReserved)/data.noOfFlightOvernight + ctz(data.singleRoomOther)/data.noOfFlightOvernight',
        groupFormula: 'period'
    },
    //Tổng số phòng đôi
    totalDoubleRoom: {
        formula: 'ctz(data.doubleRoom)/data.noOfFlightOvernight + ctz(data.doubleRoomOther)/data.noOfFlightOvernight',
        groupFormula: 'period'
    },
    //Thành tiền ngoại tệ, - phòng đơn 
    totalAmountForeignSingleRoom: {
        formula: 'ctz(data.singleRoom) * ctz(data.priceSingleRoom)'
    },
    //Thành tiền ngoại tệ, - phòng đơn  có Vat
    totalAmountForeignSingleRoomVat: {
        // formula: '(ctz(data.singleRoom)/data.noOfFlightOvernight + ctz(data.singleRoomReserved)/data.noOfFlightOvernight + ctz(data.singleRoomOther)/data.noOfFlightOvernight) * ctz(data.priceSingleRoomVat) '
        formula: 'ctz(data.totalSingleRoom) * ctz(data.priceSingleRoomVat)'
    },
    //Thành tiền ngoại tệ,  - phòng đôi
    totalAmountForeignDoubleRoom: {
        formula: 'ctz(data.totalDoubleRoom) * ctz(data.priceDoubleRoom)'
    },
    //Thành tiền ngoại tệ,  - phòng đôi có vat
    totalAmountForeignDoubleRoomVat: {
        // formula: '(ctz(data.doubleRoom)/data.noOfFlightOvernight + ctz(data.doubleRoomOther)/data.noOfFlightOvernight) * ctz(data.priceDoubleRoomVat)'
        formula: 'ctz(data.totalDoubleRoom) * ctz(data.priceDoubleRoomVat)'
    },
    //Thành tiền ngoại tệ,  - phòng early-checkin 
    totalAmountForeignEarly: {
        formula: '(ctz(data.singleRoomEarly)/data.noOfOvernight + ctz(data.singleRoomEarlyReserved)/data.noOfOvernight) * ctz(data.priceSingleRoomEarly)  + (ctz(data.doubleRoomEarly)/data.noOfOvernight * ctz(data.priceDoubleRoomEarly))'
    },
    //Thành tiền ngoại tệ,  - phòng early-checkin  có Vat
    totalAmountForeignEarlyVat: {
        formula: '(ctz(data.singleRoomEarly)/data.noOfOvernight + ctz(data.singleRoomEarlyReserved)/data.noOfOvernight) * ctz(data.priceSingleRoomEarlyVat)  + (ctz(data.doubleRoomEarly)/data.noOfOvernight * ctz(data.priceDoubleRoomEarlyVat))'
    },
    //Thành tiền ngoại tệ, - phòng late checkout
    totalAmountForeignLate: {
        formula: '(ctz(data.singleRoomLate)/data.noOfOvernight + ctz(data.singleRoomLateReserved)/data.noOfOvernight) * ctz(data.priceSingleRoomLate)  + (ctz(data.doubleRoomLate)/data.noOfOvernight * ctz(data.priceDoubleRoomLate))'
    },
    //Thành tiền ngoại tệ, - phòng late checkout có VAT
    totalAmountForeignLateVat: {
        formula: '(ctz(data.singleRoomLate)/data.noOfOvernight + ctz(data.singleRoomLateReserved)/data.noOfOvernight) * ctz(data.priceSingleRoomLateVat)  + (ctz(data.doubleRoomLate)/data.noOfOvernight * ctz(data.priceDoubleRoomLateVat))'
    },
    //Tổng tiền theo loại máy bay
    totalAmountAircraft: {
        formula: 'ctz(data.totalAmountForeignSingleRoomVat) + ctz(data.totalAmountForeignDoubleRoomVat) + ctz(data.totalAmountForeignEarlyVat) + ctz(data.totalAmountForeignLateVat) + ctz(data.totalAmountForeignTransVat)'
    },
    // Tổng tiền ngoại tệ - Chưa bao gồm VAT
    totalAmountForeign: {
        // formula: '(ctz(data.singleRoom) + ctz(data.singleRoomReserved) + ctz(data.singleRoomOther)) * ctz(data.priceSingleRoom) '
        //     + ' + (ctz(data.doubleRoom) + ctz(data.doubleRoomOther) ) * ctz(data.priceDoubleRoom) '
        //     + ' + (ctz(data.singleRoomEarly) + ctz(data.singleRoomEarlyReserved)) * ctz(data.priceSingleRoomEarly) '
        //     + ' + (ctz(data.doubleRoomEarly) * ctz(data.priceDoubleRoomEarly)) '
        //     + ' + (ctz(data.singleRoomLate) + ctz(data.singleRoomLateReserved)) * ctz(data.priceSingleRoomLate) '
        //     + ' + (ctz(data.doubleRoomLate) * ctz(data.priceDoubleRoomLate)) '
        //     + ' + (ctz(data.totalFlightMonth )* 2 * ctz(data.priceCrewTransport)) ',
        // formulaUpdateBudgetPlan: ' ctz(data.singleRoom) * ctz(data.priceSingleRoom) '
        //     + ' + ctz(data.doubleRoom) * ctz(data.priceDoubleRoom) '
        //     + ' + ctz(data.singleRoomEarly) * ctz(data.priceSingleRoomEarly) '
        //     + ' + ctz(data.doubleRoomEarly) * ctz(data.priceDoubleRoomEarly) '
        //     + ' + ctz(data.singleRoomLate) * ctz(data.priceSingleRoomLate) '
        //     + ' + ctz(data.doubleRoomLate) * ctz(data.priceDoubleRoomLate) '
        //     + ' + (ctz(data.totalFlightMonth) * 2 * ctz(data.priceCrewTransport)) ',
        formula: '(ctz(data.totalSingleRoom) * ctz(data.priceSingleRoom))'
            + ' + (ctz(data.totalDoubleRoom) * ctz(data.priceDoubleRoom))'
            + ' + ctz(data.totalAmountForeignEarly)'
            + ' + ctz(data.totalAmountForeignLate)'
            + ' + ctz(data.totalAmountForeignTransport)',
        groupFormula: 'period',
    },
    //Tổng tiền ngoại tệ - Bao gồm VAT
    totalAmountForeignVat: {
        formula: 'ctz(data.totalAmountForeignSingleRoomVat) '
            + '+ ctz(data.totalAmountForeignDoubleRoomVat)'
            + '+ ctz(data.totalAmountForeignEarlyVat)'
            + '+ ctz(data.totalAmountForeignLateVat)'
            + '+ ctz(data.totalAmountForeignTransVat)',
        groupFormula: 'period',
    },
    //Tổng tiền VND - bao gồm VAT
    totalAmountVat: {
        formula: 'ctz(data.totalAmountForeignVat) * ctz(data.rateInPeriod)',
        groupFormula: 'period',
    },
    //Tổng tiền VND - chưa bao gồm VAT
    totalAmount: {
        formula: 'ctz(data.totalAmountForeign) * ctz(data.rateInPeriod)',
        groupFormula: 'period',
    },
}

export function getHeaderRowDef1(contractData: any): string[] {
    const columns: { column: string, visible: boolean }[] = [
        { column: "month", visible: true },
        { column: "aircraftType", visible: true },
        { column: "overnight", visible: true },
        { column: "numberFlight", visible: true },
        { column: "numberOfRooms", visible: true },
        { column: "numberOfRoomsForOthers", visible: true },
        { column: "numberOfEstimatedEarlyCheckInRooms", visible: checkVisibleColumn(contractData, FlagTypeEnum.EARLY_CHECKIN) },
        { column: "numberOfEstimatedLateCheckoutRooms", visible: checkVisibleColumn(contractData, FlagTypeEnum.LATE_CHECKOUT) },
        { column: 'totalRoom', visible: true },
        { column: "priceCrewTransport", visible: !!contractData.crewTransportFeeFlag }, // (Đơn giá xe chở tổ bay/lượt) 
        { column: "totalAmountForeignTransport", visible: !!contractData.crewTransportFeeFlag },
        { column: "totalAmountForeignColspan", visible: true },
        { column: "totalAmountColspan", visible: true }
    ]
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getHeaderRowDef2(contractData: any): string[] {
    const columns: { column: string, visible: boolean }[] = [
        { column: "singleRoom", visible: true },
        { column: "doubleRoom", visible: true },
        { column: "singleRoomReserved", visible: true },
        { column: "singleRoomOther", visible: true },
        { column: "doubleRoomOther", visible: true },
        { column: "singleRoomEarly", visible: checkVisibleColumn(contractData, FlagTypeEnum.EARLY_CHECKIN) },
        { column: "doubleRoomEarly", visible: checkVisibleColumn(contractData, FlagTypeEnum.EARLY_CHECKIN) },
        { column: "singleRoomEarlyReserved", visible: checkVisibleColumn(contractData, FlagTypeEnum.EARLY_CHECKIN) },
        { column: "singleRoomLate", visible: checkVisibleColumn(contractData, FlagTypeEnum.LATE_CHECKOUT) },
        { column: "doubleRoomLate", visible: checkVisibleColumn(contractData, FlagTypeEnum.LATE_CHECKOUT) },
        { column: "singleRoomLateReserved", visible: checkVisibleColumn(contractData, FlagTypeEnum.LATE_CHECKOUT) },
        { column: 'totalSingleRoom', visible: true },
        { column: 'totalDoubleRoom', visible: true },
        { column: "totalAmountForeign", visible: true },
        { column: "totalAmountForeignVat", visible: true },
        { column: "totalAmount", visible: true },
        { column: "totalAmountVat", visible: true },
    ];
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getRowDef(contractData: any): string[] {
    const columns = [
        { column: "month", visible: true },
        { column: "aircraftType", visible: true },
        { column: "overnight", visible: true },
        { column: "numberFlight", visible: true },
        { column: "singleRoom", visible: true },
        { column: "doubleRoom", visible: true },
        { column: "singleRoomReserved", visible: true },
        { column: "singleRoomOther", visible: true },
        { column: "doubleRoomOther", visible: true },
        { column: "singleRoomEarly", visible: checkVisibleColumn(contractData, FlagTypeEnum.EARLY_CHECKIN) },
        { column: "doubleRoomEarly", visible: checkVisibleColumn(contractData, FlagTypeEnum.EARLY_CHECKIN) },
        { column: "singleRoomEarlyReserved", visible: checkVisibleColumn(contractData, FlagTypeEnum.EARLY_CHECKIN) },
        { column: "singleRoomLate", visible: checkVisibleColumn(contractData, FlagTypeEnum.LATE_CHECKOUT) },
        { column: "doubleRoomLate", visible: checkVisibleColumn(contractData, FlagTypeEnum.LATE_CHECKOUT) },
        { column: "singleRoomLateReserved", visible: checkVisibleColumn(contractData, FlagTypeEnum.LATE_CHECKOUT) },
        { column: 'totalSingleRoom', visible: true },
        { column: 'totalDoubleRoom', visible: true },
        { column: "priceCrewTransport", visible: !!contractData.crewTransportFeeFlag },
        { column: "totalAmountForeignTransport", visible: !!contractData.crewTransportFeeFlag },
        { column: "totalAmountForeign", visible: true },
        { column: "totalAmountForeignVat", visible: true },
        { column: "totalAmount", visible: true },
        { column: "totalAmountVat", visible: true },
    ];
    return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

const FlagTypeEnum = {
    EARLY_CHECKIN: 'earlyCheckinFeeFlag',
    LATE_CHECKOUT: 'lateCheckoutFeeFlag',
    CREW_TRANSPORT: 'priceCrewTransportFlag'
}

export function checkVisibleColumn(contractData: any, flagType: string): boolean {
    if (contractData.haveContract) {
        if (contractData.earlyCheckinContractFlag && flagType === FlagTypeEnum.EARLY_CHECKIN) {
            return true
        } else if (contractData.lateCheckoutContractFlag && flagType === FlagTypeEnum.LATE_CHECKOUT) {
            return true;
        }

    } else {
        if (flagType === FlagTypeEnum.EARLY_CHECKIN && !!contractData.earlyCheckinFlag) {
            return true;
        } else if (flagType === FlagTypeEnum.LATE_CHECKOUT && !!contractData.lateCheckoutFlag) {
            return true
        }

    }
    return false
}


export function checkChange(value1: any, value2: any) {
    return value1 !== value2;
}
