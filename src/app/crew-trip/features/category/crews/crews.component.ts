import { Component, inject, OnInit } from '@angular/core';
import { CommonComponent } from "src/app/crew-trip/shared/common.component";
import { UsersService } from "src/app/crew-trip/core/services/users-service";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CrewsService } from "src/app/crew-trip/core/services/crews-service";
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-crews',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, DataTransformPipe],
  templateUrl: './crews.component.html',
  styleUrl: './crews.component.scss'
})
export class CrewsComponent extends CommonComponent implements OnInit {
  override baseService = inject(CrewsService);
  usersService = inject(UsersService);
  flightMarketService = inject(FlightMarketService);
  formBuilder = inject(FormBuilder);

  _displayedColumns: { label: string; value: string, type?: string, format?: string }[] = [
    { label: $localize`:@@pid:PID`, value: 'pid' },
    { label: $localize`:@@persCode:Pers Code`, value: 'persCode' },
    { label: $localize`:@@fullName:Full Name`, value: 'fullName' },
    { label: $localize`:@@cmsName:CMS Name`, value: 'cmsName' },
    { label: $localize`:@@gender:Gender`, value: 'gender' },
    { label: $localize`:@@function:Function`, value: 'function' },
    { label: $localize`:@@rank:Rank`, value: 'rank' },
    { label: $localize`:@@base:Base`, value: 'base' }
  ]
    ;

  override formGroupSearch = this.formBuilder.group({
    s: [''], //Keyword Search
  });

  filteredOptionsMarket: Observable<any[]>;

  override ngOnInit(): void {
    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value)];
    this.search();
    
  }
}
