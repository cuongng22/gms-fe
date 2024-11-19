export interface Menu {
  title: string;
  rootPath: string;
  subMenu: subMenu[];
}

export interface subMenu {
  path: string;
  title: string;
  icon: string;
  menu?: Menu[];
}


export const menu: Menu[] = [
  {
    title: $localize`:@@Dashboard:DASHBOARD`,
    rootPath: 'dashboard',
    subMenu: []
  },
  {
    title: $localize`:@@category:CATEGORY`,
    rootPath: 'category',
    subMenu: [
      {
        path: 'category/flight-market', title: $localize`:@@airPort:Airport`, icon: 'ri-store-line'
      },
      {
        path: 'category/hotel', title: $localize`:@@hotel:Hotels`, icon: 'ri-hotel-bed-line'
      },
      {
        path: 'category/vehicle', title: $localize`:@@carRentalCompany:Car rental`, icon: 'ri-car-line'
      },
      {
        path: 'category/cost', title: $localize`:@@costCategory:Cost category`, icon: 'ri-server-line'
      },
      {
        path: 'category/contract', title: $localize`:@@contract:Contract`, icon: 'ri-contract-line'
      },
      {
        path: 'category/act-rate',
        title: $localize`:@@ActExchangeRate:Actual exchange rate`,
        icon: 'ri-exchange-cny-line'
      },
      {
        path: 'category/crews-flight', title: $localize`:@@flightCrew:Flight Crew`, icon: 'ri-id-card-line'
      },
      {
        path: 'category/crews', title: $localize`:@@crewList:Crew List`, icon: 'ri-id-card-line'
      },
      {
        path: 'category/nation', title: $localize`:@@country:Country`, icon: 'ri-global-line'
      }
    ]
  },
  {
    title: $localize`:@@flightSchedules:FLIGHT SCHEDULES`,
    rootPath: 'flight-schedules',
    subMenu: [
      {
        path: 'flight-schedules/seasonal',
        title: $localize`:@@seasonalFlightSchedule:Seasonal Flight Schedule`,
        icon: 'ri-calendar-schedule-line'
      },
      {
        path: 'flight-schedules/daily',
        title: $localize`:@@dailyFlightSchedule:Daily Flight Schedule`,
        icon: 'ri-calendar-schedule-line'
      }
    ]
  },
  {
    title: $localize`:@@hotelCarService:HOTEL & CAR SERVICE`,
    rootPath: 'service',
    subMenu: [
      {
        path: '', title: '', icon: 'ri-calendar-schedule-line',
        menu: [
          {
            title: $localize`:@@hotelRoom:Hotel room`,
            rootPath: 'service/hotel',
            subMenu: [
              {
                path: 'service/hotel/room-booking',
                title: $localize`:@@roomBooking:Room booking`,
                icon: 'ri-exchange-cny-line'
              },
              {
                path: 'service/hotel/cost-tracking',
                title: $localize`:@@plannedExchangeRate:Hotel cost tracking(AVES)`,
                icon: 'ri-exchange-cny-line'
              }
            ]
          },
          {
            title: $localize`:@@carRental:Car rental`,
            rootPath: 'service/car',
            subMenu: [
              {
                path: 'service/car/car-booking',
                title: $localize`:@@carBooking:Car booking`,
                icon: 'ri-folder-chart-line'
              },
              {
                path: 'service/car/cost-tracking',
                title: $localize`:@@carCostTracking:Car cost tracking(AVES)`,
                icon: 'ri-folder-chart-line'
              }
            ]
          }]
      }
    ]
  },
  {
    title: $localize`:@@invoice:INVOICE`,
    rootPath: 'invoice',
    subMenu: [
      {
        path: 'invoice/detailed', title: $localize`:@@detailedStatment:Detailed statement`, icon: 'ri-calendar-line'
      },
      {
        path: 'invoice/e-invoice', title: $localize`:@@invoice:Invoice`, icon: 'ri-folder-chart-line'
      },
      {
        path: 'invoice/actual-expense-tracking',
        title: $localize`:@@actualExpenseTracking:Actual expense tracking`,
        icon: 'ri-shopping-cart-line'
      },
    ]
  },
  {
    title: $localize`:@@plan:Plan`,
    rootPath: 'plan',
    subMenu: [
      {
        path: '', title: '', icon: 'ri-calendar-schedule-line',
        menu: [
          {
            title: $localize`:@@rates:Rates`,
            rootPath: 'plan/rate',
            subMenu: [
              {
                path: 'plan/rate/uth', title: $localize`:@@uth:Ước thực hiện`, icon: 'ri-exchange-cny-line'
              },
              {
                path: 'plan/rate/planned',
                title: $localize`:@@plannedExchangeRate:Planned exchange rate`,
                icon: 'ri-exchange-cny-line'
              }
            ]
          },
          {
            title: $localize`:@@production:Production`,
            rootPath: 'plan/production',
            subMenu: [
              {
                path: 'plan/production/est-annual-production',
                title: $localize`:@@estAnnualProduction:Estimated Annual Production`,
                icon: 'ri-folder-chart-line'
              },
              {
                path: 'plan/production/planned',
                title: $localize`:@@planedAnnualProduction:Planned Annual Production`,
                icon: 'ri-folder-chart-line'
              },
              {
                path: 'plan/production/five-year-plan',
                title: $localize`:@@fiveYearPlan:5-Year Plans`,
                icon: 'ri-folder-chart-line'
              },
            ]
          },
          {
            title: $localize`:@@estimatePlan:Estimate/Plan`,
            rootPath: 'plan/est-plan',
            subMenu: [
              {
                path: 'plan/est-plan/est-cost',
                title: $localize`:@@estimateCost:Estimated cost`,
                icon: 'ri-folder-chart-line'
              },
              {
                path: 'plan/est-plan/planned',
                title: $localize`:@@planedAnnualProduction:Budget & Procurement plan`,
                icon: 'ri-folder-chart-line'
              },
              {
                path: 'plan/est-plan/five-year-plan',
                title: $localize`:@@fiveYearPlan:Wet lease & Charter plan`,
                icon: 'ri-folder-chart-line'
              },
              {
                path: 'plan/est-plan/five-year-plan',
                title: $localize`:@@fiveYearPlan:Procurement tracking`,
                icon: 'ri-folder-chart-line'
              },
            ]
          }
        ]
      }]
  },
  {
    title: $localize`:@@reportManagement:Quản lý báo cáo`,
    rootPath: 'report',
    subMenu: [
      {
        path: 'report/report1',
        title: $localize`:@@budgetReport:Báo cáo ngân sách theo thị trường`,
        icon: 'ri-folder-chart-line',
        menu: []
      }
    ]
  },

  {
    title: $localize`:@@system:System`,
    rootPath: 'system',
    subMenu: [
      {
        path: '', title: '', icon: 'ri-calendar-schedule-line',
        menu: [
          {
            title: $localize`:@@rolesAccounts:Roles & Accounts`,
            rootPath: 'system/admin',
            subMenu: [
              {
                path: 'system/admin/users', title: $localize`:@@account:Account`, icon: 'ri-group-line'
              },
              {
                path: 'system/admin/roles', title: $localize`:@@role:Role`, icon: 'ri-calendar-schedule-line'
              },
              {
                path: 'system/admin/functions',
                title: $localize`:@@function:Function`,
                icon: 'ri-calendar-schedule-line'
              }
            ]
          },
          {
            title: $localize`:@@config:Config`,
            rootPath: 'system/config',
            subMenu: [
              {
                path: 'system/config/group-mail', title: $localize`:@@groupsMail:Groups mail`, icon: 'ri-mail-add-line'
              },
              {
                path: 'system/config/email-supplier',
                title: $localize`:@@emailSupplier:Email to Supplier`,
                icon: 'ri-mail-add-line'
              },
              {
                path: 'system/config/noti-warning',
                title: $localize`:@@noti:Notification/Warning`,
                icon: 'ri-mail-add-line'
              },
              {
                path: 'system/config/information-plane',
                title: $localize`:@@aircaft:Aircraft data`,
                icon: 'ri-mail-add-line'
              },
            ]
          },
          {
            title: $localize`:@@historyLog:History Log`,
            rootPath: 'system/history',
            subMenu: [
              {
                path: 'system/history/login', title: $localize`:@@loginHistory:Login History`, icon: 'ri-mail-add-line'
              },
              {
                path: 'system/history/email-noti',
                title: $localize`:@@emailNoti:Email & Notification History`,
                icon: 'ri-mail-add-line'
              },
              {
                path: 'system/history/data-sync',
                title: $localize`:@@dataSync:Data Sync History`,
                icon: 'ri-mail-add-line'
              },
            ]
          }]
      }]
  }];
