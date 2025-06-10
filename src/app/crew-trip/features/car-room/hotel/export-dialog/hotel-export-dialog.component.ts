import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
	MatCard,
	MatCardContent,
	MatCardHeader,
	MatCardTitle,
} from '@angular/material/card';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BaseImport } from 'src/app/crew-trip/shared/base-import';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
	selector: 'app-hotel-export-dialog',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		SelectMultipleComponent,
		InputSizeComponent,
		MatCard,
		MatCardHeader,
		MatCardTitle,
		MatCardContent,
		BaseImport,
	],
	templateUrl: './hotel-export-dialog.component.html',
	styleUrls: ['./hotel-export-dialog.component.scss'],
})
export class HotelExportDialogComponent implements OnInit {
	exportForm: FormGroup;
	markets: string[] = [];
	monthSelection: string[] = [];
	listYear: number[] = [];
	fb: FormBuilder = inject(FormBuilder);

	constructor(
		public dialogRef: MatDialogRef<HotelExportDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
	) {
		this.exportForm = this.fb.group({
			marketCode: [[], Validators.required],
			month: [''],
			year: [],
		});

		this.markets = data.markets || [];
		this.monthSelection = data.monthSelection || [];
		this.listYear = data.listYear || [];
	}

	ngOnInit(): void {
		const month = new Date().getMonth() + 1;
		this.exportForm.controls['month'].setValue(
			month < 10 ? '0' + month : month.toString(),
		);
		this.exportForm.controls['year'].setValue(new Date().getFullYear());
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onExport(): void {
		if (this.exportForm.valid) {
			this.dialogRef.close({
				...this.exportForm.value,
				export: true,
			});
		}
	}
}
