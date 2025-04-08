import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  NO_ERRORS_SCHEMA,
  OnInit,
  ViewChild
} from '@angular/core';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {RouterLink} from '@angular/router';
import {CommonModule, NgClass, NgIf, TitleCasePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DataTransformPipe} from 'src/app/crew-trip/shared/data-transform.pipe';
import {MatError, MatFormField, MatFormFieldModule, MatLabel, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';
import {MatInput, MatInputModule} from '@angular/material/input';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {RoleFunctionComponent} from 'src/app/crew-trip/features/roles/role-function/role-function.component';
import {NoDataRowOutlet} from '@angular/cdk/table';
import {NationService} from 'src/app/crew-trip/core/services/nation-service';
import {UsersService} from 'src/app/crew-trip/core/services/users-service';
import {HotelService} from 'src/app/crew-trip/core/services/hotel-service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
  MatNativeDateModule,
  NativeDateAdapter,
  provideNativeDateAdapter
} from '@angular/material/core';
import {MatAutocompleteModule, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {map, Observable, startWith} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {FlightMarketService} from 'src/app/crew-trip/core/services/flight-market.service';
import {Constant, DATE_FORMAT_DD_MM_YYYY} from 'src/app/crew-trip/shared/utils/constant';
import {MAT_MOMENT_DATE_FORMATS, provideMomentDateAdapter} from '@angular/material-moment-adapter';
import {ReportService} from "src/app/crew-trip/core/services/report-service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule
  ],
  providers: [DataTransformPipe,
    provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),
  ],
  templateUrl: './report3.component.html',
  styleUrl: './report3.component.scss'
})
export class reportcomponent3 extends CommonComponent implements OnInit {
  override baseService = inject(ReportService);
  iframeUrl: SafeResourceUrl;
  codeReport = 'BC_7_3';

  constructor(private sanitizer: DomSanitizer) {
    super();
  }

  override async ngOnInit() {
    await this.spinner.show();
    try {
      await this.loadReport();
    } catch (error: any) {
      this.showError(error);
    }
    await this.spinner.hide();
  }

  async loadReport() {
    try {
      this.baseService.getReportLink(this.codeReport).then(res => {
        this.iframeUrl = this.sanitizeUrl(res.data);
      });
    } catch (Error: any) {
      console.log(Error);
    }
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
