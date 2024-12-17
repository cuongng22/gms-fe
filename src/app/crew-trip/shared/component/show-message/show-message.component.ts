import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActionAlertComponent } from '../../action-alert/action-alert.component';

@Component({
  selector: 'app-show-message',
  standalone: true,
  imports: [],
  templateUrl: './show-message.component.html',
  styleUrl: './show-message.component.scss'
})
export class ShowMessageComponent {
  snackBar = inject(MatSnackBar);

  showNotification(message: string, options: any) {
    this.snackBar.openFromComponent(ActionAlertComponent, options);
  }


  showSuccess(message: string | undefined) {
    if (message) {
      this.showNotification(message, {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        data: { type: 'success', message: message }
      });
    }
  }

  showError(message: string | undefined) {
    if (message) {
      this.showNotification(message, {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        data: { type: 'error', message: message }
      });
    }
  }

  showWarning(message: string | undefined) {
    if (message) {
      this.showNotification(message, {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        data: { type: 'warning', message: message }
      });
    }
  }

  showInfo(message: string | undefined) {
    if (message) {
      this.showNotification(message, {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        data: { type: 'info', message: message }
      });
    }
  }
}
