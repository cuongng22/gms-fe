import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-flight-market',
  standalone: true,
  imports: [RouterLink,RouterModule],
  providers: [],
  templateUrl: './flight-market.component.html',
  styleUrl: './flight-market.component.scss'
})
export class FlightMarketComponent  {
}
