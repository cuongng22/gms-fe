import { Component, inject, OnInit } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { ReportService } from 'src/app/crew-trip/core/services/report-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-report11',
	standalone: true,
	imports: [MatCard, MatCardContent],
	templateUrl: './report11.component.html',
	styleUrl: './report11.component.scss',
})
export class Report11Component extends CommonComponent implements OnInit {
	override baseService = inject(ReportService);
	iframeUrl: SafeResourceUrl;
	codeReport = 'BC_7_11';

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
