import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { InvoiceDocumentDetailComponent } from 'src/app/crew-trip/features/invoice/document/document-detail/invoice-document-detail.component';
import { InvoiceDocumentReviewComponent } from 'src/app/crew-trip/features/invoice/document/document-detail/invoice-document-review.component';
import { InvoiceDocumentRemindComponent } from 'src/app/crew-trip/features/invoice/document/invoice-document-remind.component';
import { InvoiceDocumentComponent } from 'src/app/crew-trip/features/invoice/document/invoice-document.component';

@Component({
	selector: 'app-invoice-document-tab',
	standalone: true,
	imports: [
		CommonModule,
		MatCardModule,
		MatButtonModule,
		MatMenuModule,
		MatTableModule,
		MatPaginatorModule,
		NgIf,
		MatCheckboxModule,
		ReactiveFormsModule,
		MatTab,
		MatTabGroup,
		MatDatepickerModule,
		InvoiceDocumentDetailComponent,
		InvoiceDocumentDetailComponent,
		InvoiceDocumentReviewComponent,
		InvoiceDocumentComponent,
		InvoiceDocumentRemindComponent,
	],
	templateUrl: './invoice-document-tab.component.html',
	styleUrl: './invoice-document-tab.component.scss',
})
export class InvoiceDocumentTabComponent implements OnInit {
	tabType = 'INVOICE';
	step = 1;
	id: any;
	readMode: any;
	dataObject: any;

	constructor() {}

	async ngOnInit() {}

	onTabChange($event: any) {
		if ($event.index === 0) {
			this.tabType = 'INVOICE';
		} else {
			this.tabType = 'REMINDER';
		}
	}

	nextStepEmit($event: any) {
		this.id = $event[0];
		this.readMode = $event[1];
		this.step = $event[2];
		this.dataObject = $event[3];
	}

	backStepEmit($event: any) {
		this.step = 1;
		this.tabType = 'INVOICE';
	}
}
