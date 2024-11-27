import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, DestroyRef, effect, ElementRef, inject, input, model, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { FlightMarketService } from 'src/app/crew-trip/core/services/ flight-market.service';
import { NationService } from 'src/app/crew-trip/core/services/nation-service';
import { ServiceFeeService } from 'src/app/crew-trip/core/services/service-fee-service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { debouncedSignal, LOCALE, MESSAGE } from 'src/app/crew-trip/shared/utils/constant';
import { LOCALE_ID, Inject } from '@angular/core';
import { FlightGroupData } from 'src/app/crew-trip/core/master-data/flight-group.data';
import { MatDialog } from '@angular/material/dialog';
import { HotelDetailComponent } from '../hotel-detail/hotel-detail.component';
import { CarRentalDetailComponent } from '../car-rental-detail/car-rental-detail.component';
import { CreateFlightMarketDTO, CreateHotel, CreateMarketFlight, CreateVehiclePartner, InsertHotelAndCar, UpdateFlightMarket, UpdateHotelAndCar } from './flight-market.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { debounceTime, Subject } from 'rxjs';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { HttpStatusCode } from '@angular/common/http';
import { ValidationErrors } from '@iplab/ngx-file-upload';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';

@Component({
  selector: 'app-flight-market-detail',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, MatChipsModule, RouterLink, RouterModule, NgxTrimDirectiveModule, NgxControlError, DataTransformPipe,
    SelectMultipleComponent],
  templateUrl: './flight-market-detail.component.html',
  styleUrl: './flight-market-detail.component.scss'
})
export class FlightMarketDetailComponent extends CommonComponent implements OnInit, AfterViewInit {
  formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  override baseService = inject(FlightMarketService);
  serviceFeeService = inject(ServiceFeeService);
  nationService = inject(NationService);

  @ViewChild('nationName') nationName: ElementRef<HTMLInputElement>;

  LOCALE = LOCALE;

  // id của flight market
  id = input<number>();
  // ẩn hiện khi view hoặc create, update
  readonlyDetail = model<boolean>(false);
  isCreate = model<boolean>(false);

  filteredCountry = model<any[]>([]);
  costCategorysRaw: any[] = [];
  costCategorys: any[] = [];
  countries: any[] = [];
  keySearchNation = new Subject<string>();
  flightGroupData = FlightGroupData;

  hotelDataSource = new MatTableDataSource<any[]>([]);
  hotelColumns = ['hotelCode', 'hotelName', 'address', 'fullName', 'email', 'phone', 'active', 'notes'];
  dialogDeleteHotel = false;
  indexDeleteHotel: number;

  carRentalDataSource = new MatTableDataSource<any[]>([]);
  carRentalColumns = ['code', 'name', 'address', 'fullName', 'email', 'phone', 'active', 'notes'];
  dialogDeleteCarRental = false;
  indexDeleteCarRental: number;

  airportCodeExists = false;
  airportCodeExistsMessage = '';

  override formGroupDetail = this.formBuilder.group({
    id: [],
    marketCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3),
    this.airportCodeExistsValidator.bind(this)
    ]],
    marketName: ['', Validators.maxLength(250)],
    nationId: ['', Validators.required],
    nationName: ['', Validators.required],
    marketType: ['', Validators.required],
    flightGroup: [''],
    serviceFeeCode: [''],
    statusUsage: ['', Validators.required],
    notes: ['', Validators.maxLength(500)],
    overnight: []

  });

  constructor(@Inject(LOCALE_ID) public locale: string, public dialog: MatDialog,
    private activeRoute: ActivatedRoute, private router: Router) {
    super();
    console.debug('locale: ', locale);


  }
  override async ngOnInit() {

    // Lấy chi tiết flight market
    if (this.id()) {
      await this.baseService.detail(this.id()).then(res => {
        this.formGroupDetail.patchValue(res.data);
        this.formGroupDetail.controls.marketCode.disable();
        this.hotelDataSource.data = res.data.hotels;
        this.carRentalDataSource.data = res.data.vehiclesPartner;
      });
    }

    // lấy danh sách dịch vụ
    this.serviceFeeService.search({ page: 0, size: 99999 }).then(res => {
      this.costCategorysRaw = res.data.content;
      this.costCategorys = res.data.content;
    });

    // Lấy danh sách quốc gia
    this.nationService.search({ page: 0, limit: 99999 }).then(res => {
      this.countries = res.data.content;

      // set lại nationName
      const nationName = this.countries
        .filter(country => country.id === this.formGroupDetail.controls.nationId.value)
        .map(country => LOCALE.VN ? country.vniName : country.engName)[0];
      this.formGroupDetail.patchValue({ nationName: nationName });
    });


    const _isViewDetail: string = this.activeRoute.snapshot.queryParamMap.get('view-detail') ?? '';
    this.readonlyDetail.set(_isViewDetail === 'true');
    if (this.readonlyDetail()) {
      Object.keys(this.formGroupDetail.controls).forEach(control => {
        this.formGroupDetail.get(control)?.disable();
      });
    } else {
      // thêm cột action cho table carRental and hotel
      this.hotelColumns.push('action');
      this.carRentalColumns.push('action');
    }

    this.isCreate.set(!!this.id());

    //search Nation
    this.keySearchNation.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.filteredCountry.set(this.countries.filter(country => {
        const code = country.code.toLowerCase();
        return code.includes(value.toLowerCase()) || (this.locale == LOCALE.VN ?
          country.vniName.toLowerCase().includes(value.toLowerCase()) :
          country.engName.toLowerCase().includes(value.toLowerCase()));
      }));
    });


    this.destroyRef.onDestroy(() => {
      this.keySearchNation.unsubscribe();
    });
  }

  override ngAfterViewInit(): void {
  }

  filterCountry(isClean?: boolean): void {
    const filterValue = isClean ? null : this.nationName.nativeElement.value;
    const value = this.nationName.nativeElement.value.startsWith('[') ? null : this.nationName.nativeElement.value;
    if (value) {
      this.formGroupDetail.controls.nationName.setValue(value);
    }
    if (!filterValue) {
      this.filteredCountry.set(this.countries);
      return;
    }
    this.keySearchNation.next(filterValue);
  }

  countrySelected(country: MatAutocompleteSelectedEvent) {
    const selectedCountry = country.option.value;
    this.formGroupDetail.controls.nationId.setValue(selectedCountry.id);
    this.formGroupDetail.controls.nationName.setValue(this.locale == LOCALE.VN ? selectedCountry.vniName : selectedCountry.engName);
    // Nếu code = VN thì set marketType = International
    if (selectedCountry.code === 'VN') {
      this.formGroupDetail.controls.marketType.setValue('Domestic');
    } else {
      this.formGroupDetail.controls.marketType.setValue('International');
    }
  }

  // detail or edit, create hotel
  hotelDetail(isViewDetail: boolean, hotel?: any) {
    if (!isViewDetail && hotel) {
      hotel = {
        ...hotel, marketCode: this.formGroupDetail.controls.marketCode.value
      };
    }
    const dialogRef = this.dialog.open(HotelDetailComponent, {
      data: { hotel: hotel, isViewDetail: isViewDetail },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      const hotelDatas = this.hotelDataSource.data as any[] || [];
      if (result) {
        const index = !result.id ? -1 : hotelDatas.findIndex(hotel => hotel.id === result.id);
        if (index !== -1) {
          hotelDatas[index] = { ...hotelDatas[index], ...result };
        } else {
          hotelDatas.push(result);
        }
        this.hotelDataSource.data = [...hotelDatas]; // Refresh the data source
      }
    });
  }

  // detail or edit, create car rental
  carRentalDetail(isViewDetail: boolean, carRental?: any) {
    if (!isViewDetail && carRental) {
      carRental = {
        ...carRental, marketCode: this.formGroupDetail.controls.marketCode.value
      };
    }
    const dialogRef = this.dialog.open(CarRentalDetailComponent, {
      data: { carRental: carRental, isViewDetail: isViewDetail },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ', result);
      const carRentalDatas = this.carRentalDataSource.data as any[] || [];
      console.log('carRentalDatas: ', carRentalDatas);
      if (result) {
        const index = !result.id ? -1 : carRentalDatas.findIndex(carRental => carRental.id === result.id);
        if (index !== -1) {
          carRentalDatas[index] = { ...carRentalDatas[index], ...result };
        } else {
          carRentalDatas.push(result);
        }
        this.carRentalDataSource.data = [...carRentalDatas]; // Refresh the data source
      }
    });
  }

  override async save() {
    try {
      this.formGroupDetail.markAllAsTouched();
      if (this.formGroupDetail.invalid) {
        return;
      }
      const isUpdate = !!this.formGroupDetail.value.id;
      this.spinner.show();
      let res;
      if (isUpdate) {
        const body = this.updateBody({ ...this.formGroupDetail.value, marketCode: this.formGroupDetail.controls.marketCode.value?.toUpperCase() }, this.hotelDataSource.data, this.carRentalDataSource.data);
        res = await this.baseService.update(body);
      } else {
        const body = this.createBody({ ...this.formGroupDetail.value, marketCode: this.formGroupDetail.controls.marketCode.value?.toUpperCase() }, this.hotelDataSource.data, this.carRentalDataSource.data);
        res = await this.baseService.create(body);
      }
      console.log(res);
      this.baseService.showSuccess(isUpdate ? MESSAGE.UPDATE_SUCCESS : MESSAGE.CREATE_SUCCESS);
      this.router.navigate(['/category/flight-market']);
    } catch (e: any) {
      console.error(e);
      if (e.status === HttpStatusCode.Conflict) {
        this.airportCodeExists = true;
        this.formGroupDetail.controls.marketCode.updateValueAndValidity();
        this.airportCodeExistsMessage = e?.error?.error ?? $localize`:@@airportCodeExistsMessage:Airport code ${MESSAGE.ALREADY_EXISTS}`
        this.airportCodeExists = false;
      } else {
        this.baseService.showError((e.error?.error ?? e.error?.error?.code) ?? MESSAGE.ERROR);
      }
    } finally {
      await this.spinner.hide();
    }
  }

  createBody(flightMarketData: any, hotelDatas: any[], carRentalDatas: any[]): any {
    const marketFlight: CreateMarketFlight = new CreateMarketFlight(flightMarketData);
    const hotels: CreateHotel[] = [];
    const carRentals: CreateVehiclePartner[] = [];

    hotelDatas.forEach(hotel => {
      hotels.push(new CreateHotel(hotel));
    });

    carRentalDatas.forEach(carRental => {
      carRentals.push(new CreateVehiclePartner(carRental));
    });

    const createFlightMarketDTO = new CreateFlightMarketDTO(marketFlight, hotels, carRentals);
    return createFlightMarketDTO;
  }

  updateBody(flightMarketData: any, hotelDatas: any[], carRentalDatas: any[]) {
    const deleteItems: { id: number; type: string }[] = [];
    const updateItems: UpdateHotelAndCar[] = [];
    const insertItems: InsertHotelAndCar[] = [];
    const updateFlightMarket: UpdateFlightMarket = new UpdateFlightMarket(flightMarketData);

    hotelDatas.forEach(hotel => {
      if (hotel.isDelete) {
        deleteItems.push({ id: hotel.id, type: 'HOTEL' });
      } else if (hotel.id) {
        updateItems.push(new UpdateHotelAndCar({ ...hotel, type: 'HOTEL' }));
      } else {
        insertItems.push(new InsertHotelAndCar({ ...hotel, type: 'HOTEL' }));
      }
    });

    carRentalDatas.forEach(carRental => {
      if (carRental.isDelete) {
        deleteItems.push({ id: carRental.id, type: 'HOTEL' });
      } else if (carRental.id) {
        updateItems.push(new UpdateHotelAndCar({ ...carRental, type: 'VEHICLE' }));
      } else {
        insertItems.push(new InsertHotelAndCar({ ...carRental, type: 'VEHICLE' }));
      }
    });

    return { id: flightMarketData.id, ...updateFlightMarket, insertItems: insertItems, updateItems: updateItems, deleteItems: deleteItems };
  }


  toggleDialogDeleteHotel() {
    this.dialogDeleteHotel = !this.dialogDeleteHotel;
  }

  confirmDeleteHotel() {
    this.toggleDialogDeleteHotel();
    if (this.indexDeleteHotel != null && this.indexDeleteHotel >= 0) {
      console.log('indexDeleteHotel: ', this.indexDeleteHotel);
      const hotel = this.hotelDataSource.data[this.indexDeleteHotel] as any;
      if (hotel.id) {
        if (hotel.usage) {
          this.baseService.showError(MESSAGE.HOTEL_CANNOT_BE_DELETED);
          return;
        }
        hotel.isDelete = true;
      } else {
        this.hotelDataSource.data.splice(this.indexDeleteHotel, 1);
        this.hotelDataSource.data = [...this.hotelDataSource.data];
      }
    } else {
      this.baseService.showError(MESSAGE.DELETE_FAIL);
    }
  }

  toggleDialogDeleteCarRental() {
    this.dialogDeleteCarRental = !this.dialogDeleteCarRental;
  }


  confirmDeleteCarRental() {
    this.toggleDialogDeleteCarRental();
    if (this.indexDeleteCarRental != null && this.indexDeleteCarRental >= 0) {
      console.log('indexDeleteCarRental: ', this.indexDeleteCarRental);
      const carRental = this.carRentalDataSource.data[this.indexDeleteCarRental] as any;
      if (carRental.id) {
        if (carRental.usage) {
          this.baseService.showError(MESSAGE.CAR_COMPANY_CANNOT_BE_DELETED);
          return;
        }
        carRental.isDelete = true;
      } else {
        this.carRentalDataSource.data.splice(this.indexDeleteCarRental, 1);
        this.carRentalDataSource.data = [...this.carRentalDataSource.data];
      }
    } else {
      this.baseService.showError(MESSAGE.DELETE_FAIL);
    }
  }

  airportCodeExistsValidator(control: AbstractControl): ValidationErrors | null {
    return this.airportCodeExists ? { airportCodeExists: true } : null
  }
}