import { PlanCategoryEnum } from '../../../budget-procurement.model';

export const formula: any = {

  //Số chuyến bay theo tàu (công thức của kế hoạch mua sắm)
  // totalFlightByAircraft: {
  //   formula: 'ctz(data.totalFlightMonth) * (ctz(data.flightOvernightRate)/100)',
  //   formulaProcurement: 'ctz(data.planFlightPeriod) * (ctz(data.flightOvernightRate)/100)'
  // },
  numberOfFlights: {
    formula: 'ctz(data.totalFlightByAircraft) * (ctz(data.flightOvernightRate)/100)',
    formulaProcurement: 'ctz(data.planFlightPeriod) * (ctz(data.flightOvernightRate)/100)'
  },

  //Tổng tiền xe chở tổ bay (ngoại tệ)
  totalAmountForeignTransport: {
    // formula: 'ctz(data.numberOfFlights) * 2 * ctz(data.priceCrewTransport)',
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
    formula: 'ctz(data.singleRoom)/ctz(data.noOfFlightOvernight) + ctz(data.singleRoomReserved)/ctz(data.noOfFlightOvernight) + ctz(data.singleRoomOther)/ctz(data.noOfFlightOvernight)',
  },
  //Tổng số phòng đôi
  totalDoubleRoom: {
    formula: 'ctz(data.doubleRoom)/ctz(data.noOfFlightOvernight) + ctz(data.doubleRoomOther)/ctz(data.noOfFlightOvernight)',
  },
  //Thành tiền ngoại tệ, - phòng đơn 
  totalAmountForeignSingleRoom: {
    // formula: '(ctz(data.singleRoom)/ctz(data.noOfFlightOvernight) + ctz(data.singleRoomReserved)/ctz(data.noOfFlightOvernight) + ctz(data.singleRoomOther)/ctz(data.noOfFlightOvernight)) * ctz(data.priceSingleRoomVat) '
    formula: 'ctz(data.totalSingleRoom) * ctz(data.priceSingleRoom)'
  },
  //Thành tiền ngoại tệ, - phòng đơn  có Vat
  totalAmountForeignSingleRoomVat: {
    // formula: '(ctz(data.singleRoom)/ctz(data.noOfFlightOvernight) + ctz(data.singleRoomReserved)/ctz(data.noOfFlightOvernight) + ctz(data.singleRoomOther)/ctz(data.noOfFlightOvernight)) * ctz(data.priceSingleRoomVat) '
    formula: 'ctz(data.totalSingleRoom) * ctz(data.priceSingleRoomVat)'
  },
  //Thành tiền ngoại tệ,  - phòng đôi
  totalAmountForeignDoubleRoom: {
    // formula: '(ctz(data.doubleRoom)/ctz(data.noOfFlightOvernight) + ctz(data.doubleRoomOther)/ctz(data.noOfFlightOvernight)) * ctz(data.priceDoubleRoomVat)'
    formula: 'ctz(data.totalDoubleRoom) * ctz(data.priceDoubleRoom)'
  },
  //Thành tiền ngoại tệ,  - phòng đôi có vat
  totalAmountForeignDoubleRoomVat: {
    // formula: '(ctz(data.doubleRoom)/ctz(data.noOfFlightOvernight) + ctz(data.doubleRoomOther)/ctz(data.noOfFlightOvernight)) * ctz(data.priceDoubleRoomVat)'
    formula: 'ctz(data.totalDoubleRoom) * ctz(data.priceDoubleRoomVat)'
  },
  //Thành tiền ngoại tệ,  - phòng early-checkin 
  // với case các phòng early và late thì Thu bảo sẽ chia nếu tháng đã thực hiện thì chia theo giai đoạn, chưa thực hiện chia theo đêm nghỉ
  totalAmountForeignEarly: {
    formula: '(ctz(data.singleRoomEarly)/(!!data.monthIsPerform ? ctz(data.noOfFlightOvernight) : ctz(data.noOfOvernight)) '
      + ' + ctz(data.singleRoomEarlyReserved)/(!!data.monthIsPerform ? ctz(data.noOfFlightOvernight) : ctz(data.noOfOvernight))) * ctz(data.priceSingleRoomEarly)  '
      + ' + (ctz(data.doubleRoomEarly)/(!!data.monthIsPerform ? ctz(data.noOfFlightOvernight) : ctz(data.noOfOvernight)) * ctz(data.priceDoubleRoomEarly))'
  },
  //Thành tiền ngoại tệ,  - phòng early-checkin 
  totalAmountForeignEarlyVat: {
    formula: '(ctz(data.singleRoomEarly)/(!!data.monthIsPerform ? ctz(data.noOfFlightOvernight) : ctz(data.noOfOvernight)) '
      + ' + ctz(data.singleRoomEarlyReserved)/(!!data.monthIsPerform ? ctz(data.noOfFlightOvernight) : ctz(data.noOfOvernight))) * ctz(data.priceSingleRoomEarlyVat)  '
      + ' + (ctz(data.doubleRoomEarly)/(!!data.monthIsPerform ? ctz(data.noOfFlightOvernight) : ctz(data.noOfOvernight)) * ctz(data.priceDoubleRoomEarlyVat))'
  },
  //Thành tiền ngoại tệ, - phòng late checkout
  totalAmountForeignLate: {
    formula: '(ctz(data.singleRoomLate)/(!!data.monthIsPerform ? ctz(data.noOfFlightOvernight) : ctz(data.noOfOvernight)) '
      + ' + ctz(data.singleRoomLateReserved)/(!!data.monthIsPerform ? ctz(data.noOfFlightOvernight) : ctz(data.noOfOvernight))) * ctz(data.priceSingleRoomLate)  '
      + ' + (ctz(data.doubleRoomLate)/(!!data.monthIsPerform ? ctz(data.noOfFlightOvernight) : ctz(data.noOfOvernight)) * ctz(data.priceDoubleRoomLate))'
  },
  //Thành tiền ngoại tệ, - phòng late checkout có VAT
  totalAmountForeignLateVat: {
    formula: '(ctz(data.singleRoomLate)/(!!data.monthIsPerform ? ctz(data.noOfFlightOvernight) : ctz(data.noOfOvernight)) '
      + ' + ctz(data.singleRoomLateReserved)/(!!data.monthIsPerform ? ctz(data.noOfFlightOvernight) : ctz(data.noOfOvernight))) * ctz(data.priceSingleRoomLateVat) '
      + ' + (ctz(data.doubleRoomLate)/(!!data.monthIsPerform ? ctz(data.noOfFlightOvernight) : ctz(data.noOfOvernight)) * ctz(data.priceDoubleRoomLateVat))'
  },
  //Tổng tiền theo loại máy bay
  totalAmountAircraft: {
    formula: 'ctz(data.totalAmountForeignSingleRoomVat) + ctz(data.totalAmountForeignDoubleRoomVat) + ctz(data.totalAmountForeignEarlyVat) + ctz(data.totalAmountForeignLateVat) + ctz(data.totalAmountForeignTransport)'
  },
  // Tổng tiền ngoại tệ - Chưa bao gồm VAT, noOfFlightOvernight cái này để chia vs trường hợp tháng đã thực hiện
  totalAmountForeign: {
    // formula: '(ctz(data.singleRoom)/ctz(data.noOfFlightOvernight) + ctz(data.singleRoomReserved)/ctz(data.noOfFlightOvernight) + ctz(data.singleRoomOther)/ctz(data.noOfFlightOvernight)) * ctz(data.priceSingleRoom) '
    //   + ' +  (ctz(data.doubleRoom)/ctz(data.noOfFlightOvernight) + ctz(data.doubleRoomOther)/ctz(data.noOfFlightOvernight) ) * ctz(data.priceDoubleRoom) '
    //   + ' + (ctz(data.singleRoomEarly)/ctz(data.noOfOvernight) + ctz(data.singleRoomEarlyReserved)/ctz(data.noOfOvernight)) * ctz(data.priceSingleRoomEarly) '
    //   + ' + (ctz(data.doubleRoomEarly)/ctz(data.noOfOvernight) * ctz(data.priceDoubleRoomEarly)) '
    //   + ' + (ctz(data.singleRoomLate)/ctz(data.noOfOvernight) + ctz(data.singleRoomLateReserved)/ctz(data.noOfOvernight)) * ctz(data.priceSingleRoomLate)  + (ctz(data.doubleRoomLate)/ctz(data.noOfOvernight) * ctz(data.priceDoubleRoomLate))'
    //   + ' + (generalData.crewTransportFeeFlag ? (ctz(data.numberOfFlights) * 2 * ctz(data.priceCrewTransport)) : 0)'
    formula: '(ctz(data.totalSingleRoom) * ctz(data.priceSingleRoom))'
      + ' + (ctz(data.totalDoubleRoom) * ctz(data.priceDoubleRoom))'
      + ' + ctz(data.totalAmountForeignEarly)'
      + ' + ctz(data.totalAmountForeignLate)'
      + ' + ctz(data.totalAmountForeignTransport)'
    ,
    // formulaUpdateBudgetPlan: ' ctz(data.singleRoom) * ctz(data.priceSingleRoom) '
    //   + ' + ctz(ata.doubleRoom) * ctz(data.priceDoubleRoom) '
    //   + ' + ctz(data.singleRoomEarly) * ctz(data.priceSingleRoomEarly) '
    //   + ' + ctz(data.doubleRoomEarly) * ctz(data.priceDoubleRoomEarly) '
    //   + ' + ctz(data.singleRoomLate) * ctz(data.priceSingleRoomLate) '
    //   + ' + ctz(data.doubleRoomLate) * ctz(data.priceDoubleRoomLate) '
    //   + ' + (ctz(data.totalFlightByAircraft) * 2 * ctz(data.priceCrewTransport)) '
    //   ,
    formulaProcurement: 'ctz(data.totalAmountForeignVat) / (1 + (ctz(data.taxRate)/100)) ',
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
    formulaProcurement: 'ctz(data.totalAmountVat) / (1 + (ctz(data.taxRate)/100))',
    groupFormula: 'period',
  }

}

export function getHeaderRowDef1(contractData: any, type: string): string[] {
  const columns: { column: string, visible: boolean }[] = [
    { column: "month", visible: true },
    { column: "aircraftType", visible: true },
    { column: "overnight", visible: true },
    { column: "numberOfFlights", visible: true },
    { column: "numberOfRooms", visible: true },
    { column: "numberOfRoomsForOthers", visible: true },
    { column: "numberOfEstimatedEarlyCheckInRooms", visible: checkVisibleColumn(contractData, FlagTypeEnum.EARLY_CHECKIN, type) },
    { column: "numberOfEstimatedLateCheckoutRooms", visible: checkVisibleColumn(contractData, FlagTypeEnum.LATE_CHECKOUT, type) },
    // { column: 'totalRoom', visible: true },
    //start phần kế hoạch mua sắm
    { column: "unitPriceIncludingVat", visible: type === PlanCategoryEnum.PROCUREMENT }, // (Đơn giá bao gồm vat) 
    { column: "priceCrewTransport", visible: !!contractData.crewTransportFeeFlag }, // (Đơn giá xe chở tổ bay/lượt) 
    // end phần kế hoạch mua sắm
    { column: "totalAmountForeignTransport", visible: !!contractData.crewTransportFeeFlag },
    { column: "totalAmountForeignColspan", visible: true },
    { column: "totalAmountColspan", visible: true }
  ]
  return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getHeaderRowDef2(contractData: any, type: string): string[] {
  const columns: { column: string, visible: boolean }[] = [
    { column: "singleRoom", visible: true },
    { column: "doubleRoom", visible: true },
    { column: "singleRoomReserved", visible: true },
    { column: "singleRoomOther", visible: true },
    { column: "doubleRoomOther", visible: true },
    { column: "singleRoomEarly", visible: checkVisibleColumn(contractData, FlagTypeEnum.EARLY_CHECKIN, type) },
    { column: "doubleRoomEarly", visible: checkVisibleColumn(contractData, FlagTypeEnum.EARLY_CHECKIN, type) },
    { column: "singleRoomEarlyReserved", visible: checkVisibleColumn(contractData, FlagTypeEnum.EARLY_CHECKIN, type) },
    { column: "singleRoomLate", visible: checkVisibleColumn(contractData, FlagTypeEnum.LATE_CHECKOUT, type) },
    { column: "doubleRoomLate", visible: checkVisibleColumn(contractData, FlagTypeEnum.LATE_CHECKOUT, type) },
    { column: "singleRoomLateReserved", visible: checkVisibleColumn(contractData, FlagTypeEnum.LATE_CHECKOUT, type) },
    // { column: "totalSingleRoom", visible: true },
    // { column: "totalDoubleRoom", visible: true },
    //start phần kế hoạch mua sắm
    { column: "priceSingleRoom", visible: type === PlanCategoryEnum.PROCUREMENT }, // (Đơn giá phòng đơn) 
    { column: "priceDoubleRoom", visible: type === PlanCategoryEnum.PROCUREMENT }, // (Đơn giá phòng đôi) 
    { column: "priceSingleRoomEarly", visible: type === PlanCategoryEnum.PROCUREMENT && checkVisibleColumn(contractData, FlagTypeEnum.EARLY_CHECKIN, PlanCategoryEnum.PROCUREMENT) }, // (Đơn giá Early-checkin phòng đơn) 
    { column: "priceDoubleRoomEarly", visible: type === PlanCategoryEnum.PROCUREMENT && checkVisibleColumn(contractData, FlagTypeEnum.EARLY_CHECKIN, PlanCategoryEnum.PROCUREMENT) }, // (Đơn giá Early-checkin phòng đôi) 
    { column: "priceSingleRoomLate", visible: type === PlanCategoryEnum.PROCUREMENT && checkVisibleColumn(contractData, FlagTypeEnum.LATE_CHECKOUT, PlanCategoryEnum.PROCUREMENT) }, // (Đơn giá late checkout phòng đơn) 
    { column: "priceDoubleRoomLate", visible: type === PlanCategoryEnum.PROCUREMENT && checkVisibleColumn(contractData, FlagTypeEnum.LATE_CHECKOUT, PlanCategoryEnum.PROCUREMENT) }, // (Đơn giá late check out phòng đôi) 
    // end phần kế hoạch mua sắm
    { column: "totalAmountForeign", visible: true },
    { column: "totalAmountForeignVat", visible: true },
    { column: "totalAmount", visible: true },
    { column: "totalAmountVat", visible: true },
  ];
  return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export function getRowDef(contractData: any, type: string): string[] {
  const columns = [
    { column: "month", visible: true },
    { column: "aircraftType", visible: true },
    { column: "overnight", visible: true },
    { column: "numberOfFlights", visible: true },
    { column: "singleRoom", visible: true },
    { column: "doubleRoom", visible: true },
    { column: "singleRoomReserved", visible: true },
    { column: "singleRoomOther", visible: true },
    { column: "doubleRoomOther", visible: true },
    { column: "singleRoomEarly", visible: checkVisibleColumn(contractData, FlagTypeEnum.EARLY_CHECKIN, type) },
    { column: "doubleRoomEarly", visible: checkVisibleColumn(contractData, FlagTypeEnum.EARLY_CHECKIN, type) },
    { column: "singleRoomEarlyReserved", visible: checkVisibleColumn(contractData, FlagTypeEnum.EARLY_CHECKIN, type) },
    { column: "singleRoomLate", visible: checkVisibleColumn(contractData, FlagTypeEnum.LATE_CHECKOUT, type) },
    { column: "doubleRoomLate", visible: checkVisibleColumn(contractData, FlagTypeEnum.LATE_CHECKOUT, type) },
    { column: "singleRoomLateReserved", visible: checkVisibleColumn(contractData, FlagTypeEnum.LATE_CHECKOUT, type) },
    // { column: "totalSingleRoom", visible: true },
    // { column: "totalDoubleRoom", visible: true },
    //start phần kế hoạch mua sắm
    { column: "priceSingleRoom", visible: type === PlanCategoryEnum.PROCUREMENT },
    { column: "priceDoubleRoom", visible: type === PlanCategoryEnum.PROCUREMENT },
    { column: "priceSingleRoomEarly", visible: type === PlanCategoryEnum.PROCUREMENT && checkVisibleColumn(contractData, FlagTypeEnum.EARLY_CHECKIN, PlanCategoryEnum.PROCUREMENT) },
    { column: "priceDoubleRoomEarly", visible: type === PlanCategoryEnum.PROCUREMENT && checkVisibleColumn(contractData, FlagTypeEnum.EARLY_CHECKIN, PlanCategoryEnum.PROCUREMENT) },
    { column: "priceSingleRoomLate", visible: type === PlanCategoryEnum.PROCUREMENT && checkVisibleColumn(contractData, FlagTypeEnum.LATE_CHECKOUT, PlanCategoryEnum.PROCUREMENT) },
    { column: "priceDoubleRoomLate", visible: type === PlanCategoryEnum.PROCUREMENT && checkVisibleColumn(contractData, FlagTypeEnum.LATE_CHECKOUT, PlanCategoryEnum.PROCUREMENT) },
    { column: "priceCrewTransport", visible: !!contractData.crewTransportFeeFlag },
    // end phần kế hoạch mua sắm
    { column: "totalAmountForeignTransport", visible: !!contractData.crewTransportFeeFlag },
    { column: "totalAmountForeign", visible: true },
    { column: "totalAmountForeignVat", visible: true },
    { column: "totalAmount", visible: true },
    { column: "totalAmountVat", visible: true },
  ];
  return columns.filter((column: any) => column.visible).map((column: any) => column.column)
}

export const FlagTypeEnum = {
  EARLY_CHECKIN: 'earlyCheckinFlag',
  LATE_CHECKOUT: 'lateCheckoutFlag',
  CREW_TRANSPORT: 'crewTransportFeeFlag'
}

export function checkVisibleColumn(contractData: any, flagType: string, type: string): boolean {
  // earlyCheckinContractFlag: new FormControl(false),
  // lateCheckoutContractFlag: new FormControl(false),
  //   (1) trường hợp có hợp đồng, trong hợp đồng có HHDV = phí ECI, LCO 
  // => có tích 2 checkbox -> bảng KHNS, KHMS hiển thị các cột liên quan đến ECI, LCO
  // => Khi người dùng bỏ tích chọn -> bảng KHNS vẫn hiển thị các cột ECI, LCO. Bảng KHMS k hiển thị các cột ECI, LCO
  if (contractData.haveContract) {
    if (contractData.earlyCheckinContractFlag && flagType === FlagTypeEnum.EARLY_CHECKIN && !!contractData.earlyCheckinFlag) {
      return true
    } else if (contractData.earlyCheckinContractFlag && flagType === FlagTypeEnum.EARLY_CHECKIN && !contractData.earlyCheckinFlag && type === PlanCategoryEnum.BUDGET) {
      return true
    } else if (contractData.lateCheckoutContractFlag && flagType === FlagTypeEnum.LATE_CHECKOUT && !!contractData.lateCheckoutFlag) {
      return true;
    } else if (contractData.lateCheckoutContractFlag && flagType === FlagTypeEnum.LATE_CHECKOUT && !contractData.lateCheckoutFlag && type === PlanCategoryEnum.BUDGET) {
      return true
    }
    //   (2) trường hợp có hợp đồng, trong hợp đồng KHÔNG có HHDV = phí ECI, LCO 
    // => không tích 2 checkbox -> bảng KHNS, KHMS KHÔNG hiển thị các cột liên quan đến ECI, LCO
    // => Khi người dùng CÓ tích chọn -> bảng KHNS KHÔNG hiển thị các cột ECI, LCO. Bảng KHMS CÓ hiển thị các cột ECI, LCO
    else if (!contractData.earlyCheckinContractFlag && flagType === FlagTypeEnum.EARLY_CHECKIN && !!contractData.earlyCheckinFlag && type === PlanCategoryEnum.PROCUREMENT) {
      return true;
    } else if (!contractData.lateCheckoutContractFlag && flagType === FlagTypeEnum.LATE_CHECKOUT && !!contractData.lateCheckoutFlag && type === PlanCategoryEnum.PROCUREMENT) {
      return true;
    }

  } else {
    //   (3) Trường hợp không có hợp đồng -> vào kịch bay mùa (NETLINE_FLIGHT_LEGS_MASTER) theo điều kiện: năm làm kế hoạch = năm của trường min_dep_at:
    // + Check ECI: mã thị trường = ARR_AP_SCHED   -> nếu có 1 dòng có cột ECI  = 1 -> có tích chọn checkbox ECI 
    // -> cả 2 bảng KHNS, KHMS đều hiện các cột liên quan đến ECI. Khi người dùng bỏ tích chọn -> cả 2 bảng KHNS, KHMS đều không hiện các cột liên quan đến ECI
    // + Check LCO: mã thị trường = DEP_AP_SCHED  -> nếu có 1 gdòng có cột LCO = 1 -> có tích chọn checkbox LCO
    // -> cả 2 bảng KHNS, KHMS đều hiện các cột liên quan đến LCO. Khi người dùng bỏ tích chọn -> cả 2 bảng KHNS, KHMS đều không hiện các cột liên quan đến LCO
    // + nếu tất cả các dòng đều có ECI = 0, LCO = 0 -> KHÔNG tích chọn 2 checkbox
    // -> 2 bảng KHNS, KHMS KHÔNG hiện các cột ECI, LCO. Khi người dùng tích chọn check box ECI thì cả 2 bảng KHNS, KHMS đều hiện các cột liên quan đến ECI (LCO cũng tương tự)
    if (flagType === FlagTypeEnum.EARLY_CHECKIN && !!contractData.earlyCheckinFlag) {
      return true;
    } else if (flagType === FlagTypeEnum.LATE_CHECKOUT && !!contractData.lateCheckoutFlag) {
      return true
    }

  }
  return false
}


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
]

export function checkChange(value1: any, value2: any) {
  return value1 !== value2;
}
