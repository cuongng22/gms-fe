import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { HotelService } from '../services/hotel-service';
import { catchError, map, Observable, of } from 'rxjs';
import { VehicleService } from '../services/vehicle.service';

export class AlreadyExistsValidator {
  static existsHotelCode(hotelService: HotelService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (hotelService.isUpdate) {
        return of(null);
      }
      if (control.value) {
        try {
          return hotelService.checkCodeExist(control.value.toUpperCase().trim()).pipe(
            map((res: any) => {
              return res && res.status == 409 ? { existsHotelCode: true } : null;
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


  static existsCarRentalCode(carRentalService: VehicleService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (carRentalService.isUpdate) {
        return of(null);
      }
      if (control.value) {
        try {
          return carRentalService.checkCodeExist(control.value.toUpperCase().trim()).pipe(
            map((res: any) => {
              return res && res.status == 409 ? { existsCarRentalCode: true } : null;
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
