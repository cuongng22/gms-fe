import {Component, Inject, inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import {NgClass} from '@angular/common';
import {MatIconButton} from "@angular/material/button";
import {MatSuffix} from "@angular/material/form-field";

@Component({
  selector: 'app-action-alert',
  standalone: true,
  imports: [
    NgClass,
    MatIconButton,
    MatSuffix
  ],
  templateUrl: './action-alert.component.html',
  styleUrl: './action-alert.component.scss'
})
export class ActionAlertComponent implements OnInit, OnDestroy {
  message: string;
  type: string;
  pinned = false;
  snackBarRef = inject(MatSnackBarRef<ActionAlertComponent>);
  duration = 3000
  private timeoutHandle: any;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.message = data.message;
    this.type = data.type;
  }

  ngOnInit() {
    this.timeoutHandle = setTimeout(() => {
      if (!this.pinned) {
        this.snackBarRef.dismiss();
      }
    }, this.duration);
  }

  pin() {
    this.pinned = true;
    clearTimeout(this.timeoutHandle);
  }

  close() {
    this.snackBarRef.dismiss();
  }

  ngOnDestroy() {
    clearTimeout(this.timeoutHandle); // tránh memory leak
  }
}
