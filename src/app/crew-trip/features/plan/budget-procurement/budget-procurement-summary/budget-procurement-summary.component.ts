import { Component, inject, input, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { BudgetProcurementSummarySearchComponent } from './budget-procurement-summary-search/budget-procurement-summary-search.component';
import { BudgetProcurementSummaryListComponent } from './budget-procurement-summary-list/budget-procurement-summary-list.component';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { PlanBudgetProcurementService } from 'src/app/crew-trip/core/services/plan-budget-procurement.service';
import { CategoryEnum } from '../budget-procurement.model';

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

  @ViewChild('budgetProcurementSummaryListAll') summaryAll: BudgetProcurementSummaryListComponent;
  @ViewChild('budgetProcurementSummaryListInternational') summaryInternational: BudgetProcurementSummaryListComponent;
  @ViewChild('budgetProcurementSummaryListDomestic') summaryDomestic: BudgetProcurementSummaryListComponent;

  CategoryEnum = CategoryEnum;

  searchSummary(data: any, type: string) {
    let bodySearch: any = {
      status: data.status,
      airportCodes: data.airportCodes
    }
    switch (type) {
      case 'All':
        this.summaryAll.setDisplayedColumns(data.categoryOfPlan);
        bodySearch.category = data.category;
        this.summaryAll.search(bodySearch);
        break;
      case CategoryEnum.INTERNATIONAL:
        this.summaryInternational.setDisplayedColumns(data.categoryOfPlan);
        this.summaryInternational.search(bodySearch);
        break;
      case CategoryEnum.DOMESTIC:
        this.summaryDomestic.setDisplayedColumns(data.categoryOfPlan);
        this.summaryDomestic.search(bodySearch);
        break;
    }
    console.log(data)
  }


  formSearchChange(data: any, type: string) {
    let bodySearch: any = {
      status: data.status,
      airportCodes: data.airportCodes
    }
    switch (type) {
      case 'All':
        bodySearch.category = data.category;
        this.summaryAll.setBodyExport(bodySearch);
        break;
      case CategoryEnum.INTERNATIONAL:
        this.summaryInternational.setBodyExport(bodySearch);
        break;
      case CategoryEnum.DOMESTIC:
        this.summaryDomestic.setBodyExport(bodySearch);
        break;
    }
  }

  override ngOnInit(): void {
  }
}
