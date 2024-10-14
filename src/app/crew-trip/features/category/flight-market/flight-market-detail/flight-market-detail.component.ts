import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, effect, ElementRef, inject, input, model, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-flight-market-detail',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, MatChipsModule, RouterLink, RouterModule],
  templateUrl: './flight-market-detail.component.html',
  styleUrl: './flight-market-detail.component.scss'
})
export class FlightMarketDetailComponent extends CommonComponent implements OnInit {
  formBuilder = inject(FormBuilder);
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


  searchCostCategory = model<string>('');
  debounceSearchCostCategory = debouncedSignal(this.searchCostCategory, 300);

  filteredCountry = model<any[]>([]);
  costCategorysRaw: any[] = [];
  costCategorys: any[] = [];
  countries: any[] = [];
  flightGroupData = FlightGroupData;

  hotelDataSource = new MatTableDataSource<any[]>([]);
  hotelColumns = ["hotelCode", "hotelName", "address", "fullName", "email", "phone", "active", "notes"];
  dialogDeleteHotel = false;
  indexDeleteHotel: number;

  carRentalDataSource = new MatTableDataSource<any[]>([]);
  carRentalColumns = ["code", "name", "address", "fullName", "email", "phone", "active", "notes"];
  dialogDeleteCarRental = false;
  indexDeleteCarRental: number;

  override formGroupDetail = this.formBuilder.group({
    id: [],
    marketCode: [''],
    marketName: [''],
    nationId: [''],
    nationName: [''],
    marketType: [''],
    flightGroup: [''],
    serviceFeeCode: [''],
    statusUsage: [''],
    notes: [''],

  });

  constructor(@Inject(LOCALE_ID) public locale: string, public dialog: MatDialog,
    private activeRoute: ActivatedRoute, private router: Router) {
    super();
    console.debug('locale: ', locale);


    // tìm kiếm danh mục chi phí
    effect(() => {
      const keySearch = this.debounceSearchCostCategory();
      if (!keySearch) {
        this.costCategorys = this.costCategorysRaw;
      } else {
        this.costCategorys = this.costCategorysRaw.filter(x => (x.name.toLowerCase().includes(keySearch.toLowerCase()) || x.code.toLowerCase().includes(keySearch.toLowerCase())));
      }

    });

  }
  override async ngOnInit() {

    // Lấy chi tiết flight market
    if (this.id()) {
      await this.baseService.detail(this.id()).then(res => {
        this.formGroupDetail.patchValue(res.data);
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
    this.nationService.search({ page: 0, size: 99999 }).then(res => {
      this.countries = res.data.content;
      this.filteredCountry.set(this.countries);

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
        this.formGroupDetail.get(control)?.disable()
      });
    } else {
      // thêm cột action cho table carRental and hotel
      this.hotelColumns.push("action");
      this.carRentalColumns.push("action");
    }
    console.log('this.id(): ', this.id());
    console.log('!!this.id(): ', !!this.id());
    this.isCreate.set(!!this.id());
    console.log('this.isCreate: ', this.isCreate());
  }

  override ngAfterViewInit(): void {
  }

  filterCountry(): void {
    const filterValue = this.nationName.nativeElement.value;
    if (!filterValue) {
      this.filteredCountry.set(this.countries);
      return;
    }
    this.filteredCountry.set(this.countries.filter(country => this.locale == LOCALE.VN ?
      country.vniName.toLowerCase().includes(filterValue.toLowerCase()) :
      country.engName.toLowerCase().includes(filterValue.toLowerCase())
    ))
  }

  countrySelected(country: MatAutocompleteSelectedEvent) {
    const selectedCountry = country.option.value;
    this.formGroupDetail.controls.nationId.setValue(selectedCountry.id);
    this.formGroupDetail.controls.nationName.setValue(this.locale == LOCALE.VN ? selectedCountry.vniName : selectedCountry.engName);
  }

  // detail or edit, create hotel
  hotelDetail(isViewDetail: boolean, hotel?: any) {
    if (!isViewDetail && hotel) {
      hotel = {
        ...hotel, marketCode: this.formGroupDetail.controls.marketCode.value
      };
    }
    let dialogRef = this.dialog.open(HotelDetailComponent, {
      data: { hotel: hotel, isViewDetail: isViewDetail },
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(result => {
      const hotelDatas = this.hotelDataSource.data as any[] || [];
      if (result) {
        const index = hotelDatas.findIndex(hotel => hotel.id === result.id);
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
    let dialogRef = this.dialog.open(CarRentalDetailComponent, {
      data: { carRental: carRental, isViewDetail: isViewDetail },
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result: ', result);
      const carRentalDatas = this.carRentalDataSource.data as any[] || [];
      console.log('carRentalDatas: ', carRentalDatas);
      if (result) {
        const index = carRentalDatas.findIndex(carRental => carRental.id === result.id);
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
      let isUpdate = !!this.formGroupDetail.value.id;
      this.spinner.show();
      let res;
      if (isUpdate) {
        const body = this.updateBody(this.formGroupDetail.value, this.hotelDataSource.data, this.carRentalDataSource.data)
        res = await this.baseService.update(body);
      } else {
        const body = this.createBody(this.formGroupDetail.value, this.hotelDataSource.data, this.carRentalDataSource.data);
        res = await this.baseService.create(body);
      }
      console.log(res)
      this.baseService.showSuccess(isUpdate ? MESSAGE.UPDATE_SUCCESS : MESSAGE.CREATE_SUCCESS);
      this.router.navigate(['/category/flight-market']);
    } catch (e: any) {
      console.error(e);
      this.baseService.showError((e.error?.error?.code) ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  createBody(flightMarketData: any, hotelDatas: any[], carRentalDatas: any[]): any {
    let marketFlight: CreateMarketFlight = new CreateMarketFlight(flightMarketData);
    let hotels: CreateHotel[] = [];
    let carRentals: CreateVehiclePartner[] = [];

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
    let deleteItems: { id: number; type: string }[] = [];
    let updateItems: UpdateHotelAndCar[] = [];
    let insertItems: InsertHotelAndCar[] = [];
    let updateFlightMarket: UpdateFlightMarket = new UpdateFlightMarket(flightMarketData);

    hotelDatas.forEach(hotel => {
      if (hotel.isDelete) {
        deleteItems.push({ id: hotel.id, type: 'HOTEL' });
      } else if (hotel.id) {
        updateItems.push(new UpdateHotelAndCar({ ...hotel, type: 'HOTEL' }));
      } else {
        insertItems.push(new InsertHotelAndCar({ ...hotel, type: 'HOTEL' }));
      }
    })

    carRentalDatas.forEach(carRental => {
      if (carRental.isDelete) {
        deleteItems.push({ id: carRental.id, type: 'HOTEL' });
      } else if (carRental.id) {
        updateItems.push(new UpdateHotelAndCar({ ...carRental, type: 'VEHICLE' }));
      } else {
        insertItems.push(new InsertHotelAndCar({ ...carRental, type: 'VEHICLE' }));
      }
    })

    return { id: flightMarketData.id, ...updateFlightMarket, insertItems: insertItems, updateItems: updateItems, deleteItems: deleteItems }
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
        carRental.isDelete = true;
      } else {
        this.carRentalDataSource.data.splice(this.indexDeleteCarRental, 1);
        this.carRentalDataSource.data = [...this.carRentalDataSource.data];
      }
    } else {
      this.baseService.showError(MESSAGE.DELETE_FAIL);
    }
  }
}