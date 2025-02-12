import { CommonModule } from '@angular/common';
import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { ValidationErrors } from '@iplab/ngx-file-upload';
import { DigitOnlyModule } from '@uiowa/digit-only';
import moment from 'moment';
import { ClickOutside } from 'ngxtension/click-outside';
import { NgxControlError } from 'ngxtension/control-error';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { HotelService } from 'src/app/crew-trip/core/services/hotel-service';
import { VehicleService } from 'src/app/crew-trip/core/services/vehicle.service';
import { WetLeaseService } from 'src/app/crew-trip/core/services/wet-lease.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DatepickerYearMonthComponent } from 'src/app/crew-trip/shared/component/datepicker-year-month/datepicker-year-month.component';
import { DatepickerComponent } from 'src/app/crew-trip/shared/component/datepicker/datepicker.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { SeparatorDirective } from 'src/app/crew-trip/shared/directive/separator.directive';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { ListResponse } from 'src/app/crew-trip/shared/models/common.model';
import { DATE_FORMAT_DD_MM_YYYY } from 'src/app/crew-trip/shared/utils/constant';

@Component({
  selector: 'app-wet-lease-general',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule, MatAutocompleteModule,
    NgxControlError, DatepickerYearMonthComponent, DigitOnlyModule, SeparatorDirective, SelectionSuggestComponent,
    DatepickerComponent, MatDatepickerModule, NgxControlError, ClickOutside
  ],
  templateUrl: './wet-lease-general.component.html',
  styleUrl: './wet-lease-general.component.scss',
  providers: [DataTransformPipe,
    provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WetLeaseGeneralComponent extends CommonComponent implements OnInit, AfterViewChecked {
  flightMarketService = inject(FlightMarketService);
  hotelService = inject(HotelService);
  vehicleService = inject(VehicleService);
  wetLeaseService = inject(WetLeaseService);
  dataTransformPipe = inject(DataTransformPipe);
  cdRef = inject(ChangeDetectorRef);
  dataSourceHotel: MatTableDataSource<any, MatPaginator> = new MatTableDataSource<any, MatPaginator>();
  displayedColumnsHotel: string[] = ['supplierName', 'unitPriceForSingleRoom', 'unitPriceForTwinRoom', 'action'];

  dataSourceCarRental: MatTableDataSource<any, MatPaginator> = new MatTableDataSource<any, MatPaginator>();
  displayedColumnsCarRental: string[] = ['supplierName', 'unitPrice', 'action'];
  showDialogDeleteHotel = false;
  showDialogDeleteCarRental = false;
  indexDeleteHotel: any;
  indexDeleteCarRental: any;

  disabled = input<boolean>(false);
  dataGeneral = input<any>();

  airports: any[] = [];
  hotels: any[] = [];
  carRentals: any[] = [];
  maxDate: any;
  errorDiffMonth = false;

  override formGroupDetail = this.formBuilder.group({
    airportCode: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required, this.sameMonthValidator.bind(this)]],
    exchangeRate: [null, [Validators.required]],
    isHotel: [true],
    isTransport: [true],
    rateVat: []
  });

  constructor() {
    super();
    effect(() => {
      if (this.dataGeneral()) {
        const data = { ...this.dataGeneral() }
        this.formGroupDetail.patchValue(data);
        if (data.priceHotelsList) {
          this.dataSourceHotel.data = [...data.priceHotelsList];
        }
        if (data.priceTransports) {
          this.dataSourceCarRental.data = [...data.priceTransports];
        }
      }
    }, { allowSignalWrites: true });
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges(); // Phát hiện và cập nhật các thay đổi
    if (this.disabled() && !this.formGroupDetail.disabled) {
      this.formGroupDetail.disable()
    }
  }

  override async ngOnInit() {
    await this.spinner.show();
    console.log(this.dataSourceHotel.data)
    let airportRes = await this.flightMarketService.search({ option: 1, page: 0, size: 999999999, limit: 999999999 });;
    this.airports = airportRes.data

    if (this.formGroupDetail.controls.airportCode.value) {
      this.getHotelByAirport(this.formGroupDetail.controls.airportCode.value);
      this.getCaRentalByAirport(this.formGroupDetail.controls.airportCode.value);
    }
    if (this.formGroupDetail.controls.airportCode.value &&
      this.formGroupDetail.controls.startDate.value &&
      this.formGroupDetail.controls.endDate.value &&
      !this.formGroupDetail.controls.exchangeRate.value
    ) {
      this.getExchangeRate();
    }
    this.spinner.hide();
    this.formGroupDetail.controls.endDate.valueChanges.subscribe(value => {
      this.getExchangeRate()
    });

  }

  submit(): void {
    console.log(this.formGroupDetail)
  }


  checkDateInMonth() {
    const startDate = this.formGroupDetail.controls.startDate.value;
    const endDate = this.formGroupDetail.controls.endDate.value;
    if (startDate && endDate) {
      if (moment(startDate).month() !== moment(endDate).month()) {
        this.errorDiffMonth = true;
      } else {
        this.errorDiffMonth = false;
      }
    } else {
      this.errorDiffMonth = false;
    }
    this.formGroupDetail.controls.endDate.updateValueAndValidity({ emitEvent: false });
    return this.errorDiffMonth;
  }

  airportChange(data: any) {
    this.dataSourceHotel.data = []
    this.getHotelByAirport(data.value);
    this.getCaRentalByAirport(data.value);
    this.getExchangeRate()
  }

  async getHotelByAirport(airportCode: string) {
    let res: ListResponse<any> = await this.hotelService.search<ListResponse<any>>({ page: 0, limit: 9999999, marketCode: airportCode });
    this.hotels = res.data.content.map(item => {
      return {
        id: item.id,
        hotelCode: item.hotelCode,
        hotelName: item.hotelName
      }
    })
  }

  async getCaRentalByAirport(airportCode: string) {
    let res: ListResponse<any> = await this.vehicleService.search<ListResponse<any>>({ page: 0, limit: 9999999, marketCode: airportCode });
    this.carRentals = res.data.content.map(item => {
      return {
        carRentalCode: item.code,
        carRentalName: item.name
      }
    })
  }

  async getExchangeRate() {
    if (!this.checkDateInMonth() && this.formGroupDetail.controls.airportCode.value
      && this.formGroupDetail.controls.startDate.value
      && this.formGroupDetail.controls.endDate.value) {
      const response = await this.wetLeaseService.exchangeRate({
        startDate: this.dataTransformPipe.transform(this.formGroupDetail.controls.startDate.value, [this.Constant.DATE, this.Constant.LOCAL_DATE_FORMAT]),
        endDate: this.dataTransformPipe.transform(this.formGroupDetail.controls.endDate.value, [this.Constant.DATE, this.Constant.LOCAL_DATE_FORMAT]),
        airportCode: this.formGroupDetail.controls.airportCode.value
      });
      this.formGroupDetail.controls.exchangeRate.setValue(response.data);
    }
  }

  hotelChange(event: any, element: any) {
    element.hotelName = event.viewValue;
  }
  carRentalChange(event: any, element: any) {
    element.carRentalName = event.viewValue;
  }



  clickEdit(data: any, control: string) {
    data[control] = true;
  }
  clickOutside(data: any, control: string) {
    data[control] = false;
  }

  toggleDialogDeleteHotel() {
    this.showDialogDeleteHotel = !this.showDialogDeleteHotel;
  }

  toggleDialogDeleteCarRental() {
    this.showDialogDeleteCarRental = !this.showDialogDeleteCarRental;
  }

  invalidHotel() {
    if (this.dataSourceHotel.data) {
      return this.dataSourceHotel.data.some((item, index) => this.dataSourceHotel.data.map(mapItem => mapItem.hotelCode).indexOf(item.hotelCode) !== index);
    }
    return false;
  }

  addHotel() {
    const addItem = {
      supplierName: '',
      unitPriceForSingleRoom: null,
      unitPriceForTwinRoom: null
    }
    this.dataSourceHotel.data.push(addItem);
    this.dataSourceHotel.data = [...this.dataSourceHotel.data];
  }
  showConfirmDeleteHotel(index: any) {
    this.indexDeleteHotel = index;
    this.toggleDialogDeleteHotel();
  }
  deleteHotel() {
    this.dataSourceHotel.data.splice(this.indexDeleteHotel, 1);
    this.dataSourceHotel.data = [...this.dataSourceHotel.data]
    this.toggleDialogDeleteHotel()
  }

  invalidCarRental() {
    if (this.dataSourceCarRental.data) {
      return this.dataSourceCarRental.data.some((item, index) => this.dataSourceCarRental.data.map(mapItem => mapItem.carRentalCode).indexOf(item.carRentalCode) !== index);
    }
    return false;
  }

  addCarRental() {
    const addItem = {
      supplierName: '',
      unitPrice: null
    }
    this.dataSourceCarRental.data.push(addItem);
    this.dataSourceCarRental.data = [...this.dataSourceCarRental.data];
  }
  showConfirmDeleteCarRental(index: any) {
    this.indexDeleteCarRental = index;
    this.toggleDialogDeleteCarRental();
  }
  deleteCarRental() {
    this.dataSourceCarRental.data.splice(this.indexDeleteCarRental, 1);
    this.dataSourceCarRental.data = [...this.dataSourceCarRental.data]
    this.toggleDialogDeleteCarRental()
  }

  sameMonthValidator(control: AbstractControl): ValidationErrors | null {
    return this.errorDiffMonth ? { errorDiffMonth: true } : null;
  }
}
