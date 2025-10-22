import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from 'src/app/crew-trip/core/auth/forgot-password/forgot-password.component';
import { ProfileComponent } from 'src/app/crew-trip/core/auth/profile/profile.component';
import { ResetPasswordComponent } from 'src/app/crew-trip/core/auth/reset-password/reset-password.component';
import { SignInComponent } from 'src/app/crew-trip/core/auth/sign-in/sign-in.component';
import { AuthGuard } from 'src/app/crew-trip/core/guards/menu.guard';
import { FirstPageComponent } from 'src/app/crew-trip/features/first-page/first-page.component';
import { RolesComponent } from 'src/app/crew-trip/features/roles/roles.component';
import { AircraftDataComponent } from 'src/app/crew-trip/features/system/config/aircraft-data/aircraft-data.component';
import { AvesConfigComponent } from 'src/app/crew-trip/features/system/config/aves-config/aves-config.component';
import { EmailSupplierComponent } from 'src/app/crew-trip/features/system/config/email-supplier/email-supplier.component';
import { GroupMailComponent } from 'src/app/crew-trip/features/system/config/group-mail/group-mail.component';
import { NotificationComponent } from 'src/app/crew-trip/features/system/config/notification/notification.component';
import { UsersComponent } from 'src/app/crew-trip/features/system/users/users.component';
import { NotFoundComponent } from 'src/app/not-found/not-found.component';
import { EmailNotificationHistoryComponent } from './crew-trip/features/system/history/email-notification-history/email-notification-history.component';
import { LoginHistoryComponent } from './crew-trip/features/system/history/login-history/login-history.component';

export const routes: Routes = [
	{
		path: '',
		component: FirstPageComponent,
		// canActivate: [RedirectGuard],
		// redirectTo: 'auth/login',
		// pathMatch: 'full',
	},
	{
		path: '',
		component: FirstPageComponent,
		// canActivate: [AuthGuard],
		data: { permissionCodes: [] },
		children: [
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
				],
			},
			{
				path: 'system/config',
				children: [
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
					{
						path: 'aves-config',
						component: AvesConfigComponent,
						canActivate: [AuthGuard],
						data: {
							permissionCodes: ['API_CONFIG_AVES_LIST'],
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
			{ path: 'profile', component: ProfileComponent },
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
