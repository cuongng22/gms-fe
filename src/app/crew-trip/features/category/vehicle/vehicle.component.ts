import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { map, Observable, startWith } from 'rxjs';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { debounceTime } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { VehicleService } from 'src/app/crew-trip/core/services/vehicle.service';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule
  ],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent extends CommonComponent implements OnInit {
  override baseService = inject(VehicleService);

  formBuilder = inject(FormBuilder);

  options: any[] = [{
    key: 'HAN',
    value: 'HAN'
  },
  {
    key: 'SGN',
    value: 'SGN'
  }];

  filteredOptionsMarket: Observable<any[]>;

  override formGroupSearch = this.formBuilder.group({
    s: [''], //Keyword Search
    marketCode: [''],
    contractEndDate: [''],
    active: [''],
  });

  override formGroupDetail = this.formBuilder.group({
    id: [''],
    department: ['', Validators.required],
    fullName: ['', Validators.required],
    gender: [true],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    roles: [<any>[], Validators.required],
    active: [true, [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')]],
    description: ['']
  });

  override ngOnInit(): void {
    super.ngOnInit();
    this.filteredOptionsMarket = this.formGroupSearch.controls.marketCode.valueChanges.pipe(
      debounceTime(300), // Đợi 300ms sau lần nhập cuối cùng
      startWith(''),
      map(value => this._filterMarket(value ?? '')));

    this.displayedColumns = ['stt', 'market', 'carRentalCompany', 'address', 'contactDetails', 'active', 'notes'];
    this.search();
  }

  private _filterMarket(value: string): any[] {
    if (!value) {
      return this.options;
    }
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.value.toLowerCase().includes(filterValue));
  }
}

