import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors
} from '@angular/forms';
import { HotelService } from '../services/hotel-service';
import { catchError, map, Observable, of } from 'rxjs';
import { VehicleService } from '../services/vehicle.service';

export class AlreadyExistsValidator {
  static existsHotelCode(
    hotelService: HotelService,
    marketCode: string,
    hotelCodes: string[]
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (hotelService.isUpdate) {
        return of(null);
      }
      if (!!control.value && !!marketCode) {
        try {
          const hotelCode = control.value.toUpperCase().trim();
          if (hotelCodes.includes(hotelCode)) {
            return of({ existsHotelCode: true });
          }
          return hotelService.checkCodeExists(hotelCode).pipe(
            map((res: any) => {
              return res && res.status == 409
                ? { existsHotelCode: true }
                : null;
            }),
            catchError((error) => {
              if (error.status === 409) {
                return of({ existsHotelCode: true });
              }
              return of(null);
            })
          );
        } catch (e) {
          return of(null);
        }
      } else {
        return of(null);
      }
    };
  }

  static existsCarRentalCode(
    carRentalService: VehicleService,
    marketCode: string,
    carRentalCodes: string[]
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (carRentalService.isUpdate) {
        return of(null);
      }
      if (!!control.value && !!marketCode) {
        try {
          const code = control.value.toUpperCase().trim();
          if (carRentalCodes.includes(code)) {
            return of({ existsCarRentalCode: true });
          }
          return carRentalService.checkCodeExists(code).pipe(
            map((res: any) => {
              return res && res.status == 409
                ? { existsCarRentalCode: true }
                : null;
            }),
            catchError((error) => {
              if (error.status === 409) {
                return of({ existsCarRentalCode: true });
              }
              return of(null);
            })
          );
        } catch (e) {
          return of(null);
        }
      } else {
        return of(null);
      }
    };
  }
}
