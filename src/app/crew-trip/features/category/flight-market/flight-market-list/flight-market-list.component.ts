import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { Observable, debounceTime, startWith, map } from 'rxjs';
import { FlightMarketService } from 'src/app/crew-trip/core/services/ flight-market.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { Constant } from 'src/app/crew-trip/shared/utils/constant';
import { CustomMatPaginatorIntl } from 'src/app/customizer-settings/paginator-intl.service';
import { CarRentalDetailComponent } from '../car-rental-detail/car-rental-detail.component';
import { HotelDetailComponent } from '../hotel-detail/hotel-detail.component';

@Component({
  selector: 'app-flight-market-list',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, MatChipsModule, RouterLink, RouterModule],
  providers: [DataTransformPipe, { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }],
  templateUrl: './flight-market-list.component.html',
  styleUrl: './flight-market-list.component.scss'
})
export class FlightMarketListComponent extends CommonComponent implements OnInit {
  override baseService = inject(FlightMarketService);

  formBuilder = inject(FormBuilder);

  // danh sách thị trường
  markets: any[] = [];
  filteredOptionsMarket: Observable<any[]>;

  override formGroupSearch = this.formBuilder.group({
    s: [''], //Keyword Search
    code: [''], // Mã thị trường
    type: [''], // Phân Loại 
    status: [''], // Trạng thái thị trường
    contractStartDate: [''], // Ngày hợp đồng từ
    contractEndDate: [''], // Ngày hợp đồng đến
  });

  constructor(public dataTransformPipe: DataTransformPipe, public dialog: MatDialog) {
    super();
  }

  override ngOnInit(): void {

    this.displayedColumns = ['stt', 'airport', 'hotelName', 'carRentalCompany', 'country', 'category', 'flightGroup', 'costCategory', 'status', 'action'];

    // Danh sách thị trường
    this.search();

    // Lấy danh sách thị trường cho ô search
    this.baseService.search({ option: 1 }).then(res => {
      this.markets = res.data;

      this.filteredOptionsMarket = this.formGroupSearch.controls.code.valueChanges.pipe(
        debounceTime(300), // Đợi 300ms sau lần nhập cuối cùng
        startWith(''),
        map(value => this._filterMarket(value ?? '')));
    });
  }

  override search(): any {
    console.log(this.formGroupSearch.value)
    const contractStartDate = this.formGroupSearch.controls.contractStartDate.value;
    const contractEndDate = this.formGroupSearch.controls.contractEndDate.value;
    const searchValue = {
      ...this.formGroupSearch.value, option: 0,
      contractStartDate: contractStartDate ? this.dataTransformPipe.transform(contractStartDate, ['date', Constant.DATE_FORMAT]) : null,
      contractEndDate: contractEndDate ? this.dataTransformPipe.transform(contractEndDate, ['date', Constant.DATE_FORMAT]) : null,
    };
    super.search(searchValue);
  }


  private _filterMarket(value: string): any[] {
    if (!value) {
      return this.markets;
    }
    const filterValue = value.toLowerCase();
    return this.markets.filter(market => market.value.toLowerCase().includes(filterValue));
  }

  showHotelDetail(isCreate?: boolean, hotel?: any, airport?: string) {
    if (hotel) {
      hotel = {
        ...hotel, activeLable: hotel.active ? this.MESSAGE.ACTIVE : this.MESSAGE.INACTIVE,
        airport: airport
      }
    }
    this.dialog.open(HotelDetailComponent, {
      data: { hotel: hotel, isCreate: isCreate },
    })
  }


  showCarRentalDetail(isCreate?: boolean, carRental?: any, airport?: string) {
    if (carRental) {
      carRental = {
        ...carRental, activeLable: carRental.active ? this.MESSAGE.ACTIVE : this.MESSAGE.INACTIVE,
        airport: airport
      }
    }
    this.dialog.open(CarRentalDetailComponent, {
      data: { carRental: carRental, isCreate: isCreate },
    })
  }


}

