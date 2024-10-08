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
import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { BaseService } from '../services/base-service';
import { MESSAGE } from '../../shared/utils/constant';
import {STORAGE_KEY} from "src/app/crew-trip/core/constants/config";


export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const notification = inject(MatSnackBar);
  const baseService = inject(BaseService);
  const router = inject(Router);
  const token = localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
  if (token) {
    const authReq = req.clone({
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
    return next(authReq).pipe(
      timeout(10000),
      tap(event => {
        if (event.type === HttpEventType.Response) {
          console.log(req.url, 'returned a response with status', event.status);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          router.navigate(['auth/login'], {fragment: '401',skipLocationChange: true});
        } else if (error.status === 404) {
          console.error('Not Found: ', error.message);
        } else if (error.status === 500) {
          console.error('Server Error: ', error.message);
          // baseService.showError('Server Error: ' + error.message)
        } else {
          console.error('Error occurred: ', error.message);
        }
        return throwError(() => error.error);
      })
    );
    // return next(authReq)
  } else {
    return next(req);
  }


}
