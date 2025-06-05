import {Component, Inject} from "@angular/core";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


@Component({
  selector: 'app-message-dialog',
  standalone: true,
  imports: [MatCard, MatCardContent],
  templateUrl: './message-dialog.html',
  styleUrl: './message-dialog.scss',
})


export class MessageDialog {
  constructor(
    public dialogRef: MatDialogRef<MessageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { icon?: any; mainText?: string; subText?: string }
  ) {
  }

  doConfirm(): void {
    this.dialogRef.close(true);
  }

  closeConfirm(): void {
    this.dialogRef.close(false);
  }
}
