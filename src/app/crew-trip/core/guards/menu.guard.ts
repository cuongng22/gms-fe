import {CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {StorageService} from 'src/app/crew-trip/core/services/storage.service';
import {STORAGE_KEY} from 'src/app/crew-trip/core/constants/config';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private storageService: StorageService, private router: Router) {}

  canActivate(): boolean {
    if (this.storageService.get(STORAGE_KEY.USER_INFO)) {
      return true;
    } else {
      this.router.navigate(['auth/login']);
      return false;
    }
  }
}
