import {Component, Inject, inject, LOCALE_ID, OnInit} from '@angular/core';
import {DataTransformPipe} from "src/app/crew-trip/shared/data-transform.pipe";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatSelect} from "@angular/material/select";
import {NgxControlError} from "ngxtension/control-error";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {CrewsService} from "src/app/crew-trip/core/services/crews-service";
import {NationService} from "src/app/crew-trip/core/services/nation-service";
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {FlightCrewService} from "src/app/crew-trip/core/services/flight-crew-service";
import {FlightMarketService} from "src/app/crew-trip/core/services/ flight-market.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-flight-crew-detail',
  standalone: true,
  imports: [
    DataTransformPipe,
    FormsModule,
    InputSizeComponent,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgxControlError,
    NgxTrimDirectiveModule,
    ReactiveFormsModule
  ],
  templateUrl: './flight-crew-detail.component.html',
  styleUrl: './flight-crew-detail.component.scss'
})
export class FlightCrewDetailComponent extends CommonComponent implements OnInit  {
  formBuilder = inject(FormBuilder);
  override baseService = inject(CrewsService);
  flightMarketService = inject(FlightMarketService);

  override formGroupDetail = this.formBuilder.group({
    id: [],
    airportCode: ['', [Validators.required, Validators.maxLength(250)]],
    acType: ['', Validators.maxLength(150)],
    pilotnNumber: ['', Validators.required],
    attendantNumber: ['', [Validators.maxLength(20), Validators.pattern('^[0-9()+ ]+$')]],
    status: ['', [Validators.required, Validators.maxLength(150)]],
    notes: [''],
  });

  constructor(
    public dialogRef: MatDialogRef<FlightCrewDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }



  override async save() {
    const res = await super.save();
    if (res) {
      this.dialogRef.close('Update Success');
    }
  }
  close(): void {
    this.dialogRef.close();
  }
}
