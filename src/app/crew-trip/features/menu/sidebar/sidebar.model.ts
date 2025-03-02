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
    subMenu: [],
  },
  {
    title: $localize`:@@category:CATEGORY`,
    rootPath: 'category',
    subMenu: [
      {
        path: 'category/flight-market',
        title: $localize`:@@airportCode:Airport code`,
        icon: 'ri-store-line',
      },
      {
        path: 'category/hotel',
        title: $localize`:@@hotels:Hotels`,
        icon: 'ri-hotel-bed-line',
      },
      {
        path: 'category/vehicle',
        title: $localize`:@@transporations:Transportations`,
        icon: 'ri-car-line',
      },
      {
        path: 'category/cost',
        title: $localize`:@@costCategory:Cost category`,
        icon: 'ri-server-line',
      },
      {
        path: 'category/contract',
        title: $localize`:@@contract:Contract`,
        icon: 'ri-contract-line',
      },
      {
        path: 'category/act-rate',
        title: $localize`:@@ActExchangeRate:Actual exchange rate`,
        icon: 'ri-exchange-cny-line',
      },
      {
        path: 'category/flight-crew',
        title: $localize`:@@flightCrew:Flight Crew`,
        icon: 'ri-id-card-line',
      },
      {
        path: 'category/crews',
        title: $localize`:@@crewList:Crew list`,
        icon: 'ri-id-card-line',
      },
      {
        path: 'category/nation',
        title: $localize`:@@country:Countries`,
        icon: 'ri-global-line',
      },
    ],
  },
  {
    title: $localize`:@@flightSchedules:FLIGHT SCHEDULES`,
    rootPath: 'flight-schedules',
    subMenu: [
      {
        path: 'flight-schedules/seasonal',
        title: $localize`:@@seasonalSchedules:Seasonal Schedules`,
        icon: 'ri-calendar-schedule-line',
      },
      {
        path: 'flight-schedules/daily',
        title: $localize`:@@dailyFlightSchedule:Daily Flight Schedule`,
        icon: 'ri-calendar-schedule-line',
      },
      {
        path: 'flight-schedules/email-tracking',
        title: $localize`:@@emailTracking:Email Tracking`,
        icon: 'ri-calendar-schedule-line'
      }
    ]
  },
  {
    title: $localize`:@@hotelCarService:Accommodation Service`,
    rootPath: 'service',
    subMenu: [
      {
        path: '',
        title: '',
        icon: 'ri-calendar-schedule-line',
        menu: [
          {
            title: $localize`:@@hotelRoom:Hotel room`,
            rootPath: 'service/hotel',
            subMenu: [
              {
                path: 'service/hotel/room-booking',
                title: $localize`:@@roomBooking:Room booking`,
                icon: 'ri-exchange-cny-line',
              },
              {
                path: 'service/hotel/cost-tracking',
                title: $localize`:@@plannedExchangeRate:Hotel cost tracking(AVES)`,
                icon: 'ri-exchange-cny-line',
              },
            ],
          },
          {
            title: $localize`:@@carRental:Transportations`,
            rootPath: 'service/car',
            subMenu: [
              {
                path: 'service/car/car-booking',
                title: $localize`:@@carBooking:Transportations booking`,
                icon: 'ri-folder-chart-line',
              },
              {
                path: 'service/car/cost-tracking',
                title: $localize`:@@carCostTracking:Transportations cost tracking(AVES)`,
                icon: 'ri-folder-chart-line',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: $localize`:@@invoice:INVOICE`,
    rootPath: 'invoice',
    subMenu: [
      {
        path: 'invoice/invoice-form-tab',
        title: $localize`:@@detailedStatment:Detailed statement`,
        icon: 'ri-calendar-line',
      },
      {
        path: 'invoice/invoice-document-tab',
        title: $localize`:@@invoice:Invoice`,
        icon: 'ri-folder-chart-line',
      },
      {
        path: 'invoice/invoice-actual-cost-tab',
        title: $localize`:@@actualExpenseTracking:Actual expense tracking`,
        icon: 'ri-shopping-cart-line',
      },
    ],
  },
  {
    title: $localize`:@@plan:Plan`,
    rootPath: 'plan',
    subMenu: [
      {
        path: '',
        title: '',
        icon: 'ri-calendar-schedule-line',
        menu: [
          {
            title: $localize`:@@rates:Exchange rate`,
            rootPath: 'plan/rate',
            subMenu: [
              {
                path: 'plan/rate/uth',
                title: $localize`:@@estimatedExchangeRate:Estimated exchange rate`,
                icon: 'ri-exchange-cny-line',
              },
              {
                path: 'plan/rate/planned',
                title: $localize`:@@plannedExchangeRate:Planned exchange rate`,
                icon: 'ri-exchange-cny-line',
              },
            ],
          },
          {
            title: $localize`:@@production:Production`,
            rootPath: 'plan/production',
            subMenu: [
              {
                path: 'plan/production/est-annual-production',
                title: $localize`:@@estAnnualProduction:Estimated annual production`,
                icon: 'ri-folder-chart-line',
              },
              {
                path: 'plan/production/planned',
                title: $localize`:@@planedAnnualProduction:Planned annual production`,
                icon: 'ri-folder-chart-line',
              },
              {
                path: 'plan/production/five-year-plan',
                title: $localize`:@@fiveYearPlan:5-Year plans`,
                icon: 'ri-folder-chart-line',
              },
            ],
          },
          {
            title: $localize`:@@estimatePlan:Estimate/Plan`,
            rootPath: 'plan/est-plan',
            subMenu: [
              {
                path: 'plan/est-plan/est-cost',
                title: $localize`:@@estimateCost:Estimated cost`,
                icon: 'ri-folder-chart-line',
              },
              {
                path: 'plan/est-plan/budget-procurement',
                title: $localize`:@@budgetProcurementPlan:Budget & Procurement plan`,
                icon: 'ri-folder-chart-line',
              },
              {
                path: 'plan/est-plan/wet-lease-charter',
                title: $localize`:@@wetLeaseCharter plan:Wet lease & Charter plan`,
                icon: 'ri-folder-chart-line',
              },
              {
                path: 'plan/est-plan/procurement-tracking',
                title: $localize`:@@fiveYearPlan:Procurement tracking`,
                icon: 'ri-folder-chart-line',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: $localize`:@@reportManagement:REPORTS`,
    rootPath: 'reports',
    subMenu: [
      {
        path: 'reports/report1',
        title: $localize`:@@budgetReport:Actual vs. budgeted cost report`,
        icon: 'ri-folder-chart-line',
        menu: [],
      },
      {
        path: 'reports/report2',
        title: $localize`:@@budgetReport:Market cost report `,
        icon: 'ri-folder-chart-line',
        menu: [],
      },
      {
        path: 'reports/report3',
        title: $localize`:@@budgetReport:Room quantity report `,
        icon: 'ri-folder-chart-line',
        menu: [],
      },
      {
        path: 'reports/report4',
        title: $localize`:@@budgetReport:Monthly performance report `,
        icon: 'ri-folder-chart-line',
        menu: [],
      },
      {
        path: 'reports/report5',
        title: $localize`:@@budgetReport:Cost savings report `,
        icon: 'ri-folder-chart-line',
        menu: [],
      },
      {
        path: 'reports/report6',
        title: $localize`:@@budgetReport:Accounts payable report `,
        icon: 'ri-folder-chart-line',
        menu: [],
      },
      {
        path: 'reports/report7',
        title: $localize`:@@budgetReport:Quarterly cost report `,
        icon: 'ri-folder-chart-line',
        menu: [],
      },
      {
        path: 'reports/report8',
        title: $localize`:@@budgetReport:Hotel room and cost report`,
        icon: 'ri-folder-chart-line',
        menu: [],
      },
      {
        path: 'reports/report9',
        title: $localize`:@@budgetReport:Car usage and cost report `,
        icon: 'ri-folder-chart-line',
        menu: [],
      },
      {
        path: 'reports/report10',
        title: $localize`:@@budgetReport:Cost planning report `,
        icon: 'ri-folder-chart-line',
        menu: [],
      },
    ],
  },

  {
    title: $localize`:@@system:System`,
    rootPath: 'system',
    subMenu: [
      {
        path: '',
        title: '',
        icon: 'ri-calendar-schedule-line',
        menu: [
          {
            title: $localize`:@@rolesAccounts:Roles & Accounts`,
            rootPath: '',
            subMenu: [
              {
                path: 'system/admin/users',
                title: $localize`:@@accounts:Accounts`,
                icon: 'ri-group-line',
              },
              {
                path: 'system/admin/roles',
                title: $localize`:@@role:Role`,
                icon: 'ri-calendar-schedule-line',
              },
              {
                path: 'system/admin/functions',
                title: $localize`:@@function:Function`,
                icon: 'ri-calendar-schedule-line',
              },
            ],
          },
          {
            title: $localize`:@@config:Config`,
            rootPath: '',
            subMenu: [
              {
                path: 'system/config/group-mail',
                title: $localize`:@@groupsMail:Groups mail`,
                icon: 'ri-mail-add-line',
              },
              {
                path: 'system/config/email-supplier',
                title: $localize`:@@emailSupplier:Email to supplier`,
                icon: 'ri-mail-add-line',
              },
              {
                path: 'system/config/noti-warning',
                title: $localize`:@@noti:Notification/Warning`,
                icon: 'ri-mail-add-line',
              },
              {
                path: 'system/config/information-plane',
                title: $localize`:@@aircaft:Aircraft data`,
                icon: 'ri-mail-add-line',
              },
            ],
          },
          {
            title: $localize`:@@historyLog:History Log`,
            rootPath: '',
            subMenu: [
              {
                path: 'system/history/login',
                title: $localize`:@@loginHistory:Login History`,
                icon: 'ri-mail-add-line',
              },
              {
                path: 'system/history/email-noti',
                title: $localize`:@@emailNoti:Email & Notification History`,
                icon: 'ri-mail-add-line',
              },
              {
                path: 'system/history/data-sync',
                title: $localize`:@@dataSync:Data Sync History`,
                icon: 'ri-mail-add-line',
              },
            ],
          },
        ],
      },
    ],
  },
];
