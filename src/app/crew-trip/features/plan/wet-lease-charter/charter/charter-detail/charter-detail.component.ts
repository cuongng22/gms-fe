import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule, MatExpansionPanelContent } from '@angular/material/expansion';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { Router } from 'express';
import { CharterService } from 'src/app/crew-trip/core/services/charter.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { CategoryEnum } from '../../../budget-procurement/budget-procurement.model';
import { CharterGeneralComponent } from './component/charter-general/charter-general.component';

@Component({
  selector: 'app-charter-detail',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule,
    MatExpansionModule, MatExpansionPanelContent, CharterGeneralComponent
  ],
  templateUrl: './charter-detail.component.html',
  styleUrl: './charter-detail.component.scss'
})
export class CharterDetailComponent extends CommonComponent {
  override baseService = inject(CharterService);
  router = inject(Router);
  // @ViewChild('wetLeaseGeneral') wetLeaseGeneral: WetLeaseGeneralComponent;
  // @ViewChild('wetLeaseHotel') wetLeaseHotel: WetLeaseHotelComponent;
  // @ViewChild('wetLeaseCarRental') wetLeaseCarRental: WetLeaseCarRentalComponent;
  CategoryEnum = CategoryEnum;


  id = input<number>();
  viewDetail = input<string>("true", { alias: 'view-detail' });
  isCompleted: boolean = false;

  showDialogCreateData: boolean = false;

  override formGroupDetail = this.formBuilder.group({
    id: [],
    isCompleted: [false]
  });


  createData() {

  }

  async confirmCreateData() {

  }


  get disable(): boolean {
    return (this.viewDetail() === 'true') || this.isCompleted
  }
  toggleDialogCreateData() {
    this.showDialogCreateData = !this.showDialogCreateData;
  }

}
