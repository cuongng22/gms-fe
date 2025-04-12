import { CommonModule, NgForOf } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import {
	Component,
	ElementRef,
	Inject,
	OnInit,
	ViewChild,
	inject,
} from '@angular/core';
import {
	AbstractControl,
	FormsModule,
	ReactiveFormsModule,
	ValidationErrors,
	Validators,
} from '@angular/forms';
import {
	MatAutocomplete,
	MatAutocompleteTrigger,
	MatOption,
} from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
	MatCard,
	MatCardContent,
	MatCardHeader,
	MatCardTitle,
} from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
	MatError,
	MatFormField,
	MatFormFieldModule,
	MatLabel,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { FlightCrewService } from 'src/app/crew-trip/core/services/flight-crew-service';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
	selector: 'app-flight-crew-detail',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		InputSizeComponent,
		MatAutocomplete,
		MatAutocompleteTrigger,
		MatButton,
		MatCard,
		MatCardContent,
		MatCardHeader,
		MatCardTitle,
		MatError,
		MatFormField,
		MatInput,
		MatLabel,
		MatOption,
		MatSelect,
		NgxTrimDirectiveModule,
		ReactiveFormsModule,
		NgForOf,
		MatCheckbox,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatIconButton,
	],
	templateUrl: './flight-crew-detail.component.html',
	styleUrl: './flight-crew-detail.component.scss',
})
export class FlightCrewDetailComponent
	extends CommonComponent
	implements OnInit {
	override baseService = inject(FlightCrewService);
	flightMarketService = inject(FlightMarketService);
	filteredOptionsMarket: any[];
	@ViewChild('marketCode') marketCode: ElementRef<HTMLInputElement>;
	@ViewChild(MatAutocompleteTrigger)
	autocompleteTrigger!: MatAutocompleteTrigger;
	markets: string[] = [];
	acTypes: any[] = [];
	existActype = false;
	messageErrorActype: string;

	override formGroupDetail = this.formBuilder.group({
		id: [''],
		marketCode: ['', [Validators.required]],
		acType: ['', [Validators.required, this.existActypeValidator.bind(this)]],
		pilotNumber: [
			'',
			[Validators.required, Validators.min(1), Validators.max(99)],
		],
		numberAttendant: [
			'',
			[Validators.required, Validators.min(1), Validators.max(99)],
		],
		notes: ['', [Validators.maxLength(500)]],
		status: [true],
	});

	constructor(
		public dialogRef: MatDialogRef<FlightCrewDetailComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
	) {
		super();
		this.markets = data.markets;
		this.acTypes = data.acTypes;
	}

	override ngOnInit(): void {
		if (this.data.item) {
			this.formGroupDetail.patchValue({
				...this.data.item,
				numberAttendant: this.data.item.attendantNumber,
			});
		}
		if (this.data.id) {
			this.formGroupDetail.controls.acType.disable();
			this.formGroupDetail.controls.marketCode.disable();

		}
	}

	filterMarket(): void {
		const filterValue = this.marketCode.nativeElement.value.toLowerCase();
		if (!filterValue) {
			this.filteredOptionsMarket = this.markets;
		}
		this.filteredOptionsMarket = this.markets.filter((market) =>
			market.toLowerCase().includes(filterValue),
		);
	}

	onFocusMarket(): void {
		this.filteredOptionsMarket = this.markets;
		this.autocompleteTrigger.openPanel();
	}

	override async save() {
		try {
			this.formGroupDetail.markAllAsTouched();
			if (this.formGroupDetail.invalid) {
				return;
			}
			this.messageErrorActype = '';
			const value = await super.save();
			this.dialogRef.close('Update Success');
		} catch (error: any) {
			if (error.status === HttpStatusCode.Conflict) {
				this.existActype = true;
				this.messageErrorActype = error.error?.error || 'Conflict error';
				this.formGroupDetail.controls['acType'].updateValueAndValidity();
				this.existActype = false;
			} else {
				console.error('Unexpected error:', error);
			}
		}
	}

	close(): void {
		this.dialogRef.close();
	}

	existActypeValidator(control: AbstractControl): ValidationErrors | null {
		return this.existActype ? { existActype: true } : null;
	}
}
