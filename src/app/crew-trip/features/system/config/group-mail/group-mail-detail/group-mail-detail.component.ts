import {Component, ElementRef, Inject, inject, LOCALE_ID, model, OnInit, ViewChild} from '@angular/core';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader, MatCardModule, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GroupMailService} from 'src/app/crew-trip/core/services/group-mail.service';
import {AsyncPipe, CommonModule} from '@angular/common';
import {MatChipsModule} from '@angular/material/chips';
import {RouterLink, RouterModule} from '@angular/router';
import {FlightMarketService} from 'src/app/crew-trip/core/services/flight-market.service';
import {BehaviorSubject, map, Observable, of, startWith} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableModule
} from '@angular/material/table';
import {MatIcon} from '@angular/material/icon';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckbox} from '@angular/material/checkbox';

interface EmailObj {
  email: string;
  isEditing: boolean;
  isInvalid?: boolean;
}
@Component({
  selector: 'app-group-mail-detail',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule
  ],
  templateUrl: './group-mail-detail.component.html',
  styleUrl: './group-mail-detail.component.scss'
})

export class GroupMailDetailComponent extends CommonComponent implements OnInit{
  formBuilder = inject(FormBuilder);
  override baseService = inject(GroupMailService);
  flightMarketSv = inject(FlightMarketService);
  @ViewChild('marketCode') marketCode: ElementRef<HTMLInputElement>;
  markets: any[] = [];
  filteredOptionsMarket = model<any[]>([]);
  override displayedColumns: string[] = ['email', 'actions'];
  emailList: EmailObj[] = [];
  emailForm: FormGroup;
  emailListStr: string[] = [];

  override formGroupDetail = this.formBuilder.group({
    id: [],
    groupName: ['', Validators.required],
    notes: [''],
    marketCode: ['', Validators.required],
    groupEmail: [[] as string[], Validators.required]
  });

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    public dialogRef: MatDialogRef<GroupMailDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { grMail: any; mode: string }
    ,private fb: FormBuilder) {
    super();
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  override ngOnInit(): void {
    if (this.data?.grMail) {
      this.formGroupDetail.patchValue(this.data?.grMail);
      this.emailList = this.data?.grMail.groupEmail.map((email: string) => ({
        email: email,
        isEditing: false
      }));
    }
    this.flightMarketSv.search({ option: 1 }).then(res => {
      this.markets = res.data;

    });
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
    this.emailList.push({ email: '', isEditing: true });
    this.emailList = [...this.emailList];
  }

  onEmailInput(event: any, index: number) {
    const email = event.target.value;
    this.emailList[index].email = email;

    this.emailForm.controls['email'].setValue(email);
    if (this.emailForm.controls['email'].invalid) {
      this.emailList[index].isInvalid = true;
    } else {
      this.emailList[index].isInvalid = false;
    }
  }

  editEmail(index: number): void {
    this.emailList[index].isEditing = true;
    this.emailList = [...this.emailList];
  }

  saveEmail(index: number): void {
    this.emailList[index].isEditing = false;
    this.emailList = [...this.emailList];
  }

  deleteEmail(index: number): void {
    this.emailList.splice(index, 1);
    this.emailList = [...this.emailList];
  }

  override async save() {
    this.emailListStr = this.emailList.filter(emailObj => !emailObj.isEditing) .map(emailObj => emailObj.email);
    if(!this.emailListStr || this.emailListStr.length <=0){
      this.baseService.showError('List email is required!');
      return;
    }
    this.formGroupDetail.patchValue({ groupEmail: this.emailListStr });
    try {
      const res = await  super.save();
      if (res) {
        this.dialogRef.close('Update Success');
        await super.search();
      }
    } catch (e: any) {
    } finally {
      await this.spinner.hide();
    }
  }

}
