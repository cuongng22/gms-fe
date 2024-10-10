import {Component, inject, OnInit} from '@angular/core';
import {MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatSelect, MatSelectModule} from "@angular/material/select";
import { FileUploadModule} from "@iplab/ngx-file-upload";
import { MatDatepickerModule} from "@angular/material/datepicker";
import {RouterLink} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule, NgClass} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, MatCardModule,FormsModule,MatButtonModule,ReactiveFormsModule,CommonModule,NgClass,MatFormField, MatSelectModule, InputSizeComponent,MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, FileUploadModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  fb = inject(FormBuilder);
  genderSelected = 'option1';
  formGroup: FormGroup;

  constructor() {
    this.formGroup = this.fb.group({
      email: ['',  [Validators.required]],
    });
  }
}
