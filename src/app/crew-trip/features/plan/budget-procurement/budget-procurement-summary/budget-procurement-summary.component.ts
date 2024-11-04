import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { BudgetProcurementSummarySearchComponent } from './budget-procurement-summary-search/budget-procurement-summary-search.component';
import { BudgetProcurementSummaryListComponent } from './budget-procurement-summary-list/budget-procurement-summary-list.component';

@Component({
  selector: 'app-budget-procurement-summary',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatTabsModule, BudgetProcurementSummarySearchComponent, BudgetProcurementSummaryListComponent],
  templateUrl: './budget-procurement-summary.component.html',
  styleUrl: './budget-procurement-summary.component.scss'
})
export class BudgetProcurementSummaryComponent {


  searchCategoryAll(data:any){
    console.log(data)
  }

  searchCategoryInternational(data:any){
    console.log(data)
  }

  searchCategoryDomestic(data:any){
    console.log(data)
  }
}
