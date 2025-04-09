import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule, NgIf } from '@angular/common';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { MatDialog } from '@angular/material/dialog';
import { PaymentMailService } from 'src/app/crew-trip/core/services/payment-mail.service';
import { MatOption } from '@angular/material/select';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { MatMenuModule } from '@angular/material/menu';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { HasPermissionDirective } from 'src/app/crew-trip/shared/directive/has-permission.directive';

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
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption, HasPermissionDirective
  ],
  templateUrl: './payment-mail.component.html',
  styleUrl: './payment-mail.component.scss',
  providers: [HasPermissionDirective]
})
export class PaymentEmailComponent extends CommonComponent implements OnInit {
  override baseService = inject(PaymentMailService);
  flightMarketService = inject(FlightMarketService);
  activeTab = 0;
  @ViewChild('marketCode') marketCode: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger!: MatAutocompleteTrigger;
  markets: string[] = [];
  filteredOptionsMarket: any[];

  _displayedColumns: {
    label: string;
    value: string;
    type?: string;
    format?: string;
  }[] = [
      { label: $localize`:@@airportCode:Airport code`, value: 'marketCode' },
      { label: $localize`:@@name:Email`, value: 'emails' },
      { label: $localize`:@@note:Remark`, value: 'note' }
      // { label: $localize`:@@status:Status`, value: 'status' }
    ];

  constructor() {
    super();
  }

  override formGroupSearch = this.formBuilder.group({
    s: [''], //Keyword Search
    type: ['']
  });

  override formGroupDetail = this.formBuilder.group({
    id: [''],
    marketCode: ['', [Validators.required]],
    emailsInput: ['', [Validators.required, Validators.maxLength(500)]],
    note: ['', Validators.maxLength(500)],
    emails: [[''], [Validators.required]]
  });

  override async ngOnInit() {
    super.ngOnInit();
    this.displayedColumns = [
      'stt',
      ...this._displayedColumns.map((s) => s.value),
      'action'
    ];
    await this.search();
    await this.getListAirport();
  }

  override async save() {
    try {
      const emailInput = this.formGroupDetail.get('emailsInput')
        ?.value;
      if (emailInput) {
        const emailList = emailInput
          .split(';')
          .map((email: string) => email.trim());
        this.formGroupDetail.patchValue({
          emails: emailList
        });
      }
      await super.save();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        if (error.error.status === HttpStatusCode.BadRequest) {
          this.formGroupDetail.get('emailsInput')?.setErrors({
            invalid: true,
            message: error.error.error['emails[]']
          });
        } else if (error.error.status === HttpStatusCode.Conflict) {
          this.formGroupDetail.get('marketCode')?.setErrors({
            conflict: true,
            message: error.error.error
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

  filterMarket(): void {
    const filterValue = this.marketCode.nativeElement.value.toLowerCase();
    if (!filterValue) {
      this.filteredOptionsMarket = this.markets;
    }
    this.filteredOptionsMarket = this.markets.filter((market) =>
      market.toLowerCase().includes(filterValue)
    );
  }

  override async showDialogDetail(id?: any, type?: string) {
    // const email = this.dataSource.data[id] ? this.dataSource.data[id] : '';
    if (id != null && type === 'index') {
      const data = this.dataSource.data[id] as Data;
      if (typeof data.emails === 'string') {
        data.emailsInput = data.emails;
        data.emails = data.emails ? data.emails.split(';') : [];
      }
      // data.emailsInput = data.emails;
      this.formGroupDetail.patchValue(data);
    } else if (id != null) {
      await this.detail(id);
    }
    this.toggleDialogCreate();
  }

  onFocusMarket(): void {
    this.filteredOptionsMarket = this.markets;
    this.autocompleteTrigger.openPanel();
  }
}

interface Data {
  id: any,
  marketCode: any,
  emails: any,
  emailsInput: any,
  note: any
}
