import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { RouterLink } from '@angular/router';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';

@Component({
  selector: 'app-procurement-tracking-detail',
  standalone: true,
  imports: [
    MatCard,
    RouterLink,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton,
    MatCardModule,
  ],
  templateUrl: './procurement-tracking-detail.component.html',
  styleUrl: './procurement-tracking-detail.component.scss',
})
export class ProcurementTrackingDetailComponent extends CommonComponent {
  isCreate = true;
  readonlyDetail = false;
  fb: FormBuilder = inject(FormBuilder);

  constructor() {
    super();
    this.formGroupDetail = this.fb.group({
      type: ['HOTEL'],
    });
  }
}
