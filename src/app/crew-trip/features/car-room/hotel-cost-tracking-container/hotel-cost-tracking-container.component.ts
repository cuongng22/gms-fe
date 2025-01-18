import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { HotelCostDomesticComponent } from 'src/app/crew-trip/features/car-room/hotel-cost-domestic/hotel-cost-domestic.component';
import { HotelCostTrackingComponent } from 'src/app/crew-trip/features/car-room/hotel/hotel-cost-tracking.component';

@Component({
  selector: 'app-hotel-cost-tracking-container',
  standalone: true,
  imports: [
    FormsModule,
    HotelCostTrackingComponent,
    MatTab,
    MatTabGroup,
    HotelCostDomesticComponent,
  ],
  templateUrl: './hotel-cost-tracking-container.component.html',
  styleUrl: './hotel-cost-tracking-container.component.scss',
})
export class HotelCostTrackingContainerComponent implements OnInit {
  onTabChange(event: any) {}

  ngOnInit(): void {}
}
