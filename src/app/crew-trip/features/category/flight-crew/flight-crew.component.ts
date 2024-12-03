import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
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
  MatDatepickerActions,
  MatDatepickerApply, MatDatepickerCancel, MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker, MatEndDate, MatStartDate
} from "@angular/material/datepicker";
import {MatError, MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSelect} from "@angular/material/select";
import {CommonModule, NgClass, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {
  ConfigOvernightRateComponent
} from "src/app/crew-trip/features/category/flight-crew/config-overnight-rate/config-overnight-rate.component";
import {OtherCrewComponent} from "src/app/crew-trip/features/category/flight-crew/other-crew/other-crew.component";
import {DataTransformPipe} from "src/app/crew-trip/shared/data-transform.pipe";
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {NationService} from "src/app/crew-trip/core/services/nation-service";
import {UsersService} from "src/app/crew-trip/core/services/users-service";
import {FlightCrewService} from "src/app/crew-trip/core/services/flight-crew-service";
import {RoleFunctionComponent} from "src/app/crew-trip/features/roles/role-function/role-function.component";
import {NoDataRowOutlet} from "@angular/cdk/table";
import {InputComponent} from "src/app/ui-elements/input/input.component";
import {RouterLink} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";

@Component({
  selector: 'app-flight-crew',
  standalone: true,
  imports: [RouterLink, CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet, InputComponent, NgxTrimDirectiveModule, OtherCrewComponent, ConfigOvernightRateComponent],

  templateUrl: './flight-crew.component.html',
  styleUrl: './flight-crew.component.scss'
})
export class FlightCrewComponent extends CommonComponent implements OnInit {
  override baseService = inject(FlightCrewService);
  usersService = inject(UsersService);
  fb = inject(FormBuilder);


  _displayedColumns: {
    label: string; value: string, type?: string, format?: string
  }[] = [
    {label: $localize`Code`, value: 'code'}, {
      label: $localize`English name`,
      value: 'engName'
    }, {label: $localize`VietNam name`, value: 'vniName'}, {
      label: $localize`Region`,
      value: 'area'
    }, {label: $localize`Status`, value: 'activeLabel'},];


  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      s: ['',], active: ['',], area: ['',],
    });
    this.formGroupDetail = this.fb.group({
      id: ['',],
      area: ['', [Validators.required]],
      code: ['', [Validators.required]],
      vniName: ['', [Validators.required, Validators.maxLength(250)]],
      engName: ['', [Validators.required, Validators.maxLength(250)]],
      curCode: [''],
      active: [true,]
    });
    this.formGroupSearchInit = {...this.formGroupSearch.value};
    this.formGroupDetailInit = {...this.formGroupDetail.value};
  }
}
