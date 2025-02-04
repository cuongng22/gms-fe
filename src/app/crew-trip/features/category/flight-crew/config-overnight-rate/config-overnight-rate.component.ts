import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatAnchor, MatButton, MatButtonModule} from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader, MatCardModule,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {
  MatError,
  MatFormField,
  MatFormFieldModule,
  MatHint,
  MatLabel,
  MatPrefix,
  MatSuffix
} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import {CommonModule, DecimalPipe, NgClass, NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {SelectMultipleComponent} from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {FlightCrewService} from 'src/app/crew-trip/core/services/flight-crew-service';
import {FlightMarketService} from 'src/app/crew-trip/core/services/flight-market.service';
import {InfoPlaneService} from 'src/app/crew-trip/core/services/InfoPlaneService.service';
import {UsersService} from 'src/app/crew-trip/core/services/users-service';
import {ConfigOvernightRateService} from 'src/app/crew-trip/core/services/config-overnight-rate-service';
import {MatDialog} from '@angular/material/dialog';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableModule
} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {FileUploadComponent, FileUploadValidators} from '@iplab/ngx-file-upload';
import {MESSAGE} from 'src/app/crew-trip/shared/utils/constant';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DataTransformPipe} from 'src/app/crew-trip/shared/data-transform.pipe';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {RoleFunctionComponent} from 'src/app/crew-trip/features/roles/role-function/role-function.component';
import {NoDataRowOutlet} from '@angular/cdk/table';
import {InputComponent} from 'src/app/ui-elements/input/input.component';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {OtherCrewComponent} from 'src/app/crew-trip/features/category/flight-crew/other-crew/other-crew.component';
import {SelectionComponent} from 'src/app/crew-trip/shared/component/selection/selection.component';

@Component({
  selector: 'app-config-overnight-rate',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatFormFieldModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet, InputComponent, NgxTrimDirectiveModule, OtherCrewComponent, ConfigOvernightRateComponent, MatAutocomplete, MatAutocompleteTrigger, SelectionComponent, InputSizeComponent, SelectMultipleComponent, FileUploadComponent
  ],
  templateUrl: './config-overnight-rate.component.html',
  styleUrl: './config-overnight-rate.component.scss'
})
export class ConfigOvernightRateComponent extends CommonComponent implements OnInit {
  override baseService = inject(ConfigOvernightRateService);
  flightMarketService = inject(FlightMarketService);
  fb = inject(FormBuilder);
  @ViewChild('marketCode') marketCode: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  markets: string[] = [];
  filteredOptionsMarket: any[];
  showDialogUpload = false;

  fileUpload = new FormControl<File[]>([], [Validators.required, FileUploadValidators.filesLimit(1)]);
  uploadFileError: { blob?: Blob, fileName?: string, totalErrors?: string } = {};

  override formGroupDetail = this.fb.group({
    id: ['',],
    marketCode: ['', [Validators.required]],
    nightCount: [''],
    rate: [''],
    notes: ['']
  });

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      marketCode: ['',]
    });
    this.formGroupSearchInit = {...this.formGroupSearch.value};


  }

  override async ngOnInit() {
    super.ngOnInit();
    await Promise.all([
      this.getListAirport(),
      this.search(),
    ]).then(() => {
    });
    this.displayedColumns = ['stt', 'marketCode', 'nightCount', 'rate', 'remark', 'action'];
  }


  getListAirport() {
    this.flightMarketService.search({page: 0, limit: 99999, option: 0}).then(res => {
      this.markets = res.data.content.map((item: any) => item.marketCode);
    });
  }


  filterMarket(): void {
    const filterValue = this.marketCode.nativeElement.value.toLowerCase();
    if (!filterValue) {
      this.filteredOptionsMarket = this.markets;
    }
    this.filteredOptionsMarket = this.markets.filter(market => market.toLowerCase().includes(filterValue));
  }

  onFocusMarket(): void {
    this.filteredOptionsMarket = this.markets;
    this.autocompleteTrigger.openPanel();
  }

  async uploadFile() {
    try {
      this.fileUpload.markAllAsTouched();
      if (this.fileUpload.valid && this.fileUpload.value) {
        const form = new FormData();
        const file: File = this.fileUpload.value[0];
        form.append('file', new Blob([new Uint8Array(await file.arrayBuffer())], {type: file.type}));
        await this.spinner.show();
        const res = await this.baseService.uploadFile(form);
        this.uploadFileError = res;
        if (!res.totalErrors) {
          this.baseService.showSuccess(this.MESSAGE.UPLOAD_SUCCESS);
          this.search();
          this.toggleDialogUpload();
        }
      }
    } catch (e: any) {
      this.baseService.showError(e.error?.error ?? e.error?.error?.code ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }


  toggleDialogUpload() {
    this.showDialogUpload = !this.showDialogUpload;
  }

  async downloadFileError() {
    if (this.uploadFileError.blob) {
      this.downloadFile(this.uploadFileError.blob, this.uploadFileError.fileName ?? 'file-error.xlsx');
    }
  }

}
