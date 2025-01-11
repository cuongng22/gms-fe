import { Component, EventEmitter, Input, Output } from "@angular/core";
import {MatCard, MatCardContent} from "@angular/material/card";



@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent
  ],
  templateUrl: './confirm-delete-dialog.html',
  styleUrl: './confirm-delete-dialog.scss',
})


export class ConfirmDeleteDialog {
  @Input() showDialogDelete: boolean = false;

  // Sự kiện để thông báo khi người dùng xác nhận xóa
  @Output() confirmDelete: EventEmitter<void> = new EventEmitter<void>();

  // Sự kiện để đóng popup
  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();

  // Hàm xử lý khi người dùng xác nhận xóa
  delete() {
    this.confirmDelete.emit();
  }

  // Hàm xử lý khi người dùng hủy bỏ
  closeConfirmDelete() {
    this.closeDialog.emit();
  }
}
