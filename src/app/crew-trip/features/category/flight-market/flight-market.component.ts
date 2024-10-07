import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
  selector: 'app-flight-market',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule],
  templateUrl: './flight-market.component.html',
  styleUrl: './flight-market.component.scss'
})
export class FlightMarketComponent extends CommonComponent implements OnInit {
  override baseService = inject(FlightMarketService);
  
  formBuilder = inject(FormBuilder);

  override formGroupSearch = this.formBuilder.group({
    s: [''], //Keyword Search
    marketCode: [''],
    contractEndDate: [''],
    active: [''],
  });

  override ngOnInit(): void {
    
  }

}
