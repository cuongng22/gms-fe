export interface Menu {
  title: string;
  rootPath: string;
  subMenu: subMenu[];
  permissionCode: string[] | string;
}

export interface subMenu {
  path: string;
  title: string;
  icon: string;
  menu?: Menu[];
  permissionCode: string[] | string;
}

export const menu: Menu[] = [
  {
    title: $localize`:@@Dashboard:DASHBOARD`,
    rootPath: 'reports',
    permissionCode: [],
    subMenu: [{
      path: 'reports/dashboard',
      title: $localize`:@@dashBoard:Dashboard`,
      icon: 'ri-dashboard-3-line',
      permissionCode: []
    }],
  },
  {
    title: $localize`:@@category:CATEGORY`,
    rootPath: 'category',
    permissionCode: [
      'API_MARKET_FLIGHT_LIST',
      'API_HOTEL_LIST',
      'API_VEHICLES_LIST',
      'API_SERVICE_FEE_LIST',
      'API_CONTRACT_LIST',
      'API_CURRENCY_LIST',
      'API_CREW_FLIGHTS_OTHERS_LIST',
      'API_CREWS_LIST',
      'API_NATION_LIST'
    ],
    subMenu: [
      {
        path: 'category/flight-market',
        title: $localize`:@@airportCode:Airport code`,
        icon: 'ri-store-line',
        permissionCode: ['API_MARKET_FLIGHT_LIST']
      },
      {
        path: 'category/hotel',
        title: $localize`:@@hotels:Hotels`,
        icon: 'ri-hotel-bed-line',
        permissionCode: ['API_HOTEL_LIST']
      },
      {
        path: 'category/vehicle',
        title: $localize`:@@transporations:Transportations`,
        icon: 'ri-car-line',
        permissionCode: ['API_VEHICLES_LIST']
      },
      {
        path: 'category/cost',
        title: $localize`:@@costCategory:Cost category`,
        icon: 'ri-server-line',
        permissionCode: ['API_SERVICE_FEE_LIST']
      },
      {
        path: 'category/contract',
        title: $localize`:@@contract:Contract`,
        icon: 'ri-contract-line',
        permissionCode: ['API_CONTRACT_LIST']
      },
      {
        path: 'category/act-rate',
        title: $localize`:@@ActExchangeRate:Actual exchange rate`,
        icon: 'ri-exchange-cny-line',
        permissionCode: ['API_CURRENCY_LIST']
      },
      {
        path: 'category/other-crew',
        title: $localize`:@@flightCrew:Other crew`,
        icon: 'ri-id-card-line',
        permissionCode: ['API_CREW_FLIGHTS_OTHERS_LIST']
      },
      {
        path: 'category/crews',
        title: $localize`:@@crewList:Crew list`,
        icon: 'ri-id-card-line',
        permissionCode: ['API_CREWS_LIST']
      },
      {
        path: 'category/nation',
        title: $localize`:@@country:Countries`,
        icon: 'ri-global-line',
        permissionCode: ['API_NATION_LIST']
      },
    ],
  },
  {
    title: $localize`:@@flightSchedules:FLIGHT SCHEDULES`,
    rootPath: 'flight-schedules',
    permissionCode: [
      'API_SEASON_FLIGHT_LIST',
      'API_DAILY_FLIGHT_SCHEDULE_PLAN_LIST',
      'API_DAILY_FLIGHT_SCHEDULE_IN_MONTH_LIST',
      'API_EMAIL_LIST'
    ],
    subMenu: [
      {
        path: 'flight-schedules/seasonal',
        title: $localize`:@@seasonalSchedules:Seasonal Schedules`,
        icon: 'ri-calendar-schedule-line',
        permissionCode: ['API_SEASON_FLIGHT_LIST']
      },
      {
        path: '',
        title: $localize`:@@dailyFlightSchedule:Daily Flight Schedule1`,
        icon: 'ri-calendar-schedule-line',
        permissionCode: [
          'API_DAILY_FLIGHT_SCHEDULE_PLAN_LIST',
          'API_DAILY_FLIGHT_SCHEDULE_IN_MONTH_LIST',
          'API_EMAIL_LIST'
        ],
        menu: [
          {
            title: $localize`:@@dailyFlightSchedule:Daily Flight Schedule`,
            rootPath: '',
            permissionCode: [],
            subMenu: [
              {
                path: 'flight-schedules/daily',
                title: $localize`:@@flightList:Flight List`,
                icon: 'ri-calendar-schedule-line',
                permissionCode: [
                  'API_DAILY_FLIGHT_SCHEDULE_PLAN_LIST',
                  'API_DAILY_FLIGHT_SCHEDULE_IN_MONTH_LIST'
                ]
              },
              {
                path: 'flight-schedules/email-tracking',
                title: $localize`:@@emailTracking:Email Tracking`,
                icon: 'ri-calendar-schedule-line',
                permissionCode: ['API_EMAIL_LIST']
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: $localize`:@@hotelCarService:HOTEL & TRANSPORTATION SERVICE`,
    rootPath: 'service',
    permissionCode: [
      'API_AVES_ROOM_TRACKING_LIST',
      'API_ROOM_COST_LIST',
      'API_AVES_TRANSPORT_TRACKING_LIST',
      'API_CAR_COST_TRACKING_LIST'
    ],
    subMenu: [
      {
        path: '',
        title: '',
        icon: 'ri-calendar-schedule-line',
        permissionCode: [],
        menu: [
          {
            title: $localize`:@@hotelRoom:Hotel room`,
            rootPath: 'service/hotel',
            permissionCode: [
              'API_AVES_ROOM_TRACKING_LIST',
              'API_ROOM_COST_LIST'
            ],
            subMenu: [
              {
                path: 'service/hotel/room-booking',
                title: $localize`:@@roomBooking:Room booking`,
                icon: 'ri-exchange-cny-line',
                permissionCode: ['API_AVES_ROOM_TRACKING_LIST']
              },
              {
                path: 'service/hotel/cost-tracking',
                title: $localize`:@@plannedExchangeRate:Hotel cost tracking (AVES)`,
                icon: 'ri-exchange-cny-line',
                permissionCode: ['API_ROOM_COST_LIST']
              },
            ],
          },
          {
            title: $localize`:@@carRental:Transportations`,
            rootPath: 'service/car',
            permissionCode: [
              'API_AVES_TRANSPORT_TRACKING_LIST',
              'API_CAR_COST_TRACKING_LIST'
            ],
            subMenu: [
              {
                path: 'service/car/car-booking',
                title: $localize`:@@carBooking:Transportations booking`,
                icon: 'ri-folder-chart-line',
                permissionCode: ['API_AVES_TRANSPORT_TRACKING_LIST']
              },
              {
                path: 'service/car/cost-tracking',
                title: $localize`:@@carCostTracking:Transportations cost tracking (AVES)`,
                icon: 'ri-folder-chart-line',
                permissionCode: ['API_CAR_COST_TRACKING_LIST']
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
    permissionCode: [],
    subMenu: [
      {
        path: 'invoice/invoice-form-tab',
        title: $localize`:@@detailedStatment:Detailed statement`,
        icon: 'ri-calendar-line',
        permissionCode: ['API_INVOICE_FORM_LIST']
      },
      {
        path: 'invoice/invoice-document-tab',
        title: $localize`:@@invoice:Invoice`,
        icon: 'ri-folder-chart-line',
        permissionCode: ['API_INVOICE_DOCUMENT_LIST']
      },
      {
        path: 'invoice/invoice-actual-cost-tab',
        title: $localize`:@@actualExpenseTracking:Actual expense tracking`,
        icon: 'ri-shopping-cart-line',
        permissionCode: ['API_INVOICE_ACTUAL_COST_LIST']
      },
    ],
  },
  {
    title: $localize`:@@plan:Plan`,
    rootPath: 'plan',
    permissionCode: [
      'API_CURRENCY_UTH_LIST',
      'API_CURRENCY_LIST',
      'API_PRODUCTIVITY_LIST',
      'API_FIVE_YEAR_PLAN_LIST',
      'API_PLAN_BUDGET_PROCUREMENT_LIST',
      'API_WET_LEASE_LIST',
      'API_CHARTER_LIST',
      'API_PROCUREMENT_LIST'
    ],
    subMenu: [
      {
        path: '',
        title: '',
        icon: 'ri-calendar-schedule-line',
        permissionCode: [],
        menu: [
          {
            title: $localize`:@@rates:Exchange rate`,
            rootPath: 'plan/rate',
            permissionCode: [
              'API_CURRENCY_UTH_LIST',
              'API_CURRENCY_LIST'
            ],
            subMenu: [
              {
                path: 'plan/rate/uth',
                title: $localize`:@@estimatedExchangeRate:Estimated exchange rate`,
                icon: 'ri-exchange-cny-line',
                permissionCode: ['API_CURRENCY_UTH_LIST'],
              },
              {
                path: 'plan/rate/planned',
                title: $localize`:@@plannedExchangeRate:Planned exchange rate`,
                icon: 'ri-exchange-cny-line',
                permissionCode: ['API_CURRENCY_LIST']
              },
            ],
          },
          {
            title: $localize`:@@production:Production`,
            rootPath: 'plan/production',
            permissionCode: [
              'API_PRODUCTIVITY_LIST',
              'API_PRODUCTIVITY_LIST',
              'API_FIVE_YEAR_PLAN_LIST'
            ],
            subMenu: [
              {
                path: 'plan/production/est-annual-production',
                title: $localize`:@@estAnnualProduction:Estimated annual production`,
                icon: 'ri-folder-chart-line',
                permissionCode: ['API_PRODUCTIVITY_LIST']
              },
              {
                path: 'plan/production/planned',
                title: $localize`:@@planedAnnualProduction:Planned annual production`,
                icon: 'ri-folder-chart-line',
                permissionCode: ['API_PRODUCTIVITY_LIST']
              },
              {
                path: 'plan/production/five-year-plan',
                title: $localize`:@@fiveYearPlan:5-Year plans`,
                icon: 'ri-folder-chart-line',
                permissionCode: ['API_FIVE_YEAR_PLAN_LIST']
              },
            ],
          },
          {
            title: $localize`:@@estimatePlan:Estimate/Plan`,
            rootPath: 'plan/est-plan',
            permissionCode: [
              'API_PLAN_BUDGET_PROCUREMENT_LIST',
              'API_WET_LEASE_LIST',
              'API_CHARTER_LIST',
              'API_PROCUREMENT_LIST'
            ],
            subMenu: [
              {
                path: 'plan/est-plan/est-cost',
                title: $localize`:@@estimateCost:Estimated cost`,
                icon: 'ri-folder-chart-line',
                permissionCode: ['API_PLAN_BUDGET_PROCUREMENT_LIST']
              },
              {
                path: 'plan/est-plan/budget-procurement',
                title: $localize`:@@budgetProcurementPlan:Budget & Procurement plan`,
                icon: 'ri-folder-chart-line',
                permissionCode: ['API_PLAN_BUDGET_PROCUREMENT_LIST']
              },
              {
                path: 'plan/est-plan/wet-lease-charter',
                title: $localize`:@@wetLeaseCharter plan:Wet lease & Charter plan`,
                icon: 'ri-folder-chart-line',
                permissionCode: ['API_WET_LEASE_LIST', 'API_CHARTER_LIST']
              },
              {
                path: 'plan/est-plan/procurement-tracking',
                title: $localize`:@@fiveYearPlan:Procurement tracking`,
                icon: 'ri-folder-chart-line',
                permissionCode: ['API_PROCUREMENT_LIST']
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
    permissionCode: ['REPORT_1',
      'REPORT_2',
      'REPORT_3',
      'REPORT_4',
      'REPORT_5',
      'REPORT_6',
      'REPORT_7',
      'REPORT_8',
      'REPORT_9',
      'REPORT_10',
      'REPORT_11'],
    subMenu: [
      {
        path: 'reports/report1',
        title: $localize`:@@budgetReport:Actual vs. budgeted cost report`,
        icon: 'ri-folder-chart-line',
        permissionCode: ['REPORT_1'],
        menu: [],
      },
      {
        path: 'reports/report2',
        title: $localize`:@@budgetReport:Market cost report `,
        icon: 'ri-folder-chart-line',
        permissionCode: ['REPORT_2'],
        menu: [],
      },
      {
        path: 'reports/report3',
        title: $localize`:@@budgetReport:Room quantity report `,
        icon: 'ri-folder-chart-line',
        menu: [],
        permissionCode: ['REPORT_3']
      },
      {
        path: 'reports/report4',
        title: $localize`:@@budgetReport:Monthly performance report `,
        icon: 'ri-folder-chart-line',
        menu: [],
        permissionCode: ['REPORT_4']
      },
      {
        path: 'reports/report5',
        title: $localize`:@@budgetReport:Cost savings report `,
        icon: 'ri-folder-chart-line',
        menu: [],
        permissionCode: ['REPORT_5']
      },
      {
        path: 'reports/report6',
        title: $localize`:@@budgetReport:Accounts payable report `,
        icon: 'ri-folder-chart-line',
        menu: [],
        permissionCode: ['REPORT_6']
      },
      {
        path: 'reports/report7',
        title: $localize`:@@budgetReport:Quarterly cost report `,
        icon: 'ri-folder-chart-line',
        menu: [],
        permissionCode: ['REPORT_7']
      },
      {
        path: 'reports/report8',
        title: $localize`:@@budgetReport:Hotel room and cost report`,
        icon: 'ri-folder-chart-line',
        menu: [],
        permissionCode: ['REPORT_8']
      },
      {
        path: 'reports/report9',
        title: $localize`:@@budgetReport:Car usage and cost report `,
        icon: 'ri-folder-chart-line',
        menu: [],
        permissionCode: ['REPORT_9']
      },
      {
        path: 'reports/report10',
        title: $localize`:@@budgetReport:Cost planning - Actual report`,
        icon: 'ri-folder-chart-line',
        menu: [],
        permissionCode: ['REPORT_10']
      },
      {
        path: 'reports/report11',
        title: $localize`:@@budgetReport:Cost planning - Estimate cost report `,
        icon: 'ri-folder-chart-line',
        menu: [],
        permissionCode: ['REPORT_11']
      },
    ],
  },

  {
    title: $localize`:@@system:System`,
    rootPath: 'system',
    permissionCode: [],
    subMenu: [
      {
        path: '',
        title: '',
        icon: 'ri-calendar-schedule-line',
        permissionCode: [],
        menu: [
          {
            title: $localize`:@@rolesAccounts:Roles & Accounts`,
            rootPath: '',
            permissionCode: [
              'API_USER_GET_ALL_LIST',
              'API_ROLES_LIST',
              'API_FUNCTIONS_LIST'
            ],
            subMenu: [
              {
                path: 'system/admin/users',
                title: $localize`:@@accounts:Accounts`,
                icon: 'ri-calendar-schedule-line',
                permissionCode: ['API_USER_GET_ALL_LIST']
              },
              {
                path: 'system/admin/roles',
                title: $localize`:@@role:Role`,
                icon: 'ri-calendar-schedule-line',
                permissionCode: ['API_ROLES_LIST']
              },
              {
                path: 'system/admin/functions',
                title: $localize`:@@function:Function`,
                icon: 'ri-calendar-schedule-line',
                permissionCode: ['API_FUNCTIONS_LIST']
              },
            ],
          },
          {
            title: $localize`:@@config:Config`,
            rootPath: '',
            permissionCode: [
              'API_CREW_FLIGHTS_LIST',
              'API_OVERNIGHT_RATE_LIST',
              'API_GROUP_MAIL_LIST',
              'API_PAYMENT_MAIL_LIST',
              'API_EMAIL_CONFIG_LIST',
              'API_NOTI_CONFIG_LIST',
              'API_NOTI_SETUP_LIST',
              'API_PLANE_LIST'
            ],
            subMenu: [
              {
                path: 'system/config/flight-crew',
                title: $localize`:@@flightCrew:Flight crew`,
                icon: 'ri-id-card-line',
                permissionCode: ['API_CREW_FLIGHTS_LIST', 'API_OVERNIGHT_RATE_LIST']
              },
              {
                path: 'system/config/group-mail',
                title: $localize`:@@groupsMail:Groups mail`,
                icon: 'ri-mail-add-line',
                permissionCode: ['API_GROUP_MAIL_LIST', 'API_PAYMENT_MAIL_LIST']
              },
              {
                path: 'system/config/email-supplier',
                title: $localize`:@@emailSupplier:Email to supplier`,
                icon: 'ri-mail-add-line',
                permissionCode: ['API_EMAIL_CONFIG_LIST']
              },
              {
                path: 'system/config/noti-warning',
                title: $localize`:@@noti:Notification/Warning`,
                icon: 'ri-mail-add-line',
                permissionCode: ['API_NOTI_CONFIG_LIST', 'API_NOTI_SETUP_LIST']
              },
              {
                path: 'system/config/information-plane',
                title: $localize`:@@aircaft:Aircraft data`,
                icon: 'ri-mail-add-line',
                permissionCode: ['API_PLANE_LIST']
              },
            ],
          },
          {
            title: $localize`:@@historyLog:History Log`,
            rootPath: '',
            permissionCode: [
              'API_AUTHLOG_LIST',
              'API_EMAIL_HISTORY_LIST',
              'API_NOTIFICATION_LIST'
            ],
            subMenu: [
              {
                path: 'system/history/login',
                title: $localize`:@@loginHistory:Login History`,
                icon: 'ri-mail-add-line',
                permissionCode: ['API_AUTHLOG_LIST']
              },
              {
                path: 'system/history/email-noti',
                title: $localize`:@@emailNoti:Email & Notification History`,
                icon: 'ri-mail-add-line',
                permissionCode: ['API_EMAIL_HISTORY_LIST', 'API_NOTIFICATION_LIST']
              },
              // {
              // 	path: 'system/history/data-sync',
              // 	title: $localize`:@@dataSync:Data Sync History`,
              // 	icon: 'ri-mail-add-line',
              // 	permissionCode: []
              // },
            ],
          },
        ],
      },
    ],
  },
];
