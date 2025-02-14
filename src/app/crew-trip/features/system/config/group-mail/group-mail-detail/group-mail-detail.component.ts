import {CommonModule} from '@angular/common';
import {HttpStatusCode} from '@angular/common/http';
import {Component, ElementRef, Inject, inject, LOCALE_ID, OnInit, ViewChild,} from '@angular/core';
import {AbstractControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {BehaviorSubject} from 'rxjs';
import {FlightMarketService} from 'src/app/crew-trip/core/services/flight-market.service';
import {GroupMailService} from 'src/app/crew-trip/core/services/group-mail.service';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {InputComponent} from 'src/app/crew-trip/shared/component/input/input.component';
import {
  SelectionSuggestComponent
} from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';

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
    MatCardModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatAutocompleteModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    InputComponent,
    SelectionSuggestComponent,
  ],
  templateUrl: './group-mail-detail.component.html',
  styleUrl: './group-mail-detail.component.scss',
})
export class GroupMailDetailComponent extends CommonComponent implements OnInit {
  override baseService = inject(GroupMailService);
  flightMarketSv = inject(FlightMarketService);
  @ViewChild('marketCode', {static: true}) marketCode!: ElementRef;
  markets: any[] = [];
  filteredOptionsMarket: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  // override displayedColumns: string[] = ['email', 'actions'];
  emailList: EmailObj[] = [];
  emailForm: FormGroup;
  emailListStr: string[] = [];
  existCode = false;
  existMessage = '';
  emailListCheck: EmailObj[] = [];
  formTitle = '';
  public dialogRef: MatDialogRef<GroupMailDetailComponent>;
  public locale: string;
  override formGroupDetail = this.formBuilder.group({
    id: [],
    groupName: ['', [Validators.required, Validators.maxLength(100)]],
    notes: ['', Validators.maxLength(500)],
    marketCode: ['', [Validators.required, this.existCodeValidator.bind(this)]],
    groupEmail: [[] as string[], Validators.required],
  });

  override keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.close();
    }
  }

  constructor(
    @Inject(LOCALE_ID) locale: string,
    dialogRef: MatDialogRef<GroupMailDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { grMail: any; mode: string },
  ) {
    super();
    this.locale = locale;
    this.dialogRef = dialogRef;

    this.emailForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          ),
        ],
      ],
    });
    if (!data?.mode || data.mode !== 'view') {
      this.displayedColumns = ['email', 'actions'];
    } else {
      this.displayedColumns = ['email'];
    }
    if (data?.mode === 'view') {
      this.formTitle = 'View';
    } else if (data?.mode === 'edit') {
      this.formTitle = 'Edit';
    } else {
      this.formTitle = 'Add new';
    }
  }

  override async ngOnInit(): Promise<void> {
    await this.flightMarketSv
      .search({option: 1, status: 'Operational'})
      .then((res) => {
        this.markets = res.data;
        if (this.formGroupDetail.value.marketCode) {
          this.formGroupDetail.patchValue({
            marketCode: this.formGroupDetail.value.marketCode,
          });
        }
      });
    this.filteredOptionsMarket.next(this.markets);
    if (this.data?.grMail) {
      this.formGroupDetail.patchValue(this.data?.grMail);
      this.emailList = this.data?.grMail.groupEmail.map((email: string) => ({
        email: email,
        isEditing: false,
      }));
      this.emailListCheck = this.emailList;
    }
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
    const emailValue = this.emailList[index]?.email.toLowerCase();
    if (!emailValue) {
      this.emailList[index].isEmpty = !emailValue;
      return;
    }
    const exist = this.emailListCheck.some((emailObj, i) =>
      emailObj.email.toLowerCase() === emailValue && i !== index
    );
    if (exist) {
      this.emailList[index].isDuplicate = true;
      this.emailList[index].isEditing = true;
    } else {
      this.emailList[index].isEmpty = !emailValue;
      this.emailList[index].isEditing = false;
      this.emailListCheck = this.emailList;
    }
  }

  deleteEmail(index: number): void {
    const emailToDelete = this.emailList[index]?.email.toLowerCase();
    this.emailList = this.emailList.filter((_, i) => i !== index);
    this.emailListCheck = this.emailListCheck.filter(emailObj => emailObj.email.toLowerCase() !== emailToDelete);
  }

  override async save() {
    this.emailListStr = this.emailList
      .filter((emailObj) => !emailObj.isEditing)
      .map((emailObj) => emailObj.email);
    if (
      !this.formGroupDetail.hasError('required') &&
      (!this.emailListStr || this.emailListStr.length <= 0)
    ) {
      this.baseService.showError('List email is required!');
      return;
    }
    this.formGroupDetail.patchValue({groupEmail: this.emailListStr});
    this.formGroupDetail.markAllAsTouched();
    this.formGroupDetail.updateValueAndValidity();
    if (this.formGroupDetail.invalid) {
      this.findInvalidControls(this.formGroupDetail);
      return;
    }
    try {
      await super.save().then((value) => {
        if (value?.status == HttpStatusCode.Conflict) {
          this.showError(value.error?.error)
          // this.existCode = true;
          // this.existMessage = value.error?.error;
          // this.formGroupDetail.controls['marketCode'].updateValueAndValidity();
          // this.existCode = false;
          return;
        }
        this.dialogRef.close('Update Success');
      });
    } catch (e: any) {
      console.log("aaaa:", e)
    } finally {
      await this.spinner.hide();
    }
  }

  get hasEditingEmail(): boolean {
    return this.emailList.some(emailObj => emailObj.isEditing);
  }

  existCodeValidator(control: AbstractControl): ValidationErrors | null {
    return this.existCode ? {existCode: true} : null;
  }
}
