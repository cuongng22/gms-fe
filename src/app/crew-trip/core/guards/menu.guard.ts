import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UsersService } from 'src/app/crew-trip/core/services/users-service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(
		private readonly usersService: UsersService,
		private readonly router: Router,
	) {}

	canActivate(activatedRoute: ActivatedRouteSnapshot): boolean {
		// return true;
		// if (this.usersService.isLoggedIn()) {
		//   return true;
		// } else {
		//   this.router.navigate(['auth/login']);
		//   return false;
		// }

		const permissionCodes = activatedRoute.data['permissionCodes'];
		// console.log('>>>>> vao AuthGuard.canActivate: ', permissionCodes);
		if (!permissionCodes || permissionCodes.length === 0) {
			if (this.usersService.isLoggedIn()) {
				return true;
			}
			this.router.navigate(['auth/login']);
			return false;
		} else {
			const check = this.usersService.hasPermission(permissionCodes);
			if (!check) {
				this.router.navigate(['404']);
				return false;
			}
			return true;
		}
	}
}
