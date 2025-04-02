import {
  Component, CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit
} from '@angular/core';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {CommonModule, NgClass, NgIf, TitleCasePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {DataTransformPipe} from 'src/app/crew-trip/shared/data-transform.pipe';
import {MatError, MatFormField, MatFormFieldModule, MatLabel, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';
import {MatInput, MatInputModule} from '@angular/material/input';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {
  MatNativeDateModule,
} from '@angular/material/core';
import {MatAutocompleteModule, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {Constant, DATE_FORMAT_DD_MM_YYYY} from 'src/app/crew-trip/shared/utils/constant';
import {MAT_MOMENT_DATE_FORMATS, provideMomentDateAdapter} from '@angular/material-moment-adapter';
import {ReportService} from 'src/app/crew-trip/core/services/report-service';
import { TableauModule } from 'ngx-tableau';


@Component({
	selector: 'app-report',
	standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
	imports: [
		MatCardModule,
		FormsModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		MatSelectModule,
		MatButtonModule,
		MatFormField,
		MatInputModule,
		InputSizeComponent,
		MatDatepickerModule,
		MatNativeDateModule,
		NgxMaterialTimepickerModule,
		MatAutocompleteModule,
		CommonModule,
		MatTableModule,
		MatPaginatorModule,
		TableauModule,
	],
	providers: [
		DataTransformPipe,
		provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),
	],
	templateUrl: './report1.component.html',
	styleUrl: './report1.component.scss',
})
export class reportcomponent extends CommonComponent implements OnInit {
	override baseService = inject(ReportService);
	iframeUrl = '';
  serverUrl: string;
  ticket: string;
  report: string;
	codeReport = 'BC_7_2';

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
			this.baseService.getReportLink(this.codeReport).then((res) => {
				this.iframeUrl = res.data;
        // const serverEndIndex = this.iframeUrl.indexOf('/trusted/');
        // this.serverUrl = this.iframeUrl.substring(0, serverEndIndex);
        //
        // const ticketStartIndex = serverEndIndex + '/trusted/'.length;
        // const ticketEndIndex = this.iframeUrl.indexOf('/views/');
        // this.ticket = this.iframeUrl.substring(ticketStartIndex, ticketEndIndex);
        //
        // const reportStartIndex = ticketEndIndex + 1;
        // const queryIndex = this.iframeUrl.indexOf('?');
        // this.report = queryIndex === -1 ? this.iframeUrl.substring(reportStartIndex) : this.iframeUrl.substring(reportStartIndex, queryIndex);
        // // Log để kiểm tra giá trị
        // console.log('Server URL:', this.serverUrl);
        // console.log('Ticket:', this.ticket);
        // console.log('Report:', this.report);
				// this.iframeUrl = this.sanitizeUrl('https://crewtripreport.vietnamairlines.com/trusted/je6uoh7qTn6zVWHiwfxqVA==:G6J_26cjbpA8W5Gb93Hwcs64/views/BC_7_2/BC_7_2');
			});
		} catch (Error: any) {
			console.log(Error);
		}
	}

	sanitizeUrl(url: string): SafeResourceUrl {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}
}
