import {Component, inject, OnInit} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core'; // Import MatOptionModule nếu cần thiết
import { MatIconModule } from '@angular/material/icon';
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {InfoPlaneService} from "src/app/crew-trip/core/services/InfoPlaneService.service";

@Component({
  selector: 'app-infor-plane',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule, MatOptionModule, MatSelectModule, MatIconModule, InputSizeComponent
  ],
  templateUrl: './infor-plane.component.html',
  styleUrls: ['./infor-plane.component.scss']
})
export class InforPlaneComponent extends CommonComponent {
  override baseService = inject(InfoPlaneService);
  override displayedColumns: string[] = ['index', 'acGroup', 'acType', 'note', 'status', 'action'];
  // infor = [
  //   { acGroup: '320', acType: '32L', note: '', status: 'Active' },
  //   { acGroup: '321', acType: '32A', note: '', status: 'Active' },
  //   { acGroup: '350', acType: '35A', note: '', status: 'Active' },
  //   { acGroup: '787', acType: '78A', note: '', status: 'Active' },
  //   { acGroup: 'ART', acType: 'AT7', note: '', status: 'Active' },
  // ];
  override formGroupSearch: FormGroup;
  // override dataSource: any[] = []; // Đây là dữ liệu mẫu, bạn có thể cập nhật theo nhu cầu của mình

  override totalElement = 0;
  override pageSize = 10;
  override pageSizeOptions = [5, 10, 25, 50];
  override pageIndex = 0;
  override showFirstLastButtons = true;
  override showDialogDelete = false;
  statuses: string[] = ['Active', 'Inactive', 'Pending'];
  constructor(private fb: FormBuilder) {
    super();
    this.formGroupSearch = this.fb.group({
      s: ['',], active: ['',], area: ['',],
    });
    this.formGroupSearchInit = {...this.formGroupSearch.value}
  }


  override async ngOnInit() {
    //call api
    await Promise.all([this.search(),]).then(() => {
      console.log(this.dataSource)
    });
  }
  createAirplane() {

  }
  // search() {
  //   // Thêm logic tìm kiếm tại đây
  //   console.log('Search clicked', this.formGroupSearch.value);
  // }
  //
  // grMailDetail(id?: number, mode?: string) {
  //   // Logic hiển thị chi tiết group mail
  //   console.log('Detail clicked', { id, mode });
  // }
  //
  // showConfirmDelete(id: number) {
  //   this.showDialogDelete = true;
  //   console.log('Show confirm delete dialog for ID:', id);
  // }
  //
  // toggleDialogDelete() {
  //   this.showDialogDelete = !this.showDialogDelete;
  // }
  //
  // delete() {
  //   // Logic xoá phần tử
  //   console.log('Delete action confirmed');
  //   this.showDialogDelete = false;
  // }
  //
  // onPageChange(event: any) {
  //   console.log('Page change event:', event);
  //   // Cập nhật dữ liệu dựa vào phân trang
  // }

}
