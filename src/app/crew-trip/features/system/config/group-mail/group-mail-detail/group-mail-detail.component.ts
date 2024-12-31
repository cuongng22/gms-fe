import {
  Component, ElementRef, Inject, inject, LOCALE_ID, model, OnChanges, OnInit, SimpleChanges,
  ViewChild
} from '@angular/core';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MatAutocompleteModule,} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GroupMailService} from 'src/app/crew-trip/core/services/group-mail.service';
import {CommonModule} from '@angular/common';
import {FlightMarketService} from 'src/app/crew-trip/core/services/flight-market.service';
import {MatTableModule} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatPaginatorModule} from '@angular/material/paginator';
import {HttpStatusCode} from '@angular/common/http';
import {InputComponent} from 'src/app/crew-trip/shared/component/input/input.component';

interface EmailObj {
  email: string;
  isEditing: boolean;
  isInvalid?: boolean;
  isEmpty?: boolean;
  isDuplicate?: boolean;
}

@Component({
  selector: 'app-group-mail-detail',
  standalone: true,
  imports: [
    MatCardModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, CommonModule, InputComponent
  ],
  templateUrl: './group-mail-detail.component.html',
  styleUrl: './group-mail-detail.component.scss'
})

export class GroupMailDetailComponent extends CommonComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  override baseService = inject(GroupMailService);
  flightMarketSv = inject(FlightMarketService);
  @ViewChild('marketCode') marketCode: ElementRef<HTMLInputElement>;
  markets: any[] = [];
  filteredOptionsMarket = model<any[]>([]);
  // override displayedColumns: string[] = ['email', 'actions'];
  emailList: EmailObj[] = [];
  emailForm: FormGroup;
  emailListStr: string[] = [];
  existCode = false;
  existMessage = '';
  emailListCheck: EmailObj[] = [];
  override formGroupDetail = this.formBuilder.group({
    id: [],
    groupName: ['', [Validators.required, Validators.maxLength(100)]],
    notes: ['', Validators.maxLength(500)],
    marketCode: ['', [Validators.required, this.existCodeValidator.bind(this)]],
    groupEmail: [[] as string[], Validators.required]
  });

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    public dialogRef: MatDialogRef<GroupMailDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { grMail: any; mode: string }
    , private fb: FormBuilder) {
    super();
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]]
    });
    if (!data?.mode || data.mode !== 'view') {
      this.displayedColumns = ['email', 'actions'];
    } else {
      this.displayedColumns = ['email'];
    }
  }

  override ngOnInit(): void {
    console.log(this.formGroupDetail);
    if (this.data?.grMail) {
      this.formGroupDetail.patchValue(this.data?.grMail);
      this.emailList = this.data?.grMail.groupEmail.map((email: string) => ({
        email: email,
        isEditing: false
      }));
    }
    this.flightMarketSv.search({option: 1, status: 'Operational'}).then(res => {
      this.markets = res.data;

    });
    this.formGroupDetail.patchValue({marketCode: this.formGroupDetail.value.marketCode});
  }

  filterMarket(): void {
    const filterValue = this.marketCode.nativeElement.value.toLowerCase();
    if (!filterValue) {
      this.filteredOptionsMarket.set(this.markets);
    }
    this.filteredOptionsMarket.set(this.markets.filter(market => market?.toLowerCase().includes(filterValue)));
  }

  close(): void {
    this.dialogRef.close();
  }

  addEmailRow(): void {
    this.emailList.push({email: '', isEditing: true});
    this.emailList = [...this.emailList];
  }

  onEmailInput(event: any, index: number) {
    const email = event.target.value;
    this.emailList[index].email = email;

    this.emailForm.controls['email'].setValue(email);
    this.emailList[index].isInvalid = this.emailForm.controls['email'].invalid;
    this.emailList[index].isEmpty = this.emailList[index].email === '';
    this.emailList[index].isDuplicate = false;
  }

  editEmail(index: number): void {
    this.emailList[index].isEditing = true;
    this.emailList = [...this.emailList];
    this.emailList[index].isEmpty = this.emailList[index].email === '';
  }

  saveEmail(index: number): void {
    this.emailList[index].isEditing = false;
    const exist = this.emailListCheck.find((emailObj: EmailObj) => emailObj.email.toLowerCase() === this.emailList[index].email.toLowerCase());
    if (exist) {
      this.emailList[index].isDuplicate = true;
    } else {
      this.emailList = [...this.emailList];
      this.emailListCheck.push(this.emailList[index]);
      this.emailList[index].isEmpty = this.emailList[index].email === '';
    }
  }

  deleteEmail(index: number): void {
    this.emailList.splice(index, 1);
    this.emailList = [...this.emailList];
  }

  override async save() {
    this.emailListStr = this.emailList.filter(emailObj => !emailObj.isEditing).map(emailObj => emailObj.email);
    if (!this.emailListStr || this.emailListStr.length <= 0) {
      // this.baseService.showError('List email is required!');
      return;
    }
    this.formGroupDetail.patchValue({groupEmail: this.emailListStr});
    try {
      await super.save().then(value => {
        if (value.status == HttpStatusCode.Conflict) {
          this.existCode = true;
          this.existMessage = value.error?.error;
          this.formGroupDetail.controls['marketCode'].updateValueAndValidity();
          this.existCode = false;
        } else {
          this.dialogRef.close('Update Success');
        }
      });
    } catch (e: any) {
    } finally {
      await this.spinner.hide();
    }
  }

  existCodeValidator(control: AbstractControl): ValidationErrors | null {
    return this.existCode ? {existCode: true} : null;
  }
}
