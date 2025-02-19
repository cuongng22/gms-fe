import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
    CommonModule
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
    { name: 'Car Rental', value: 'CAR' },
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
      { label: $localize`:@@noOfKQLC:No.of KQLC`, value: 'planNumber' },
      { label: $localize`:@@unit:Unit`, value: 'planSelectionUnit' },
      { label: $localize`:@@unitPriceKQLCIncludingVAT:Unit price _ KQLC (Including VAT)`, value: 'planUnitPriceIncVAT' },
      { label: $localize`:@@TotalValueVNDMSKQLC:Total value (VND) - MS KQLC`, value: 'planTotalValueVND' },
      { label: $localize`:@@note:Note`, value: 'note' }
    ];
  fb: FormBuilder = inject(FormBuilder);

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      airportCodes: [''],
      type: [''],
      field: [''],
      contractPeriod: [''],
      export: false
    });
  }

  override async ngOnInit(): Promise<void> {
    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'action'];
    await this.spinner.show();
    this.formGroupSearchInit = { ...this.formGroupSearch.value };
    const listMarket = await this._flightMarketService.search({
      option: 1,
      status: 'Operational',
    });
    this.listFlightMarket = listMarket.data;
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
