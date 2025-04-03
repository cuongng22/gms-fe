import { Component, inject, OnInit } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { ReportService } from 'src/app/crew-trip/core/services/report-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [MatCard, MatCardContent],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent extends CommonComponent implements OnInit {
	override baseService = inject(ReportService);
	iframeUrl = '';
	ticket: string;
	report: string;
	codeReport = 'CR_DASHBOARD';

	constructor() {
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
			});
		} catch (Error: any) {
			console.log(Error);
		}
	}
}
