import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import moment from 'moment';
import { AvesConfigService } from 'src/app/crew-trip/core/services/aves-config.service';
import { BaseImport } from 'src/app/crew-trip/shared/base-import';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';

@Component({
	selector: 'app-aves-config',
	standalone: true,
	imports: [BaseImport],
	templateUrl: './aves-config.component.html',
	styleUrl: './aves-config.component.scss',
})
export class AvesConfigComponent extends CommonComponent {
	avesConfigService = inject(AvesConfigService);
	fb = inject(FormBuilder);

	constructor() {
		super();
		this.formGroupDetail = this.fb.group({
			id: [''],
			month: [''],
			date: [''],
		});
	}

	override async ngOnInit() {
		await this.spinner.show();
		const data = await this.avesConfigService.search({});
		this.dataSource = data?.data || [];
		this.formGroupDetailInit = { ...this.formGroupDetail };
		await this.spinner.hide();
	}

	editItem(item: any) {
		this.showDialogCreate = true;
		this.formGroupDetail.patchValue(item);
	}

	override async closeDetail() {
		this.toggleDialogCreate();
	}

	saveData() {
		if (this.formGroupDetail.invalid) {
			this.formGroupDetail.markAllAsTouched();
			return;
		}
		const data = this.formGroupDetail.value;
		//validate month and date
		const month = data.month; //current format = JAN, FEB
		const date = data.date; //current format = 01, 02, ..., 31
		const currentYear = new Date().getFullYear();
		if (!moment(month + date + currentYear, 'MMMDDYYYY').isValid()) {
			this.formGroupDetail.controls['date'].setErrors({
				invalid: true,
				code: 'INVALID_DATE_FORMAT',
				message: 'Invalid date format. Please enter a valid date.',
			});
			console.log(this.formGroupDetail.controls['date'].getError('message'));
			return;
		}
		if (data.id) {
			this.avesConfigService.update(data).then(() => {
				this.toggleDialogCreate();
				this.ngOnInit();
				this.showSuccess('Update success');
			});
		} else {
			this.avesConfigService.create(data).then(() => {
				this.toggleDialogCreate();
				this.ngOnInit();
			});
		}
	}
}
