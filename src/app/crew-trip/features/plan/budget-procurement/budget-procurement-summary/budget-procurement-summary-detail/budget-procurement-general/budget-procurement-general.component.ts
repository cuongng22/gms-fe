import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, model, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { debounceTime, startWith, Subject } from 'rxjs';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
  selector: 'app-budget-procurement-general',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule, MatAutocompleteModule],
  templateUrl: './budget-procurement-general.component.html',
  styleUrl: './budget-procurement-general.component.scss'
})
export class BudgetProcurementGeneralComponent extends CommonComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);


  categorys: any[] = ['International', 'Domestic'];

  @ViewChild('airport') airport: ElementRef<HTMLInputElement>;
  filteredOptionsAirport = model<any[]>([]);
  keySearchAirport = new Subject<string>();
  airports: any[] = ['HAN', 'SGN'];


  

  override formGroupDetail = this.formBuilder.group({
    category: new FormControl(''),
    airport: new FormControl('')
  });



  override ngOnInit(): void {
    this.keySearchAirport.pipe(
      debounceTime(500),
      startWith(''),
    ).subscribe((value: string) => this._filterAirport(value ?? ''));
  }


  private _filterAirport(value: string): void {
    if (!value) {
      this.filteredOptionsAirport.set(this.airports);
      return;
    }
    const filterValue = value.toLowerCase();
    this.filteredOptionsAirport.set(this.airports.filter(airport => airport?.toLowerCase().includes(filterValue)));
  }

  filterAirport(): void {
    const filterdValue = this.airport.nativeElement.value;
    if (!filterdValue) {
      this.filteredOptionsAirport.set(this.airports);
      return;
    }
    this.keySearchAirport.next(filterdValue);
  }
}
