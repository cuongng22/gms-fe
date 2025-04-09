import { Component, inject, ViewChild, viewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { BudgetProcurementSummaryListComponent } from '../../../plan/budget-procurement/budget-procurement-summary/budget-procurement-summary-list/budget-procurement-summary-list.component';
import { BudgetProcurementSummarySearchComponent } from '../../../plan/budget-procurement/budget-procurement-summary/budget-procurement-summary-search/budget-procurement-summary-search.component';
import { EmailNotificationSearchComponent } from './email-notification-search/email-notification-search.component';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { EmailHistoryService } from 'src/app/crew-trip/core/services/email-history.service';
import { EmailComponent } from './email/email.component';
import moment, { Moment } from 'moment';
import { NotificationComponent } from './notification/notification.component';
import { HasPermissionDirective } from 'src/app/crew-trip/shared/directive/has-permission.directive';

@Component({
  selector: 'app-email-notification-history',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatTabsModule,
    EmailNotificationSearchComponent, EmailComponent, NotificationComponent, HasPermissionDirective],
  templateUrl: './email-notification-history.component.html',
  styleUrl: './email-notification-history.component.scss',
  providers: [HasPermissionDirective]
})
export class EmailNotificationHistoryComponent extends CommonComponent {
  @ViewChild('appEmail') appEmail: EmailComponent;
  @ViewChild('appNotification') appNotification: NotificationComponent;
  @ViewChild('appEmailNotificationSearchEmail') appEmailNotificationSearchEmail: EmailNotificationSearchComponent;
  @ViewChild('appEmailNotificationSearchNoti') appEmailNotificationSearchNoti: EmailNotificationSearchComponent;

  async onSearch(data: any, type: string) {
    if (type === 'EMAIL') {
      if (data) {
        data.startTimeSend = ((data?.startTimeSend) ? (moment(data.startTimeSend)).format(this.Constant.DATE_FORMAT_YYYYMMDD) : '');
        data.endTimeSend = ((data?.endTimeSend) ? (moment(data.endTimeSend)).format(this.Constant.DATE_FORMAT_YYYYMMDD) : '');
      }
      this.appEmail.search(data);
    } else {
      data.startTime = ((data?.startTimeSend) ? (moment(data.startTimeSend)).format(this.Constant.DATE_FORMAT_YYYYMMDD) : '');
      data.endTime = ((data?.endTimeSend) ? (moment(data.endTimeSend)).format(this.Constant.DATE_FORMAT_YYYYMMDD) : '');
      this.appNotification.search({ ...data, mode: 1 })
    }
  }

  reloadSearch(type: string) {
    if (type === 'EMAIL') {
      this.appEmailNotificationSearchEmail.onSearch()
    } else {
      this.appEmailNotificationSearchNoti.onSearch()
    }
  }
}
