import {Component, Inject, inject, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBar} from '@angular/material/snack-bar';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-action-alert',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './action-alert.component.html',
  styleUrl: './action-alert.component.scss'
})
export class ActionAlertComponent {
  message: string;
  type: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.message = data.message;
    this.type = data.type;
  }
}
