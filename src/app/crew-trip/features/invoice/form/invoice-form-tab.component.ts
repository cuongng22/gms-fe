import { NoDataRowOutlet } from '@angular/cdk/table';
import { CommonModule, NgClass, NgIf, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
	MatError,
	MatFormField,
	MatHint,
	MatLabel,
	MatPrefix,
	MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { ContractDetailComponent } from 'src/app/crew-trip/features/contract/contract-detail/contract-detail.component';
import { InvoiceFormDetailComponent } from 'src/app/crew-trip/features/invoice/form/form-detail/invoice-form-detail.component';
import { InvoiceFormComponent } from 'src/app/crew-trip/features/invoice/form/invoice-form.component';
import { RoleFunctionComponent } from 'src/app/crew-trip/features/roles/role-function/role-function.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
	selector: 'app-invoice-form-tab',
	standalone: true,
	imports: [
		RouterLink,
		CommonModule,
		MatCardModule,
		MatButtonModule,
		MatMenuModule,
		MatTableModule,
		MatPaginatorModule,
		NgIf,
		MatCheckboxModule,
		TitleCasePipe,
		DataTransformPipe,
		NgClass,
		MatFormField,
		MatSelect,
		MatOption,
		MatInput,
		MatLabel,
		ReactiveFormsModule,
		InputSizeComponent,
		MatError,
		MatPrefix,
		MatSuffix,
		MatTab,
		MatTabGroup,
		RoleFunctionComponent,
		NoDataRowOutlet,
		ContractDetailComponent,
		MatDatepickerModule,
		MatHint,
		InvoiceFormComponent,
		InvoiceFormDetailComponent,
	],
	templateUrl: './invoice-form-tab.component.html',
	styleUrl: './invoice-form-tab.component.scss',
})
export class InvoiceFormTabComponent implements OnInit {
	partnerType = 'HOTEL';
	step = 1;
	id: any;
	readMode: any;

	constructor() {}

	async ngOnInit() {}

	onTabChange($event: any) {
		if ($event.index === 0) {
			this.partnerType = 'HOTEL';
		} else {
			this.partnerType = 'TRANSPORTATION';
		}
	}

	nextStepEmit($event: any) {
		this.step = 2;
		this.id = $event[0];
		this.readMode = $event[1];
	}

	backStepEmit($event: any) {
		this.step = 1;
		this.partnerType = $event[0];
	}
}
