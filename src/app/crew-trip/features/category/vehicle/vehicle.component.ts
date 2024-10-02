import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule
  ],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent extends CommonComponent implements OnInit {
  formBuilder = inject(FormBuilder);

  override formGroupSearch = this.formBuilder.group({
    keySearch: [''],
    status: [''],
    role: ['']
  });

  override formGroupDetail = this.formBuilder.group({
    id: [''],
    department: ['', Validators.required],
    fullName: ['', Validators.required],
    gender: [true],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    roles: [<any>[], Validators.required],
    active: [true, [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')]],
    description: ['']
  });

}
