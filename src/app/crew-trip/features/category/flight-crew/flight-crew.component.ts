import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {
  MatDatepickerActions,
  MatDatepickerApply, MatDatepickerCancel, MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker, MatEndDate, MatStartDate
} from "@angular/material/datepicker";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatPaginator} from "@angular/material/paginator";
import {MatSelect} from "@angular/material/select";
import {NgForOf} from "@angular/common";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {
  ConfigOvernightRateComponent
} from "src/app/crew-trip/features/category/flight-crew/config-overnight-rate/config-overnight-rate.component";
import {OtherCrewComponent} from "src/app/crew-trip/features/category/flight-crew/other-crew/other-crew.component";

@Component({
  selector: 'app-flight-crew',
  standalone: true,
  imports: [
    FormsModule,
    InputSizeComponent,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatDateRangeInput,
    MatDateRangePicker,
    MatDatepickerActions,
    MatDatepickerApply,
    MatDatepickerCancel,
    MatDatepickerToggle,
    MatEndDate,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatInput,
    MatLabel,
    MatOption,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSelect,
    MatStartDate,
    MatSuffix,
    MatTable,
    NgForOf,
    ReactiveFormsModule,
    MatTabGroup,
    MatTab,
    ConfigOvernightRateComponent,
    OtherCrewComponent
  ],
  templateUrl: './flight-crew.component.html',
  styleUrl: './flight-crew.component.scss'
})
export class FlightCrewComponent {

}
