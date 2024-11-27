import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
  HttpStatusCode
} from '@angular/common/http';
import {Observable, tap, throwError, timeout} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {BaseService} from '../services/base-service';
import {MESSAGE, COMMON_CONFIG} from '../../shared/utils/constant';
import {STORAGE_KEY} from 'src/app/crew-trip/core/constants/config';
import {LanguageService} from 'src/app/crew-trip/core/services/language.service';
import {UsersService} from "src/app/crew-trip/core/services/users-service";


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
  const authReq = req.clone({headers});
  return next(authReq).pipe(timeout(COMMON_CONFIG.TIMEOUT), tap(event => {
    if (event.type === HttpEventType.Response) {
      // console.log(req.url, 'returned a response with status', event.status);
    }
  }), catchError((error: any) => {
    if (error.name === 'TimeoutError') {
      baseService.showError(MESSAGE.ERROR_CONNECT);
    } else if (error instanceof HttpErrorResponse) {
      if (error.status === HttpStatusCode.Unauthorized) {
        usersService.logout();
        router.navigate(['auth/login'], {fragment: HttpStatusCode.Unauthorized.toString(), skipLocationChange: true});
      } else if (error.status === HttpStatusCode.ServiceUnavailable || (error.status === 0 && error.statusText === 'Unknown Error')) {
        baseService.showError(MESSAGE.ERROR_CONNECT);
      } else if (error.status === HttpStatusCode.Conflict) {
        return throwError(() => error);
      } else if (error.status === HttpStatusCode.BadRequest) {
        baseService.showError(error?.error?.error);
      } else if (error.status === HttpStatusCode.InternalServerError) {
        if (error.error?.error.includes('UNIQUE')) {
          return throwError(() => error);
        }
        baseService.showError(error?.error?.error);
      } else {
        return throwError(() => error);
      }
    }
    return throwError(() => error);
  }));
}
