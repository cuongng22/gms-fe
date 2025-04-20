import { CommonModule, NgClass, NgIf } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import {
	Component,
	CUSTOM_ELEMENTS_SCHEMA,
	inject,
	NO_ERRORS_SCHEMA,
	OnInit,
} from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	ReactiveFormsModule,
	ValidationErrors,
	Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
	MatError,
	MatFormField,
	MatLabel,
	MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ServiceFeeService } from 'src/app/crew-trip/core/services/service-fee-service';
import { UsersService } from 'src/app/crew-trip/core/services/users-service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectionComponent } from 'src/app/crew-trip/shared/component/selection/selection.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { HasPermissionDirective } from 'src/app/crew-trip/shared/directive/has-permission.directive';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { feeOptions } from './service-fee.model';

@Component({
	imports: [
		CommonModule,
		MatCardModule,
		MatButtonModule,
		MatMenuModule,
		MatTableModule,
		MatPaginatorModule,
		NgIf,
		MatCheckboxModule,
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
		MatSuffix,
		HasPermissionDirective,
		SelectionComponent,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
	selector: 'app-service-fee',
	standalone: true,
	styleUrl: 'service-fee.component.scss',
	templateUrl: 'service-fee.component.html',
	providers: [HasPermissionDirective],
})
export class ServiceFeeComponent extends CommonComponent implements OnInit {
	override baseService = inject(ServiceFeeService);
	usersService = inject(UsersService);
	fb = inject(FormBuilder);

	//variable
	_displayedColumns: {
		label: string;
		value: string;
		type?: string;
		format?: string;
	}[] = [
		{ label: $localize`Code`, value: 'code' },
		{
			label: $localize`Cost category name`,
			value: 'name',
		},
		{ label: $localize`Unit`, value: 'unit' },
		{ label: $localize`Note`, value: 'description' },
		{
			label: $localize`Status`,
			value: 'activeLabel',
		},
		{ label: $localize`DataSource`, value: 'dataSource' },
	];
	existCode = false;

	feeOptions = feeOptions;

	constructor() {
		super();
		this.formGroupSearch = this.fb.group({
			s: [''],
			active: [''],
			area: [''],
		});
		this.formGroupDetail = this.fb.group({
			id: [''],
			code: [
				'',
				[
					Validators.required,
					Validators.maxLength(20),
					this.existCodeValidator.bind(this),
				],
			],
			name: ['', [Validators.required, Validators.maxLength(250)]],
			unit: ['', [Validators.required]],
			description: ['', [Validators.maxLength(500)]],
			active: [true],
			groupCode: [''],
		});
		this.formGroupSearchInit = { ...this.formGroupSearch.value };
		this.formGroupDetailInit = { ...this.formGroupDetail.value };
	}

	override async ngOnInit() {
		await Promise.all([this.search()]);
		this.displayedColumns = [
			'stt',
			...this._displayedColumns.map((s) => s.value),
			'action',
		];
	}

	async _detail(index: number) {
		this.formGroupDetail.patchValue(this.dataSource.data[index] as JSON);
		/*this.formGroupDetail.patchValue({
      currencyCode: this.formGroupDetail.value.curCode
    });*/
		this.toggleDialogCreate();
	}

	override async save(): Promise<any> {
		super.save().then((res) => {
			if (res.status == HttpStatusCode.Conflict) {
				this.existCode = true;
				this.formGroupDetail.controls['code'].updateValueAndValidity();
				this.existCode = false;
			} else if (
				res.status == HttpStatusCode.InternalServerError &&
				res.error?.error.includes('SERVICE_CODE_UNIQUE')
			) {
				this.existCode = true;
				this.formGroupDetail.controls['code'].updateValueAndValidity();
				this.existCode = false;
			}
		});
	}

	override async showDialogDetail(id?: any, type?: string) {
		this.formGroupDetail.get('code')?.enable();
		if (id != null && type === 'index') {
			this.formGroupDetail.get('code')?.disable();
			this.formGroupDetail.patchValue(this.dataSource.data[id] as JSON);
		} else if (id != null) {
			await this.detail(id);
		}
		this.toggleDialogCreate();
	}

	existCodeValidator(control: AbstractControl): ValidationErrors | null {
		return this.existCode ? { existCode: true } : null;
	}
}
