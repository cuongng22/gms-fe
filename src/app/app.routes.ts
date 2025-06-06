import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from 'src/app/crew-trip/core/auth/forgot-password/forgot-password.component';
import { ProfileComponent } from 'src/app/crew-trip/core/auth/profile/profile.component';
import { ResetPasswordComponent } from 'src/app/crew-trip/core/auth/reset-password/reset-password.component';
import { SignInComponent } from 'src/app/crew-trip/core/auth/sign-in/sign-in.component';
import { AuthGuard } from 'src/app/crew-trip/core/guards/menu.guard';
import { RedirectGuard } from 'src/app/crew-trip/core/guards/redirect-guard';
import { CarBookingComponent } from 'src/app/crew-trip/features/car-room/car-booking/car-booking.component';
import { CarCostTrackingComponent } from 'src/app/crew-trip/features/car-room/car-cost-tracking/car-cost-tracking.component';
import { HotelCostTrackingContainerComponent } from 'src/app/crew-trip/features/car-room/hotel-cost-tracking-container/hotel-cost-tracking-container.component';
import { RoomBookingComponent } from 'src/app/crew-trip/features/car-room/room-booking/room-booking.component';
import { ActRateComponent } from 'src/app/crew-trip/features/category/act-rate/act-rate.component';
import { CrewsComponent } from 'src/app/crew-trip/features/category/crews/crews.component';
import { FlightCrewComponent } from 'src/app/crew-trip/features/category/flight-crew/flight-crew.component';
import { OtherCrewComponent } from 'src/app/crew-trip/features/category/flight-crew/other-crew/other-crew.component';
import { HotelComponent } from 'src/app/crew-trip/features/category/hotel/hotel.component';
import { NationComponent } from 'src/app/crew-trip/features/category/nation/nation.component';
import { ServiceFeeComponent } from 'src/app/crew-trip/features/category/service-fee/service-fee.component';
import { VehicleComponent } from 'src/app/crew-trip/features/category/vehicle/vehicle.component';
import { ContractDetailComponent } from 'src/app/crew-trip/features/contract/contract-detail/contract-detail.component';
import { ContractComponent } from 'src/app/crew-trip/features/contract/contract.component';
import { FirstPageComponent } from 'src/app/crew-trip/features/first-page/first-page.component';
import { FunctionsComponent } from 'src/app/crew-trip/features/functions/functions.component';
import { InvoiceActualCostTabComponent } from 'src/app/crew-trip/features/invoice/actual-cost/invoice-actual-cost-tab.component';
import { InvoiceDocumentTabComponent } from 'src/app/crew-trip/features/invoice/document/invoice-document-tab.component';
import { InvoiceFormTabComponent } from 'src/app/crew-trip/features/invoice/form/invoice-form-tab.component';
import { KeHoachComponent } from 'src/app/crew-trip/features/plan/ke-hoach/ke-hoach.component';
import { AnnualProductionComponent } from 'src/app/crew-trip/features/plan/production/annual-production/annual-production.component';
import { EstAnnualProductionComponent } from 'src/app/crew-trip/features/plan/production/est-annual-production/est-annual-production.component';
import { FiveYearPlanComponent } from 'src/app/crew-trip/features/plan/production/five-year-plan/five-year-plan.component';
import { RatePlannedComponent } from 'src/app/crew-trip/features/plan/rate-planned/rate-planned.component';
import { RateUthComponent } from 'src/app/crew-trip/features/plan/rate-uth/rate-uth.component';
import { WetLeaseDetailComponent } from 'src/app/crew-trip/features/plan/wet-lease-charter/wet-lease/wet-lease-detail/wet-lease-detail.component';
import { DashboardComponent } from 'src/app/crew-trip/features/reports/dashboard/dashboard.component';
import { Report11Component } from 'src/app/crew-trip/features/reports/report11/report11.component';
import { RolesComponent } from 'src/app/crew-trip/features/roles/roles.component';
import { AircraftDataComponent } from 'src/app/crew-trip/features/system/config/aircraft-data/aircraft-data.component';
import { EmailSupplierComponent } from 'src/app/crew-trip/features/system/config/email-supplier/email-supplier.component';
import { GroupMailComponent } from 'src/app/crew-trip/features/system/config/group-mail/group-mail.component';
import { NotificationComponent } from 'src/app/crew-trip/features/system/config/notification/notification.component';
import { UsersComponent } from 'src/app/crew-trip/features/system/users/users.component';
import { NotFoundComponent } from 'src/app/not-found/not-found.component';
import { FlightMarketDetailComponent } from './crew-trip/features/category/flight-market/flight-market-detail/flight-market-detail.component';
import { FlightMarketListComponent } from './crew-trip/features/category/flight-market/flight-market-list/flight-market-list.component';
import { FlightMarketComponent } from './crew-trip/features/category/flight-market/flight-market.component';
import { DailyFlightSchedulesComponent } from './crew-trip/features/flight-schedules/daily-flight-schedules/daily-flight-schedules.component';
import { OtherFlightScheduleComponent } from './crew-trip/features/flight-schedules/daily-flight-schedules/monthly-flight-schedule/other-flight-schedule/other-flight-schedule.component';
import { EmailTrackingComponent } from './crew-trip/features/flight-schedules/email-tracking/email-tracking.component';
import { SeasonalSchedulesComponent } from './crew-trip/features/flight-schedules/seasonal-schedules/seasonal-schedules.component';
import { BudgetProcurementListComponent } from './crew-trip/features/plan/budget-procurement/budget-procurement-list/budget-procurement-list.component';
import { BudgetProcurementSummaryDetailComponent } from './crew-trip/features/plan/budget-procurement/budget-procurement-summary/budget-procurement-summary-detail/budget-procurement-summary-detail.component';
import { BudgetProcurementSummaryComponent } from './crew-trip/features/plan/budget-procurement/budget-procurement-summary/budget-procurement-summary.component';
import { BudgetProcurementComponent } from './crew-trip/features/plan/budget-procurement/budget-procurement.component';
import { EstimatedCostListComponent } from './crew-trip/features/plan/estimated-cost/estimated-cost-list/estimated-cost-list.component';
import { EstimatedCostSummaryDetailComponent } from './crew-trip/features/plan/estimated-cost/estimated-cost-summary/estimated-cost-summary-detail/estimated-cost-summary-detail.component';
import { EstimatedCostSummaryComponent } from './crew-trip/features/plan/estimated-cost/estimated-cost-summary/estimated-cost-summary.component';
import { EstimatedCostComponent } from './crew-trip/features/plan/estimated-cost/estimated-cost.component';
import { CharterDetailComponent } from './crew-trip/features/plan/wet-lease-charter/charter/charter-detail/charter-detail.component';
import { WetLeaseCharterComponent } from './crew-trip/features/plan/wet-lease-charter/wet-lease-charter.component';
import { ProcurementTrackingDetailComponent } from './crew-trip/features/procurement-tracking/procurement-tracking-detail/procurement-tracking-detail.component';
import { ProcurementTrackingComponent } from './crew-trip/features/procurement-tracking/procurement-tracking.component';
import { reportcomponent } from './crew-trip/features/reports/report1/report1.component';
import { reportcomponent10 } from './crew-trip/features/reports/report10/report10.component';
import { reportcomponent2 } from './crew-trip/features/reports/report2/report2.component';
import { reportcomponent3 } from './crew-trip/features/reports/report3/report3.component';
import { reportcomponent4 } from './crew-trip/features/reports/report4/report4.component';
import { reportcomponent5 } from './crew-trip/features/reports/report5/report5.component';
import { reportcomponent6 } from './crew-trip/features/reports/report6/report6.component';
import { reportcomponent7 } from './crew-trip/features/reports/report7/report7.component';
import { reportcomponent8 } from './crew-trip/features/reports/report8/report8.component';
import { reportcomponent9 } from './crew-trip/features/reports/report9/report9.component';
import { EmailNotificationHistoryComponent } from './crew-trip/features/system/history/email-notification-history/email-notification-history.component';
import { LoginHistoryComponent } from './crew-trip/features/system/history/login-history/login-history.component';

export const routes: Routes = [
	{
		path: '',
		component: FirstPageComponent,
		canActivate: [RedirectGuard],
		// redirectTo: 'auth/login',
		// pathMatch: 'full',
	},
	{
		path: '',
		component: FirstPageComponent,
		canActivate: [AuthGuard],
		data: { permissionCodes: [] },
		children: [
			{ path: 'ke-hoach', component: KeHoachComponent },
			{ path: 'contract', component: ContractComponent },
			{
				path: 'system/admin',
				children: [
					{
						path: 'users',
						component: UsersComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_USER_GET_ALL_LIST'] },
					},
					{
						path: 'roles',
						component: RolesComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_ROLES_LIST'] },
					},
					{
						path: 'functions',
						component: FunctionsComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_FUNCTIONS_LIST'] },
					},
				],
			},
			{
				path: 'system/config',
				children: [
					{
						path: 'flight-crew',
						component: FlightCrewComponent,
						canActivate: [AuthGuard],
						data: {
							permissionCodes: [
								'API_CREW_FLIGHTS_LIST',
								'API_OVERNIGHT_RATE_LIST',
							],
						},
					},
					{
						path: 'group-mail',
						component: GroupMailComponent,
						canActivate: [AuthGuard],
						data: {
							permissionCodes: ['API_GROUP_MAIL_LIST', 'API_PAYMENT_MAIL_LIST'],
						},
					},
					{
						path: 'information-plane',
						component: AircraftDataComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_PLANE_LIST'] },
					},
					{
						path: 'email-supplier',
						component: EmailSupplierComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_EMAIL_CONFIG_LIST'] },
					},
					{
						path: 'noti-warning',
						component: NotificationComponent,
						canActivate: [AuthGuard],
						data: {
							permissionCodes: ['API_NOTI_CONFIG_LIST', 'API_NOTI_SETUP_LIST'],
						},
					},
				],
			},
			{
				path: 'system/history',
				children: [
					{
						path: 'login',
						component: LoginHistoryComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_AUTHLOG_LIST'] },
					},
					{
						path: 'email-noti',
						component: EmailNotificationHistoryComponent,
						canActivate: [AuthGuard],
						data: {
							permissionCodes: [
								'API_EMAIL_HISTORY_LIST',
								'API_NOTIFICATION_LIST',
							],
						},
					},
				],
			},
			{
				path: 'plan',
				children: [
					{
						path: 'est-plan',
						children: [
							{
								path: 'wet-lease-charter',
								children: [
									{
										path: '',
										component: WetLeaseCharterComponent,
										canActivate: [AuthGuard],
										data: {
											permissionCodes: [
												'API_WET_LEASE_LIST',
												'API_CHARTER_LIST',
											],
										},
									},
									{
										path: 'wet-lease-detail/:id',
										component: WetLeaseDetailComponent,
										canActivate: [AuthGuard],
										data: {
											permissionCodes: [
												'API_WET_LEASE_UPDATE',
												'API_WET_LEASE_DETAILS',
											],
										},
									},
									{
										path: 'wet-lease-detail',
										component: WetLeaseDetailComponent,
										canActivate: [AuthGuard],
										data: { permissionCodes: ['API_WET_LEASE_INSERT'] },
									},
									{
										path: 'charter-detail/:id',
										component: CharterDetailComponent,
										canActivate: [AuthGuard],
										data: {
											permissionCodes: [
												'API_CHARTER_DETAILS',
												'API_CHARTER_UPDATE',
											],
										},
									},
									{
										path: 'charter-detail',
										component: CharterDetailComponent,
										canActivate: [AuthGuard],
										data: { permissionCodes: ['API_CHARTER_INSERT'] },
									},
								],
							},
						],
					},
					{
						path: 'est-plan/procurement-tracking',
						children: [
							{
								path: '',
								component: ProcurementTrackingComponent,
								canActivate: [AuthGuard],
								data: { permissionCodes: ['API_PROCUREMENT_LIST'] },
							},
							{
								path: 'detail',
								component: ProcurementTrackingDetailComponent,
								canActivate: [AuthGuard],
								data: { permissionCodes: ['API_PROCUREMENT_INSERT'] },
							},
							{
								path: 'detail/:id',
								component: ProcurementTrackingDetailComponent,
								canActivate: [AuthGuard],
								data: {
									permissionCodes: [
										'API_PROCUREMENT_DETAILS',
										'API_PROCUREMENT_UPDATE',
									],
								},
							},
						],
					},
					{
						path: 'rate/uth',
						component: RateUthComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_CURRENCY_UTH_LIST'] },
					},
					{
						path: 'rate/planned',
						component: RatePlannedComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_CURRENCY_LIST'] },
					},
					{
						path: 'production/five-year-plan',
						component: FiveYearPlanComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_FIVE_YEAR_PLAN_LIST'] },
					},
					{
						path: 'production/est-annual-production',
						component: EstAnnualProductionComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_PRODUCTIVITY_LIST'] },
					},
					{
						path: 'production/planned',
						component: AnnualProductionComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_PRODUCTIVITY_LIST'] },
					},
					{
						path: 'est-plan/budget-procurement',
						component: BudgetProcurementComponent,
						children: [
							{
								path: '',
								component: BudgetProcurementListComponent,
								canActivate: [AuthGuard],
								data: {
									permissionCodes: ['API_PLAN_BUDGET_PROCUREMENT_LIST'],
								},
							},
							{
								path: ':id/summary',
								component: BudgetProcurementSummaryComponent,
								pathMatch: 'full',
								canActivate: [AuthGuard],
								data: {
									permissionCodes: [
										'API_PLAN_BUDGET_PROCUREMENT_SUMMARY_SEARCH_INSERT',
									],
								},
							},
							{
								path: ':plan-budget-procurement-id/summary/:id/detail',
								component: BudgetProcurementSummaryDetailComponent,
								canActivate: [AuthGuard],
								data: {
									permissionCodes: [
										'API_PLAN_BUDGET_PROCUREMENT_SUMMARY_DETAILS',
									],
								},
							},
						],
					},
					{
						path: 'est-plan/est-cost',
						component: EstimatedCostComponent,
						children: [
							{
								path: '',
								component: EstimatedCostListComponent,
								canActivate: [AuthGuard],
								data: {
									permissionCodes: ['API_PLAN_BUDGET_PROCUREMENT_LIST'],
								},
							},
							{
								path: ':id/summary',
								component: EstimatedCostSummaryComponent,
								pathMatch: 'full',
								canActivate: [AuthGuard],
								data: {
									permissionCodes: [
										'API_PLAN_BUDGET_PROCUREMENT_SUMMARY_SEARCH_INSERT',
									],
								},
							},
							{
								path: ':est-cost-id/summary/:id/detail',
								component: EstimatedCostSummaryDetailComponent,
								canActivate: [AuthGuard],
								data: {
									permissionCodes: [
										'API_PLAN_BUDGET_PROCUREMENT_SUMMARY_DETAILS',
									],
								},
							},
						],
					},
				],
			},
			{
				path: 'category',
				children: [
					{
						path: 'vehicle',
						component: VehicleComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_VEHICLES_LIST'] },
					},
					{
						path: 'contract',
						component: ContractComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_CONTRACT_LIST'] },
					},
					{
						path: 'contract/annex',
						component: ContractComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_CONTRACT_LIST'] },
					},
					{
						path: 'contract/detail',
						component: ContractDetailComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_CONTRACT_LIST'] },
					},
					{
						path: 'act-rate',
						component: ActRateComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_CURRENCY_LIST'] },
					},
					{ path: 'hotel', component: HotelComponent },
					{ path: 'nation', component: NationComponent },
					{
						path: 'cost',
						component: ServiceFeeComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_SERVICE_FEE_LIST'] },
					},
					{
						path: 'crews',
						component: CrewsComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_CREWS_LIST'] },
					},
					{
						path: 'other-crew',
						component: OtherCrewComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_CREW_FLIGHTS_OTHERS_LIST'] },
					},
					{ path: 'vehicle', component: VehicleComponent },
					{
						path: 'hotel',
						component: HotelComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_HOTEL_LIST'] },
					},
					{
						path: 'nation',
						component: NationComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_NATION_LIST'] },
					},
					// {
					// 	path: 'crews',
					// 	component: CrewsComponent,
					// 	children: [
					// 		{ path: '', component: CrewsComponent },
					// 		{ path: 'detail', component: CrewsDetailComponent },
					// 	],
					// },
					// { path: 'autocomplete', component: AutocompleteComponent },
					{
						path: 'flight-market',
						component: FlightMarketComponent,
						children: [
							{
								path: '',
								component: FlightMarketListComponent,
								canActivate: [AuthGuard],
								data: { permissionCodes: ['API_MARKET_FLIGHT_LIST'] },
							},
							{
								path: 'detail',
								component: FlightMarketDetailComponent,
								canActivate: [AuthGuard],
								data: { permissionCodes: ['API_MARKET_FLIGHT_INSERT'] },
							},
							{
								path: 'detail/:id',
								component: FlightMarketDetailComponent,
								canActivate: [AuthGuard],
								data: {
									permissionCodes: [
										'API_MARKET_FLIGHT_DETAILS',
										'API_MARKET_FLIGHT_UPDATE',
									],
								},
							},
						],
					},
				],
			},
			{
				path: 'flight-schedules',
				children: [
					{
						path: 'seasonal',
						component: SeasonalSchedulesComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_SEASON_FLIGHT_LIST'] },
					},
					{
						path: 'daily',
						children: [
							{
								path: '',
								component: DailyFlightSchedulesComponent,
								data: {
									permissionCodes: [
										'API_DAILY_FLIGHT_SCHEDULE_PLAN_LIST',
										'API_DAILY_FLIGHT_SCHEDULE_IN_MONTH_LIST',
									],
								},
							},
							{
								path: 'other',
								component: OtherFlightScheduleComponent,
								data: {
									permissionCodes: [
										'API_DAILY_FLIGHT_SCHEDULE_LIST_EXTRA_CREWS_LIST',
									],
								},
							},
						],
					},
					{
						path: 'email-tracking',
						component: EmailTrackingComponent,
						canActivate: [AuthGuard],
						data: {
							permissionCodes: ['API_EMAIL_LIST'],
						},
					},
				],
			},
			{
				path: 'invoice',
				children: [
					{
						path: 'invoice-form-tab',
						component: InvoiceFormTabComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_INVOICE_FORM_LIST'] },
					},
					{
						path: 'invoice-document-tab',
						component: InvoiceDocumentTabComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_INVOICE_DOCUMENT_LIST'] },
					},
					{
						path: 'invoice-actual-cost-tab',
						component: InvoiceActualCostTabComponent,
						canActivate: [AuthGuard],
						data: { permissionCodes: ['API_INVOICE_ACTUAL_COST_LIST'] },
					},
				],
			},
			{
				path: 'reports',
				children: [
					{ path: 'report1', component: reportcomponent },
					{ path: 'report2', component: reportcomponent2 },
					{ path: 'report3', component: reportcomponent3 },
					{ path: 'report4', component: reportcomponent4 },
					{ path: 'report5', component: reportcomponent5 },
					{ path: 'report6', component: reportcomponent6 },
					{ path: 'report7', component: reportcomponent7 },
					{ path: 'report8', component: reportcomponent8 },
					{ path: 'report9', component: reportcomponent9 },
					{ path: 'report10', component: reportcomponent10 },
					{ path: 'report11', component: Report11Component },
					{ path: 'dashboard', component: DashboardComponent },
				],
			},
			{ path: 'profile', component: ProfileComponent },
			{
				path: 'service',
				children: [
					{
						path: 'hotel/cost-tracking',
						component: HotelCostTrackingContainerComponent,
						canActivate: [AuthGuard],
						data: {
							permissionCodes: ['API_ROOM_COST_LIST'],
						},
					},
					{
						path: 'hotel/room-booking',
						component: RoomBookingComponent,
						canActivate: [AuthGuard],
						data: {
							permissionCodes: ['API_AVES_ROOM_TRACKING_LIST'],
						},
					},
					{
						path: 'car/cost-tracking',
						component: CarCostTrackingComponent,
						canActivate: [AuthGuard],
						data: {
							permissionCodes: ['API_CAR_COST_TRACKING_LIST'],
						},
					},
					{
						path: 'car/car-booking',
						component: CarBookingComponent,
						canActivate: [AuthGuard],
						data: {
							permissionCodes: ['API_AVES_TRANSPORT_TRACKING_LIST'],
						},
					},
				],
			},
		],
	},
	{
		path: 'auth',
		children: [
			{ path: 'login', component: SignInComponent },
			{ path: 'forgot-password', component: ForgotPasswordComponent },
			{ path: 'reset-password', component: ResetPasswordComponent },
		],
	},

	{ path: '**', component: NotFoundComponent },
];
