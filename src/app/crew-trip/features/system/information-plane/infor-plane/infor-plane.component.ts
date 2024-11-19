import {Component, inject} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import {  MatError, MatFormField, MatFormFieldModule, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatOption, MatOptionModule } from '@angular/material/core'; // Import MatOptionModule nếu cần thiết
import { MatIconModule } from '@angular/material/icon';
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {InfoPlaneService} from "src/app/crew-trip/core/services/InfoPlaneService.service";
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule, NgClass, NgIf,TitleCasePipe } from '@angular/common';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { RouterLink } from '@angular/router';

import { MatMenuModule } from '@angular/material/menu';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { RoleFunctionComponent } from '../../../roles/role-function/role-function.component';
import { NoDataRowOutlet } from '@angular/cdk/table';


// @ts-ignore
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
    MatPaginatorModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    InputSizeComponent,
    MatCheckbox,
    TitleCasePipe,
    DataTransformPipe,
    CommonModule,

    RouterLink,
    NgIf,
    DataTransformPipe,
    NgClass,
    MatFormField,
    MatSelect,
    MatOption,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatError, MatPrefix,
    MatSuffix,
    MatTab,
    MatTabGroup,
    RoleFunctionComponent,
    NoDataRowOutlet

  ],
  templateUrl: './infor-plane.component.html',
  styleUrls: ['./infor-plane.component.scss']
})
export class InforPlaneComponent extends CommonComponent {
  override baseService = inject(InfoPlaneService);
  override displayedColumns: string[] = ['index', 'acGroup', 'acType', 'note', 'status', 'action'];
  fb = inject(FormBuilder);
  _displayedColumns: {
    label: string;
    value: string,
    type?: string,
    format?: string
  }[] = [// {label: 'Ngày tạo', value: 'ngayTao', type: Constant.DATE, format: Constant.DATE_FORMAT},
    {label: `AC Group`,value: "acGroup"},
    {label:`AC Type`, value: "acType" },
    {label: `Description`,value: "Description"},
    {label: `Status`, value: "activeLabel" },];


  override formGroupSearch: FormGroup;


  // override dataSource: any[] = []; // Đây là dữ liệu mẫu, bạn có thể cập nhật theo nhu cầu của mình
  override totalElement = 0;
  override pageSize = 10;
  override pageSizeOptions = [5, 10, 25, 50];
  override pageIndex = 0;
  override showFirstLastButtons = true;
  override showDialogDelete = false;
  statuses: string[] = ['Active', 'Inactive', 'Pending'];
  selectedOption = true;
  constructor() {
    super();

    this.formGroupSearch = this.fb.group({
      s: ['',],
      active: [true,]
    });
    this.formGroupDetail = this.fb.group({
      id: [],
      notes: [''],
      acGroup: [''],
      acType: [''],
      active: [''],
      description: [''],
    })

    this.formGroupSearchInit = {...this.formGroupSearch.value}
    this.formGroupDetailInit = {...this.formGroupDetail.value}
  }


  override async ngOnInit() {
    //call api
    await Promise.all([this.search(),]);
  }
  createAirplane() {
    this.showDialogCreate = true
  }

//   override async save(): Promise<void> {
//     this.formGroupDetail = this.fb.group({
//       id: [''],
//       notes: [''],
// ACGroup: [''],
//       ACType: [''],
//       active: [''],
//       description: [''],
//     });
//     this.formGroupDetailInit = {...this.formGroupDetail.value}
//     super.save()
//   }

  updateAirplane(): void {
    this.showDialogCreate = true
  }


  // search() {
  //   // Thêm logic tìm kiếm tại đâyh.val
  //   console.log('Search clicked', this.formGroupSearcue);
  // }

  // grMailDetail(id?: number, mode?: string) {
  //   // Logic hiển thị chi tiết group mail
  //   console.log('Detail clicked', { id, mode });
  // }

  override async showConfirmDelete(id: number) {
    this.showDialogDelete = true;
    console.log('Show confirm delete dialog for ID:', id);
    // super()
  }

  // toggleDialogDelete() {
  //   this.showDialogDelete = !this.showDialogDelete;
  // }

  // delete() {
  //   // Logic xoá phần tử
  //   console.log('Delete action confirmed');
  //   this.showDialogDelete = false;
  // }

  // onPageChange(event: any) {
  //   console.log('Page change event:', event);
  //   // Cập nhật dữ liệu dựa vào phân trang
  // }

}
