export type Menu = {
  title: string; subMenu: subMenu[];
}
export type subMenu = {
  path: string; title: string; icon: string; menu: Menu[];
}


export const menu: Menu[] = [{
  title: $localize`:@@Data Management:Quản lý dữ liệu`, subMenu: [{
    path: 'admin/users', title: $localize`:@@budgetPlan:Kế hoạch ngân sách`, icon: 'ri-calendar-line', menu: []
  }, {
    path: 'admin/users', title: $localize`:@@dailyFlight schedule:Lịch bay ngày`, icon: 'ri-folder-chart-line', menu: []
  }, {
    path: 'admin/users',
    title: $localize`:@@manageBookingsVehicles:Quản lý đặt phòng/xe`,
    icon: 'ri-shopping-cart-line',
    menu: []
  }, {
    path: 'admin/users', title: $localize`:@@invoiceDocuments:Chứng từ hóa đơn`, icon: 'ri-bill-line', menu: []
  }]
}, {
  title: $localize`:@@reportManagement:Quản lý báo cáo`, subMenu: [{
    path: 'admin/users',
    title: $localize`:@@budgetReport:Báo cáo ngân sách theo thị trường`,
    icon: 'ri-folder-chart-line',
    menu: []
  }]
}, {
  title: $localize`:@@category:Danh mục`, subMenu: [{
    path: 'category/users',
    title: $localize`:@@annualFlightSchedule:Lịch bay năm`,
    icon: 'ri-calendar-schedule-fill',
    menu: []
  }, {
    path: 'category/users',
    title: $localize`:@@seasonalFlightSchedule:Lịch bay mùa`,
    icon: 'ri-calendar-schedule-fill',
    menu: []
  }, {
    path: 'category/contract', title: $localize`:@@contract:Hợp đồng`, icon: 'ri-contract-line', menu: []
  }, {
    path: 'category/users', title: $localize`:@@hotel:Khách sạn`, icon: 'ri-hotel-bed-fill', menu: []
  }, {
    path: 'category/vehicle', title: $localize`:@@carRentalCompany:Nhà xe`, icon: 'ri-car-line', menu: []
  }, {
    path: 'category/users', title: $localize`:@@flightMarket:Thị trường bay`, icon: 'ri-store-line', menu: []
  }, {
    path: 'category/rate', title: $localize`:@@exchangeRate:Tỉ giá ngoại tệ`, icon: 'ri-exchange-cny-line', menu: []
  }, {
    path: 'category/nation', title: $localize`:@@country:Country`, icon: 'ri-global-fill', menu: []
  }, {
    path: 'category/service-fee', title: $localize`:@@serviceFee:Service Fee`, icon: 'ri-money-dollar-box-fill', menu: []
  }

  ]
}, {
  title: $localize`:@@system:Hệ Thống`, subMenu: [{
    path: 'admin/users', title: $localize`:@@profile:Profile`, icon: 'ri-calendar-schedule-fill', menu: [{
      title: $localize`:@@rolesAccounts:Roles & Accounts`, subMenu: [{
        path: 'admin/users', title: $localize`:@@account:Account`, icon: 'ri-group-fill', menu: []
      }, {
        path: 'admin/roles', title: $localize`:@@role:Role`, icon: 'ri-calendar-schedule-fill', menu: []
      }, {
        path: 'admin/functions', title: $localize`:@@function:Function`, icon: 'ri-calendar-schedule-fill', menu: []
      }]
    }]
  }]
}]
