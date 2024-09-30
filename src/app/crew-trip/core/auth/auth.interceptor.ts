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


export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const notification = inject(MatSnackBar);
  const router = inject(Router);
  const baseService = inject(BaseService);
  // localStorage.setItem('access_token1', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsIk1BX1FEIjoiUcSQLVRDRFQiLCJNQV9UUiI6IlRUci1RTEhEVCIsIk1BX0RWSSI6IjAxMDEiLCJDQVBfRFZJIjoiMSIsIlRFTl9EVkkiOiJU4buVbmcgY-G7pWMgROG7sSB0cuG7ryBOaMOgIG7GsOG7m2MiLCJURU5fUEhPTkdfQkFOIjoiIiwiVEVOX0RBWV9EVSI6IkFkbWluaXN0YXRvciIsIlBPU0lUSU9OIjoiUXXhuqNuIHRy4buLIGjhu4cgdGjhu5FuZyIsIklEIjoxLCJleHAiOjE3MjY4Mjc3MzB9.qu5L9kiWGQPqI7uMi0dwvmNFwlDRpZLZDJA6IQJ0vRgT7oxxSqmRQv7xu55Da2AIHeH_-9yotXnKce9kdMSDhQ');
  localStorage.setItem('access_token1', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnaW1hc3lzLmNvbSIsImlhdCI6MTcyNzcwOTk2MywiZXhwIjoxNzI3NzI3OTYzfQ.J8i_SZImlsBBIz4LNX99We433wPM8K4ODIWrNq8oT1nVDOaV6V5ZiOqbY-ioqLSZYyVEM6BulEGGLujy0OHw2A');
  const token = localStorage.getItem('access_token1');
  if (token) {
    const authReq = req.clone({
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
    return next(authReq).pipe(
      timeout(3000),
      tap(event => {
        if (event.type === HttpEventType.Response) {
          console.log(req.url, 'returned a response with status', event.status);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error('Unauthorized : ', error.message);
          /*let _noti = notification.open('Tài khoản không hợp lệ', 'Đăng nhập', {
            duration: 5000
          });
          _noti.onAction().subscribe(() => {
            router.navigate(['/login']);
          });
          _noti.afterDismissed().subscribe(() => {
            // router.navigate(['/dashboard']);
          });*/
        } else if (error.status === 404) {
          console.error('Not Found: ', error.message);
        } else if (error.status === 500) {
          console.error('Server Error: ', error.message);
        } else {
          console.error('Error occurred: ', error.message);
        }
        baseService.showError(MESSAGE.ERROR);
        return throwError(() => new Error(error.message));
        
      })
    );
    // return next(authReq)
  } else {
    return next(req);
  }


}
