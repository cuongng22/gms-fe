import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SelectionSuggestComponent } from 'src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { getYear, months } from '../daily-flight-schedules.model';
import { FlightMarketService } from 'src/app/crew-trip/core/services/flight-market.service';
import { FlightMarketStatusEnum } from '../../../category/flight-market/flight-market.model';
import { ListResponse } from 'src/app/crew-trip/shared/models/common.model';

@Component({
  selector: 'app-daily-flight-schedules-search',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent,
    MatNativeDateModule, MatAutocompleteModule, CommonModule,
    SelectionSuggestComponent
  ],
  templateUrl: './daily-flight-schedules-search.component.html',
  styleUrl: './daily-flight-schedules-search.component.scss'
})
export class DailyFlightSchedulesSearchComponent implements OnInit {
  flightMarketService = inject(FlightMarketService)
  search = output<any>();
  formBuilder = inject(FormBuilder);

  airports: any[] = [];
  months = months;
  years = getYear();


  formGroupSearch = this.formBuilder.group({
    s: '',
    airport: '',
    month: '',
    year: ''
  });

  ngOnInit(): void {
    this.flightMarketService.search<any>({ option: 0, page: 0, size: 999999, status: FlightMarketStatusEnum.OPERATIONAL }).then((res: ListResponse<any>) => {
      this.airports = res.data.content.map((item: any) => {
        return {
          marketCode: item.marketCode,
          marketName: item.marketName,
          timezone: item.timezone
        }
      });
    });
  }


  onSearch() {
    const bodySearch= {
      ...this.formGroupSearch.value,
      timezone:this.airports.find((item:any)=> item.marketCode === this.formGroupSearch.value.airport)?.timezone
    }
    console.log(bodySearch)
    // this.search.emit(this.formGroupSearch.value);
  }
}
