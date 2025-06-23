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
		let data = this.formGroupDetail.value;
		//validate month and date
		const month = data.month; //current format = JAN, FEB
		let date = data.date; //current format = 01, 02, ..., 31
		const currentYear = new Date().getFullYear();
		const map = new Map<string, string>();
		map.set('JAN', '01');
		map.set('FEB', '02');
		map.set('MAR', '03');
		map.set('APR', '04');
		map.set('MAY', '05');
		map.set('JUN', '06');
		map.set('JUL', '07');
		map.set('AUG', '08');
		map.set('SEP', '09');
		map.set('OCT', '10');
		map.set('NOV', '11');
		map.set('DEC', '12');
		if (date < 1 || date > 31) {
			this.formGroupDetail.controls['date'].setErrors({
				invalid: true,
				code: 'INVALID_DATE',
				message: 'Date must be between 1 and 31.',
			});
			return;
		}
		if (date < 10 && date.length < 2) {
			date = '0' + date; // Ensure date is two digits
			data.date = date; // Update the form control value
		}
		if (
			!moment(map.get(month) + date + currentYear, 'MMDDYYYY', true).isValid()
		) {
			this.formGroupDetail.controls['date'].setErrors({
				invalid: true,
				code: 'INVALID_DATE_FORMAT',
				message: 'Invalid date format. Please enter a valid date.',
			});
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
