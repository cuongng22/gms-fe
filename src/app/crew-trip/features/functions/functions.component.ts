import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, NO_ERRORS_SCHEMA, OnInit} from '@angular/core';
import {CommonModule, NgClass, NgIf, TitleCasePipe} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatError, MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
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
import {
  MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MESSAGE} from "src/app/crew-trip/shared/utils/constant";


@Component({
  imports: [RouterLink, CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet, MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatExpansionPanelDescription, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  selector: 'app-functions',
  standalone: true,
  styleUrl: 'functions.component.scss',
  templateUrl: 'functions.component.html'
})


export class FunctionsComponent extends CommonComponent implements OnInit {
  override baseService = inject(FunctionsService);
  fb = inject(FormBuilder);

  //variable
  listFunction: any = [];

  constructor() {
    super();
    this.formGroupSearch = this.fb.group({});
    this.formGroupDetail = this.fb.group({
      id: ['',],
      alias: ['', [Validators.required]],
    });
  }

  override async ngOnInit() {
    await Promise.all([this._detail()]).then(() => {
      console.log(this.listFunction)
    });
  }

  async _detail() {
    try {
      await this.baseService.search({}).then(res => {
        if (res.data) {
          //func
          let objFunction = res.data;
          Object.keys(objFunction).forEach(key => {
            let func = objFunction[key];
            this.listFunction = [...this.listFunction, {
              name: key, label: func.label, child: func.functionsDtos
            }];
          })
        } else {
          this.baseService.showWarning(MESSAGE.DATA_EMPTY)
        }
      })
    } catch (e) {
      this.baseService.showWarning(MESSAGE.ERROR)
    }
  }

  async _showDialogDetail(data: any) {
    this.formGroupDetail.patchValue({
      id: data.id,
      alias: data.alias,
    })
    this.toggleDialogCreate();
  }
}
