import {Component, Inject, inject, LOCALE_ID, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {NgClass, NgIf, TitleCasePipe} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {KeHoachService} from "src/app/crew-trip/core/services/ke-hoach-service";
import {DataTransformPipe} from "src/app/crew-trip/shared/data-transform.pipe";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Constant} from "src/app/crew-trip/shared/utils/constant";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {InputSizeComponent} from '../../../shared/input/input-size.component';
import {CommonComponent} from "src/app/crew-trip/shared/common.component";


export interface PeriodicElement {
  projectName: string;
  deadline: string;
  status: any;
}

@Component({
  selector: 'app-ke-hoach',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatSelectModule, MatDatepickerModule, MatNativeDateModule, NgxMaterialTimepickerModule],
  templateUrl: './ke-hoach.component.html',
  styleUrl: './ke-hoach.component.scss',
})


export class KeHoachComponent extends CommonComponent implements OnInit {
  override baseService = inject(KeHoachService);
  fb = inject(FormBuilder);
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

  constructor(
    @Inject(LOCALE_ID) public locale: string

    // public _actionAlertComponent:ActionAlertComponent
  ) {
    super();
    this.formGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['',]
    });
  }

  override async ngOnInit() {
    await Promise.all([
      // this.search()
    ]).then(() => {
    });
    this.displayedColumns = ['select', 'stt', ...this._displayedColumns.map(s => s.value)];
  }
}
