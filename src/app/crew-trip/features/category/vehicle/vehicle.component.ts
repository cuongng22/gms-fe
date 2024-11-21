import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { map, Observable, startWith } from 'rxjs';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { VehicleService } from 'src/app/crew-trip/core/services/vehicle.service';
import { FlightMarketService } from 'src/app/crew-trip/core/services/ flight-market.service';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { Constant, DATE_FORMAT_DD_MM_YYYY } from 'src/app/crew-trip/shared/utils/constant';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule
  ],
  providers: [DataTransformPipe,
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_DD_MM_YYYY },
    { provide: MAT_NATIVE_DATE_FORMATS, useValue: DATE_FORMAT_DD_MM_YYYY },
    provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),

  ],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent extends CommonComponent implements OnInit {
  override baseService = inject(VehicleService);
  flightMarketService = inject(FlightMarketService);
  formBuilder = inject(FormBuilder);

  @ViewChild('marketCode') marketCode: ElementRef<HTMLInputElement>;

  // danh sách thị trường
  markets: any[] = [];
  filteredOptionsMarket: any[];

  override formGroupSearch = this.formBuilder.group({
    s: [''], //Keyword Search
    marketCode: [''],
    contractStartDate: [''],
    contractEndDate: [''],
    active: [''],
  });

  override formGroupDetail = this.formBuilder.group({
    id: [''],
    department: ['', Validators.required],
    fullName: ['', Validators.required],
    gender: [true],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    roles: [([] as any), Validators.required],
    active: [true, [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')]],
    description: ['']
  });

  constructor(public dataTransformPipe: DataTransformPipe) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();


    this.displayedColumns = ['stt', 'market', 'carRentalCompany', 'address', 'contactDetails', 'active', 'notes'];
    this.search();

    // Lấy danh sách thị trường
    this.flightMarketService.search({ option: 1 }).then(res => {
      this.markets = res.data;
    });
  }

  filterMarket(): void {
    const filterValue = this.marketCode.nativeElement.value.toLowerCase();
    if (!filterValue) {
      this.filteredOptionsMarket = this.markets;
    }
    this.filteredOptionsMarket = this.markets.filter(market => market.toLowerCase().includes(filterValue));
  }

  override search(body?: any, isNextPage?: boolean): any {
    const contractStartDate = this.formGroupSearch.controls.contractStartDate.value;
    const contractEndDate = this.formGroupSearch.controls.contractEndDate.value;
    const searchValue = {
      ...this.formGroupSearch.value,
      contractStartDate: contractStartDate ? this.dataTransformPipe.transform(contractStartDate, ['date', Constant.DATE_FORMAT]) : null,
      contractEndDate: contractEndDate ? this.dataTransformPipe.transform(contractEndDate, ['date', Constant.DATE_FORMAT]) : null,
    };
    super.search(searchValue, isNextPage);
  }
}

