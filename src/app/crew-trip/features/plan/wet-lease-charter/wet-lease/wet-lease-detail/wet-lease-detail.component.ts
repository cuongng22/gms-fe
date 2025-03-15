import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule, MatExpansionPanelContent } from '@angular/material/expansion';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { WetLeaseGeneralComponent } from './component/wet-lease-general/wet-lease-general.component';
import { WetLeaseHotelComponent } from './component/wet-lease-hotel/wet-lease-hotel.component';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { CategoryEnum } from '../../../budget-procurement/budget-procurement.model';
import { dataExample } from './wet-lease-detail.model';
import { WetLeaseCarRentalComponent } from './component/wet-lease-car-rental/wet-lease-car-rental.component';
import moment from 'moment';
import { WetLeaseService } from 'src/app/crew-trip/core/services/wet-lease.service';

@Component({
  selector: 'app-wet-lease-detail',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule,
    MatExpansionModule, MatExpansionPanelContent,
    WetLeaseGeneralComponent, WetLeaseHotelComponent, WetLeaseCarRentalComponent
  ],
  templateUrl: './wet-lease-detail.component.html',
  styleUrl: './wet-lease-detail.component.scss'
})
export class WetLeaseDetailComponent extends CommonComponent {
  override baseService = inject(WetLeaseService);
  router = inject(Router);
  @ViewChild('wetLeaseGeneral') wetLeaseGeneral: WetLeaseGeneralComponent;
  @ViewChild('wetLeaseHotel') wetLeaseHotel: WetLeaseHotelComponent;
  @ViewChild('wetLeaseCarRental') wetLeaseCarRental: WetLeaseCarRentalComponent;
  CategoryEnum = CategoryEnum;
  dataHotels: any[];

  _planHotel: any[] = [];
  _planTransports: any[] = [];
  _dataGeneral: any;
  _priceHotel: any[];

  id = input<number>();
  viewDetail = input<string>("true", { alias: 'view-detail' });
  isCompleted: boolean = false;
  category = signal<CategoryEnum>(CategoryEnum.DOMESTIC);

  override formGroupDetail = this.formBuilder.group({
    id: [],
    isCompleted: [false]
  });
  showDialogCreateData: boolean = false;
  isCreateData = false;

  showDialogClose = false;

  constructor() {
    super();
  }

  override async ngOnInit() {
    this.getDetailById(this.id());
  }


  async getDetailById(id: number | undefined) {
    try {
      await this.spinner.show();
      if (id) {
        let resDetail = await this.baseService.detail(this.id());
        this.formGroupDetail.patchValue({ ...resDetail.data });

        this.airportCodeChange(resDetail.data.airportCode)
        this.dataGeneral = { ...resDetail.data, id: this.id() };
        this.wetLeaseGeneral.setData(this.dataGeneral)
        this.planHotel = [...resDetail.data.planHotel];
        this.planTransports = [...resDetail.data.planTransports];
        this.setPriceHotel();
        this.setPriceCarRental();
        this.priceHotel = [...resDetail.data.priceHotelsList];

        this.isCompleted = !!this.formGroupDetail.controls.isCompleted.value;
        if (this.disable) {
          this.formGroupDetail.controls.isCompleted.disable()
        }
      }
    } finally {
      this.spinner.hide()
    }

  }

  get disable(): boolean {
    return (this.viewDetail() === 'true') || this.isCompleted
  }

  // set đơn giá vào từng object Hotel
  setPriceHotel() {
    const _priceHotelsList: any[] = this.dataGeneral.priceHotelsList;
    this.planHotel.forEach((element: any) => {
      Object.entries<any>(element.hotelItem).forEach(([hotelCode, hotelValue]) => {
        const _itemPrice = _priceHotelsList.find(item => item.hotelCode === hotelCode);
        hotelValue.singleRoomPrice = Number(_itemPrice.singleRoomPrice);
        hotelValue.twinRoomPrice = Number(_itemPrice.twinRoomPrice);
      })
    });
  }

  // set đơn giá nhà xe
  setPriceCarRental() {
    const _priceTransports: any[] = this.dataGeneral.priceTransports;
    this.planTransports.forEach((element: any) => {
      const _itemPrice = _priceTransports.find(item => item.carRentalCode === element.transportCode);
      element.unitPrice = _itemPrice.unitPrice;
    });
  }

  createData() {
    this.wetLeaseGeneral.formGroupDetail.markAllAsTouched();
    const isRequiredHotelAndTrans = this.wetLeaseGeneral.checkRequiredHotelAndTransportation();
    const _dataGeneral = this.wetLeaseGeneral.formGroupDetail.getRawValue();
    if (this.wetLeaseGeneral.formGroupDetail.invalid ||
      this.wetLeaseGeneral.duplicateCarRental() ||
      this.wetLeaseGeneral.duplicateSupplierHotel()
    ) {
      return;
    } else if (
      (_dataGeneral.isHotel && this.wetLeaseGeneral.dataSourceHotel.data.length <= 0) ||
      (_dataGeneral.isTransport && this.wetLeaseGeneral.dataSourceCarRental.data.length <= 0) ||
      isRequiredHotelAndTrans
    ) {
      this.showError($localize`:@@cannotCreateDataWithoutHotelOrTransportationData:Cannot create data without hotel or transportation data`)
      return;
    } else if (
      ((_dataGeneral.isHotel && this.wetLeaseHotel.dataSource.data && this.wetLeaseHotel.dataSource.data.length > 0)) ||
      ((_dataGeneral.isTransport && this.wetLeaseCarRental.dataSource.data && this.wetLeaseCarRental.dataSource.data.length > 0))
    ) {
      this.toggleDialogCreateData();
    } else {
      this.confirmCreateData()
    }

    // if (this.wetLeaseGeneral.formGroupDetail.valid &&
    //   !this.wetLeaseGeneral.duplicateCarRental() &&
    //   !this.wetLeaseGeneral.duplicateSupplierHotel() &&
    //   (!_dataGeneral.isHotel || (_dataGeneral.isHotel && this.wetLeaseGeneral.dataSourceHotel.data.length > 0)) &&
    //   (!_dataGeneral.isTransport || (_dataGeneral.isTransport && this.wetLeaseGeneral.dataSourceCarRental.data.length > 0)) &&
    //   !isRequiredHotelAndTrans
    // ) {

    // }
  }

  async confirmCreateData() {
    this.showDialogCreateData = false;
    await this.spinner.show();
    const _dataGeneral = this.wetLeaseGeneral.formGroupDetail.getRawValue();
    let _startDate = moment(this.wetLeaseGeneral.formGroupDetail.controls.startDate.value);
    let _endDate = moment(this.wetLeaseGeneral.formGroupDetail.controls.endDate.value);


    let _priceHotelsList = [...(_dataGeneral.isHotel ? this.wetLeaseGeneral.dataSourceHotel.data : [])];
    let _priceTransports = [...(_dataGeneral.isTransport ? this.wetLeaseGeneral.dataSourceCarRental.data : [])];
    let _planHotel = [];

    while (_startDate <= _endDate) {
      const _startDateCopy = _startDate.clone();
      let planHotelItem: any = {
        wetLeaseDate: _startDateCopy.format(this.Constant.LOCAL_DATE_FORMAT),
        hotelItem: {}
      }
      _priceHotelsList.forEach(element => {
        let hotelItem =
        {
          hotelCode: element.hotelCode,
          hotelName: element.hotelName,
          totalSingleRoom: 0,
          totalTwinRoom: 0,
          twinRoomPrice: Number(element.twinRoomPrice),
          singleRoomPrice: Number(element.singleRoomPrice),
        };
        planHotelItem.hotelItem[element.hotelCode] = hotelItem;
      })
      _planHotel.push(planHotelItem);
      _startDate.add(1, 'day'); // Tăng ngày lên 1
    }

    this.planHotel = _planHotel;
    this.priceHotel = _priceHotelsList;


    let _planTransports: any[] = [];
    _priceTransports.forEach(element => {
      const _carRental = {
        transportCode: element.carRentalCode,
        transportName: element.carRentalName,
        numberOfTrip: 0,
        unitPrice: Number(element.unitPrice),
        totalAmountForex: 0,
        totalAmountIncVAT: 0,
        totalAmountExcVAT: 0
      }
      _planTransports.push(_carRental)
    });
    this.planTransports = _planTransports;

    this.wetLeaseHotel.totalPlannedBudget = {}

    this.dataGeneral = { ...this.wetLeaseGeneral.formGroupDetail.getRawValue() };
    this.isCreateData = true;

    this.spinner.hide()
  }

  async saveAndProccess() {
    const res = await this.save();
    if (res?.data && !this.id()) {
      this.router.navigate(['/plan/est-plan/wet-lease-charter/wet-lease-detail', res.data])
    } else if (this.id()) {
      this.getDetailById(this.id())
    }
  }

  async saveAndClose() {
    try {
      await this.save();
      debugger
      this.router.navigate(['/plan/est-plan/wet-lease-charter'], { fragment: 'wet-lease' })
    } catch (error) {
      console.error(error)
    }

  }

  override async save(): Promise<any> {
    this.wetLeaseGeneral.formGroupDetail.markAllAsTouched();
    const isRequiredHotelAndTrans = this.wetLeaseGeneral.checkRequiredHotelAndTransportation();
    const _dataGeneral = this.wetLeaseGeneral.formGroupDetail.getRawValue();
    if (this.wetLeaseGeneral.formGroupDetail.invalid ||
      this.wetLeaseGeneral.duplicateCarRental() ||
      this.wetLeaseGeneral.duplicateSupplierHotel()
    ) {
      return;
    } else if (
      (_dataGeneral.isHotel && this.wetLeaseGeneral.dataSourceHotel.data.length <= 0) ||
      (_dataGeneral.isTransport && this.wetLeaseGeneral.dataSourceCarRental.data.length <= 0) ||
      isRequiredHotelAndTrans
    ) {
      this.showError($localize`:@@cannotSaveDataWithoutHotelOrTransportationData:Cannot save data without hotel or transportation data`)
      return;
    }

    await this.spinner.show()
    const _priceHotelsList = _dataGeneral.isHotel ? this.wetLeaseGeneral.dataSourceHotel.data : [];
    const _priceTransports = _dataGeneral.isTransport ? this.wetLeaseGeneral.dataSourceCarRental.data : [];
    const _planHotel = _dataGeneral.isHotel ? this.wetLeaseHotel.dataSource.data : [];
    const _planTransports = _dataGeneral.isTransport ? this.wetLeaseCarRental.dataSource.data : [];

    let _body: any = { ..._dataGeneral }
    _body.id = this.formGroupDetail.controls.id.value;
    _body.isCompleted = this.formGroupDetail.controls.isCompleted.value;
    _body.startDate = moment(_dataGeneral.startDate).format(this.Constant.LOCAL_DATE_FORMAT);
    _body.endDate = moment(_dataGeneral.endDate).format(this.Constant.LOCAL_DATE_FORMAT);
    _body.priceHotelsList = [..._priceHotelsList];
    _body.priceTransports = [..._priceTransports];
    _body.planHotel = [..._planHotel];
    _body.planTransports = [..._planTransports];
    _body.totalCountForeign = [..._planHotel.map(item => item.totalCountForeign).flat(), ..._planTransports.map(item => item.totalAmountForex).flat()].reduce((acc, value) => acc + value, 0)
    _body.totalSingleRoom = _planHotel.map(item => item.totalQtySingleRoom).reduce((acc, value) => acc + value, 0);
    _body.totalTwinRoom = _planHotel.map(item => item.totalQtyTwinRoom).reduce((acc, value) => acc + value, 0);
    _body.totalNumberOfTrip = _planTransports.map(item => item.numberOfTrip).reduce((acc, value) => acc + value, 0);
    _body.totalIncVat = [..._planHotel.map(item => item.totalIncVAT).flat(), ..._planTransports.map(item => item.totalAmountIncVAT).flat()].reduce((acc, value) => acc + value, 0);
    _body.totalExcVat = [..._planHotel.map(item => item.totalExcVAT).flat(), ..._planTransports.map(item => item.totalAmountExcVAT).flat()].reduce((acc, value) => acc + value, 0)

    console.log(_body);

    try {
      const update = !!this.formGroupDetail.getRawValue().id;
      let res;
      if (update) {
        res = await this.baseService.update(_body);
      } else {
        res = await this.baseService.create(_body);
      }
      this.baseService.showSuccess(
        update ? this.MESSAGE.UPDATE_SUCCESS : this.MESSAGE.CREATE_SUCCESS,
      );
      return res;
    } catch (error: any) {
      console.error(error)
      throw error;
    } finally {
      this.spinner.hide()
    }
    this.spinner.hide()

  }

  async airportCodeChange(event: string) {
    const res = await this._flightMarketService.search({ code: event, option: 0 });
    this.category.set(res.data.content[0].marketType)
  }

  wetLeaseGeneralClearData() {
    this.wetLeaseHotel.dataSource.data = [];
    this.planHotel = []
    this.wetLeaseCarRental.dataSource.data = [];
    this.planTransports = []
  }

  get planHotel() {
    return this._planHotel;
  }

  get planTransports() {
    return this._planTransports;
  }

  set planTransports(value: any[]) {
    this._planTransports = value;
  }

  set planHotel(value: any[]) {
    this._planHotel = value;
  }

  get dataGeneral() {
    return this._dataGeneral;
  }

  set dataGeneral(value: any) {
    this._dataGeneral = value;
  }

  get priceHotel() {
    return this._priceHotel;
  }

  set priceHotel(value: any[]) {
    this._priceHotel = value
  }

  toggleDialogCreateData() {
    this.showDialogCreateData = !this.showDialogCreateData;
  }

  toggleDialogClose() {
    this.showDialogClose = !this.showDialogClose;
  }

}
