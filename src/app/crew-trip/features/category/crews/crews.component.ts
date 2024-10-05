import { Component, inject, OnInit } from '@angular/core';
import { CommonComponent } from "src/app/crew-trip/shared/common.component";
import { UsersService } from "src/app/crew-trip/core/services/users-service";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CrewsService } from "src/app/crew-trip/core/services/crews-service";
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
  selector: 'app-crews',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule],
  templateUrl: './crews.component.html',
  styleUrl: './crews.component.scss'
})
export class CrewsComponent extends CommonComponent implements OnInit {
  override baseService = inject(CrewsService);
  usersService = inject(UsersService);
  formBuilder = inject(FormBuilder);


  override formGroupSearch = this.formBuilder.group({
    s: [''], //Keyword Search
    gender: [''],
    active: [''],
  });
}
