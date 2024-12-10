import { Component, inject, input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { BudgetProcurementSummarySearchComponent } from './budget-procurement-summary-search/budget-procurement-summary-search.component';
import { BudgetProcurementSummaryListComponent } from './budget-procurement-summary-list/budget-procurement-summary-list.component';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { PlanBudgetProcurementService } from 'src/app/crew-trip/core/services/plan-budget-procurement.service';

@Component({
  selector: 'app-budget-procurement-summary',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatTabsModule, BudgetProcurementSummarySearchComponent, BudgetProcurementSummaryListComponent],
  templateUrl: './budget-procurement-summary.component.html',
  styleUrl: './budget-procurement-summary.component.scss'
})
export class BudgetProcurementSummaryComponent extends CommonComponent implements OnInit {
  override baseService = inject(PlanBudgetProcurementService);
  // id của kế hoạch
  id = input<number>();

  searchCategoryAll(data: any) {
    console.log(data)
  }

  searchCategoryInternational(data: any) {
    console.log(data)
  }

  searchCategoryDomestic(data: any) {
    console.log(data)
  }

  override ngOnInit(): void {
    this.baseService.summary(this.id()).then(res => {
      console.log(res)
    })
  }
}
