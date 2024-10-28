export type Menu = {
    title: string;rootPath:string; subMenu: subMenu[];
}
export type subMenu = {
    path: string; title: string; icon: string; menu?: Menu[];
}


export const menu: Menu[] = [
    {
        title: $localize`:@@Data Management:Quản lý dữ liệu`,
        rootPath : 'data',
        subMenu: [
            {
                path: 'data/users', title: $localize`:@@budgetPlan:Kế hoạch ngân sách`, icon: 'ri-calendar-line'
            },
            {
                path: 'data/users', title: $localize`:@@dailyFlight schedule:Lịch bay ngày`, icon: 'ri-folder-chart-line'
            },
            {
                path: 'data/users', title: $localize`:@@manageBookingsVehicles:Quản lý đặt phòng/xe`, icon: 'ri-shopping-cart-line'
            },
            {
                path: 'data/users', title: $localize`:@@invoiceDocuments:Chứng từ hóa đơn`, icon: 'ri-bill-line'
            }
        ]
    },
    {
        title: $localize`:@@reportManagement:Quản lý báo cáo`,
        rootPath : 'report',
        subMenu: [
            {
                path: 'report/report1', title: $localize`:@@budgetReport:Báo cáo ngân sách theo thị trường`, icon: 'ri-folder-chart-line', menu: []
            }
        ]
    },
  {
    title: $localize`:@@plan:Plan`,
    rootPath : 'plan',
    subMenu: [
      {
        path: '', title: '', icon: 'ri-calendar-schedule-fill',
        menu: [
          {
            title: $localize`:@@rates:Rates`,
            rootPath : '',
            subMenu: [
              {
                path: 'plan/rate/uth', title: $localize`:@@uth:Ước thực hiện`, icon: 'ri-exchange-cny-line'
              },
              {
                path: 'plan/rate/planned', title: $localize`:@@plannedExchangeRate:Planned exchange rate`, icon: 'ri-exchange-cny-line'
              }
            ]
          },
          {
            title: $localize`:@@production:Production`,
            rootPath : '',
            subMenu: [
              {
                path: 'plan/production/est-annual-production', title: $localize`:@@estAnnualProduction:Estimated Annual Production`, icon: 'ri-folder-chart-line'
              },
              {
                path: 'plan/production/planned', title: $localize`:@@planedAnnualProduction:Planned Annual Production`, icon: 'ri-folder-chart-line'
              },
              {
                path: 'plan/production/five-year-plan', title: $localize`:@@fiveYearPlan:5-Year Plans`, icon: 'ri-folder-chart-line'
              },
            ]
          }]
      }]
  },
    {
        title: $localize`:@@category:Category`,
        rootPath : 'category',
        subMenu: [
            {
                path: 'category/users', title: $localize`:@@annualFlightSchedule:Lịch bay năm`, icon: 'ri-calendar-schedule-fill'
            },
            {
                path: 'category/users', title: $localize`:@@seasonalFlightSchedule:Lịch bay mùa`, icon: 'ri-calendar-schedule-fill'
            },
            {
                path: 'category/contract', title: $localize`:@@contract:Contract`, icon: 'ri-contract-line'
            },
            {
                path: 'category/hotel', title: $localize`:@@hotel:Hotels`, icon: 'ri-hotel-bed-fill'
            },
            {
                path: 'category/vehicle', title: $localize`:@@carRentalCompany:Car rental`, icon: 'ri-car-line'
            },
            {
                path: 'category/flight-market', title: $localize`:@@flightMarket:Flight market`, icon: 'ri-store-line'
            },
            {
                path: 'category/act-rate', title: $localize`:@@ActExchangeRate:Actual exchange rate`, icon: 'ri-exchange-cny-line'
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
        title: $localize`:@@system:System`,
        rootPath : 'system',
        subMenu: [
            {
                path: '', title: '', icon: 'ri-calendar-schedule-fill',
                menu: [
                    {
                        title: $localize`:@@rolesAccounts:Roles & Accounts`,
                        rootPath : '',
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
                    },
                  {
                    title: $localize`:@@config:Config`,
                    rootPath : '',
                    subMenu: [
                      {
                        path: 'config/group-mail', title: $localize`:@@groupsMail:Groups mail`, icon: 'ri-mail-add-line'
                      },
                    ]
                  }]
            }]
    }]
