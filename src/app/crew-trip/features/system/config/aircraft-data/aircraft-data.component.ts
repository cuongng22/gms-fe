import {Component, inject, OnInit} from '@angular/core';
import {DataTransformPipe} from "src/app/crew-trip/shared/data-transform.pipe";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
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
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";
import {MatError, MatFormField, MatHint, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSelect} from "@angular/material/select";
import {CommonModule, NgClass, NgIf, TitleCasePipe} from "@angular/common";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {NationService} from "src/app/crew-trip/core/services/nation-service";
import {UsersService} from "src/app/crew-trip/core/services/users-service";
import {InfoPlaneService} from "src/app/crew-trip/core/services/InfoPlaneService.service";
import {
  FlightCrewDetailComponent
} from "src/app/crew-trip/features/category/flight-crew/flight-crew-detail/flight-crew-detail.component";
import {RouterLink} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {RoleFunctionComponent} from "src/app/crew-trip/features/roles/role-function/role-function.component";
import {NoDataRowOutlet} from "@angular/cdk/table";
import {InputComponent} from "src/app/crew-trip/shared/component/input/input.component";

@Component({
  selector: 'app-aircraft-data',
  standalone: true,
  imports: [
    RouterLink, CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet, InputComponent, NgxTrimDirectiveModule, MatHint
  ],
  templateUrl: './aircraft-data.component.html',
  styleUrl: './aircraft-data.component.scss'
})
export class AircraftDataComponent extends CommonComponent implements OnInit {
  override baseService = inject(InfoPlaneService);
  usersService = inject(UsersService);
  fb = inject(FormBuilder);


  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      s: ['',], active: ['',], area: ['',],
    });
    this.formGroupDetail = this.fb.group({
      id: ['',],
      acGroup: ['', [Validators.required]],
      acType: ['', [Validators.required]],
      note: ['', [Validators.maxLength(500)]],
      active: [true,]
    });
    this.formGroupSearchInit = {...this.formGroupSearch.value};
    this.formGroupDetailInit = {...this.formGroupDetail.value};
  }

  override async ngOnInit() {
    this.displayedColumns = ['stt', 'acgroup', 'actype', 'note', 'active' ,'action'];
    await Promise.all([this.search(),]).then(() => {
    });
  }

  override  async showDialogDetail(id?: any, type?: string) {
    if (id != null && type === 'index') {
      this.formGroupDetail.patchValue(this.dataSource.data[id] as JSON);
    } else if (id != null) {
      await this.detail(id);
    }
    this.toggleDialogCreate();
  }

}
