import {HttpStatusCode} from '@angular/common/http';
import {Component, EventEmitter, inject, Input, OnInit, Output,} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import moment from 'moment';
import {FlightMarketService} from 'src/app/crew-trip/core/services/flight-market.service';
import {HotelService} from 'src/app/crew-trip/core/services/hotel-service';
import {InvoiceFormService} from 'src/app/crew-trip/core/services/invoice-form-service';
import {VehicleService} from 'src/app/crew-trip/core/services/vehicle.service';
import {FlightMarketStatusEnum} from 'src/app/crew-trip/features/category/flight-market/flight-market.model';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {ListResponse} from 'src/app/crew-trip/shared/models/common.model';
import {Constant, DATE_FORMAT_DD_MM_YYYY, MESSAGE, removeNullValues,} from 'src/app/crew-trip/shared/utils/constant';
import {BaseImport} from "src/app/crew-trip/shared/base-import";

@Component({
  selector: 'app-invoice-history',
  standalone: true,
  imports: [
    BaseImport
  ],
  templateUrl: './invoice-history.component.html',
  styleUrl: './invoice-history.component.scss',
  providers: [
    provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY, {useUtc: true}),
  ],
})
export class InvoiceHistoryComponent extends CommonComponent implements OnInit {
  viewType = 'HD'; //HD-PL
  override baseService = inject(InvoiceFormService);
  flightMarketService = inject(FlightMarketService);
  hotelService = inject(HotelService);
  vehicleService = inject(VehicleService);
  fb = inject(FormBuilder);

  //variable
  @Input() partnerType: any;
  @Output() nextStepEmit = new EventEmitter<any>();
  step = 1;
  readMode = true;
  action = 'edit';
  id: any;
  // startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  // endOfMonth = moment().endOf('month').format('YYYY-MM-DD');
  startOfMonth = moment().startOf('year').format('YYYY-MM-DD');
  endOfMonth = moment().format('YYYY-MM-DD');

  //1=hotel quoc te ; 2=hotel quoc noi ; 3=xe quoc te ; 4=xe quoc noi
  formType = 1;
  _displayedColumns: {
    label: string;
    value: string;
    type?: string;
    format?: string;
    style?: string;
  }[] = [
    {label: $localize`Type`, value: 'ctype'},
    {label: $localize`File Name`, value: 'fileName'},
    {label: $localize`Status`, value: 'status'},
    {label: $localize`Description`, value: 'description'},
    {label: $localize`Invoice Date`, value: 'invoiceDate', type: Constant.DATE, format: Constant.DATE_FORMAT,},
    {label: $localize`Created Date`, value: 'createdDate', type: Constant.DATE, format: Constant.DATE_FORMAT,},
  ];
  @Input() contractId: any;
  formGroupFile!: FormGroup;
  showDialogFile = false;

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      searchString: [],
      ctype: [],
      partnerType: [],
      airportCode: [],
      listAirportCode: [],
      createdDateFrom: [this.startOfMonth],
      createdDateTo: [moment().format('YYYY-MM-DD')],
    });
    this.formGroupDetail = this.fb.group({
      id: [],
      bizDocId: [],
      bizDocIdC1: [],
      contractName: [],
      contractCode: [],
    });
    this.formGroupFile = this.fb.group({
      ctype: ['INTERNATIONAL'],
      partnerType: [],
      fileUpload: [],
      templateName: [],
      templateNameLabel: [],
    });
    this.formGroupSearchInit = {...this.formGroupSearch.value};
    this.formGroupDetailInit = {...this.formGroupDetail.value};
  }

  override async ngOnInit() {
    this.formGroupFile.patchValue({partnerType: this.partnerType});
    // await Promise.all([this.loadListFlightMarket(), this.loadListHotel(), this.loadListVehiclesPartner(),]).then(() => {
    await Promise.all([this.loadListFlightMarket(), this.search()]).then(
      () => {
      },
    );
    this.displayedColumns = [
      'stt',
      'ctype',
      'fileNameLink',
      'status',
      'description',
      'invoiceDate',
      'createdDate',
    ];
  }

  async nextStep(id?: any, readMode?: any, action?: any) {
    this.id = id;
    this.step = 2;
    this.readMode = readMode;
    this.action = action;
    await this.cookTemplateName();
    this.nextStepEmit.emit([this.id, this.readMode]);
  }

  async backStep() {
    await this.search();
    this.step = 1;
  }

  override async search<T>(body?: any, isNextPage?: boolean) {
    try {
      this.formGroupSearch.patchValue({
        listAirportCode: this.formGroupSearch.getRawValue().airportCode,
        partnerType: this.partnerType,
      });
      await this.spinner.show();
      if (!isNextPage) {
        this.pageIndex = Constant.PAGE;
      }
      let res;
      let req = body || this.formGroupSearch.getRawValue();
      req.createdDateFrom = moment(req.createdDateFrom).isValid()
        ? moment(req.createdDateFrom).startOf('day').format(Constant.LOCAL_DATE_TIME_FORMAT)
        : null;
      req.createdDateTo = moment(req.createdDateTo).isValid()
        ? moment(req.createdDateTo).endOf('day').format(Constant.LOCAL_DATE_TIME_FORMAT)
        : null;
      this.displayedColumns = [
        'stt',
        'ctype',
        'fileNameLink',
        'status',
        'description',
        'invoiceDate',
        'createdDate',
      ];

      res = await this.baseService.logFileAttachment<ListResponse<T>>({
        page: this.pageIndex,
        size: this.pageSize,
        limit: this.pageSize,
        ...removeNullValues(req),
      });

      if (res) {
        if (res.code === HttpStatusCode.Ok) {
          this.dataSource.data = res.data.content;
          this.totalElement = res.data.totalElements;
        }
        return res;
      }
    } catch (e: any) {
      console.log(e);
      this.baseService.showError(e.error?.message ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async openDialogFile() {
    await this.cookTemplateName();
    this.showDialogFile = !this.showDialogFile;
  }

  closeDialogFile() {
    this.showDialogFile = !this.showDialogFile;
  }

  async cookTemplateName() {
    if (
      this.formGroupFile.getRawValue().ctype === 'INTERNATIONAL' &&
      this.formGroupFile.getRawValue().partnerType === 'HOTEL'
    ) {
      this.formGroupFile.patchValue({
        templateName:
          '[Crew Trip]_Template bảng kê chi phí khách sạn_Quốc tế.xlsx',
        templateNameLabel: 'report-hotel-international-template.xlsx',
      });
      this.formType = 1;
    } else if (
      this.formGroupFile.getRawValue().ctype === 'DOMESTIC' &&
      this.formGroupFile.getRawValue().partnerType === 'HOTEL'
    ) {
      this.formGroupFile.patchValue({
        templateName:
          '[CrewTrip]_Template bảng kê chi phí khách sạn_Quốc nội.xlsx',
        templateNameLabel: 'report-hotel-domestic-template.xlsx',
      });
      this.formType = 2;
    } else if (
      this.formGroupFile.getRawValue().ctype === 'INTERNATIONAL' &&
      this.formGroupFile.getRawValue().partnerType === 'TRANSPORTATION'
    ) {
      this.formGroupFile.patchValue({
        templateName:
          '[Crew Trip]_Template bảng kê chi phí thuê xe_Quốc tế.xlsx',
        templateNameLabel: 'report-transport-international-template.xlsx',
      });
      this.formType = 3;
    } else if (
      this.formGroupFile.getRawValue().ctype === 'DOMESTIC' &&
      this.formGroupFile.getRawValue().partnerType === 'TRANSPORTATION'
    ) {
      this.formGroupFile.patchValue({
        templateName:
          '[Crew Trip]_Template bảng kê chi phí thuê xe_Quốc nội.xlsx',
        templateNameLabel: 'report-transport-domestic-template.xlsx',
      });
      this.formType = 4;
    }
  }

  ctypeChange() {
    if (this.formGroupSearch.getRawValue().ctype == 'INTERNATIONAL') {
      this.loadListFlightMarket({
        type: 'International',
        status: FlightMarketStatusEnum.OPERATIONAL,
      });
    } else if (this.formGroupSearch.getRawValue().ctype == 'DOMESTIC') {
      this.loadListFlightMarket({
        type: 'Domestic',
        status: FlightMarketStatusEnum.OPERATIONAL,
      });
    } else {
      this.loadListFlightMarket();
    }
  }

  async download(fileRow: any) {
    try {
      await this.spinner.show();
      const res = await this.baseService.getFileData({
        id: fileRow.id,
        url: fileRow.fileUrl,
        fileSize: fileRow.fileSize,
      });
      this.downloadFile(res, fileRow.fileName + '.' + fileRow.fileType);
    } catch (e) {
      // console.log(e);
      this.baseService.showError(MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  isHotel() {
    return this.partnerType === 'HOTEL';
  }

  isTransportation() {
    return this.partnerType === 'TRANSPORTATION';
  }

}
