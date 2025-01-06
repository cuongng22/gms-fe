import { Component, inject, input, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { PlanBudgetProcurementService } from 'src/app/crew-trip/core/services/plan-budget-procurement.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { BudgetProcurementSummaryListComponent } from '../../budget-procurement/budget-procurement-summary/budget-procurement-summary-list/budget-procurement-summary-list.component';
import { CategoriesEnum } from '../estimated-cost.model';
import { EstimatedCostSummarySearchComponent } from './estimated-cost-summary-search/estimated-cost-summary-search.component';
import { EstimatedCostSummaryListComponent } from './estimated-cost-summary-list/estimated-cost-summary-list.component';

@Component({
  selector: 'app-estimated-cost-summary',
  standalone: true,
  imports: [
    RouterLink, MatCardModule, MatTabsModule, EstimatedCostSummarySearchComponent, EstimatedCostSummaryListComponent
  ],
  templateUrl: './estimated-cost-summary.component.html',
  styleUrl: './estimated-cost-summary.component.scss'
})
export class EstimatedCostSummaryComponent extends CommonComponent implements OnInit {
  override baseService = inject(PlanBudgetProcurementService);
  // id của kế hoạch
  id = input<number>();

  @ViewChild('budgetProcurementSummaryListAll') summaryAll: BudgetProcurementSummaryListComponent;
  @ViewChild('budgetProcurementSummaryListInternational') summaryInternational: BudgetProcurementSummaryListComponent;
  @ViewChild('budgetProcurementSummaryListDomestic') summaryDomestic: BudgetProcurementSummaryListComponent;

  CategoriesEnum = CategoriesEnum;
  searchSummary(data: any, type: string) {
    let bodySearch: any = {
      status: data.status,
      airportCodes: data.airportCodes
    }
    switch (type) {
      case 'All':
        this.summaryAll.setDisplayedColumns(data.categoryOfPlan);
        bodySearch.category = data.category;
        this.summaryAll.loadData(bodySearch);
        break;
      case 'International':
        this.summaryInternational.setDisplayedColumns(data.categoryOfPlan);
        this.summaryInternational.loadData(bodySearch);
        break;
      case 'Domestic':
        this.summaryDomestic.setDisplayedColumns(data.categoryOfPlan);
        this.summaryDomestic.loadData(bodySearch);
        break;
    }
    console.log(data)
  }

  override ngOnInit(): void {
  }

}
