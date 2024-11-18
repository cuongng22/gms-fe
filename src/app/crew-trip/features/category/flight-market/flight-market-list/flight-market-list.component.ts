import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, viewChild, model, ElementRef, ViewChild, DestroyRef } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Observable, debounceTime, startWith, map, Subject } from 'rxjs';
import { FlightMarketService } from 'src/app/crew-trip/core/services/ flight-market.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { Constant, MESSAGE } from 'src/app/crew-trip/shared/utils/constant';
import { CustomMatPaginatorIntl } from 'src/app/customizer-settings/paginator-intl.service';
import { CarRentalDetailComponent } from '../car-rental-detail/car-rental-detail.component';
import { HotelDetailComponent } from '../hotel-detail/hotel-detail.component';
import { FileUploadComponent, FileUploadModule, FileUploadValidators } from '@iplab/ngx-file-upload';
import { File } from 'buffer';
import { subscribe } from 'diagnostics_channel';

@Component({
  selector: 'app-flight-market-list',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, MatChipsModule, RouterLink, RouterModule, FileUploadModule],
  providers: [DataTransformPipe, { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }],
  templateUrl: './flight-market-list.component.html',
  styleUrl: './flight-market-list.component.scss'
})
export class FlightMarketListComponent extends CommonComponent implements OnInit {
  override baseService = inject(FlightMarketService);
  private readonly destroyRef = inject(DestroyRef);

  formBuilder = inject(FormBuilder);

  // danh sách thị trường
  markets: any[] = [];
  filteredOptionsMarket = model<any[]>([]);
  keySearchMarket = new Subject<string>();
  @ViewChild('airport') airport: ElementRef<HTMLInputElement>;

  showDialogUpload = false;

  uploadFileError: { blob?: Blob, fileName?: string, totalErrors?: string } = {};

  override formGroupDetail = this.formBuilder.group({
    id: ['']
  });
  override formGroupSearch = this.formBuilder.group({
    s: [''], //Keyword Search
    code: [''], // Mã thị trường
    type: [''], // Phân Loại
    status: [''], // Trạng thái thị trường
    contractStartDate: [''], // Ngày hợp đồng từ
    contractEndDate: [''], // Ngày hợp đồng đến
  });

  fileUpload = new FormControl<File[]>([], [Validators.required, FileUploadValidators.filesLimit(1)]);

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

      this.keySearchMarket.pipe(
        debounceTime(500), // Đợi 300ms sau lần nhập cuối cùng
        startWith(''),
      ).subscribe((value: string) => this._filterMarket(value ?? ''));
    });

    this.destroyRef.onDestroy(() => {
      this.keySearchMarket.unsubscribe();
    });
  }

  override search(body?: any, isNextPage?: boolean): any {
    console.log(this.formGroupSearch.value);
    const contractStartDate = this.formGroupSearch.controls.contractStartDate.value;
    const contractEndDate = this.formGroupSearch.controls.contractEndDate.value;
    const searchValue = {
      ...this.formGroupSearch.value, option: 0,
      contractStartDate: contractStartDate ? this.dataTransformPipe.transform(contractStartDate, ['date', Constant.DATE_FORMAT]) : null,
      contractEndDate: contractEndDate ? this.dataTransformPipe.transform(contractEndDate, ['date', Constant.DATE_FORMAT]) : null,
    };
    super.search(searchValue);
  }


  private _filterMarket(value: string): void {
    if (!value) {
      this.filteredOptionsMarket.set(this.markets);
      return;
    }
    const filterValue = value.toLowerCase();
    this.filteredOptionsMarket.set(this.markets.filter(market => market?.toLowerCase().includes(filterValue)));
  }

  showHotelDetail(isViewDetail?: boolean, hotel?: any, marketCode?: string) {
    if (hotel) {
      hotel = {
        ...hotel, activeLable: hotel.active ? this.MESSAGE.ACTIVE : this.MESSAGE.INACTIVE,
        marketCode: marketCode
      };
    }
    this.dialog.open(HotelDetailComponent, {
      data: { hotel: hotel, isViewDetail: isViewDetail },
    });
  }


  showCarRentalDetail(isViewDetail?: boolean, carRental?: any, marketCode?: string) {
    if (carRental) {
      carRental = {
        ...carRental, activeLable: carRental.active ? this.MESSAGE.ACTIVE : this.MESSAGE.INACTIVE,
        marketCode: marketCode
      };
    }
    this.dialog.open(CarRentalDetailComponent, {
      data: { carRental: carRental, isViewDetail: isViewDetail },
    });
  }


  override async delete() {
    if (this.formGroupDetail.value.id) {
      super.delete();
    }
  }

  async uploadFile() {
    try {
      this.fileUpload.markAllAsTouched();
      if (this.fileUpload.valid && this.fileUpload.value) {
        const form = new FormData();
        const file: File = this.fileUpload.value[0];
        form.append('file', new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type }));
        await this.spinner.show();
        const res = await this.baseService.uploadFile(form);
        this.uploadFileError = res;
        if (!res.totalErrors) {
          this.baseService.showSuccess(this.MESSAGE.UPLOAD_SUCCESS);
          this.search();
          this.toggleDialogUpload();
        }
      }
    } catch (e: any) {
      this.baseService.showError(e.error?.error ?? e.error?.error?.code ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async downloadFileError() {
    if (this.uploadFileError.blob) {
      this.downloadFile(this.uploadFileError.blob, this.uploadFileError.fileName ?? 'file-error.xlsx');
    }
  }

  toggleDialogUpload() {
    this.showDialogUpload = !this.showDialogUpload;
  }

  filterMarket(): void {
    const filterdValue = this.airport.nativeElement.value;
    if (!filterdValue) {
      this.filteredOptionsMarket.set(this.markets);
      return;
    }
    this.keySearchMarket.next(filterdValue);
  }
}

