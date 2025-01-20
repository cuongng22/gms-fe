import {Component, EventEmitter, Input, Output} from "@angular/core";
import {MatCard, MatCardContent} from "@angular/material/card";


@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent
  ],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})


export class ConfirmDialog {
  @Input() icon: any;
  @Input() mainText: any = "";
  @Input() subText: any = "";
  @Input() showDialog: boolean = false;

  // Sự kiện để thông báo khi người dùng xác nhận xóa
  @Output() confirm: EventEmitter<void> = new EventEmitter<void>();

  // Sự kiện để đóng popup
  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();

  // Hàm xử lý khi người dùng xác nhận xóa
  doConfirm() {
    this.confirm.emit();
  }

  // Hàm xử lý khi người dùng hủy bỏ
  closeConfirm() {
    this.closeDialog.emit();
  }
}
