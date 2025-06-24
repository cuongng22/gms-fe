import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ReportService } from 'src/app/crew-trip/core/services/report-service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { DATE_FORMAT_DD_MM_YYYY } from 'src/app/crew-trip/shared/utils/constant';

@Component({
	selector: 'app-report',
	standalone: true,
	imports: [
		MatCardModule,
		FormsModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		MatSelectModule,
		MatButtonModule,
		MatInputModule,
		MatDatepickerModule,
		MatNativeDateModule,
		NgxMaterialTimepickerModule,
		MatAutocompleteModule,
		CommonModule,
		MatTableModule,
		MatPaginatorModule,
	],
	providers: [
		DataTransformPipe,
		provideMomentDateAdapter(DATE_FORMAT_DD_MM_YYYY),
	],
	templateUrl: './report10.component.html',
	styleUrl: './report10.component.scss',
})
export class reportcomponent10 extends CommonComponent implements OnInit {
	override baseService = inject(ReportService);
	iframeUrl: SafeResourceUrl;
	codeReport = 'BC_7_10';

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

	async loadReport(sync?: boolean) {
		try {
			this.baseService.getReportLink(this.codeReport, sync).then((res) => {
				this.iframeUrl = this.sanitizeUrl(res.data);
			});
		} catch (Error: any) {
			console.log(Error);
		}
	}

	async refreshReport(sync?: boolean) {
		try {
			await this.spinner.show();
			await this.baseService
				.getReportLink(this.codeReport, sync)
				.then((res) => {});
		} catch (Error: any) {
			await this.spinner.hide();
			console.log(Error);
		}
		await this.spinner.hide();
	}

	sanitizeUrl(url: string): SafeResourceUrl {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}
}
