import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, NO_ERRORS_SCHEMA, OnInit} from '@angular/core';
import {CommonModule, NgClass, NgIf, TitleCasePipe} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {UsersService} from "src/app/crew-trip/core/services/users-service";
import {MatError, MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {NationService} from "src/app/crew-trip/core/services/nation-service";
import {DataTransformPipe} from "src/app/crew-trip/shared/data-transform.pipe";
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInput} from '@angular/material/input';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {NoDataRowOutlet} from '@angular/cdk/table';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {RoleFunctionComponent} from 'src/app/crew-trip/features/roles/role-function/role-function.component';
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {FunctionsService} from "src/app/crew-trip/core/services/functions-service";


@Component({
  imports: [RouterLink, CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  selector: 'app-nation',
  standalone: true,
  styleUrl: 'functions.component.scss',
  templateUrl: 'functions.component.html'
})


export class FunctionsComponent extends CommonComponent implements OnInit {
  override baseService = inject(FunctionsService);
  fb = inject(FormBuilder);

  //variable
  _displayedColumns: { label: string; value: string, type?: string, format?: string }[] = [{
    label: "Active", value: "active"
  }, {label: "ID", value: "id"}, {label: "Name", value: "name"},];

  constructor() {
    super();
  }

  override async ngOnInit() {
    await Promise.all([this.search(),]).then(() => {
      console.log(this.dataSource)
    });
  }
}
