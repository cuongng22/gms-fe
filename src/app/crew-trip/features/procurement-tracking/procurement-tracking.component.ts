import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAnchor, MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatDatepickerActions,
  MatDatepickerApply,
  MatDatepickerCancel,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import {
  MatError,
  MatFormFieldModule,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { DATE_FORMAT_DD_MM_YYYY, removeNullValues } from 'src/app/crew-trip/shared/utils/constant';
import { ProcurementTrackingService } from '../../core/services/procurement-tracking.service';
import { Authoritys, ContractPeriods, Fields, SelectionUnits } from './procurement-tracking.model';
import { MatTableModule } from '@angular/material/table';
import { DataTransformPipe } from '../../shared/data-transform.pipe';
import { CommonModule } from '@angular/common';
import { ListResponse } from '../../shared/models/common.model';
import { HttpStatusCode } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-procurement-tracking',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    SelectMultipleComponent,
    SelectionComponent,
    MatButton,
    MatDateRangeInput,
    NgxTrimDirectiveModule,
    MatDatepickerToggle,
    MatDatepickerCancel,
    MatDatepickerActions,
    MatDateRangePicker,
    MatSuffix,
    MatDatepickerApply,
    NgxControlError,
    MatEndDate,
    MatFormFieldModule,
    MatLabel,
    MatError,
    InputSizeComponent,
    MatStartDate,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatAnchor,
    RouterLink,
    MatTableModule,
    DataTransformPipe,
    CommonModule, MatPaginatorModule
  ],
  templateUrl: './procurement-tracking.component.html',
  styleUrl: './procurement-tracking.component.scss',
  providers: [
    provideNativeDateAdapter(),
    provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),
  ],
})
export class ProcurementTrackingComponent extends CommonComponent implements OnInit {
  override baseService = inject(ProcurementTrackingService);

  contractPeriods = ContractPeriods;
  optionsType = [
    { name: 'Hotel', value: 'HOTEL' },
    { name: 'Transportation', value: 'CAR' },
  ];
  fields = Fields;
  _displayedColumns: {
    label: string; value: string, type?: string, format?: string, class?: string
  }[] = [
      { label: $localize`:@@servicePackageName:Service Package Name`, value: 'servicePkgName' },
      { label: $localize`:@@type:Type`, value: 'type' },
      { label: $localize`:@@authority:Authority`, value: 'authority' },
      { label: $localize`:@@field:Field`, value: 'field' },
      { label: $localize`:@@selectedSupplier:Selected supplier`, value: 'supplierName' },
      { label: $localize`:@@noOfKQLC:No.of KQLC`, value: 'resultNumber', type: this.Constant.NUMBER, class: 'text-right' },
      { label: $localize`:@@unit:Unit`, value: 'planSelectionUnit' },
      { label: $localize`:@@unitPriceKQLCIncludingVAT:Unit price_KQLC <br/> (Including VAT)`, value: 'resultUnitPriceIncVAT', type: this.Constant.NUMBER, class: 'text-right' },
      { label: $localize`:@@TotalValueMSKQLCVND:Total value_MS KQLC <br/> (VND)`, value: 'resultTotalValueVND', type: this.Constant.NUMBER, class: 'text-right' },
      { label: $localize`:@@reviewOfDepartment:Review of department`, value: 'note' }
    ];
  override formGroupDetail = this.formBuilder.group({
    id: ['']
  });
  
  override formGroupSearch = this.formBuilder.group({
    airportCodes: [''],
    type: [''],
    field: [''],
    contractPeriod: [''],
    export: false
  });

  constructor() {
    super();

  }

  override async ngOnInit(): Promise<void> {
    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'action'];
    await this.spinner.show();
    this.formGroupSearchInit = { ...this.formGroupSearch.value };
    this.loadListFlightMarket()
    this.search()
    await this.spinner.hide();
  }


  override async search<T>(
    body?: any,
    isNextPage?: boolean
  ) {
    try {
      await this.spinner.show();
      if (!isNextPage) {
        this.pageIndex = this.Constant.PAGE;
      }
      const buildBodySearch = {
        page: this.pageIndex,
        size: this.pageSize,
        limit: this.pageSize,
        ...(removeNullValues(body) ||
          removeNullValues(this.formGroupSearch?.value)),
      };
      let res = await this.baseService.search<ListResponse<T>>(buildBodySearch);
      // const
      if (res) {
        if (res.status === HttpStatusCode.Ok) {
          this.dataSource.data = res.data.content;
          this.dataSource.data = this.dataSource.data.map((s: any) => ({
            ...s,
            authority: Authoritys.find(item => item.code === s.authority)?.value,
            field: Fields.find(item => item.code === s.field)?.value,
            planSelectionUnit: SelectionUnits.find(item => item.code === s.planSelectionUnit)?.value,

          }));
          this.totalElement = res.data.totalElements;
        }
        return res;
      }
    } catch (e: any) {
      console.log(e)
      this.baseService.showError(
        e.error?.data ?? e.error?.error ?? e.error ?? this.MESSAGE.ERROR,
      );
    } finally {
      await this.spinner.hide();
    }
  }
}
