import {
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	inject,
	OnInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { ReportService } from 'src/app/crew-trip/core/services/report-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {HasPermissionDirective} from "src/app/crew-trip/shared/directive/has-permission.directive";

@Component({
	selector: 'app-dashboard',
	standalone: true,
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
    HasPermissionDirective,
  ],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss',
})
export class DashboardComponent extends CommonComponent implements OnInit {
	override baseService = inject(ReportService);
	iframeUrl: SafeResourceUrl;
	codeReport = 'CR_DASHBOARD';

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
			this.baseService.getReportLink(this.codeReport,sync).then((res) => {
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
