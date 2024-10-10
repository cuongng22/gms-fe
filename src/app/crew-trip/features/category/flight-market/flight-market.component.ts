import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { Constant } from 'src/app/crew-trip/shared/utils/constant';
import { HotelDetailComponent } from './hotel-detail/hotel-detail.component';
import { CustomMatPaginatorIntl } from 'src/app/customizer-settings/paginator-intl.service';
import { CarRentalDetailComponent } from './car-rental-detail/car-rental-detail.component';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-flight-market',
  standalone: true,
  imports: [RouterLink,RouterModule],
  providers: [],
  templateUrl: './flight-market.component.html',
  styleUrl: './flight-market.component.scss'
})
export class FlightMarketComponent  {
}
