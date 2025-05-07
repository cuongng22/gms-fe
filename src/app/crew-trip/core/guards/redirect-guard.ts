import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {StorageService} from "src/app/crew-trip/core/services/storage.service";
import {UsersService} from "src/app/crew-trip/core/services/users-service";

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {
  constructor(private usersService: UsersService, private router: Router) {
  }

  canActivate(): boolean {
    if (this.usersService.isLoggedIn()) {
      this.router.navigate(['/reports/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
    return false;
  }
}
