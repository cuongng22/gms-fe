import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
  HttpStatusCode
} from '@angular/common/http';
import { from, Observable, tap, throwError, timeout } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from '../services/base-service';
import { MESSAGE, COMMON_CONFIG } from '../../shared/utils/constant';
import { STORAGE_KEY } from 'src/app/crew-trip/core/constants/config';
import { LanguageService } from 'src/app/crew-trip/core/services/language.service';
import { UsersService } from 'src/app/crew-trip/core/services/users-service';
import { MIMEType } from 'util';
import { el } from 'node_modules/@fullcalendar/core/internal-common';


export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const router = inject(Router);

  const baseService = inject(BaseService);
  const usersService = inject(UsersService);
  const languageService = inject(LanguageService);
  const token = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
  let headers = new HttpHeaders({
    'Accept-Language': languageService.getLanguage()
  });
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }
  let requestTimeout = COMMON_CONFIG.TIMEOUT;
  if (
    req.url.includes('/api/productivity') ||
    req.url.includes('api/plan-budget-procurement/summary')) {
    requestTimeout = 1000000;
  }
  const authReq = req.clone({ headers });
  return next(authReq).pipe(timeout(requestTimeout), tap(event => {
    if (event.type === HttpEventType.Response) {
      // console.log(req.url, 'returned a response with status', event.status);
    }
  }), catchError((error: any) => {
    const silentError = req.headers.get('X-Silent-Error') === 'true';
    if (silentError) {
      return throwError(() => error);
    }
    if (error.name === 'TimeoutError') {
      baseService.showError(MESSAGE.ERROR_CONNECT);
    } else if (error instanceof HttpErrorResponse) {
      readError(error).then((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === HttpStatusCode.Unauthorized) {
          usersService.logout();
          router.navigate(['auth/login'], {
            fragment: HttpStatusCode.Unauthorized.toString(),
            skipLocationChange: true
          });
        } else if (errorResponse.status === HttpStatusCode.ServiceUnavailable ||
          (errorResponse.status === 0 && errorResponse.statusText === 'Unknown Error')) {
          baseService.showError(MESSAGE.ERROR_CONNECT);
        } else if (errorResponse.status === HttpStatusCode.BadRequest) {
          if (!errorResponse.error.error['emails[]']) {
            baseService.showError(
              errorResponse?.error?.error?.file ?? errorResponse?.error?.error ?? errorResponse?.error
            );
          }
        } else if (errorResponse.status === HttpStatusCode.InternalServerError) {
          if (!errorResponse.error?.error?.includes('UNIQUE')) {
            baseService.showError(
              errorResponse?.error?.file ??
              errorResponse?.error?.error?.file ??
              errorResponse?.error?.error ??
              errorResponse?.error
            );
          }
        } else if (errorResponse.status === HttpStatusCode.Conflict ||
          errorResponse.status === HttpStatusCode.NotFound) {

        } else {
          baseService.showError(errorResponse?.error?.error ?? MESSAGE.ERROR);
        }
      });
    }
    return throwError(() => error);
  }));
}

export function readError(error: HttpErrorResponse): Promise<HttpErrorResponse> {
  return new Promise((resolve, reject) => {
    if (error.error instanceof Blob && error.error.type.includes('application/json')) {
      const reader = new FileReader();
      reader.onload = function() {
        if (typeof reader.result === 'string') {
          const jsonError = JSON.parse(reader.result);
          resolve(new HttpErrorResponse({
            error: jsonError,
            status: error.status,
            statusText: error.statusText,
            url: error.url ?? undefined,
            headers: error.headers
          }));
        }
      };
      reader.readAsText(error.error);
    } else {
      resolve(error);
    }
  });
}
