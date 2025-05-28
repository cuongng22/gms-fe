import {CommonModule} from '@angular/common';
import {HttpStatusCode} from '@angular/common/http';
import {ChangeDetectorRef, Component, ElementRef, Inject, inject, LOCALE_ID, OnInit, ViewChild,} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup, FormGroupDirective, NgForm,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {ErrorStateMatcher, MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {BehaviorSubject, debounceTime, Observable} from 'rxjs';
import {FlightMarketService} from 'src/app/crew-trip/core/services/flight-market.service';
import {GroupMailService} from 'src/app/crew-trip/core/services/group-mail.service';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {InputComponent} from 'src/app/crew-trip/shared/component/input/input.component';
import {
  SelectionSuggestComponent
} from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import {map, startWith} from "rxjs/operators";

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
    InputComponent,
    SelectionSuggestComponent,
  ],
  templateUrl: './group-mail-detail.component.html',
  styleUrl: './group-mail-detail.component.scss',
})
export class GroupMailDetailComponent extends CommonComponent implements OnInit {
  override baseService = inject(GroupMailService);
  flightMarketSv = inject(FlightMarketService);
  private cdr = inject(ChangeDetectorRef);
  @ViewChild('marketCode', {static: true}) marketCode!: ElementRef;
  markets: any[] = [];
  filteredOptionsMarket: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  // override displayedColumns: string[] = ['email', 'actions'];
  emailList: EmailObj[] = [];
  emailControls: FormControl[] = [];
  emailListStr: string[] = [];
  existCode = false;
  existMessage = '';
  emailListCheck: EmailObj[] = [];
  formTitle = '';
  public dialogRef: MatDialogRef<GroupMailDetailComponent>;
  public locale: string;
  filteredEmails: Observable<string[]>[] = []; // Mảng Observable cho gợi ý
  emailsSugget: string[] = [];

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
      this.emailControls = this.emailList.map(
        (emailObj) =>
          new FormControl(emailObj.email, [
            Validators.required,
            Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
          ])
      );
      this.updateFilteredEmails();
    }
    await this.baseService.getEmailSuggets().then((response: any) => {
      this.emailsSugget = response.data || []; // Xử lý API trả về { data: [] }
      this.updateFilteredEmails();
    }).catch((error) => {
      this.emailsSugget = [];
      this.updateFilteredEmails();
    });
    console.log("this.emailsSuggetthis.emailsSugget:",this.emailsSugget)
  }

  private updateFilteredEmails(): void {
    this.filteredEmails = this.emailControls.map((control) =>
      control.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map((value) => {
          const filtered = this.filterEmails(value || '');
          console.log('Filtered emails:', filtered);
          return filtered;
        })
      )
    );
    console.log('this.filteredEmails:', this.filteredEmails);
  }
  close(): void {
    this.dialogRef.close();
  }

  private filterEmails(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.emailsSugget.filter((email) =>
      email.toLowerCase().includes(filterValue)
    );
  }


  // addEmailRow(): void {
  //   this.emailList.push({email: '', isEditing: true});
  //   this.emailList = [...this.emailList];
  // }

  addEmailRow(): void {
    this.emailList.push({ email: '', isEditing: true, isInvalid: false, isEmpty: true, isDuplicate: false });
    this.emailControls.push(
      new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
      ])
    );
    this.filteredEmails.push(
      this.emailControls[this.emailControls.length - 1].valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map((value) => {
          const filtered = this.filterEmails(value || '');
          console.log('Filtered emails for new row:', filtered);
          return filtered;
        })
      )
    );
    this.emailList = [...this.emailList];
    this.cdr.detectChanges();
  }

  onEmailInput(event: Event, index: number): void {
    const email = (event.target as HTMLInputElement).value;
    this.emailList[index].email = email;
    this.emailControls[index].setValue(email);
    // Reset trạng thái lỗi trước khi kiểm tra
    this.emailList[index].isInvalid = false;
    this.emailList[index].isEmpty = false;
    this.emailList[index].isDuplicate = false;
    // Kiểm tra lỗi
    if (!email) {
      this.emailList[index].isEmpty = true;
    } else if (this.emailControls[index].invalid) {
      this.emailList[index].isInvalid = true;
    } else if (this.checkDuplicate(email, index)) {
      this.emailList[index].isDuplicate = true;
    }
    console.log(`Input email at index ${index}:`, email, 'State:', {
      isEmpty: this.emailList[index].isEmpty,
      isInvalid: this.emailList[index].isInvalid,
      isDuplicate: this.emailList[index].isDuplicate,
    });
    this.emailList = [...this.emailList];
    this.cdr.detectChanges();
  }

  // editEmail(index: number): void {
  //   this.emailList[index].isEditing = true;
  //   this.emailList = [...this.emailList];
  //   this.emailList[index].isEmpty = this.emailList[index].email === '';
  // }
  //
  // saveEmail(index: number): void {
  //   const emailValue = this.emailList[index]?.email.toLowerCase();
  //   if (!emailValue) {
  //     this.emailList[index].isEmpty = !emailValue;
  //     return;
  //   }
  //   const exist = this.emailListCheck.some((emailObj, i) =>
  //     emailObj.email.toLowerCase() === emailValue && i !== index
  //   );
  //   if (exist) {
  //     this.emailList[index].isDuplicate = true;
  //     this.emailList[index].isEditing = true;
  //   } else {
  //     this.emailList[index].isEmpty = !emailValue;
  //     this.emailList[index].isEditing = false;
  //     this.emailListCheck = this.emailList;
  //   }
  // }
  //
  // deleteEmail(index: number): void {
  //   const emailToDelete = this.emailList[index]?.email.toLowerCase();
  //   this.emailList = this.emailList.filter((_, i) => i !== index);
  //   this.emailListCheck = this.emailListCheck.filter(emailObj => emailObj.email.toLowerCase() !== emailToDelete);
  // }


  editEmail(index: number): void {
    this.emailList[index].isEditing = true;
    this.emailControls[index].setValue(this.emailList[index].email);
    this.emailList[index].isEmpty = !this.emailList[index].email;
    this.emailList[index].isInvalid = this.emailControls[index].invalid && !!this.emailList[index].email;
    this.emailList[index].isDuplicate = this.checkDuplicate(this.emailList[index].email, index);
    console.log(`Edit email at index ${index}:`, this.emailList[index].email, 'State:', {
      isEmpty: this.emailList[index].isEmpty,
      isInvalid: this.emailList[index].isInvalid,
      isDuplicate: this.emailList[index].isDuplicate,
    });
    this.emailList = [...this.emailList];
    this.cdr.detectChanges();
  }

  saveEmail(index: number): void {
    const emailValue = this.emailList[index]?.email.toLowerCase();
    console.log(`Saving email at index ${index}:`, emailValue);
    if (!emailValue) {
      this.emailList[index].isEmpty = true;
      console.log(`Email empty at index ${index}`);
      return;
    }
    if (this.emailControls[index].invalid) {
      this.emailList[index].isInvalid = true;
      console.log(`Email invalid at index ${index}`);
      return;
    }
    if (this.checkDuplicate(emailValue, index)) {
      this.emailList[index].isDuplicate = true;
      this.emailList[index].isEditing = true;
      console.log(`Email duplicate at index ${index}:`, emailValue);
      return;
    }
    this.emailList[index].isEditing = false;
    this.emailList[index].isInvalid = false;
    this.emailList[index].isEmpty = false;
    this.emailList[index].isDuplicate = false;
    this.emailListCheck = [...this.emailList];
    this.emailList = [...this.emailList];
    console.log(`Email saved at index ${index}:`, emailValue);
    this.cdr.detectChanges();
  }

  deleteEmail(index: number): void {
    this.emailList = this.emailList.filter((_, i) => i !== index);
    this.emailControls.splice(index, 1);
    this.filteredEmails.splice(index, 1);
    this.emailListCheck = [...this.emailList];
    this.emailList = [...this.emailList];
    this.cdr.detectChanges();
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
        this.dialogRef.close('Update Success');
      });
    } catch (e: any) {
      if (e?.status == HttpStatusCode.Conflict) {
        this.existCode = true;
        this.existMessage = e.error?.error;
        this.formGroupDetail.controls['marketCode'].updateValueAndValidity();
        this.existCode = false;
        return;
      }
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

  onEmailSelected(event: MatAutocompleteSelectedEvent, index: number): void {
    const selectedEmail = event.option.value.toLowerCase();
    this.emailList[index].email = selectedEmail;
    this.emailControls[index].setValue(selectedEmail);
    // Reset trạng thái lỗi trước khi kiểm tra
    this.emailList[index].isInvalid = false;
    this.emailList[index].isEmpty = false;
    this.emailList[index].isDuplicate = false;
    // Kiểm tra lỗi
    if (this.checkDuplicate(selectedEmail, index)) {
      this.emailList[index].isDuplicate = true;
    }
    console.log(`Selected email at index ${index}:`, selectedEmail, 'State:', {
      isEmpty: this.emailList[index].isEmpty,
      isInvalid: this.emailList[index].isInvalid,
      isDuplicate: this.emailList[index].isDuplicate,
    });
    this.emailList = [...this.emailList];
    this.cdr.detectChanges();
  }

  // Kiểm tra email trùng lặp
  private checkDuplicate(email: string, index: number): boolean {
    return !!email && this.emailList.some(
      (emailObj, i) => i !== index && emailObj.email.toLowerCase() === email.toLowerCase()
    );
  }
}
