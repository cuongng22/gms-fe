import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CommonModule, NgClass, NgIf, TitleCasePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
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
import {InvoiceActualCostService} from "src/app/crew-trip/core/services/invoice-actual-cost-service";
import moment from "moment";
import {InvoiceDocumentDetailComponent} from "src/app/crew-trip/features/invoice/document/document-detail/invoice-document-detail.component";
import {InvoiceDocumentService} from "src/app/crew-trip/core/services/invoice-document-service";
import {FlightMarketStatusEnum} from "src/app/crew-trip/features/category/flight-market/flight-market.model";


@Component({
  selector: 'app-invoice-actual-cost',
  standalone: true,
  imports: [RouterLink, CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet, ContractDetailComponent, MatDatepickerModule, MatHint, InvoiceFormDetailComponent, MatRadioGroup, MatRadioButton, FileUploadModule, InvoiceDocumentDetailComponent],
  templateUrl: './invoice-actual-cost.component.html',
  styleUrl: './invoice-actual-cost.component.scss',
  providers: [provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY,{useUtc: true}),
  ]
})


export class InvoiceActualCostComponent extends CommonComponent implements OnInit {
  viewType = 'HD';//HD-PL
  override baseService = inject(InvoiceActualCostService);
  invoiceDocumentService = inject(InvoiceDocumentService);
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
  listInvoice: any[];
  //1=hotel quoc te ; 2=hotel quoc noi ; 3=xe quoc te ; 4=xe quoc noi
  formType = 1;
  _displayedColumns: {
    label: string; value: string, type?: string, format?: string
  }[] = [
    {label: $localize`Partner Name`, value: 'partnerName'},
    {label: $localize`Airport Code`, value: 'airportCode'},
    {label: $localize`Type`, value: 'ctype'},
    {label: $localize`Period Occurrence`, value: 'periodOccurrence', type: Constant.DATE, format: Constant.DATE_FORMAT},
    {label: $localize`Currency`, value: 'currency'},
    {label: $localize`Exchange Rate`, value: 'exchangeRate'},
    {label: $localize`Number Trip`, value: 'numberTrip', type: Constant.NUMBER},
    {label: $localize`Single Room Fc`, value: 'singleRoomFc', type: Constant.NUMBER},
    {label: $localize`Single Room Cc`, value: 'singleRoomCc', type: Constant.NUMBER},
    {label: $localize`Twin Room Cc`, value: 'twinRoomCc', type: Constant.NUMBER},
    {label: $localize`Total Amount`, value: 'totalAmount', type: Constant.NUMBER},
    {label: $localize`Actual Payment`, value: 'actualPayment', type: Constant.NUMBER},
    {label: $localize`Actual Payment (Fc)`, value: 'actualPaymentFc', type: Constant.NUMBER},
    {label: $localize`Actual Payment (Vnd)`, value: 'actualPaymentVnd', type: Constant.NUMBER},
    {label: $localize`Difference (Fc)`, value: 'differenceFc', type: Constant.NUMBER},
    {label: $localize`Difference (Vnd)`, value: 'differenceVnd', type: Constant.NUMBER},
    {label: $localize`Tax Refund (Fc)`, value: 'taxRefundFc', type: Constant.NUMBER},
    {label: $localize`Tax Refund (Vnd)`, value: 'taxRefundVnd', type: Constant.NUMBER},
    {label: $localize`Budget Amount`, value: 'budgetAmount', type: Constant.NUMBER},
    {label: $localize`Remaining Amount`, value: 'remainingAmount', type: Constant.NUMBER},
  ]
  @Input() contractId: any;
  formGroupFile!: FormGroup;
  showDialogFile = false;

  range: FormGroup
  isShowDocumentHdr: boolean = false;
  documentHdrId: any;

  constructor() {
    super();
    this.range = this.fb.group({
      start: [],
      end: [],
    })
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
      if (this.partnerType == 'HOTEL') {
        this.displayedColumns = ['stt', ...this._displayedColumns.filter(s => !['numberTrip'].includes(s.value)).map(s => s.value), 'action'];
      } else if (this.partnerType == 'TRANSPORTATION') {
        this.displayedColumns = ['stt', ...this._displayedColumns.filter(s => !['singleRoomFc', 'singleRoomCc', 'twinRoomCc'].includes(s.value)).map(s => s.value), 'action'];

      }
    });
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
    console.log(this.formGroupSearch)
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
      let req = body || this.formGroupSearch.getRawValue();
      req.periodFrom = moment.isMoment(req.periodFrom) ? req.periodFrom.format(Constant.LOCAL_DATE_FORMAT) : null;
      req.periodTo = moment.isMoment(req.periodTo) ? req.periodTo.format(Constant.LOCAL_DATE_FORMAT) : null;
      res = await this.baseService.search<ListResponse<T>>({
        page: this.pageIndex,
        size: this.pageSize,
        limit: this.pageSize, ...removeNullValues(req)
      });

      if (res) {
        if (res.code === HttpStatusCode.Ok) {
          this.dataSource.data = res.data;
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

  showDocumentHdr(documentHdrId: any) {
    documentHdrId = 42;
    if (+documentHdrId > 0) {
      this.documentHdrId = documentHdrId;
      this.isShowDocumentHdr = true;
    } else if (+documentHdrId < 0) {
      this.baseService.showError("Không tìm thấy hóa đơn");
    }
  }

  async getListInvoiceDocument(item: any) {
    try {
      await this.spinner.show();
      this.listInvoice = [];
      await this.invoiceDocumentService.search({
        page: this.pageIndex,
        size: this.pageSize,
        limit: this.pageSize,
      }).then((res: any) => {
        this.listInvoice = res?.data?.content;
      });
    } catch (e: any) {
      this.baseService.showError((e.error?.error?.code) ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }


  /*override async search<T>(body?: any, isNextPage?: boolean) {
    try {
      await this.spinner.show();
      if (!isNextPage) {
        this.pageIndex = Constant.PAGE;
      }
      let res = await this.baseService.search<ListResponse<T>>({
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
  }*/
}
