import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {MatError, MatFormFieldModule, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader} from "@angular/material/expansion";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInput} from "@angular/material/input";
import {MatMenuModule} from "@angular/material/menu";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatRadioModule} from "@angular/material/radio";
import {MatTableModule} from "@angular/material/table";
import {CommonModule, NgClass, NgForOf, NgIf} from "@angular/common";
import {NgxEditorModule} from "ngx-editor";
import {MatDatepicker, MatDatepickerModule, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {FileUploadModule} from "@iplab/ngx-file-upload";
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDialogModule} from "@angular/material/dialog";
import {NgxControlError} from "ngxtension/control-error";
import {SelectionSuggestComponent} from "src/app/crew-trip/shared/component/selection-suggest/selection-suggest.component";
import {ConfirmDialog} from "src/app/crew-trip/shared/dialog/confirm-dialog/confirm-dialog";
import {ThousandsSeparatorDirective} from "src/app/crew-trip/shared/directive/thousand-separator.directive";
import {ControlErrorComponent} from "src/app/crew-trip/shared/component/control-error/control-error.component";
import {SelectionSuggest2Component} from "src/app/crew-trip/shared/component/selection-suggest-2/selection-suggest-2.component";

export const BaseImport = [
  FormsModule,
  CommonModule,
  InputSizeComponent,
  MatFormFieldModule,
  MatAccordion,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatError,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatInput,
  MatLabel,
  MatMenuModule,
  MatOption,
  MatPaginatorModule,
  MatRadioModule,
  MatSelect,
  MatSuffix,
  MatTableModule,
  NgClass,
  NgIf,
  NgxEditorModule,
  ReactiveFormsModule,
  MatHint,
  MatDatepickerModule,
  MatDatepicker,
  MatDatepickerToggle,
  MatNativeDateModule,
  FileUploadModule,
  MatAutocomplete,
  MatAutocompleteTrigger,
  NgxTrimDirectiveModule,
  NgxMaterialTimepickerModule,
  NgForOf,
  MatTooltipModule,
  MatDialogModule,
  NgxControlError,
  SelectionSuggestComponent,
  ConfirmDialog,
  ThousandsSeparatorDirective,
  ControlErrorComponent,
  SelectionSuggest2Component,
];
