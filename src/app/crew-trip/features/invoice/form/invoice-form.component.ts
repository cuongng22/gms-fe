import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CommonModule, NgClass, NgIf, TitleCasePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DataTransformPipe} from 'src/app/crew-trip/shared/data-transform.pipe';
import {MatError, MatFormField, MatHint, MatLabel, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {RoleFunctionComponent} from 'src/app/crew-trip/features/roles/role-function/role-function.component';
import {NoDataRowOutlet} from '@angular/cdk/table';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {ContractDetailComponent} from 'src/app/crew-trip/features/contract/contract-detail/contract-detail.component';
import {Constant, DATE_FORMAT_DD_MM_YYYY, MESSAGE, removeNullValues} from 'src/app/crew-trip/shared/utils/constant';
import {FlightMarketService} from 'src/app/crew-trip/core/services/flight-market.service';
import {HotelService} from 'src/app/crew-trip/core/services/hotel-service';
import {VehicleService} from 'src/app/crew-trip/core/services/vehicle.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ListResponse} from 'src/app/crew-trip/shared/models/common.model';
import {HttpStatusCode} from '@angular/common/http';
import {InvoiceFormService} from 'src/app/crew-trip/core/services/invoice-form-service';
import {InvoiceFormDetailComponent} from "src/app/crew-trip/features/invoice/form/form-detail/invoice-form-detail.component";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {FileUploadModule} from "@iplab/ngx-file-upload";
import {provideMomentDateAdapter} from "@angular/material-moment-adapter";


@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [RouterLink, CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet, ContractDetailComponent, MatDatepickerModule, MatHint, InvoiceFormDetailComponent, MatRadioGroup, MatRadioButton, FileUploadModule],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss',
  providers: [provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),
  ]
})


export class InvoiceFormComponent extends CommonComponent implements OnInit {
  viewType = 'HD';//HD-PL
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
  listPartner: any[] = [];
  listHotel = [];
  listVehicle = [];
  listAirportCode = [];
  //1=hotel quoc te ; 2=hotel quoc noi ; 3=xe quoc te ; 4=xe quoc noi
  formType = 1;
  _displayedColumns: {
    label: string; value: string, type?: string, format?: string
  }[] = [
    {label: $localize`Airport Code`, value: 'airportCode'},
    {label: $localize`Partner Name`, value: 'partnerName'},
    {label: $localize`Invoice Number`, value: 'invoiceNumber'},
    {label: $localize`Invoice Date`, value: 'invoiceDate', type: Constant.DATE, format: Constant.DATE_FORMAT},
    {
      label: $localize`Receive Date`,
      value: 'invoiceReceiveDate',
      type: Constant.DATE,
      format: Constant.DATE_FORMAT
    },
    {label: $localize`Total Amount`, value: 'totalAmount', type: Constant.NUMBER}
  ];
  @Input() contractId: any;
  formGroupFile!: FormGroup;
  showDialogFile = false;
  ///////
  dataSource11 =
    [
      {
        "id": 1086,
        "accessBridge": null,
        "accommodationTaxCcCharge": null,
        "accommodationTaxFcCharge": null,
        "airportParkingFee": null,
        "breakfastCc": null,
        "breakfastFc": null,
        "cc": null,
        "ciDate": "2024-10-09",
        "ciFltno": "VN230",
        "ciTime": "7:30",
        "cityTaxCcCharge": null,
        "cityTaxFcCharge": null,
        "coDate": "2024-09-11",
        "coFltno": null,
        "coTime": "21:20",
        "cdate": null,
        "detail": null,
        "earlyCheckin": 0.5,
        "eciSingleRoomCcCharge": null,
        "eciSingleRoomFcCharge": null,
        "eciTwinRoomCcCharge": null,
        "fc": null,
        "fltno": null,
        "fullname": "NGUYEN VAN A",
        "lateCheckout": 1,
        "lcoSingleRoomCcCharge": null,
        "lcoSingleRoomFcCharge": null,
        "lcoTwinRoomCcCharge": null,
        "night": 1,
        "numberOfNights": null,
        "numberOfVehicle": null,
        "price": 200000,
        "remark": null,
        "roomNo": null,
        "serviceTaxCcCharge": null,
        "serviceTaxFcCharge": null,
        "singleRoomCc": null,
        "singleRoomCcCharge": null,
        "singleRoomFc": null,
        "singleRoomFcCharge": null,
        "timeStay": "37.5",
        "toll": null,
        "totalAmountCc": null,
        "totalAmountFc": null,
        "totalBreakfastCcCharge": null,
        "totalBreakfastFcCharge": null,
        "totalCharge": 500000,
        "totalCharges": null,
        "totalNight": 2.5,
        "totalRevenue": null,
        "totalSingleRoomsCc": null,
        "totalSingleRoomsFc": null,
        "totalTwinRoomsCc": null,
        "totalVat": null,
        "transitDuty": null,
        "transportCharge": null,
        "twinRoomCc": null,
        "twinRoomCcCharge": null,
        "unitPrice": null,
        "typeRoom": "FC Single room",
        "createdDate": "2025-01-23T10:37:45.7821567",
        "createdBy": "chien@c.c",
        "updatedDate": "2025-01-23T10:37:45.7821567",
        "updatedBy": "chien@c.c",
        "rowIndex": 10,
        "no": "1"
      },
      {
        "id": 1087,
        "accessBridge": null,
        "accommodationTaxCcCharge": null,
        "accommodationTaxFcCharge": null,
        "airportParkingFee": null,
        "breakfastCc": null,
        "breakfastFc": null,
        "cc": null,
        "ciDate": "2024-10-09",
        "ciFltno": "VN230",
        "ciTime": "7:30",
        "cityTaxCcCharge": null,
        "cityTaxFcCharge": null,
        "coDate": "2024-09-11",
        "coFltno": null,
        "coTime": "21:20",
        "cdate": null,
        "detail": null,
        "earlyCheckin": 0.5,
        "eciSingleRoomCcCharge": null,
        "eciSingleRoomFcCharge": null,
        "eciTwinRoomCcCharge": null,
        "fc": null,
        "fltno": null,
        "fullname": "NGUYEN VAN B",
        "lateCheckout": 1,
        "lcoSingleRoomCcCharge": null,
        "lcoSingleRoomFcCharge": null,
        "lcoTwinRoomCcCharge": null,
        "night": 1,
        "numberOfNights": null,
        "numberOfVehicle": null,
        "price": 200000,
        "remark": null,
        "roomNo": null,
        "serviceTaxCcCharge": null,
        "serviceTaxFcCharge": null,
        "singleRoomCc": null,
        "singleRoomCcCharge": null,
        "singleRoomFc": null,
        "singleRoomFcCharge": null,
        "timeStay": "37:30",
        "toll": null,
        "totalAmountCc": null,
        "totalAmountFc": null,
        "totalBreakfastCcCharge": null,
        "totalBreakfastFcCharge": null,
        "totalCharge": 500000,
        "totalCharges": null,
        "totalNight": 2.5,
        "totalRevenue": null,
        "totalSingleRoomsCc": null,
        "totalSingleRoomsFc": null,
        "totalTwinRoomsCc": null,
        "totalVat": null,
        "transitDuty": null,
        "transportCharge": null,
        "twinRoomCc": null,
        "twinRoomCcCharge": null,
        "unitPrice": null,
        "typeRoom": "CC Single room",
        "createdDate": "2025-01-23T10:37:45.7921596",
        "createdBy": "chien@c.c",
        "updatedDate": "2025-01-23T10:37:45.7921596",
        "updatedBy": "chien@c.c",
        "rowIndex": 5,
        "no": "1"
      },
      {
        "id": 1088,
        "accessBridge": null,
        "accommodationTaxCcCharge": null,
        "accommodationTaxFcCharge": null,
        "airportParkingFee": null,
        "breakfastCc": null,
        "breakfastFc": null,
        "cc": null,
        "ciDate": "2024-10-09",
        "ciFltno": "VN230",
        "ciTime": "7:30",
        "cityTaxCcCharge": null,
        "cityTaxFcCharge": null,
        "coDate": "2024-09-11",
        "coFltno": null,
        "coTime": "21:20",
        "cdate": null,
        "detail": null,
        "earlyCheckin": 0.5,
        "eciSingleRoomCcCharge": null,
        "eciSingleRoomFcCharge": null,
        "eciTwinRoomCcCharge": null,
        "fc": null,
        "fltno": null,
        "fullname": "NGUYEN VAN POE",
        "lateCheckout": 1,
        "lcoSingleRoomCcCharge": null,
        "lcoSingleRoomFcCharge": null,
        "lcoTwinRoomCcCharge": null,
        "night": 5,
        "numberOfNights": null,
        "numberOfVehicle": null,
        "price": 200000,
        "remark": null,
        "roomNo": "999",
        "serviceTaxCcCharge": null,
        "serviceTaxFcCharge": null,
        "singleRoomCc": null,
        "singleRoomCcCharge": null,
        "singleRoomFc": null,
        "singleRoomFcCharge": null,
        "timeStay": "37.5",
        "toll": null,
        "totalAmountCc": null,
        "totalAmountFc": null,
        "totalBreakfastCcCharge": null,
        "totalBreakfastFcCharge": null,
        "totalCharge": 1300000,
        "totalCharges": null,
        "totalNight": 6.5,
        "totalRevenue": null,
        "totalSingleRoomsCc": null,
        "totalSingleRoomsFc": null,
        "totalTwinRoomsCc": null,
        "totalVat": null,
        "transitDuty": null,
        "transportCharge": null,
        "twinRoomCc": null,
        "twinRoomCcCharge": null,
        "unitPrice": null,
        "typeRoom": "CC Twin room",
        "createdDate": "2025-01-23T10:37:45.8111585",
        "createdBy": "chien@c.c",
        "updatedDate": "2025-01-23T10:37:45.8111585",
        "updatedBy": "chien@c.c",
        "rowIndex": 5,
        "no": "1"
      },
      {
        "id": 1089,
        "accessBridge": null,
        "accommodationTaxCcCharge": null,
        "accommodationTaxFcCharge": null,
        "airportParkingFee": null,
        "breakfastCc": null,
        "breakfastFc": null,
        "cc": null,
        "ciDate": "2024-10-09",
        "ciFltno": null,
        "ciTime": "10:30",
        "cityTaxCcCharge": null,
        "cityTaxFcCharge": null,
        "coDate": "2024-09-10",
        "coFltno": null,
        "coTime": "18:00",
        "cdate": null,
        "detail": null,
        "earlyCheckin": 0.5,
        "eciSingleRoomCcCharge": null,
        "eciSingleRoomFcCharge": null,
        "eciTwinRoomCcCharge": null,
        "fc": null,
        "fltno": null,
        "fullname": "NGUYEN VAN NO",
        "lateCheckout": 1,
        "lcoSingleRoomCcCharge": null,
        "lcoSingleRoomFcCharge": null,
        "lcoTwinRoomCcCharge": null,
        "night": 5,
        "numberOfNights": null,
        "numberOfVehicle": null,
        "price": 200000,
        "remark": null,
        "roomNo": "999",
        "serviceTaxCcCharge": null,
        "serviceTaxFcCharge": null,
        "singleRoomCc": null,
        "singleRoomCcCharge": null,
        "singleRoomFc": null,
        "singleRoomFcCharge": null,
        "timeStay": "37.5",
        "toll": null,
        "totalAmountCc": null,
        "totalAmountFc": null,
        "totalBreakfastCcCharge": null,
        "totalBreakfastFcCharge": null,
        "totalCharge": 1300000,
        "totalCharges": null,
        "totalNight": 6.5,
        "totalRevenue": null,
        "totalSingleRoomsCc": null,
        "totalSingleRoomsFc": null,
        "totalTwinRoomsCc": null,
        "totalVat": null,
        "transitDuty": null,
        "transportCharge": null,
        "twinRoomCc": null,
        "twinRoomCcCharge": null,
        "unitPrice": null,
        "typeRoom": "CC Twin room",
        "createdDate": "2025-01-23T10:37:45.8171568",
        "createdBy": "chien@c.c",
        "updatedDate": "2025-01-23T10:37:45.8171568",
        "updatedBy": "chien@c.c",
        "rowIndex": 6,
        "no": "1"
      },
      {
        "id": 1090,
        "accessBridge": null,
        "accommodationTaxCcCharge": null,
        "accommodationTaxFcCharge": null,
        "airportParkingFee": null,
        "breakfastCc": null,
        "breakfastFc": null,
        "cc": null,
        "ciDate": "2024-10-09",
        "ciFltno": null,
        "ciTime": "5:30",
        "cityTaxCcCharge": null,
        "cityTaxFcCharge": null,
        "coDate": "2024-09-10",
        "coFltno": null,
        "coTime": "20:30",
        "cdate": null,
        "detail": null,
        "earlyCheckin": 1,
        "eciSingleRoomCcCharge": null,
        "eciSingleRoomFcCharge": null,
        "eciTwinRoomCcCharge": null,
        "fc": null,
        "fltno": null,
        "fullname": "LINH",
        "lateCheckout": 1,
        "lcoSingleRoomCcCharge": null,
        "lcoSingleRoomFcCharge": null,
        "lcoTwinRoomCcCharge": null,
        "night": 0,
        "numberOfNights": null,
        "numberOfVehicle": null,
        "price": 200000,
        "remark": null,
        "roomNo": "111",
        "serviceTaxCcCharge": null,
        "serviceTaxFcCharge": null,
        "singleRoomCc": null,
        "singleRoomCcCharge": null,
        "singleRoomFc": null,
        "singleRoomFcCharge": null,
        "timeStay": "15:00",
        "toll": null,
        "totalAmountCc": null,
        "totalAmountFc": null,
        "totalBreakfastCcCharge": null,
        "totalBreakfastFcCharge": null,
        "totalCharge": null,
        "totalCharges": null,
        "totalNight": 2,
        "totalRevenue": null,
        "totalSingleRoomsCc": null,
        "totalSingleRoomsFc": null,
        "totalTwinRoomsCc": null,
        "totalVat": null,
        "transitDuty": null,
        "transportCharge": null,
        "twinRoomCc": null,
        "twinRoomCcCharge": null,
        "unitPrice": null,
        "typeRoom": "CC Twin room",
        "createdDate": "2025-01-23T10:37:45.8251575",
        "createdBy": "chien@c.c",
        "updatedDate": "2025-01-23T10:37:45.8251575",
        "updatedBy": "chien@c.c",
        "rowIndex": 7,
        "no": "3"
      },
      {
        "id": 1091,
        "accessBridge": null,
        "accommodationTaxCcCharge": null,
        "accommodationTaxFcCharge": null,
        "airportParkingFee": null,
        "breakfastCc": null,
        "breakfastFc": null,
        "cc": null,
        "ciDate": "2024-10-09",
        "ciFltno": null,
        "ciTime": "5:30",
        "cityTaxCcCharge": null,
        "cityTaxFcCharge": null,
        "coDate": "2024-09-11",
        "coFltno": null,
        "coTime": "20:30",
        "cdate": null,
        "detail": null,
        "earlyCheckin": 1,
        "eciSingleRoomCcCharge": null,
        "eciSingleRoomFcCharge": null,
        "eciTwinRoomCcCharge": null,
        "fc": null,
        "fltno": null,
        "fullname": "TUAN",
        "lateCheckout": 1,
        "lcoSingleRoomCcCharge": null,
        "lcoSingleRoomFcCharge": null,
        "lcoTwinRoomCcCharge": null,
        "night": 1,
        "numberOfNights": null,
        "numberOfVehicle": null,
        "price": 200000,
        "remark": null,
        "roomNo": "222",
        "serviceTaxCcCharge": null,
        "serviceTaxFcCharge": null,
        "singleRoomCc": null,
        "singleRoomCcCharge": null,
        "singleRoomFc": null,
        "singleRoomFcCharge": null,
        "timeStay": "39",
        "toll": null,
        "totalAmountCc": null,
        "totalAmountFc": null,
        "totalBreakfastCcCharge": null,
        "totalBreakfastFcCharge": null,
        "totalCharge": null,
        "totalCharges": null,
        "totalNight": 3,
        "totalRevenue": null,
        "totalSingleRoomsCc": null,
        "totalSingleRoomsFc": null,
        "totalTwinRoomsCc": null,
        "totalVat": null,
        "transitDuty": null,
        "transportCharge": null,
        "twinRoomCc": null,
        "twinRoomCcCharge": null,
        "unitPrice": null,
        "typeRoom": "CC Twin room",
        "createdDate": "2025-01-23T10:37:45.8331568",
        "createdBy": "chien@c.c",
        "updatedDate": "2025-01-23T10:37:45.8331568",
        "updatedBy": "chien@c.c",
        "rowIndex": 8,
        "no": "4"
      }
    ]

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      searchString: [],
      ctype: [],
      partnerType: [],
      airportCode: [],
      listAirportCode: [],
      periodFrom: [],
      periodTo: [],
    });
    this.formGroupDetail = this.fb.group({
      id: [], bizDocId: [], bizDocIdC1: [], contractName: [], contractCode: []
    });
    this.formGroupFile = this.fb.group({
      ctype: ['INTERNATIONAL'], partnerType: [], fileUpload: [], templateName: [], templateNameLabel: []
    });
    this.formGroupSearchInit = {...this.formGroupSearch.value};
    this.formGroupDetailInit = {...this.formGroupDetail.value};
  }

  override async ngOnInit() {
    this.formGroupFile.patchValue({partnerType: this.partnerType});
    // await Promise.all([this.loadListFlightMarket(), this.loadListHotel(), this.loadListVehiclesPartner(),]).then(() => {
    await Promise.all([this.loadListFlightMarket(), this.search(),]).then(() => {

    });
    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'periodDate', 'action'];
  }

  async nextStep(id?: any, readMode?: any, action?: any) {
    this.id = id;
    this.step = 2;
    this.readMode = readMode;
    this.action = action;
    await this.cookTemplateName();
    this.nextStepEmit.emit([this.id, this.readMode])
  }

  async backStep() {
    await this.search();
    this.step = 1;
  }

  override async search<T>(body?: any, isNextPage?: boolean) {
    try {
      this.formGroupSearch.patchValue({
        listAirportCode: this.formGroupSearch.getRawValue().airportCode,
        partnerType: this.partnerType
      });
      await this.spinner.show();
      if (!isNextPage) {
        this.pageIndex = Constant.PAGE;
      }
      let res;
      this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'periodDate', 'action'];
      res = await this.baseService.search<ListResponse<T>>({
        page: this.pageIndex,
        size: this.pageSize,
        limit: this.pageSize, ...removeNullValues(body) || removeNullValues(this.formGroupSearch.value)
      });

      if (res) {
        if (res.code === HttpStatusCode.Ok) {
          this.dataSource.data = res.data.content;
          this.totalElement = res.data.totalElements;
        }
        return res;
      }
    } catch (e: any) {
      this.baseService.showError(e.error?.message ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async upload() {
    try {
      await this.spinner.show();
      let formUpload = new FormData();
      let fileUpload = this.formGroupFile.value.fileUpload[0];
      if (fileUpload.size > 50 * 1048576) {
        this.baseService.showError(MESSAGE.MAX_FILE_SIZE);
        return;
      }
      formUpload.append('file', fileUpload, fileUpload.name);
      formUpload.append('invoiceRequest', JSON.stringify({
        ctype: this.formGroupFile.getRawValue().ctype,
        partnerType: this.formGroupFile.getRawValue().partnerType
      }));
      await this.baseService.uploadFileData(formUpload).then(res => {
        if (res.code == HttpStatusCode.Ok) {
          this.search();
          this.baseService.showSuccess(this.MESSAGE.UPLOAD_SUCCESS);
        }
      });
    } catch (e: any) {
      this.baseService.showError(e.error?.message ?? this.MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
      this.formGroupFile.patchValue({fileUpload: []});
      this.closeDialogFile();
    }
  }

  async download(type: any) {
    try {
      await this.spinner.show();
      let filename = '';
      if (type === 'EXPORT') {
      } else if (type === 'DOWNLOAD') {
        const res = await this.baseService.exportFileData({
          fileExportType: '1'
          // ctype: this.formGroupFile.getRawValue().ctype,
          // partnerType: this.formGroupFile.getRawValue().partnerType
        });
        this.downloadFile(res, this.formGroupFile.getRawValue().templateNameLabel);
      }
    } catch (e) {
      console.log(e)
    } finally {
      await this.spinner.hide();
    }
  }

  override async exportFile(body?: any, filename?: string) {
    try {
      await this.spinner.show();
      const res = await this.baseService.exportData({
        ctype: this.formGroupFile.getRawValue().ctype,
        partnerType: this.formGroupFile.getRawValue().partnerType
      });
      this.downloadFile(res.blob, filename ?? res.fileName);
    } catch (e: any) {
      this.baseService.showError((e.error?.error?.code) ?? MESSAGE.ERROR);
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
    if (this.formGroupFile.getRawValue().ctype === 'INTERNATIONAL' && this.formGroupFile.getRawValue().partnerType === 'HOTEL') {
      this.formGroupFile.patchValue({
        templateName: '[Crew Trip]_Template bảng kê chi phí khách sạn_Quốc tế.xlsx',
        templateNameLabel: 'report-hotel-international-template.xlsx'
      })
    } else if (this.formGroupFile.getRawValue().ctype === 'DOMESTIC' && this.formGroupFile.getRawValue().partnerType === 'HOTEL') {
      this.formGroupFile.patchValue({
        templateName: '[CrewTrip]_Template bảng kê chi phí khách sạn_Quốc nội.xlsx',
        templateNameLabel: 'report-hotel-domestic-template.xlsx'
      })
    } else if (this.formGroupFile.getRawValue().ctype === 'INTERNATIONAL' && this.formGroupFile.getRawValue().partnerType === 'TRANSPORTATION') {
      this.formGroupFile.patchValue({
        templateName: '[Crew Trip]_Template bảng kê chi phí thuê xe_Quốc tế.xlsx',
        templateNameLabel: 'report-transport-international-template.xlsx'
      })
    } else if (this.formGroupFile.getRawValue().ctype === 'DOMESTIC' && this.formGroupFile.getRawValue().partnerType === 'TRANSPORTATION') {
      this.formGroupFile.patchValue({
        templateName: '[Crew Trip]_Template bảng kê chi phí thuê xe_Quốc nội.xlsx',
        templateNameLabel: 'report-transport-international-template.xlsx'
      })
    }
  }
}
