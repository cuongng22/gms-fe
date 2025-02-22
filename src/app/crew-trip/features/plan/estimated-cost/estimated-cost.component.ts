import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-estimated-cost',
  standalone: true,
  imports: [RouterLink, RouterModule],
  template: '<router-outlet/>',
  styles: ''
})
export class EstimatedCostComponent {
}