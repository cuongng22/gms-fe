import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, DatePipe} from "@angular/common";
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {MatAnchor, MatButton, MatButtonModule} from "@angular/material/button";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable, MatTableModule
} from "@angular/material/table";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatFormField, MatFormFieldModule, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ExchangeRateService} from "src/app/crew-trip/core/services/exchange-rate.service";
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {MatSelectModule} from "@angular/material/select";
import {MatNativeDateModule} from "@angular/material/core";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatCheckbox} from "@angular/material/checkbox";

@Component({
  selector: 'app-rate-planned',
  standalone: true,
    imports: [
      MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
      MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
      MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
      MatTableModule, MatPaginatorModule, MatCheckbox
    ],
  templateUrl: './rate-planned.component.html',
  styleUrl: './rate-planned.component.scss'
})
export class RatePlannedComponent extends CommonComponent implements OnInit{
  override baseService = inject(ExchangeRateService);
  formBuilder = inject(FormBuilder);

  override formGroupSearch = this.formBuilder.group({
    s: [''], //Keyword Search
    version: [1],
    year: [2025],
    dataSource: [null],
    export: [false],
  });

  override async ngOnInit() {
    super.ngOnInit();
    this.displayedColumns = ['stt','code','price','type','currDate','updatedDate', 'action'];
    this.search();
  }

}
