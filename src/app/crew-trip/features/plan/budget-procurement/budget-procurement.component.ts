import { Component } from "@angular/core";
import { RouterLink, RouterModule } from "@angular/router";

@Component({
    selector: 'app-budget-procurement',
    standalone: true,
    imports: [RouterLink, RouterModule],
    template: '<router-outlet/>',
    styles: ''
})
export class BudgetProcurementComponent {
}