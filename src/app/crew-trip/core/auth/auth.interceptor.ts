import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest
} from '@angular/common/http';
import { Observable, tap, throwError, timeout } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject, LOCALE_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BaseService } from '../services/base-service';
import { MESSAGE } from '../../shared/utils/constant';
import { STORAGE_KEY } from 'src/app/crew-trip/core/constants/config';
import { LanguageService } from 'src/app/crew-trip/core/services/language.service';
import { UsersService } from "src/app/crew-trip/core/services/users-service";


export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const router = inject(Router);

  const baseService = inject(BaseService);
  const usersService = inject(UsersService);
  const languageService = inject(LanguageService);
  const token = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
  let headers = new HttpHeaders({
    'Accept-Language': languageService.getLanguage(),
  });
  /*if (req.body instanceof FormData) {
    headers = headers.set('Accept', 'application/octet-stream');
  }*/
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }
  const authReq = req.clone({ headers });
  return next(authReq).pipe(
    timeout(10000),
    tap(event => {
      if (event.type === HttpEventType.Response) {
        console.log(req.url, 'returned a response with status', event.status);
      }
    }),
    catchError((error: any) => {
      if (error.name === 'TimeoutError') {
        baseService.showError(MESSAGE.ERROR_CONNECT);
      } else if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          usersService.logout();
          router.navigate(['auth/login'], { fragment: '401', skipLocationChange: true });
        } else if (error.status === 503 || (error.status === 0 && error.statusText === 'Unknown Error')) {
          baseService.showError(MESSAGE.ERROR_CONNECT);
        } else if (error.status === 409) {
          baseService.showError(error?.error?.error);
        }
      }
      return throwError(() => error);
    })
  );
}
