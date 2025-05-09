import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import {
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {
  MatCardModule,
} from '@angular/material/card';
import {
  MatTableModule
} from '@angular/material/table';
import {
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { ExchangeRateService } from 'src/app/crew-trip/core/services/exchange-rate.service';
import { MatNativeDateModule } from '@angular/material/core';
import { Constant, DATE_FORMAT_DD_MM_YYYY, MESSAGE, removeNullValues } from 'src/app/crew-trip/shared/utils/constant';
import { HttpStatusCode } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { HasPermissionDirective } from 'src/app/crew-trip/shared/directive/has-permission.directive';

@Component({
  selector: 'app-act-rate',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, MatCheckbox, NgxTrimDirectiveModule,
    HasPermissionDirective
  ],
  providers: [DataTransformPipe,
    provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),
    HasPermissionDirective
  ],
  templateUrl: './act-rate.component.html',
  styleUrl: './act-rate.component.scss'
})

export class ActRateComponent extends CommonComponent implements OnInit {
  override baseService = inject(ExchangeRateService);
  showDialogHistory = false;
  itemDetail: any;
  listHistoryData = [];
  displayedColumnsHis: string[] = [];
  override formGroupSearch = this.formBuilder.group({
    s: [''], //Keyword Search
    startDate: [new Date()],
    endDate: [new Date()],
    export: [false],
  });

  constructor(public dataTransformPipe: DataTransformPipe) {
    super();
  }


  override async ngOnInit() {
    super.ngOnInit();
    this.displayedColumns = ['stt', 'code', 'price', 'type', 'currDate', 'updatedDate', 'action'];
    this.search();
  }


  override async search(body?: any, isNextPage?: boolean) {
    const startDate = this.formGroupSearch.controls.startDate.value;
    const endDate = this.formGroupSearch.controls.endDate.value;
    const searchValue = {
      ...this.formGroupSearch.value,
      startDate: startDate ? this.dataTransformPipe.transform(startDate, ['date', 'YYYY-MM-DD']) : null,
      endDate: endDate ? this.dataTransformPipe.transform(endDate, ['date', 'YYYY-MM-DD']) : null,
    };
    try {
      await this.spinner.show();
      if (!isNextPage) {
        this.pageIndex = Constant.PAGE;
      }
      const res = await this.baseService.actSearch({
        page: this.pageIndex,
        size: this.pageSize, ...removeNullValues(body) || removeNullValues(searchValue),
        limit: this.pageSize, ...removeNullValues(body) || removeNullValues(searchValue)
      });
      if (res) {
        if (res.status === HttpStatusCode.Ok) {
          this.dataSource.data = res.data.content;
          this.dataSource.data = this.dataSource.data.map((s: any) => ({
            ...s,
            isActiveLabel: s.isActive ? MESSAGE.ACTIVE : MESSAGE.INACTIVE,
            activeLabel: !!s.active || !!s.status ? MESSAGE.ACTIVE : MESSAGE.INACTIVE
          }));
          this.totalElement = res.data.totalElements;
        }
        return res;
      }
    } catch (e: any) {
      this.baseService.showError(e.error?.data ?? e.error ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async viewHistory(item?: any) {
    this.showDialogHistory = !this.showDialogHistory;
    this.itemDetail = item ?? null;
    this.listHistoryData = [];
    try {
      await this.spinner.show();
      const res = await this.baseService.actDetail(item?.code);
      if (res) {
        if (res.status === HttpStatusCode.Ok) {
          this.displayedColumnsHis = ['updatedDate', 'rate', 'currDate', 'type'];
          this.listHistoryData = res.data;
        }
        return res;
      }
    } catch (e: any) {
      this.baseService.showError(e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  override async exportFileOptions(body?: any, filename?: string, sourcePath?: string) {
    try {
      await this.spinner.show();
      const startDate = this.formGroupSearch.controls.startDate.value;
      const endDate = this.formGroupSearch.controls.endDate.value;
      const searchValue = {
        ...this.formGroupSearch.value,
        'export': true,
        startDate: startDate ? this.dataTransformPipe.transform(startDate, ['date', 'YYYY-MM-DD']) : null,
        endDate: endDate ? this.dataTransformPipe.transform(endDate, ['date', 'YYYY-MM-DD']) : null,
      };
      const res = await this.baseService.exportDataOptions({ ...removeNullValues(body) || removeNullValues(searchValue) }, sourcePath);
      this.downloadFile(res.blob, filename ?? res.fileName);
    } catch (e: any) {
      this.baseService.showError((e.error?.error?.code) ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async sync() {
    try {
      await this.spinner.show();
      this.baseService.actualSync();
    } catch (e: any) {
      this.showError(
        e.error?.data ?? e.error?.error ?? e.error ?? this.MESSAGE.ERROR,
      );
    } finally {
      this.spinner.hide()
    }
  }
}

