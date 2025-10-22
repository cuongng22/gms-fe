import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from 'src/app/crew-trip/core/auth/forgot-password/forgot-password.component';
import { ProfileComponent } from 'src/app/crew-trip/core/auth/profile/profile.component';
import { ResetPasswordComponent } from 'src/app/crew-trip/core/auth/reset-password/reset-password.component';
import { SignInComponent } from 'src/app/crew-trip/core/auth/sign-in/sign-in.component';
import { AuthGuard } from 'src/app/crew-trip/core/guards/menu.guard';
import { FirstPageComponent } from 'src/app/crew-trip/features/first-page/first-page.component';
import { RolesComponent } from 'src/app/crew-trip/features/roles/roles.component';
import { UsersComponent } from 'src/app/crew-trip/features/system/users/users.component';
import { NotFoundComponent } from 'src/app/not-found/not-found.component';
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
