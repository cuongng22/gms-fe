import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, NO_ERRORS_SCHEMA, OnInit} from '@angular/core';
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {RouterLink} from "@angular/router";
import {CommonModule, NgClass, NgIf, TitleCasePipe} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {DataTransformPipe} from "src/app/crew-trip/shared/data-transform.pipe";
import {MatError, MatFormField, MatFormFieldModule, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";
import {MatInput, MatInputModule} from "@angular/material/input";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {RoleFunctionComponent} from "src/app/crew-trip/features/roles/role-function/role-function.component";
import {NoDataRowOutlet} from "@angular/cdk/table";
import {NationService} from "src/app/crew-trip/core/services/nation-service";
import {UsersService} from "src/app/crew-trip/core/services/users-service";
import {HotelService} from "src/app/crew-trip/core/services/hotel-service";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {map, Observable, startWith} from "rxjs";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule
  ],
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.scss'
})
export class HotelComponent extends CommonComponent implements OnInit {
  override baseService = inject(HotelService);
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

  override async ngOnInit() {
    super.ngOnInit();
    this.filteredOptionsMarket = this.formGroupSearch.controls.marketCode.valueChanges.pipe(
      debounceTime(300), // Đợi 300ms sau lần nhập cuối cùng
      startWith(''),
      map(value => this._filterMarket(value ?? '')));

    this.displayedColumns = ['stt', 'market', 'hotel', 'address', 'contactDetails', 'status', 'notes'];
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
