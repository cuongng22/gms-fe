import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from 'src/app/crew-trip/core/auth/forgot-password/forgot-password.component';
import { ProfileComponent } from 'src/app/crew-trip/core/auth/profile/profile.component';
import { ResetPasswordComponent } from 'src/app/crew-trip/core/auth/reset-password/reset-password.component';
import { SignInComponent } from 'src/app/crew-trip/core/auth/sign-in/sign-in.component';
import { AuthGuard } from 'src/app/crew-trip/core/guards/menu.guard';
import { RedirectGuard } from 'src/app/crew-trip/core/guards/redirect-guard';
import { CarCostTrackingComponent } from 'src/app/crew-trip/features/car-room/car-cost-tracking/car-cost-tracking.component';
import { HotelCostTrackingContainerComponent } from 'src/app/crew-trip/features/car-room/hotel-cost-tracking-container/hotel-cost-tracking-container.component';
import { RoomBookingComponent } from 'src/app/crew-trip/features/car-room/room-booking/room-booking.component';
import { ActRateComponent } from 'src/app/crew-trip/features/category/act-rate/act-rate.component';
import { CrewsComponent } from 'src/app/crew-trip/features/category/crews/crews.component';
import { FlightCrewComponent } from 'src/app/crew-trip/features/category/flight-crew/flight-crew.component';
import { HotelComponent } from 'src/app/crew-trip/features/category/hotel/hotel.component';
import { NationComponent } from 'src/app/crew-trip/features/category/nation/nation.component';
import { ServiceFeeComponent } from 'src/app/crew-trip/features/category/service-fee/service-fee.component';
import { VehicleComponent } from 'src/app/crew-trip/features/category/vehicle/vehicle.component';
import { ContractDetailComponent } from 'src/app/crew-trip/features/contract/contract-detail/contract-detail.component';
import { ContractComponent } from 'src/app/crew-trip/features/contract/contract.component';
import { FirstPageComponent } from 'src/app/crew-trip/features/first-page/first-page.component';
import { FunctionsComponent } from 'src/app/crew-trip/features/functions/functions.component';
import { InvoiceDocumentTabComponent } from 'src/app/crew-trip/features/invoice/document/invoice-document-tab.component';
import { InvoiceFormTabComponent } from 'src/app/crew-trip/features/invoice/form/invoice-form-tab.component';
import { KeHoachComponent } from 'src/app/crew-trip/features/plan/ke-hoach/ke-hoach.component';
import { AnnualProductionComponent } from 'src/app/crew-trip/features/plan/production/annual-production/annual-production.component';
import { EstAnnualProductionComponent } from 'src/app/crew-trip/features/plan/production/est-annual-production/est-annual-production.component';
import { FiveYearPlanComponent } from 'src/app/crew-trip/features/plan/production/five-year-plan/five-year-plan.component';
import { RatePlannedComponent } from 'src/app/crew-trip/features/plan/rate-planned/rate-planned.component';
import { RateUthComponent } from 'src/app/crew-trip/features/plan/rate-uth/rate-uth.component';
import { RolesComponent } from 'src/app/crew-trip/features/roles/roles.component';
import { AircraftDataComponent } from 'src/app/crew-trip/features/system/config/aircraft-data/aircraft-data.component';
import { EmailSupplierComponent } from 'src/app/crew-trip/features/system/config/email-supplier/email-supplier.component';
import { GroupMailComponent } from 'src/app/crew-trip/features/system/config/group-mail/group-mail.component';
import { UsersComponent } from 'src/app/crew-trip/features/system/users/users.component';
import { NotFoundComponent } from 'src/app/not-found/not-found.component';
import { CrewsDetailComponent } from './crew-trip/features/category/crews/crews-detail/crews-detail.component';
import { FlightMarketDetailComponent } from './crew-trip/features/category/flight-market/flight-market-detail/flight-market-detail.component';
import { FlightMarketListComponent } from './crew-trip/features/category/flight-market/flight-market-list/flight-market-list.component';
import { FlightMarketComponent } from './crew-trip/features/category/flight-market/flight-market.component';
import { SeasonalSchedulesComponent } from './crew-trip/features/flight-schedules/seasonal-schedules/seasonal-schedules.component';
import { BudgetProcurementListComponent } from './crew-trip/features/plan/budget-procurement/budget-procurement-list/budget-procurement-list.component';
import { BudgetProcurementSummaryDetailComponent } from './crew-trip/features/plan/budget-procurement/budget-procurement-summary/budget-procurement-summary-detail/budget-procurement-summary-detail.component';
import { BudgetProcurementSummaryComponent } from './crew-trip/features/plan/budget-procurement/budget-procurement-summary/budget-procurement-summary.component';
import { BudgetProcurementComponent } from './crew-trip/features/plan/budget-procurement/budget-procurement.component';
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
import { AutocompleteComponent } from './ui-elements/autocomplete/autocomplete.component';

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
		children: [
			{ path: 'ke-hoach', component: KeHoachComponent },
			{
				path: 'system/admin',
				children: [
					{ path: 'users', component: UsersComponent },
					{ path: 'roles', component: RolesComponent },
					{ path: 'functions', component: FunctionsComponent },
				],
			},
			{
				path: 'system/config',
				children: [
					{ path: 'group-mail', component: GroupMailComponent },
					{ path: 'information-plane', component: AircraftDataComponent },
					{ path: 'email-supplier', component: EmailSupplierComponent },
				],
			},
			{
				path: 'plan',
				children: [
					{ path: 'rate/uth', component: RateUthComponent },
					{ path: 'rate/planned', component: RatePlannedComponent },
					{
						path: 'production/five-year-plan',
						component: FiveYearPlanComponent,
					},
					{
						path: 'production/est-annual-production',
						component: EstAnnualProductionComponent,
					},
					{ path: 'production/planned', component: AnnualProductionComponent },
					{
						path: 'est-plan/budget-procurement',
						component: BudgetProcurementComponent,
						children: [
							{ path: '', component: BudgetProcurementListComponent },
							{
								path: ':id/summary',
								component: BudgetProcurementSummaryComponent,
								pathMatch: 'full',
							},
							{
								path: ':plan-budget-procurement-id/summary/:id/detail',
								component: BudgetProcurementSummaryDetailComponent,
							},
						],
					},
				],
			},
			{
				path: 'category',
				children: [
					{ path: 'vehicle', component: VehicleComponent },
					{ path: 'contract', component: ContractComponent },
					{ path: 'contract/detail', component: ContractDetailComponent },
					{ path: 'act-rate', component: ActRateComponent },
					{ path: 'hotel', component: HotelComponent },
					{ path: 'nation', component: NationComponent },
					{ path: 'cost', component: ServiceFeeComponent },
					{ path: 'crews', component: CrewsComponent },
					{ path: 'flight-crew', component: FlightCrewComponent },
					{ path: 'vehicle', component: VehicleComponent },
					{ path: 'hotel', component: HotelComponent },
					{ path: 'nation', component: NationComponent },
					{
						path: 'crews',
						component: CrewsComponent,
						children: [
							{ path: '', component: CrewsComponent },
							{ path: 'detail', component: CrewsDetailComponent },
						],
					},
					{ path: 'autocomplete', component: AutocompleteComponent },
					{
						path: 'flight-market',
						component: FlightMarketComponent,
						children: [
							{ path: '', component: FlightMarketListComponent },
							{ path: 'detail', component: FlightMarketDetailComponent },
							{ path: 'detail/:id', component: FlightMarketDetailComponent },
						],
					},
				],
			},
			{
				path: 'flight-schedules',
				children: [{ path: 'seasonal', component: SeasonalSchedulesComponent }],
			},
			{
				path: 'invoice',
				children: [
					{ path: 'invoice-form-tab', component: InvoiceFormTabComponent },
					{
						path: 'invoice-document-tab',
						component: InvoiceDocumentTabComponent,
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
				],
			},
			{ path: 'profile', component: ProfileComponent },
			{
				path: 'service',
				children: [
					{
						path: 'hotel/cost-tracking',
						component: HotelCostTrackingContainerComponent,
					},
					{
						path: 'hotel/room-booking',
						component: RoomBookingComponent,
					},
					{
						path: 'car/cost-tracking',
						component: CarCostTrackingComponent,
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
