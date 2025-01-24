import { Component, inject, OnInit } from '@angular/core';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { UsersService } from 'src/app/crew-trip/core/services/users-service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrewsService } from 'src/app/crew-trip/core/services/crews-service';
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
import { RouterLink, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CrewsDetailComponent } from './crews-detail/crews-detail.component';
import { Validators } from 'ngx-editor';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';

@Component({
  selector: 'app-crews',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, DataTransformPipe, RouterLink, RouterModule, NgxTrimDirectiveModule],
  templateUrl: './crews.component.html',
  styleUrl: './crews.component.scss'
})
export class CrewsComponent extends CommonComponent implements OnInit {
  override baseService = inject(CrewsService);
  usersService = inject(UsersService);
  flightMarketService = inject(FlightMarketService);

  _displayedColumns: { label: string; value: string, type?: string, format?: string, class?: string }[] = [
    // { label: $localize`:@@pid:PID`, value: 'pid' },
    { label: $localize`:@@persCode:Code`, value: 'persCode' },
    { label: $localize`:@@fullName:Full name`, value: 'fullName' },
    { label: $localize`:@@cmsName:CMS name`, value: 'cmsName' },
    { label: $localize`:@@gender:Gender`, value: 'gender', class: 'text-center' },
    { label: $localize`:@@phone:Phone`, value: 'phone', class: 'text-center' },
    { label: $localize`:@@rank:Rank`, value: 'rank', class: 'text-center' },
    { label: $localize`:@@function:Function`, value: 'function', class: 'text-center' },
    { label: $localize`:@@base:Base`, value: 'base', class: 'text-center' },
    { label: $localize`:@@type:Type`, value: 'sourceType' }
  ];

  override formGroupSearch = this.formBuilder.group({
    s: [''], //Keyword Search
    type: ['']
  });

  override formGroupDetail = this.formBuilder.group({
    id: [],
    fullName: ['', Validators.required],
    shortName: [''],
    gender: ['', Validators.required],
    phone: [''],
    function: ['', Validators.required],
    nation: [''],
    nationName: ['']
  });

  filteredOptionsMarket: Observable<any[]>;

  constructor() {
    super();
  }

  override ngOnInit(): void {
    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value), 'action'];
    this.search();

  }

  // detail or edit, create car rental
  async crewsDetail(crewId?: any) {
    let crews = {};
    if (crewId) {
      const response = await this.baseService.detail(crewId);
      crews = { ...response.data };
    }

    const dialogRef = this.dialog.open(CrewsDetailComponent, {
      data: { crews },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result);
      if (result) {
        this.search();
      }
    });
  }
}
