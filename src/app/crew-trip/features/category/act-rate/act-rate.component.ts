import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatPaginator} from "@angular/material/paginator";
import {MatSelect} from "@angular/material/select";
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {HotelService} from "src/app/crew-trip/core/services/hotel-service";
import {ExchangeRateService} from "src/app/crew-trip/core/services/exchange-rate.service";
import {MatNativeDateModule} from "@angular/material/core";
import {Constant, MESSAGE, removeNullValues} from "src/app/crew-trip/shared/utils/constant";
import {HttpStatusCode} from "@angular/common/http";
import {SelectionModel} from "@angular/cdk/collections";

@Component({
  selector: 'app-act-rate',
  standalone: true,
    imports: [
        MatDatepickerModule,
      MatNativeDateModule,
      InputSizeComponent,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatButton,
        MatCard,
        MatCardContent,
        MatCardHeader,
        MatCardSubtitle,
        MatCardTitle,
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatFormField,
        MatHeaderCell,
        MatHeaderRow,
        MatHeaderRowDef,
        MatInput,
        MatLabel,
        MatOption,
        MatPaginator,
        MatRow,
        MatRowDef,
        MatSelect,
        MatSuffix,
        MatTable,
        ReactiveFormsModule
    ],
  templateUrl: './act-rate.component.html',
  styleUrl: './act-rate.component.scss'
})

export class ActRateComponent extends CommonComponent implements OnInit{
  override baseService = inject(ExchangeRateService);
  formBuilder = inject(FormBuilder);

  override displayedColumns: string[] = [];
  override dataSource = new MatTableDataSource();
  override selection = new SelectionModel<any>(true, []);
  override pageSize = Constant.PAGE_SIZE;
  override pageIndex = Constant.PAGE;
  override pageSizeOptions = [10, 50, 100]
  override totalElement = 0;
  override formGroupSearch = this.formBuilder.group({
    s: [''], //Keyword Search
    active: [''],
  });


  override async ngOnInit() {
    super.ngOnInit();
    this.displayedColumns = ['stt','code'];
    this.search();
  }

  // @ts-ignore
  override async search(body?: any) {
    try {
      await this.spinner.show();
      let res = await this.baseService.actSearch({
        page: this.pageIndex,
        size: this.pageSize, ...removeNullValues(body) || removeNullValues(this.formGroupSearch.value),
        limit: this.pageSize, ...removeNullValues(body) || removeNullValues(this.formGroupSearch.value)
      });
      if (res) {
        if (res.status === HttpStatusCode.Ok) {
          this.dataSource.data = res.data.content;
          this.dataSource.data = this.dataSource.data.map((s: any) => ({
            ...s,
            isActiveLabel: !!s.isActive ? MESSAGE.ACTIVE : MESSAGE.INACTIVE,
            activeLabel: !!s.active || !!s.status ? MESSAGE.ACTIVE : MESSAGE.INACTIVE
          }))
          console.log("this.dataSourcethis.dataSource:",this.dataSource)
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

}
