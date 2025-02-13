import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { DigitOnlyModule } from '@uiowa/digit-only';
import moment from 'moment';
import { ClickOutside } from 'ngxtension/click-outside';
import { NgxControlError } from 'ngxtension/control-error';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';
import { CharterService } from 'src/app/crew-trip/core/services/charter.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DatepickerYearMonthComponent } from 'src/app/crew-trip/shared/component/datepicker-year-month/datepicker-year-month.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { SeparatorDirective } from 'src/app/crew-trip/shared/directive/separator.directive';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { DATE_FORMAT_DD_MM_YYYY } from 'src/app/crew-trip/shared/utils/constant';
import { DatepickerComponent } from 'src/app/ui-elements/datepicker/datepicker.component';

@Component({
  selector: 'app-charter-general',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule, MatAutocompleteModule,
    NgxControlError, DatepickerYearMonthComponent, DigitOnlyModule, SeparatorDirective, SelectionSuggestComponent,
    DatepickerComponent, MatDatepickerModule, NgxControlError, ClickOutside
  ],
  templateUrl: './charter-general.component.html',
  styleUrl: './charter-general.component.scss',
  providers: [DataTransformPipe,
    provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),
  ]
})
export class CharterGeneralComponent extends CommonComponent {
  override baseService: CharterService = inject(CharterService);
  airportCodeChange = output<string>();
  dataTransformPipe = inject(DataTransformPipe);

  disabled = input<boolean>(false);
  override displayedColumns: string[] = ['carType', 'priceIncVat', 'action'];
  errorDiffMonth = false;
  indexDeleteCarRental: any;

  override formGroupDetail = this.formBuilder.group({
    airportCode: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required, this.sameMonthValidator.bind(this)]],
    exchangeRate: [null, [Validators.required]],
    isHotel: [true],
    isTransport: [true],
    isECI: [false],
    isLCO: [false],
    rateVat: [],
    priceHotel: this.formBuilder.group({
      numberOfNight: [0, [Validators.required]],
      priceSingleRoom: [0, [Validators.required]],
      priceTwinRoom: [0, [Validators.required]],
      priceSingleRoomECI: [0, [Validators.required]],
      priceTwinRoomECI: [0, [Validators.required]],
      priceSingleRoomLCO: [0, [Validators.required]],
      priceTwinRoomLCO: [0, [Validators.required]],
    })
  });


  override ngOnInit(): void {
    this.loadListFlightMarket({ status: 'Operational' });
  }




  airportChange(data: any) {
    // this.dataSourceHotel.data = []
    // this.getHotelByAirport(data.value);
    // this.getCaRentalByAirport(data.value);
    this.getExchangeRate();
    this.airportCodeChange.emit(data.value);
  }

  async getExchangeRate() {
    if (!this.checkDateInMonth() && this.formGroupDetail.controls.airportCode.value
      && this.formGroupDetail.controls.startDate.value
      && this.formGroupDetail.controls.endDate.value) {
      const response = await this.baseService.exchangeRate({
        startDate: this.dataTransformPipe.transform(this.formGroupDetail.controls.startDate.value, [this.Constant.DATE, this.Constant.LOCAL_DATE_FORMAT]),
        endDate: this.dataTransformPipe.transform(this.formGroupDetail.controls.endDate.value, [this.Constant.DATE, this.Constant.LOCAL_DATE_FORMAT]),
        airportCode: this.formGroupDetail.controls.airportCode.value
      });
      this.formGroupDetail.controls.exchangeRate.setValue(response.data);
    }
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

  sameMonthValidator(control: AbstractControl): ValidationErrors | null {
    return this.errorDiffMonth ? { errorDiffMonth: true } : null;
  }

  invalidCarRental() {
    if (this.dataSource.data) {
      return this.dataSource.data.map(item => item.cartType.toLowerCase()).some((item, index, array) => array.indexOf(item) !== index);
    }
    return false;
  }

  addCarRental() {
    const addItem = {
      cartType: null,
      priceIncVat: 0
    }
    this.dataSource.data.push(addItem);
    this.dataSource.data = [...this.dataSource.data];
  }

  async showConfirmDeleteCarRental(id: any) {
    this.indexDeleteCarRental = id
    this.toggleDialogDelete();
  }

  deleteCarRental() {
    this.dataSource.data.splice(this.indexDeleteCarRental, 1);
    this.dataSource.data = [...this.dataSource.data]
    this.toggleDialogDelete()
  }


  clickEdit(data: any, control: string) {
    data[control] = true;
  }
  clickOutside(data: any, control: string) {
    data[control] = false;
  }

}
