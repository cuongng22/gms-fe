import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {CommonModule} from "@angular/common";


export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    <h1 mat-dialog-title>
      {{ data.title }}
    </h1>
    <div mat-dialog-content>
      <p>
        {{ data.message }}
      </p>
    </div>
    <div mat-dialog-actions class="mt-0">
      <button mat-button  (click)="onCancel()" >
        {{ data.cancelText || 'Cancel' }}
      </button>
      <button mat-flat-button style="margin-left: 10px" (click)="onConfirm()" cdkFocusInitial>
        {{ data.confirmText || 'Confirm' }}
      </button>
    </div>
  `,
  imports: [CommonModule, MatDialogModule]
})
export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);  // Trả về true khi người dùng xác nhận
  }

  onCancel(): void {
    this.dialogRef.close(false);  // Trả về false khi người dùng hủy bỏ
  }
}
