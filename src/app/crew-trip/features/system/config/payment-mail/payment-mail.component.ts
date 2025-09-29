import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { CommonModule, NgIf } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import {
	Component,
	ElementRef,
	OnInit,
	ViewChild,
	inject,
	signal,
} from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
	MatChipEditedEvent,
	MatChipInputEvent,
	MatChipsModule,
} from '@angular/material/chips';
import {
	MatError,
	MatFormFieldModule,
	MatLabel,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { ContractService } from 'src/app/crew-trip/core/services/contract-service';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { PaymentMailService } from 'src/app/crew-trip/core/services/payment-mail.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { HasPermissionDirective } from 'src/app/crew-trip/shared/directive/has-permission.directive';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { SelectionComponent } from '../../../../shared/component/selection/selection.component';

@Component({
	selector: 'app-payment-mail',
	standalone: true,
	imports: [
		CommonModule,
		MatCardModule,
		MatButtonModule,
		MatMenuModule,
		MatTableModule,
		MatFormFieldModule,
		MatPaginatorModule,
		NgIf,
		MatCheckboxModule,
		MatInput,
		MatLabel,
		ReactiveFormsModule,
		MatError,
		NgxTrimDirectiveModule,
		InputSizeComponent,
		DataTransformPipe,
		HasPermissionDirective,
		SelectionComponent,
		MatChipsModule,
		SelectionSuggestComponent,
	],
	templateUrl: './payment-mail.component.html',
	styleUrl: './payment-mail.component.scss',
	providers: [HasPermissionDirective],
})
export class PaymentEmailComponent extends CommonComponent implements OnInit {
	override baseService = inject(PaymentMailService);
	flightMarketService = inject(FlightMarketService);
	@ViewChild('marketCode') marketCode: ElementRef<HTMLInputElement>;
	@ViewChild(MatAutocompleteTrigger)
	autocompleteTrigger!: MatAutocompleteTrigger;
	markets: string[] = [];
	filteredOptionsMarket: any[];
	types: any[] = [
		{ value: 'HOTEL', display: $localize`:@@hotel:Hotel` },
		{
			value: 'TRANSPORT',
			display: $localize`:@@transportation:Transportation`,
		},
	];
	_displayedColumns: {
		label: string;
		value: string;
		type?: string;
		format?: string;
	}[] = [
		{ label: $localize`:@@groupName:Group Name`, value: 'groupName' },
		{ label: $localize`:@@type:Type`, value: 'type' },
		{ label: $localize`:@@airportCode:Airport code`, value: 'marketCode' },
		{ label: $localize`:@@name:Email`, value: 'emails' },
		{ label: 'Supplier', value: 'supplierName' },
		{ label: $localize`:@@note:Remark`, value: 'note' },
		// { label: $localize`:@@status:Status`, value: 'status' }
	];
	readonly emails = signal<string[]>([]);
	readonly announcer = inject(LiveAnnouncer);
	regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	mailFormatInvalid = false;
	readonly separatorKeysCodes = [ENTER, COMMA, SEMICOLON] as const;
	listSuppliers: any[] = [];
	contractService = inject(ContractService);

	constructor() {
		super();
	}

	override formGroupSearch = this.formBuilder.group({
		s: [''], //Keyword Search
		type: [''],
	});

	override formGroupDetail = this.formBuilder.group({
		id: [''],
		marketCode: ['', [Validators.required]],
		emailsInput: [[''], [Validators.required, Validators.maxLength(500)]],
		note: ['', Validators.maxLength(500)],
		emails: [[''], [Validators.required]],
		type: ['', [Validators.required]],
		groupName: ['', [Validators.required, Validators.maxLength(100)]],
		supplierCode: [''],
		supplierName: [''],
		bizdocid: [''],
	});

	override async ngOnInit() {
		super.ngOnInit();
		this.displayedColumns = [
			'stt',
			...this._displayedColumns.map((s) => s.value),
			'action',
		];
		await this.search();
		this.getListAirport();
	}

	override async save() {
		try {
			const emailInput = this.formGroupDetail.controls.emailsInput?.value;
			if (emailInput) {
				this.formGroupDetail.patchValue({
					emails: emailInput,
				});
			}
			await super.save();
		} catch (error) {
			if (error instanceof HttpErrorResponse) {
				if (error.error.status === HttpStatusCode.BadRequest) {
					this.formGroupDetail.get('emailsInput')?.setErrors({
						invalid: true,
						message: error.error.error['emails[]'],
					});
				} else if (error.error.status === HttpStatusCode.Conflict) {
					this.formGroupDetail.get('marketCode')?.setErrors({
						conflict: true,
						message: error.error.error,
					});
					this.formGroupDetail.get('groupName')?.setErrors({
						conflict: true,
						message: error.error.error,
					});
				}
			}
		}
	}

	getListAirport() {
		this.flightMarketService
			.search({ page: 0, limit: 99999, option: 1, status: 'Operational' })
			.then((res) => {
				this.markets = res.data;
			});
	}

	override async showDialogDetail(id?: any, type?: string) {
		// const email = this.dataSource.data[id] ? this.dataSource.data[id] : '';
		if (id != null) {
			await this.spinner.show();
			const res = await this.baseService.detail(id);
			const emailList = res.data.emails
				.split('; ')
				.map((email: string) => email.trim());
			const prefilledMarket = res.data.marketCode;
			if (prefilledMarket) {
				await this.onMarketCodeChange({ value: prefilledMarket });
			}
			this.formGroupDetail.patchValue({
				id: res.data.id,
				marketCode: res.data.marketCode,
				emailsInput: emailList,
				emails: emailList,
				type: res.data.type,
				groupName: res.data.groupName,
				supplierCode: res.data.supplierCode,
				supplierName: res.data.supplierName,
				bizdocid: res.data.bizdocid,
			});
			this.formGroupDetail.markAllAsTouched();
			console.log(this.formGroupDetail.getRawValue());
			this.emails.set(emailList);
			await this.spinner.hide();
		}
		this.toggleDialogCreate();
	}

	onFocusMarket(): void {
		this.filteredOptionsMarket = this.markets;
		this.autocompleteTrigger.openPanel();
	}

	emailInputChange(event: any) {
		this.mailFormatInvalid = false;
	}

	add(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();
		// Add our fruit
		if (value) {
			if (this.regexEmail.test(value)) {
				this.emails.update((emails) => [...emails, value]);
				// Clear the input value
				this.mailFormatInvalid = false;
				event.chipInput!.clear();
			} else {
				// this.formGroupDetail.controls.email.markAsTouched()
				this.mailFormatInvalid = true;
			}
		}
	}

	remove(email: string): void {
		this.emails.update((emails) => {
			const index = emails.indexOf(email);
			if (index < 0) {
				return emails;
			}

			emails.splice(index, 1);
			this.announcer.announce(`Removed ${emails}`);
			return [...emails];
		});
	}

	edit(email: string, event: MatChipEditedEvent) {
		const value = event.value.trim();

		// Remove fruit if it no longer has a name
		if (!value) {
			this.remove(email);
			return;
		}

		// Edit existing fruit
		this.emails.update((emails) => {
			const index = emails.indexOf(email);
			if (index >= 0) {
				emails[index] = value;
				return [...emails];
			}
			return emails;
		});
	}

	override async closeDetail() {
		this.formGroupDetail.reset();
		this.formGroupDetail.markAsUntouched();
		this.formGroupDetail.markAsPristine();
		this.formGroupDetail.updateValueAndValidity();
		this.emails.set([]);
		this.toggleDialogCreate();
	}
	async onMarketCodeChange(event: any): Promise<void> {
		const airportCode = event.value;
		this.listSuppliers = (
			await this.contractService.getListPartnerAndContractInfo({
				airportCode,
			})
		).data;
	}

	onSupplierChange(event: any): void {
		const supplierCode = event.value;
		const supplierName = event.viewValue;
		if (supplierCode) {
			this.formGroupDetail.patchValue({
				supplierName: supplierName,
				supplierCode: supplierCode,
				bizdocid: this.listSuppliers.find((item) => item.code === supplierCode)
					?.bizdocId,
			});
		}
	}
}

interface Data {
	id: any;
	marketCode: any;
	emails: any;
	emailsInput: any;
	note: any;
	type: string;
}
