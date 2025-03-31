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

@Component({
  selector: 'app-email-notification-history',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatTabsModule,
    EmailNotificationSearchComponent, EmailComponent],
  templateUrl: './email-notification-history.component.html',
  styleUrl: './email-notification-history.component.scss'
})
export class EmailNotificationHistoryComponent extends CommonComponent {
  @ViewChild('appEmail') appEmail: EmailComponent;

  async onSearch(data: any, type: string) {
    if (type === 'EMAIL') {
      this.appEmail.search(data);
    }
  }
}
