export type Menu = {
    title: string; subMenu: subMenu[];
}
export type subMenu = {
    path: string; title: string; icon: string; menu?: Menu[];
}


export const menu: Menu[] = [
    {
        title: $localize`:@@Data Management:Quản lý dữ liệu`,
        subMenu: [
            {
                path: 'admin/users', title: $localize`:@@budgetPlan:Kế hoạch ngân sách`, icon: 'ri-calendar-line'
            },
            {
                path: 'admin/users', title: $localize`:@@dailyFlight schedule:Lịch bay ngày`, icon: 'ri-folder-chart-line'
            },
            {
                path: 'admin/users', title: $localize`:@@manageBookingsVehicles:Quản lý đặt phòng/xe`, icon: 'ri-shopping-cart-line'
            },
            {
                path: 'admin/users', title: $localize`:@@invoiceDocuments:Chứng từ hóa đơn`, icon: 'ri-bill-line'
            }
        ]
    },
    {
        title: $localize`:@@reportManagement:Quản lý báo cáo`,
        subMenu: [
            {
                path: 'admin/users', title: $localize`:@@budgetReport:Báo cáo ngân sách theo thị trường`, icon: 'ri-folder-chart-line', menu: []
            }
        ]
    },
    {
        title: $localize`:@@category:Danh mục`,
        subMenu: [
            {
                path: 'category/users', title: $localize`:@@annualFlightSchedule:Lịch bay năm`, icon: 'ri-calendar-schedule-fill'
            },
            {
                path: 'category/users', title: $localize`:@@seasonalFlightSchedule:Lịch bay mùa`, icon: 'ri-calendar-schedule-fill'
            },
            {
                path: 'category/contract', title: $localize`:@@contract:Hợp đồng`, icon: 'ri-contract-line'
            },
            {
                path: 'category/users', title: $localize`:@@hotel:Khách sạn`, icon: 'ri-hotel-bed-fill'
            },
            {
                path: 'category/vehicle', title: $localize`:@@carRentalCompany:Nhà xe`, icon: 'ri-car-line'
            },
            {
                path: 'category/users', title: $localize`:@@flightMarket:Thị trường bay`, icon: 'ri-store-line'
            },
            {
                path: 'category/rate', title: $localize`:@@exchangeRate:Tỉ giá ngoại tệ`, icon: 'ri-exchange-cny-line'
            },
            {
                path: 'category/crews', title: $localize`:@@crewList:Crew List`, icon: 'ri-id-card-line'
            },
            {
                path: 'category/nation', title: $localize`:@@country:Country`, icon: 'ri-global-fill'
            },
            {
                path: 'category/service-fee', title: $localize`:@@serviceFee:Service Fee`, icon: 'ri-money-dollar-box-fill'
            }

        ]
    }, {
        title: $localize`:@@system:Hệ Thống`,
        subMenu: [
            {
                path: 'admin/users', title: $localize`:@@profile:Profile`, icon: 'ri-calendar-schedule-fill',
                menu: [
                    {
                        title: $localize`:@@rolesAccounts:Roles & Accounts`,
                        subMenu: [
                            {
                                path: 'admin/users', title: $localize`:@@account:Account`, icon: 'ri-group-fill'
                            },
                            {
                                path: 'admin/roles', title: $localize`:@@role:Role`, icon: 'ri-calendar-schedule-fill'
                            },
                            {
                                path: 'admin/functions', title: $localize`:@@function:Function`, icon: 'ri-calendar-schedule-fill'
                            }
                        ]
                    }]
            }]
    }]
