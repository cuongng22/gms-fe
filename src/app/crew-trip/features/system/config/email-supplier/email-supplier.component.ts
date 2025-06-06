import { CommonModule } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatAnchor, MatButton } from '@angular/material/button';
import {
	MatCard,
	MatCardContent,
	MatCardHeader,
	MatCardModule,
	MatCardTitle,
} from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import {
	MatError,
	MatFormField,
	MatFormFieldModule,
	MatLabel,
} from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatList } from '@angular/material/list';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { EmailSupplierService } from 'src/app/crew-trip/core/services/email-supplier-service';
import { SanitizeService } from 'src/app/crew-trip/core/services/sanitize.service';
import { BaseImport } from 'src/app/crew-trip/shared/base-import';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import { HasPermissionDirective } from 'src/app/crew-trip/shared/directive/has-permission.directive';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { marketType, MESSAGE } from 'src/app/crew-trip/shared/utils/constant';

@Component({
	selector: 'app-email-supplier',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		InputSizeComponent,
		MatButton,
		MatCard,
		MatCardContent,
		MatCardHeader,
		MatCardTitle,
		MatError,
		MatFormField,
		MatInput,
		MatCardModule,
		MatLabel,
		MatOption,
		MatSelect,
		MatTableModule,
		NgxTrimDirectiveModule,
		ReactiveFormsModule,
		MatCheckbox,
		MatFormFieldModule,
		MatInputModule,
		NgxEditorModule,
		SelectMultipleComponent,
		MatPaginator,
		MatAnchor,
		HasPermissionDirective,
		MatList,
		BaseImport,
	],
	templateUrl: './email-supplier.component.html',
	styleUrl: './email-supplier.component.scss',
	providers: [HasPermissionDirective],
})
export class EmailSupplierComponent
	extends CommonComponent
	implements OnInit, OnDestroy
{
	override baseService = inject(EmailSupplierService);
	fb = inject(FormBuilder);
	editor: Editor;
	targetPersonals: any[] = [];
	isUpdatingValue = false;
	sanitizedContent: string = '';
	toolbar: Toolbar = [
		['bold', 'italic'],
		['underline', 'strike'],
		['code', 'blockquote'],
		['ordered_list', 'bullet_list'],
		[{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
		['link', 'image'],
		['text_color', 'background_color'],
		['align_left', 'align_center', 'align_right', 'align_justify'],
	];
	isView = false;
	airports: any[];
	override formGroupSearch = this.fb.group({
		s: [''], //Keyword Search
		emailClass: [''],
		marketClass: [''],
		active: [''],
	});

	override formGroupDetail = this.fb.group({
		id: [''],
		content: ['', [Validators.required]],
		emailClass: ['', [Validators.required]],
		marketClass: ['', [Validators.required]],
		targetObject: [{ value: '', disabled: true }],
		title: ['', [Validators.maxLength(250)]],
		note: ['', [Validators.maxLength(500)]],
		active: [true],
		airports: [''],
	});

	constructor(private sanitizeService: SanitizeService) {
		super();
		this.formGroupDetailInit = { ...this.formGroupDetail.value };
	}

	override async ngOnInit() {
		super.ngOnInit();
		this.editor = new Editor();
		const marketList = await this._flightMarketService.search({
			option: 1,
			// status: 'Operational',
		});
		this.airports = marketList.data;
		this.displayedColumns = [
			'stt',
			'emailClass',
			'marketClass',
			'airports',
			'targetPersonel',
			'title',
			'active',
			'action',
		];
		this.search();
		this.targetPersonals = [
			{ label: 'Flight crew', code: 'PILOT' },
			{ label: 'Cabin crew', code: 'ATTENDANT' },
		];
		this.formGroupDetail.get('emailClass')?.valueChanges.subscribe((value) => {
			return this.updateTargetObjectValidation(value);
		});
		console.log(this.formGroupDetail.controls.marketClass);
	}

	updateTargetObjectValidation(value?: string | null): void {
		const targetObjectControl = this.formGroupDetail.get('targetObject');
		if (value === 'INVOICE_CONFIRMATION' || value === 'INVOICE_REMINDER') {
			targetObjectControl?.clearValidators();
			targetObjectControl?.disable();
			targetObjectControl?.setValue('');
		} else {
			targetObjectControl?.setValidators([Validators.required]);
			targetObjectControl?.enable();
		}
		targetObjectControl?.updateValueAndValidity();
	}

	override async showDialogDetail(id?: any, type?: string) {
		this.isView = false;
		this.formGroupDetail.enable();
		if (id != null && type === 'index') {
		} else if (id != null) {
			await this.detail(id);
		}
		this.toggleDialogCreate();
	}

	async onViewDetail(id?: any) {
		if (id != null) {
			await this.detail(id);
			this.isView = true;
		}
		if (!this.formGroupDetail.disabled) {
			try {
				this.formGroupDetail.disable({ emitEvent: false });
				// this.formGroupDetail.patchValue();
			} catch (error) {
				console.error('Error disabling form:', error);
			}
		}
		this.toggleDialogCreate();
	}

	// onEditorChange(value: string) {
	//   if (this.isUpdatingValue) {
	//     return;
	//   }
	//   const cleanedValue = this.cleanHtml(value);
	//   this.isUpdatingValue = true;
	//   this.formGroupDetail
	//     .get('content')
	//     ?.setValue(cleanedValue, {emitEvent: false});
	//   this.formGroupDetail.get('content')?.markAsTouched();
	//   this.formGroupDetail.get('content')?.updateValueAndValidity();
	//   this.isUpdatingValue = false;
	// }

	override async save() {
		try {
			let content = this.formGroupDetail.get('content')?.value;
			if (content == '<p></p>') {
				this.formGroupDetail.get('content')?.setValue('');
				this.formGroupDetail.get('content')?.markAsTouched();
				this.formGroupDetail.get('content')?.updateValueAndValidity();
			}
			this.formGroupDetail.markAllAsTouched();
			if (this.formGroupDetail.invalid) {
				this.findInvalidControls(this.formGroupDetail);
				return;
			}
			const update = !!this.formGroupDetail.getRawValue().id;
			await this.spinner.show();
			const sanitizedContent = content
				? this.sanitizeService.sanitizeToString(content)
				: '';
			const payload = {
				...this.formGroupDetail.getRawValue(),
				content: sanitizedContent,
			};
			let res;
			if (update) {
				res = await this.baseService.update(payload);
			} else {
				res = await this.baseService.create(payload);
			}
			await this.search();
			this.baseService.showSuccess(
				update ? MESSAGE.UPDATE_SUCCESS : MESSAGE.CREATE_SUCCESS,
			);
			await this.closeDetail();
			return res;
		} catch (e: any) {
			if (
				(e.status = HttpStatusCode.Conflict) &&
				!(
					e.status == HttpStatusCode.InternalServerError &&
					e.error?.error.includes('UNIQUE')
				)
			) {
				this.baseService.showError(
					e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR,
				);
			}
			return e;
		} finally {
			await this.spinner.hide();
		}
	}

	onEditorChange(value: string): void {
		if (!value || value === '<p></p>') {
			this.sanitizedContent = '';
			this.formGroupDetail.get('content')?.setValue('', { emitEvent: false });
			this.formGroupDetail.get('content')?.markAsTouched();
			this.formGroupDetail
				.get('content')
				?.updateValueAndValidity({ onlySelf: true });
		} else {
			const sanitizedValue = this.sanitizeService.sanitizeToString(value);
			console.log('Sanitized value:', sanitizedValue); // Debug
			this.sanitizedContent =
				this.sanitizeService.sanitizeToString(sanitizedValue);
			// Không cập nhật form control ngay để tránh mất con trỏ
			// Lưu giá trị gốc để đồng bộ khi save
			this.formGroupDetail
				.get('content')
				?.setValue(sanitizedValue, { emitEvent: false });
		}
	}

	ngOnDestroy(): void {
		this.editor.destroy();
	}

	async onChangeMarketClass() {
		if (
			this.formGroupDetail.controls.marketClass.value === marketType.domestic
		) {
			const marketList = await this._flightMarketService.search({
				option: 1,
				// status: 'Operational',
				type: 'Domestic',
			});
			this.airports = marketList.data;
			console.log(this.airports.length);
		} else {
			const marketList = await this._flightMarketService.search({
				option: 1,
				// status: 'Operational',
				type: 'International',
			});
			this.airports = marketList.data;
			console.log(this.airports.length);
		}
	}

	protected readonly inject = inject;
}
