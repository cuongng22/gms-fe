import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgClass, NgIf, TitleCasePipe} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {HeaderListBaseComponent} from "src/app/crew-trip/shared/header-list-base.component";
import {UsersService} from "src/app/crew-trip/core/services/users-service";
import {DataTransformPipe} from "src/app/crew-trip/shared/data-transform.pipe";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Constant} from "src/app/crew-trip/shared/utils/constant";
import {InputComponent} from "src/app/crew-trip/shared/input/input.component";
import {RolesService} from "src/app/crew-trip/core/services/roles-service";


export interface PeriodicElement {
  projectName: string;
  deadline: string;
  status: any;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})


export class UsersComponent extends HeaderListBaseComponent implements OnInit {
  override baseService = inject(UsersService);
  rolesService = inject(RolesService);
  fb = inject(FormBuilder);

  //variable
  listRoles = [];
  readMode = false;

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      s: ['',],
    });
    this.formGroupDetail = this.fb.group({
      email: ['', Validators.required],
    });
  }

  _displayedColumns: { label: string; value: string, type?: string, format?: string }[] = [
    {label: 'Ngày tạo', value: 'ngayTao', type: Constant.DATE, format: Constant.DATE_FORMAT},
    {label: 'Người tạo ID', value: 'nguoiTaoId'},
    {label: 'Ngày sửa', value: 'ngaySua', type: Constant.DATE, format: Constant.DATE_TIME_FORMAT},
    {label: 'Người sửa ID', value: 'nguoiSuaId'},
    {label: 'ID', value: 'id'},
    {label: 'Năm', value: 'nam', type: Constant.DATE},
    {label: 'Mã đơn vị', value: 'maDvi'},
    {label: 'Loại nhập xuất', value: 'loaiNhapXuat'},
    {label: 'Tên loại nhập xuất', value: 'tenLoaiNhapXuat'},
    {label: 'Kiểu nhập xuất', value: 'kieuNhapXuat'},
    {label: 'Phân loại', value: 'phanLoai'},
    {label: 'Mục đích xuất', value: 'mucDichXuat'},
    {label: 'Số đề xuất', value: 'soDx'},
    {label: 'Trích yếu', value: 'trichYeu'},
    {label: 'Loại vật tư hàng hóa', value: 'loaiVthh'},
    {label: 'Chủng loại vật tư hàng hóa', value: 'cloaiVthh'},
    {label: 'Tên vật tư hàng hóa', value: 'tenVthh'},
    {label: 'Ngày đề xuất', value: 'ngayDx'},
    {label: 'Ngày kết thúc', value: 'ngayKetThuc'},
    {label: 'Nội dung', value: 'noiDung'},
    {label: 'Trạng thái', value: 'trangThai'},
    {label: 'ID tổng hợp', value: 'idThop'},
    {label: 'Mã tổng hợp', value: 'maTongHop'},
    {label: 'ID quyết định phê duyệt', value: 'idQdPd'},
    {label: 'Số quyết định phê duyệt', value: 'soQdPd'},
    {label: 'Ngày ký quyết định', value: 'ngayKyQd'},
    {label: 'Tổng số lượng', value: 'tongSoLuong'},
    {label: 'Tổng số lượng đề xuất', value: 'tongSoLuongDeXuat'},
    {label: 'Tổng số lượng xuất cấp', value: 'tongSoLuongXuatCap'},
    {label: 'Ngày giám đốc duyệt', value: 'ngayGduyet'},
    {label: 'Người giám đốc duyệt ID', value: 'nguoiGduyetId'},
    {label: 'Ngày phê duyệt', value: 'ngayPduyet'},
    {label: 'Người phê duyệt ID', value: 'nguoiPduyetId'},
    {label: 'Lý do từ chối', value: 'lyDoTuChoi'},
    {label: 'Loại', value: 'type'},
    {label: 'Tồn kho đơn vị', value: 'tonKhoDvi'},
    {label: 'Ngày tập kết', value: 'ngayTapKet'},
    {label: 'Ngày giao hàng', value: 'ngayGiaoHang'},
    {label: 'Tên đơn vị', value: 'tenDvi'},
    {label: 'Tên đơn vị đề xuất', value: 'tenDviDx'},
    {label: 'Tên loại vật tư hàng hóa', value: 'tenLoaiVthh'},
    {label: 'Tên chủng loại vật tư hàng hóa', value: 'tenCloaiVthh'},
    {label: 'Tên trạng thái', value: 'tenTrangThai'},
    {label: 'Tên trạng thái tổng hợp', value: 'tenTrangThaiTh'},
    {label: 'Tên trạng thái quyết định', value: 'tenTrangThaiQd'},
    {label: 'Căn cứ', value: 'canCu'}
  ]
  ;

  override async ngOnInit() {
    await Promise.all([
      // this.loadListRoleGroup(),
      // this.search(),
    ]).then(() => {
    });
    this.dataSource.data = [{
      "ngayTao": "2024-09-13T15:37:48.725",
      "nguoiTaoId": 566,
      "ngaySua": "2024-09-13T15:40:06.518",
      "nguoiSuaId": 566,
      "id": 4623,
      "nam": 2024,
      "maDvi": "010124",
      "loaiNhapXuat": "8",
      "tenLoaiNhapXuat": "Xuất hỗ trợ",
      "kieuNhapXuat": "Xuất không thu tiền",
      "phanLoai": "01.04",
      "mucDichXuat": "Học sinh kỳ II năm học 2023-2024",
      "soDx": "13/TTr-QLHDT",
      "trichYeu": "Đề xuất phương án xuất CT,VT",
      "loaiVthh": "0102",
      "cloaiVthh": null,
      "tenVthh": "Gạo tẻ",
      "ngayDx": "2024-09-13",
      "ngayKetThuc": "2024-09-19",
      "noiDung": null,
      "trangThai": "52",
      "idThop": null,
      "maTongHop": null,
      "idQdPd": 3121,
      "soQdPd": "192/QĐ-TCDT",
      "ngayKyQd": "2024-09-13",
      "tongSoLuong": null,
      "tongSoLuongDeXuat": 10000,
      "tongSoLuongXuatCap": 10000,
      "ngayGduyet": null,
      "nguoiGduyetId": null,
      "ngayPduyet": "2024-09-13",
      "nguoiPduyetId": 566,
      "lyDoTuChoi": null,
      "type": null,
      "tonKhoDvi": 258282010,
      "ngayTapKet": null,
      "ngayGiaoHang": null,
      "tenDvi": "Vụ Quản lý Hàng dự trữ",
      "tenDviDx": "Tổng cục Dự trữ Nhà nước",
      "tenLoaiVthh": null,
      "tenCloaiVthh": null,
      "tenTrangThai": "Đã tạo - CB Vụ",
      "tenTrangThaiTh": "Chưa tổng hợp",
      "tenTrangThaiQd": "Ban hành",
      "canCu": []
    },
      {
        "ngayTao": "2024-09-13T15:37:48.725",
        "nguoiTaoId": 566,
        "ngaySua": "2024-09-13T15:40:06.518",
        "nguoiSuaId": 566,
        "id": 461123,
        "nam": 2024,
        "maDvi": "010124",
        "loaiNhapXuat": "8",
        "tenLoaiNhapXuat": "Xuất hỗ trợ",
        "kieuNhapXuat": "Xuất không thu tiền",
        "phanLoai": "01.04",
        "mucDichXuat": "Học sinh kỳ II năm học 2023-2024",
        "soDx": "13/TTr-QLHDT",
        "trichYeu": "Đề xuất phương án xuất CT,VT",
        "loaiVthh": "0102",
        "cloaiVthh": null,
        "tenVthh": "Gạo tẻ",
        "ngayDx": "2024-09-13",
        "ngayKetThuc": "2024-09-19",
        "noiDung": null,
        "trangThai": "52",
        "idThop": null,
        "maTongHop": null,
        "idQdPd": 3121,
        "soQdPd": "192/QĐ-TCDT",
        "ngayKyQd": "2024-09-13",
        "tongSoLuong": null,
        "tongSoLuongDeXuat": 10000,
        "tongSoLuongXuatCap": 10000,
        "ngayGduyet": null,
        "nguoiGduyetId": null,
        "ngayPduyet": "2024-09-13",
        "nguoiPduyetId": 566,
        "lyDoTuChoi": null,
        "type": null,
        "tonKhoDvi": 258282010,
        "ngayTapKet": null,
        "ngayGiaoHang": null,
        "tenDvi": "Vụ Quản lý Hàng dự trữ",
        "tenDviDx": "Tổng cục Dự trữ Nhà nước",
        "tenLoaiVthh": null,
        "tenCloaiVthh": null,
        "tenTrangThai": "Đã tạo - CB Vụ",
        "tenTrangThaiTh": "Chưa tổng hợp",
        "tenTrangThaiQd": "Ban hành",
        "canCu": [],
        email: 'aaaaa'
      }
    ]
    this.displayedColumns = ['select', 'stt', ...this._displayedColumns.map(s => s.value), 'action'];
  }

  async loadListRoleGroup() {
    let res = await this.rolesService.search({page: -1});
    if (res) {
      this.listRoles = res;
    }
  }

  override async save(data: any) {
    super.save(data).then(res => {
      console.log(res)
      /*todo: check res thanh cong thi thong bao*/
      this.search();
      this.closeDetail();
    });
  }

  override async delete(id: any) {
    super.delete(id).then(res => {
      console.log(res)
      //todo: check res thanh cong thi thong bao
      this.search();
    });
  }

  async _detail(id: any, mode: boolean) {
    super.showDetail(id).then(res => {
      console.log(res)
      this.readMode = mode;
      this.formGroupDetail[mode ? 'disable' : 'enable']();
    });
  }
}
