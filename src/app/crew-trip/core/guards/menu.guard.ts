import {CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {StorageService} from 'src/app/crew-trip/core/services/storage.service';
import {STORAGE_KEY} from 'src/app/crew-trip/core/constants/config';
import {UsersService} from "src/app/crew-trip/core/services/users-service";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private usersService: UsersService, private router: Router) {
  }

  canActivate(): boolean {
    return true;
    if (this.usersService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['auth/login']);
      return false;
    }
  }
}
