import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {DataTransformPipe} from 'src/app/crew-trip/shared/data-transform.pipe';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableModule
} from '@angular/material/table';
import {MatError, MatFormField, MatFormFieldModule, MatLabel, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {CommonModule, NgClass, NgIf} from '@angular/common';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {GroupMailService} from 'src/app/crew-trip/core/services/group-mail.service';
import {MatDialog} from '@angular/material/dialog';
import {Validators} from 'ngx-editor';
import {
  GroupMailDetailComponent
} from 'src/app/crew-trip/features/system/config/group-mail/group-mail-detail/group-mail-detail.component';
import {PaymentMailService} from 'src/app/crew-trip/core/services/payment-mail.service';
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatAutocomplete, MatAutocompleteModule, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {RouterLink, RouterModule} from '@angular/router';
import {OtherCrewComponent} from 'src/app/crew-trip/features/category/flight-crew/other-crew/other-crew.component';
import {MatCheckbox, MatCheckboxModule} from '@angular/material/checkbox';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {MatMenuModule} from '@angular/material/menu';
import {InputComponent} from 'src/app/ui-elements/input/input.component';
import {NoDataRowOutlet} from '@angular/cdk/table';
import {RoleFunctionComponent} from 'src/app/crew-trip/features/roles/role-function/role-function.component';
import {FlightMarketService} from 'src/app/crew-trip/core/services/ flight-market.service';
import {HttpStatusCode} from '@angular/common/http';

@Component({
  selector: 'app-payment-mail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatFormFieldModule, MatPaginatorModule, NgIf, MatCheckboxModule, NgClass, MatFormField, MatInput, MatLabel, ReactiveFormsModule, MatError, NgxTrimDirectiveModule, InputSizeComponent, DataTransformPipe, MatAutocomplete, MatAutocompleteTrigger, MatOption],
  templateUrl: './payment-mail.component.html',
  styleUrl: './payment-mail.component.scss'
})
export class PaymentEmailComponent extends CommonComponent implements OnInit{
  override baseService = inject(PaymentMailService);
  flightMarketService = inject(FlightMarketService);
  formBuilder = inject(FormBuilder);
  activeTab = 0;
  @ViewChild('marketCode') marketCode: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  markets: string[] = [];
  filteredOptionsMarket: any[];


  _displayedColumns: { label: string; value: string, type?: string, format?: string }[] = [
    { label: $localize`:@@airportCode:Airport code`, value: 'marketCode' },
    { label: $localize`:@@name:Email`, value: 'emails' },
    { label: $localize`:@@note:Remark`, value: 'note' },
    // { label: $localize`:@@status:Status`, value: 'status' }
  ];

  constructor(public dialog: MatDialog) {
    super();
  }

  override formGroupSearch = this.formBuilder.group({
    s: [''], //Keyword Search
    type: ['']
  });



  override formGroupDetail = this.formBuilder.group({
    id: [''],
    marketCode: ['', [Validators.required]],
    emails: ['', [Validators.required]],
    note: [''],
  });

  override async ngOnInit() {
    super.ngOnInit();
    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'action'];
    await this.search();
    await this.getListAirport();
  }

  override async save() {
    const emailInput = this.formGroupDetail.get('emails')?.value;
    if(emailInput && typeof emailInput === 'string'){
      // @ts-ignore
      const emailList = emailInput.split(';').map((email: string) => email.trim());
      this.formGroupDetail.patchValue({
        emails: emailList
      });
    }
    super.save();
  }

  getListAirport() {
    this.flightMarketService.search({page: 0, limit: 99999, option: 0}).then(res => {
      this.markets = res.data.content.map((item: any) => item.marketCode);
    });
  }

  async grMailDetail(id?: any,mode?:string) {
    let response;
    if(id){
      response = await this.baseService.detail(id);
    }
    const dialogRef = this.dialog.open(GroupMailDetailComponent, {
      data: response ? { grMail: { ...response.data }, mode:mode } : null,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search();
      }
    });
  }

  filterMarket(): void {
    const filterValue = this.marketCode.nativeElement.value.toLowerCase();
    if (!filterValue) {
      this.filteredOptionsMarket = this.markets;
    }
    this.filteredOptionsMarket = this.markets.filter(market => market.toLowerCase().includes(filterValue));
  }

  onFocusMarket(): void {
    this.filteredOptionsMarket = this.markets;
    this.autocompleteTrigger.openPanel();
  }
}
