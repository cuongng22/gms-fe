import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest
} from '@angular/common/http';
import { Observable, tap, throwError, timeout } from 'rxjs';
import { catchError } from "rxjs/operators";
import {inject, LOCALE_ID} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { BaseService } from '../services/base-service';
import { MESSAGE } from '../../shared/utils/constant';
import {STORAGE_KEY} from "src/app/crew-trip/core/constants/config";
import {LanguageService} from "src/app/crew-trip/core/services/language.service";


export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const locale = inject(LOCALE_ID);
  const router = inject(Router);
  const baseService = inject(BaseService);
  const languageService = inject(LanguageService);
  const token = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
  if (token) {
    const authReq = req.clone({
      headers: new HttpHeaders({
        'Accept-Language':  languageService.getLanguage(),
        'Authorization': `Bearer ${token}`
      })
    });
    return next(authReq).pipe(
      timeout(10000),
      tap(event => {
        if (event.type === HttpEventType.Response) {
          console.log(req.url, 'returned a response with status', event.status);
        }
      },(error: any) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            router.navigate(['auth/login'], {fragment: '401',skipLocationChange: true});
          } else if (error.status === 503 || (error.status == 0 && error.statusText == 'Unknown Error')) {
            baseService.showError(MESSAGE.ERROR_CONNECT);
          } else {
            return next(authReq);
          }
        }
        return throwError(() => new Error(error.message));
      })
    );
  } else {
    return next(req);
  }


}
