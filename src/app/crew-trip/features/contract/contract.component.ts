import {Component, inject, Input, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CommonModule, NgClass, NgIf, TitleCasePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DataTransformPipe} from 'src/app/crew-trip/shared/data-transform.pipe';
import {MatError, MatFormField, MatHint, MatLabel, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {RoleFunctionComponent} from 'src/app/crew-trip/features/roles/role-function/role-function.component';
import {NoDataRowOutlet} from '@angular/cdk/table';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {ContractService} from 'src/app/crew-trip/core/services/contract-service';
import {ContractDetailComponent} from 'src/app/crew-trip/features/contract/contract-detail/contract-detail.component';
import {Constant} from 'src/app/crew-trip/shared/utils/constant';
import {FlightMarketService} from "src/app/crew-trip/core/services/flight-market.service";
import {HotelService} from "src/app/crew-trip/core/services/hotel-service";
import {VehicleService} from "src/app/crew-trip/core/services/vehicle.service";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {log} from "util";


@Component({
  selector: 'app-contract',
  standalone: true,
  imports: [RouterLink, CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet, ContractDetailComponent, MatDatepickerModule, MatHint],
  templateUrl: './contract.component.html',
  styleUrl: './contract.component.scss',
})


export class ContractComponent extends CommonComponent implements OnInit {
  override baseService = inject(ContractService);
  flightMarketService = inject(FlightMarketService);
  hotelService = inject(HotelService);
  vehicleService = inject(VehicleService);
  fb = inject(FormBuilder);

  //variable
  step = 1;
  listFlightMarket = [];
  listPartner: any[] = [];
  listHotel = [];
  listVehicle = [];
  tblAnnexData = new MatTableDataSource();
  _displayedColumns: { label: string; value: string, type?: string, format?: string }[] = [
    // {label: 'Ngày tạo', value: 'ngayTao', type: Constant.DATE, format: Constant.DATE_FORMAT},
    {label: $localize`Market`, value: 'marketCode'},
    {label: $localize`bizDocId`, value: 'bizDocId'},
    {label: $localize`Contract Code`, value: 'contractCode'},
    {label: $localize`Contract No`, value: 'contractNo'},
    {label: $localize`Contract Name`, value: 'contractName'},
    {label: $localize`Partner Name`, value: 'partnerName'},
    {label: $localize`Service Object`, value: 'serviceObject'},
    {label: $localize`Signed Date`, value: 'signedDate', type: Constant.DATE, format: Constant.DATE_FORMAT},
    // {label: $localize`Effective Date`, value: 'effectiveDate', type: Constant.DATE, format: Constant.DATE_FORMAT},
    // {label: $localize`Expiry Date`, value: 'expiryDate', type: Constant.DATE, format: Constant.DATE_FORMAT},
    //{label: $localize`appendixList`, value: "appendixList"},
  ];
  /*_displayedColumns: { label: string; value: string, type?: string, format?: string }[] = [
    { label: 'ID', value: 'id' },
    { label: 'Mã hợp đồng', value: 'contractCode' },
    { label: 'Số hợp đồng', value: 'contractNo' },
    { label: 'Loại tiền tệ', value: 'currency' },
    { label: 'Tỷ giá', value: 'currencyRate', type: Constant.NUMBER},
    { label: 'Ngày ký', value: 'signedDate', type: Constant.DATE, format: Constant.DATE_FORMAT },
    { label: 'Ngày hiệu lực', value: 'effectiveDate', type: Constant.DATE, format: Constant.DATE_FORMAT },
    { label: 'Ngày hết hạn', value: 'expiryDate', type: Constant.DATE, format: Constant.DATE_FORMAT },
    { label: 'Loại hợp đồng', value: 'contractType' },
    { label: 'Hình thức hợp đồng', value: 'contractForm' },
    { label: 'Root HDPL', value: 'hdPlRoot' },
    { label: 'Tên hợp đồng', value: 'contractName' },
    { label: 'Mã đối tác', value: 'partnerCode' },
    { label: 'Tên đối tác', value: 'partnerName' },
    { label: 'Địa chỉ đối tác', value: 'partnerAddress' },
    { label: 'Thẩm quyền đàm phán', value: 'negotiateCompetence' },
    { label: 'Thẩm quyền', value: 'competence' },
    { label: 'Nhân viên ký', value: 'employeeSigned' },
    { label: 'Phòng ban ký', value: 'signedDepartmentName' },
    { label: 'Phòng ban ngân sách', value: 'budgetDepartmentName' },
    { label: 'Phòng ban thực hiện', value: 'proceedDepartmentName' },
    { label: 'Phòng ban thanh toán', value: 'paidDepartmentName' },
    { label: 'ID nhân viên', value: 'employeeId' },
    { label: 'Tên nhân viên', value: 'employeeName' },
    { label: 'Loại thanh toán', value: 'paymentType' },
    { label: 'Mã ngân sách', value: 'budgetCode' },
    { label: 'Mã lĩnh vực', value: 'fieldCode2' },
    { label: 'Số ngày đến hạn', value: 'dueDateNumber' },
    { label: 'Ngày bàn giao', value: 'handoverDate', type: Constant.DATE, format: Constant.DATE_FORMAT },
    { label: 'Danh sách tài liệu (JSON)', value: 'documentListJson' },

    // Thông tin khách sạn
    { label: 'ID Khách sạn', value: 'hotel.id' },
    { label: 'Mã khách sạn', value: 'hotel.hotelCode' },
    { label: 'Tên khách sạn', value: 'hotel.hotelName' },
    { label: 'Tên đầy đủ khách sạn', value: 'hotel.fullName' },
    { label: 'Email khách sạn', value: 'hotel.email' },
    { label: 'SĐT khách sạn', value: 'hotel.phone' },
    { label: 'Ghi chú khách sạn', value: 'hotel.notes' },
    { label: 'Địa chỉ khách sạn', value: 'hotel.address' },
    { label: 'Mã thị trường', value: 'hotel.marketCode' },
    { label: 'Ngày tạo khách sạn', value: 'hotel.createdDate', type: Constant.DATE, format: Constant.DATE_FORMAT },
    { label: 'Ngày cập nhật khách sạn', value: 'hotel.updatedDate', type: Constant.DATE, format: Constant.DATE_FORMAT },

    // Thông tin thị trường trong khách sạn
    { label: 'Mã thị trường khách sạn', value: 'hotel.market.marketCode' },
    { label: 'Tên thị trường khách sạn', value: 'hotel.market.marketName' },
    { label: 'Loại thị trường', value: 'hotel.market.marketType' },
    { label: 'Trạng thái sử dụng thị trường', value: 'hotel.market.statusUsage' },
    { label: 'Múi giờ thị trường', value: 'hotel.market.timezone' },
    { label: 'Quốc gia thị trường', value: 'hotel.market.nation.vniName' },

    // Thông tin phương tiện
    { label: 'ID Phương tiện', value: 'vehicle.id' },
    { label: 'Mã phương tiện', value: 'vehicle.code' },
    { label: 'Tên phương tiện', value: 'vehicle.name' },
    { label: 'Tên đầy đủ phương tiện', value: 'vehicle.fullName' },
    { label: 'Email phương tiện', value: 'vehicle.email' },
    { label: 'SĐT phương tiện', value: 'vehicle.phone' },
    { label: 'Ghi chú phương tiện', value: 'vehicle.notes' },
    { label: 'Địa chỉ phương tiện', value: 'vehicle.address' },
    { label: 'Mã thị trường phương tiện', value: 'vehicle.marketCode' },
    { label: 'Ngày tạo phương tiện', value: 'vehicle.createdDate', type: Constant.DATE, format: Constant.DATE_FORMAT },
    { label: 'Ngày cập nhật phương tiện', value: 'vehicle.updatedDate', type: Constant.DATE, format: Constant.DATE_FORMAT },

    // Thông tin tài khoản ngân hàng
    { label: 'Số tài khoản ngân hàng B', value: 'bankAccountNoB' },
    { label: 'Tên người liên hệ ngân hàng', value: 'peopleName' },
    { label: 'Tên ngân hàng B', value: 'bankNameB' },
    { label: 'Địa chỉ ngân hàng B', value: 'bankAddressB' },
    { label: 'Thành phố B', value: 'cityB' },
    { label: 'Tên chi nhánh ngân hàng B', value: 'bankBranchNameB' },
    { label: 'Mã ngân hàng địa phương', value: 'bankLocalCode' },
    { label: 'Mã SWIFT B', value: 'swiftCodeB' },
    { label: 'IBAN', value: 'iBan' },
    { label: 'Phí ngân hàng', value: 'bankCharge' },
    { label: 'Phí ngân hàng 1', value: 'bankCharge1' },
    { label: 'Số tài khoản ngân hàng B1', value: 'bankAccountNoB1' },
    { label: 'Tên ngân hàng B1', value: 'bankNameB1' },
    { label: 'Mã SWIFT B1', value: 'swiftCodeB1' },

    // Trạng thái
    { label: 'Là khách sạn', value: 'isHotel', type: 'boolean' },
    { label: 'Là phương tiện', value: 'isVehicle', type: 'boolean' }
  ];*/
  @Input() contractId: any;

  showPopupAnnex = false;

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      s: [],
      marketCodes: [],
      partnerCode: [],
      startDate: [],
      endDate: [],
      export: [null],
      active: [false],
    });
    this.formGroupDetail = this.fb.group({bizDocId: []});
    this.formGroupSearchInit = {...this.formGroupSearch.value};
    this.formGroupDetailInit = {...this.formGroupDetail.value};
  }

  override async ngOnInit() {
    await Promise.all([
      this.loadListFlightMarket(),
      this.loadListHotel(),
      this.loadListVehiclesPartner(),
      this.search(),
    ]).then(() => {
      let listCombine = [...this.listVehicle, ...this.listHotel];
      this.listPartner = listCombine.map((s: any) => ({
        code: s.code ?? s.hotelCode,
        name: s.name ?? s.hotelName,
      }));

    });
    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'effectiveDate', 'action'];
  }

  async nextStep(index: number) {
    this.formGroupDetail.patchValue(this.dataSource.data[index] as JSON);
    this.step = 2;
  }

  async backStep() {
    await this.search(),
      this.step = 1;
  }

  async showAnnex(index: any) {
    let cur: any = this.dataSource.data[index];
    this.tblAnnexData.data = cur.appendixList;
    this.showPopupAnnex = true;
  }

  async loadListFlightMarket() {
    await this.flightMarketService.search({option: 1}).then(res => {
      if (res.data) {
        this.listFlightMarket = res.data;
      }
    });
  }

  async loadListHotel() {
    await this.hotelService.search({}).then(res => {
      if (res.data) {
        this.listHotel = res.data.content;
      }
    });
  }

  async loadListVehiclesPartner() {
    await this.vehicleService.search({}).then(res => {
      if (res.data) {
        this.listVehicle = res.data.content;
      }
    });
  }

  async getPartnerInfo() {
    await this.baseService.getPartnerInfo().then(res => {
      console.log(res)
    });
  }

  async getMarket() {
    await this.baseService.getMarket().then(res => {

      console.log(res)

    });
  }

  async syncDWH() {

  }

  async showExport() {

  }
}
