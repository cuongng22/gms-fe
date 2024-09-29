import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest
} from '@angular/common/http';
import {Observable, tap, throwError, timeout} from 'rxjs';
import {catchError} from "rxjs/operators";
import {inject} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {BaseService} from "src/app/crew-trip/core/services/base-service";


export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const notification = inject(MatSnackBar);
  const baseService = inject(BaseService);
  const router = inject(Router);
  localStorage.setItem('access_token1', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnaW1hc3lzLmNvbSIsImlhdCI6MTcyNzU4MDMxOCwiZXhwIjoxNzI3NTk4MzE4fQ.ks7Tp6SDHHmDnHMG8A_g5qHYabdXt1Tm2YxLWCgss0i7fcurjBHIfq-1clJyWpaaTwIG0hj0SX8jJ7GaBDSrtg');
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
          router.navigate(['auth/login'], {fragment: '401',skipLocationChange: true});
        } else if (error.status === 404) {
          console.error('Not Found: ', error.message);
        } else if (error.status === 500) {
          console.error('Server Error: ', error.message);
        } else {
          console.error('Error occurred: ', error.message);
        }
        return throwError(() => new Error(error.message));
      })
    );
    // return next(authReq)
  } else {
    return next(req);
  }


}
