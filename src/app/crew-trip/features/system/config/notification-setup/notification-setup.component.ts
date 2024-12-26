import {Component, inject, OnInit} from '@angular/core';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {NotificationConfigService} from 'src/app/crew-trip/core/services/notification-config.service';
import {FormBuilder} from '@angular/forms';
import {NotificationSetupService} from 'src/app/crew-trip/core/services/notification-setup.service';

@Component({
  selector: 'app-notification-setup',
  standalone: true,
  imports: [],
  templateUrl: './notification-setup.component.html',
  styleUrl: './notification-setup.component.scss'
})
export class NotificationSetupComponent extends CommonComponent implements OnInit {
  override baseService = inject(NotificationSetupService);
  formBuilder = inject(FormBuilder);
}
