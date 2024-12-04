import {AsyncPipe, CommonModule} from '@angular/common';
import {Component, ElementRef, Inject, inject, input, LOCALE_ID, model, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule, MatFormField} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {RouterLink, RouterModule} from '@angular/router';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {NgxControlError} from 'ngxtension/control-error';
import {debounceTime, Observable, Subject} from 'rxjs';
import {CrewsService} from 'src/app/crew-trip/core/services/crews-service';
import {NationService} from 'src/app/crew-trip/core/services/nation-service';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {DataTransformPipe} from 'src/app/crew-trip/shared/data-transform.pipe';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {LOCALE} from 'src/app/crew-trip/shared/utils/constant';

@Component({
  selector: 'app-crews-detail',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent,
    MatAutocompleteModule, CommonModule, AsyncPipe,
    MatChipsModule, RouterLink, RouterModule, NgxTrimDirectiveModule, NgxControlError, DataTransformPipe],
  templateUrl: './crews-detail.component.html',
  styleUrl: './crews-detail.component.scss'
})
export class CrewsDetailComponent extends CommonComponent implements OnInit {
  LOCALE = LOCALE;
  formBuilder = inject(FormBuilder);
  override baseService = inject(CrewsService);
  nationService = inject(NationService);

  @ViewChild('nationName') nationName: ElementRef<HTMLInputElement>;

  countries: any[] = [];
  keySearchNation = new Subject<string>();
  filteredNation = model<any[]>([]);

  override formGroupDetail = this.formBuilder.group({
    id: [],
    fullName: ['', [Validators.required, Validators.maxLength(250)]],
    shortName: ['', Validators.maxLength(150)],
    gender: ['', Validators.required],
    phone: ['', [Validators.maxLength(20), Validators.pattern('^[0-9()+ ]+$')]],
    function: ['', [Validators.required, Validators.maxLength(150)]],
    nation: [''],
    nationName: ['']
  });

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    public dialogRef: MatDialogRef<CrewsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  override ngOnInit(): void {

    if (this.data.crews) {
      this.formGroupDetail.patchValue(this.data.crews);
    }


    // Lấy danh sách quốc gia
    this.nationService.search({page: 0, limit: 99999, active: true}).then(res => {
      this.countries = res.data.content;
      this.filteredNation.set(this.countries);

      // set lại nationName
      const nationName = this.countries
        .filter(country => country.code === this.formGroupDetail.controls.nation.value)
        .map(country => LOCALE.VN ? country.vniName : country.engName)[0];
      this.formGroupDetail.patchValue({nationName: nationName});
      console.log('this.formGroupDetail.value:', this.formGroupDetail.value);
    });

    //search Nation
    this.keySearchNation.pipe(
      debounceTime(500)
    ).subscribe(value => {
      this.filteredNation.set(this.countries.filter(country => {
        const code = country.code.toLowerCase();
        return code.includes(value.toLowerCase()) || (this.locale == LOCALE.VN ?
          country.vniName.toLowerCase().includes(value.toLowerCase()) :
          country.engName.toLowerCase().includes(value.toLowerCase()));
      }));
    });
  }

  filterNation(): void {
    const filterValue = this.nationName.nativeElement.value;
    if (!filterValue) {
      this.filteredNation.set(this.countries);
      return;
    }
    this.keySearchNation.next(filterValue);
  }

  nationSelected(country: MatAutocompleteSelectedEvent) {
    const selectedCountry = country.option.value;
    this.formGroupDetail.controls.nation.setValue(selectedCountry.code);
    this.formGroupDetail.controls.nationName.setValue(this.locale == LOCALE.VN ? selectedCountry.vniName : selectedCountry.engName);
  }

  override async save() {
    const res = await super.save();
    if (res) {
      this.dialogRef.close('Update Success');
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
