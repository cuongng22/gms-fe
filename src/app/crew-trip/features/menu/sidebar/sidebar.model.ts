export interface Menu {
	title: string;
	rootPath: string;
	subMenu: subMenu[];
	roleCode?: string[];
}

export interface subMenu {
	path: string;
	title: string;
	icon: string;
	menu?: Menu[];
	roleCode?: string[];
}

export const menu: Menu[] = [
	{
		title: $localize`:@@Dashboard:DASHBOARD`,
		rootPath: 'dashboard',
		subMenu: [],
		roleCode: []
	},
	{
		title: $localize`:@@category:CATEGORY`,
		rootPath: 'category',
		roleCode: ['API_MARKET_FLIGHT_LIST'],
		subMenu: [
			{
				path: 'category/flight-market',
				title: $localize`:@@airportCode:Airport code`,
				icon: 'ri-store-line',
				roleCode: ['API_MARKET_FLIGHT_LIST']
			},
			{
				path: 'category/hotel',
				title: $localize`:@@hotels:Hotels`,
				icon: 'ri-hotel-bed-line',
				roleCode: ['API_HOTEL_LIST']
			},
			{
				path: 'category/vehicle',
				title: $localize`:@@transporations:Transportations`,
				icon: 'ri-car-line',
				roleCode: ['API_VEHICLES_LIST']
			},
			{
				path: 'category/cost',
				title: $localize`:@@costCategory:Cost category`,
				icon: 'ri-server-line',
				roleCode: ['API_SERVICE_FEE_LIST']
			},
			{
				path: 'category/contract',
				title: $localize`:@@contract:Contract`,
				icon: 'ri-contract-line',
				roleCode: ['API_CONTRACT_LIST']
			},
			{
				path: 'category/act-rate',
				title: $localize`:@@ActExchangeRate:Actual exchange rate`,
				icon: 'ri-exchange-cny-line',
				roleCode: ['API_CURRENCY_LIST']
			},
			{
				path: 'category/other-crew',
				title: $localize`:@@flightCrew:Other crew`,
				icon: 'ri-id-card-line',
				roleCode: ['API_CREW_FLIGHTS_OTHERS_LIST']
			},
			{
				path: 'category/crews',
				title: $localize`:@@crewList:Crew list`,
				icon: 'ri-id-card-line',
				roleCode: ['API_CREWS_LIST']
			},
			{
				path: 'category/nation',
				title: $localize`:@@country:Countries`,
				icon: 'ri-global-line',
				roleCode: ['API_NATION_LIST']
			},
		],
	},
	{
		title: $localize`:@@flightSchedules:FLIGHT SCHEDULES`,
		rootPath: 'flight-schedules',
		roleCode: ['API_DAILY_FLIGHT_SCHEDULE_FLIGHTS_LIST_LIST'],
		subMenu: [
			{
				path: 'flight-schedules/seasonal',
				title: $localize`:@@seasonalSchedules:Seasonal Schedules`,
				icon: 'ri-calendar-schedule-line',
				roleCode: []
			},
			{
				path: '',
				title: $localize`:@@dailyFlightSchedule:Daily Flight Schedule`,
				icon: 'ri-calendar-schedule-line',
				roleCode: ['API_DAILY_FLIGHT_SCHEDULE_FLIGHTS_LIST_LIST'],
				menu: [
					{
						title: $localize`:@@dailyFlightSchedule:Daily Flight Schedule`,
						rootPath: '',
						roleCode: [],
						subMenu: [
							{
								path: 'flight-schedules/daily',
								title: $localize`:@@flightList:Flight List`,
								icon: 'ri-calendar-schedule-line',
								roleCode: []
							},
							{
								path: 'flight-schedules/email-tracking',
								title: $localize`:@@emailTracking:Email Tracking`,
								icon: 'ri-calendar-schedule-line',
								roleCode: []
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
		roleCode: [],
		subMenu: [
			{
				path: '',
				title: '',
				icon: 'ri-calendar-schedule-line',
				roleCode: [],
				menu: [
					{
						title: $localize`:@@hotelRoom:Hotel room`,
						rootPath: 'service/hotel',
						roleCode: [],
						subMenu: [
							{
								path: 'service/hotel/room-booking',
								title: $localize`:@@roomBooking:Room booking`,
								icon: 'ri-exchange-cny-line',
								roleCode: []
							},
							{
								path: 'service/hotel/cost-tracking',
								title: $localize`:@@plannedExchangeRate:Hotel cost tracking (AVES)`,
								icon: 'ri-exchange-cny-line',
								roleCode: []
							},
						],
					},
					{
						title: $localize`:@@carRental:Transportations`,
						rootPath: 'service/car',
						roleCode: [],
						subMenu: [
							{
								path: 'service/car/car-booking',
								title: $localize`:@@carBooking:Transportations booking`,
								icon: 'ri-folder-chart-line',
								roleCode: []
							},
							{
								path: 'service/car/cost-tracking',
								title: $localize`:@@carCostTracking:Transportations cost tracking (AVES)`,
								icon: 'ri-folder-chart-line',
								roleCode: []
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
		roleCode: [],
		subMenu: [
			{
				path: 'invoice/invoice-form-tab',
				title: $localize`:@@detailedStatment:Detailed statement`,
				icon: 'ri-calendar-line',
				roleCode: []
			},
			{
				path: 'invoice/invoice-document-tab',
				title: $localize`:@@invoice:Invoice`,
				icon: 'ri-folder-chart-line',
				roleCode: []
			},
			{
				path: 'invoice/invoice-actual-cost-tab',
				title: $localize`:@@actualExpenseTracking:Actual expense tracking`,
				icon: 'ri-shopping-cart-line',
				roleCode: []
			},
		],
	},
	{
		title: $localize`:@@plan:Plan`,
		rootPath: 'plan',
		roleCode: [],
		subMenu: [
			{
				path: '',
				title: '',
				icon: 'ri-calendar-schedule-line',
				roleCode: [],
				menu: [
					{
						title: $localize`:@@rates:Exchange rate`,
						rootPath: 'plan/rate',
						roleCode: [],
						subMenu: [
							{
								path: 'plan/rate/uth',
								title: $localize`:@@estimatedExchangeRate:Estimated exchange rate`,
								icon: 'ri-exchange-cny-line',
								roleCode: [],
							},
							{
								path: 'plan/rate/planned',
								title: $localize`:@@plannedExchangeRate:Planned exchange rate`,
								icon: 'ri-exchange-cny-line',
								roleCode: []
							},
						],
					},
					{
						title: $localize`:@@production:Production`,
						rootPath: 'plan/production',
						roleCode: [],
						subMenu: [
							{
								path: 'plan/production/est-annual-production',
								title: $localize`:@@estAnnualProduction:Estimated annual production`,
								icon: 'ri-folder-chart-line',
								roleCode: []
							},
							{
								path: 'plan/production/planned',
								title: $localize`:@@planedAnnualProduction:Planned annual production`,
								icon: 'ri-folder-chart-line',
								roleCode: []
							},
							{
								path: 'plan/production/five-year-plan',
								title: $localize`:@@fiveYearPlan:5-Year plans`,
								icon: 'ri-folder-chart-line',
								roleCode: []
							},
						],
					},
					{
						title: $localize`:@@estimatePlan:Estimate/Plan`,
						rootPath: 'plan/est-plan',
						roleCode: [],
						subMenu: [
							{
								path: 'plan/est-plan/est-cost',
								title: $localize`:@@estimateCost:Estimated cost`,
								icon: 'ri-folder-chart-line',
								roleCode: []
							},
							{
								path: 'plan/est-plan/budget-procurement',
								title: $localize`:@@budgetProcurementPlan:Budget & Procurement plan`,
								icon: 'ri-folder-chart-line',
								roleCode: []
							},
							{
								path: 'plan/est-plan/wet-lease-charter',
								title: $localize`:@@wetLeaseCharter plan:Wet lease & Charter plan`,
								icon: 'ri-folder-chart-line',
								roleCode: []
							},
							{
								path: 'plan/est-plan/procurement-tracking',
								title: $localize`:@@fiveYearPlan:Procurement tracking`,
								icon: 'ri-folder-chart-line',
								roleCode: []
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
		roleCode: [],
		subMenu: [
			{
				path: 'reports/report1',
				title: $localize`:@@budgetReport:Actual vs. budgeted cost report`,
				icon: 'ri-folder-chart-line',
				roleCode: [],
				menu: [],
			},
			{
				path: 'reports/report2',
				title: $localize`:@@budgetReport:Market cost report `,
				icon: 'ri-folder-chart-line',
				roleCode: [],
				menu: [],
			},
			{
				path: 'reports/report3',
				title: $localize`:@@budgetReport:Room quantity report `,
				icon: 'ri-folder-chart-line',
				menu: [],
				roleCode: []
			},
			{
				path: 'reports/report4',
				title: $localize`:@@budgetReport:Monthly performance report `,
				icon: 'ri-folder-chart-line',
				menu: [],
				roleCode: []
			},
			{
				path: 'reports/report5',
				title: $localize`:@@budgetReport:Cost savings report `,
				icon: 'ri-folder-chart-line',
				menu: [],
				roleCode: []
			},
			{
				path: 'reports/report6',
				title: $localize`:@@budgetReport:Accounts payable report `,
				icon: 'ri-folder-chart-line',
				menu: [],
				roleCode: []
			},
			{
				path: 'reports/report7',
				title: $localize`:@@budgetReport:Quarterly cost report `,
				icon: 'ri-folder-chart-line',
				menu: [],
				roleCode: []
			},
			{
				path: 'reports/report8',
				title: $localize`:@@budgetReport:Hotel room and cost report`,
				icon: 'ri-folder-chart-line',
				menu: [],
				roleCode: []
			},
			{
				path: 'reports/report9',
				title: $localize`:@@budgetReport:Car usage and cost report `,
				icon: 'ri-folder-chart-line',
				menu: [],
				roleCode: []
			},
			{
				path: 'reports/report10',
				title: $localize`:@@budgetReport:Cost planning report `,
				icon: 'ri-folder-chart-line',
				menu: [],
				roleCode: []
			},
		],
	},

	{
		title: $localize`:@@system:System`,
		rootPath: 'system',
		roleCode: [],
		subMenu: [
			{
				path: '',
				title: '',
				icon: 'ri-calendar-schedule-line',
				roleCode: [],
				menu: [
					{
						title: $localize`:@@rolesAccounts:Roles & Accounts`,
						rootPath: '',
						roleCode: [],
						subMenu: [
							{
								path: 'system/admin/users',
								title: $localize`:@@accounts:Accounts`,
								icon: 'ri-calendar-schedule-line',
								roleCode: []
							},
							{
								path: 'system/admin/roles',
								title: $localize`:@@role:Role`,
								icon: 'ri-calendar-schedule-line',
								roleCode: []
							},
							{
								path: 'system/admin/functions',
								title: $localize`:@@function:Function`,
								icon: 'ri-calendar-schedule-line',
								roleCode: []
							},
						],
					},
					{
						title: $localize`:@@config:Config`,
						rootPath: '',
						roleCode: [],
						subMenu: [
							{
								path: 'system/config/flight-crew',
								title: $localize`:@@flightCrew:Flight crew`,
								icon: 'ri-id-card-line',
								roleCode: []
							},
							{
								path: 'system/config/group-mail',
								title: $localize`:@@groupsMail:Groups mail`,
								icon: 'ri-mail-add-line',
								roleCode: []
							},
							{
								path: 'system/config/email-supplier',
								title: $localize`:@@emailSupplier:Email to supplier`,
								icon: 'ri-mail-add-line',
								roleCode: []
							},
							{
								path: 'system/config/noti-warning',
								title: $localize`:@@noti:Notification/Warning`,
								icon: 'ri-mail-add-line',
								roleCode: []
							},
							{
								path: 'system/config/information-plane',
								title: $localize`:@@aircaft:Aircraft data`,
								icon: 'ri-mail-add-line',
								roleCode: []
							},
						],
					},
					{
						title: $localize`:@@historyLog:History Log`,
						rootPath: '',
						roleCode: [],
						subMenu: [
							{
								path: 'system/history/login',
								title: $localize`:@@loginHistory:Login History`,
								icon: 'ri-mail-add-line',
								roleCode: []
							},
							{
								path: 'system/history/email-noti',
								title: $localize`:@@emailNoti:Email & Notification History`,
								icon: 'ri-mail-add-line',
								roleCode: []
							},
							// {
							// 	path: 'system/history/data-sync',
							// 	title: $localize`:@@dataSync:Data Sync History`,
							// 	icon: 'ri-mail-add-line',
							// 	roleCode: []
							// },
						],
					},
				],
			},
		],
	},
];
