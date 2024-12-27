import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClickOutside } from 'ngxtension/click-outside';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { Constant } from 'src/app/crew-trip/shared/utils/constant';

@Component({
  selector: 'app-budget-procurement-car-rental',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside, MatButtonModule],
  templateUrl: './budget-procurement-car-rental.component.html',
  styleUrl: './budget-procurement-car-rental.component.scss',
  providers: [DatePipe]
})
export class BudgetProcurementCarRentalComponent implements OnInit {

  dataSource = new MatTableDataSource();
  periodRowspan = 0;
  periods: string[] = [];

  headerRowDef1: string[] = ['month', 'aircraftType', 'numberOfOvernightStays', 'numberOfRooms', 'numberOfRoomsForOthers', 'numberOfEstimatedEarlyCheckInRooms', 'numberOfEstimatedLateCheckoutRooms', 'totalCostOfCrewTransport', 'totalCost', 'totalAmountColspan'];
  headerRowDef2: string[] = ['singleRoom', 'doubleRoom', 'singleReservedRoom', 'singleRoomOther', 'doubleRoomOther', 'singleRoomEarly', 'doubleRoomEarly', 'reservedRoomEarly', 'singleRoomLate', 'doubleRoomLate', 'reservedRoomLate', 'totalAmount', 'totalAmountVat'];
  rowDef: string[] = ['month', 'aircraftType', 'numberOfOvernightStays', 'singleRoom', 'doubleRoom', 'singleReservedRoom', 'singleRoomOther', 'doubleRoomOther', 'singleRoomEarly', 'doubleRoomEarly', 'reservedRoomEarly', 'singleRoomLate', 'doubleRoomLate', 'reservedRoomLate', 'totalCostOfCrewTransport', 'totalCost', 'totalAmount', 'totalAmountVat'];

  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.dataSource.data = [

      {
        periodStart: new Date(2024, 12, 1),
        aircraftType: 'Boeing 737',
        numberOfOvernightStays: 5,
        singleRoom: 10,
        doubleRoom: 5,
        singleReservedRoom: 2,
        singleRoomOther: 1,
        doubleRoomOther: 1,
        singleRoomEarly: 1,
        doubleRoomEarly: 1,
        reservedRoomEarly: 1,
        singleRoomLate: 1,
        doubleRoomLate: 1,
        reservedRoomLate: 1,
        totalCostOfCrewTransport: 1000,
        totalCost: 5000,
        totalAmount: 6000,
        totalAmountVat: 6600
      },
      {
        periodStart: new Date(2024, 12, 1),
        aircraftType: 'Airbus A320',
        numberOfOvernightStays: 5,
        singleRoom: 10,
        doubleRoom: 5,
        singleReservedRoom: 2,
        singleRoomOther: 1,
        doubleRoomOther: 1,
        singleRoomEarly: 1,
        doubleRoomEarly: 1,
        reservedRoomEarly: 1,
        singleRoomLate: 1,
        doubleRoomLate: 1,
        reservedRoomLate: 1,
        totalCostOfCrewTransport: 1000,
        totalCost: 5000,
        totalAmount: 6000,
        totalAmountVat: 6600
      },
      {
        periodStart: new Date(2025, 1, 1),
        aircraftType: 'Boeing 737',
        numberOfOvernightStays: 5,
        singleRoom: 10,
        doubleRoom: 5,
        singleReservedRoom: 2,
        singleRoomOther: 1,
        doubleRoomOther: 1,
        singleRoomEarly: 1,
        doubleRoomEarly: 1,
        reservedRoomEarly: 1,
        singleRoomLate: 1,
        doubleRoomLate: 1,
        reservedRoomLate: 1,
        totalCostOfCrewTransport: 1000,
        totalCost: 5000,
        totalAmount: 6000,
        totalAmountVat: 6600
      },
      {
        periodStart: new Date(2025, 1, 1),
        aircraftType: 'Airbus A320',
        numberOfOvernightStays: 3,
        singleRoom: 8,
        doubleRoom: 4,
        singleReservedRoom: 1,
        singleRoomOther: 1,
        doubleRoomOther: 1,
        singleRoomEarly: 1,
        doubleRoomEarly: 1,
        reservedRoomEarly: 1,
        singleRoomLate: 1,
        doubleRoomLate: 1,
        reservedRoomLate: 1,
        totalCostOfCrewTransport: 800,
        totalCost: 4000,
        totalAmount: 4800,
        totalAmountVat: 5280
      },
      {
        periodStart: new Date(2025, 2, 1),
        aircraftType: 'Boeing 737',
        numberOfOvernightStays: 3,
        singleRoom: 8,
        doubleRoom: 4,
        singleReservedRoom: 1,
        singleRoomOther: 1,
        doubleRoomOther: 1,
        singleRoomEarly: 1,
        doubleRoomEarly: 1,
        reservedRoomEarly: 1,
        singleRoomLate: 1,
        doubleRoomLate: 1,
        reservedRoomLate: 1,
        totalCostOfCrewTransport: 800,
        totalCost: 4000,
        totalAmount: 4800,
        totalAmountVat: 5280
      },
      {
        periodStart: new Date(2025, 2, 1),
        aircraftType: 'Airbus A320',
        numberOfOvernightStays: 3,
        singleRoom: 8,
        doubleRoom: 4,
        singleReservedRoom: 1,
        singleRoomOther: 1,
        doubleRoomOther: 1,
        singleRoomEarly: 1,
        doubleRoomEarly: 1,
        reservedRoomEarly: 1,
        singleRoomLate: 1,
        doubleRoomLate: 1,
        reservedRoomLate: 1,
        totalCostOfCrewTransport: 800,
        totalCost: 4000,
        totalAmount: 4800,
        totalAmountVat: 5280
      },
      {
        periodStart: new Date(2025, 3, 1),
        aircraftType: 'Boeing 737',
        numberOfOvernightStays: 3,
        singleRoom: 8,
        doubleRoom: 4,
        singleReservedRoom: 1,
        singleRoomOther: 1,
        doubleRoomOther: 1,
        singleRoomEarly: 1,
        doubleRoomEarly: 1,
        reservedRoomEarly: 1,
        singleRoomLate: 1,
        doubleRoomLate: 1,
        reservedRoomLate: 1,
        totalCostOfCrewTransport: 800,
        totalCost: 4000,
        totalAmount: 4800,
        totalAmountVat: 5280
      },
      {
        periodStart: new Date(2025, 3, 1),
        aircraftType: 'Airbus A320',
        numberOfOvernightStays: 3,
        singleRoom: 8,
        doubleRoom: 4,
        singleReservedRoom: 1,
        singleRoomOther: 1,
        doubleRoomOther: 1,
        singleRoomEarly: 1,
        doubleRoomEarly: 1,
        reservedRoomEarly: 1,
        singleRoomLate: 1,
        doubleRoomLate: 1,
        reservedRoomLate: 1,
        totalCostOfCrewTransport: 800,
        totalCost: 4000,
        totalAmount: 4800,
        totalAmountVat: 5280
      },
      {
        periodStart: new Date(2025, 4, 1),
        aircraftType: 'Boeing 737',
        numberOfOvernightStays: 3,
        singleRoom: 8,
        doubleRoom: 4,
        singleReservedRoom: 1,
        singleRoomOther: 1,
        doubleRoomOther: 1,
        singleRoomEarly: 1,
        doubleRoomEarly: 1,
        reservedRoomEarly: 1,
        singleRoomLate: 1,
        doubleRoomLate: 1,
        reservedRoomLate: 1,
        totalCostOfCrewTransport: 800,
        totalCost: 4000,
        totalAmount: 4800,
        totalAmountVat: 5280
      },
      {
        periodStart: new Date(2025, 4, 1),
        aircraftType: 'Airbus A320',
        numberOfOvernightStays: 3,
        singleRoom: 8,
        doubleRoom: 4,
        singleReservedRoom: 1,
        singleRoomOther: 1,
        doubleRoomOther: 1,
        singleRoomEarly: 1,
        doubleRoomEarly: 1,
        reservedRoomEarly: 1,
        singleRoomLate: 1,
        doubleRoomLate: 1,
        reservedRoomLate: 1,
        totalCostOfCrewTransport: 800,
        totalCost: 4000,
        totalAmount: 4800,
        totalAmountVat: 5280
      },
      {
        periodStart: new Date(2025, 5, 1),
        aircraftType: 'Boeing 737',
        numberOfOvernightStays: 3,
        singleRoom: 8,
        doubleRoom: 4,
        singleReservedRoom: 1,
        singleRoomOther: 1,
        doubleRoomOther: 1,
        singleRoomEarly: 1,
        doubleRoomEarly: 1,
        reservedRoomEarly: 1,
        singleRoomLate: 1,
        doubleRoomLate: 1,
        reservedRoomLate: 1,
        totalCostOfCrewTransport: 800,
        totalCost: 4000,
        totalAmount: 4800,
        totalAmountVat: 5280
      },
      {
        periodStart: new Date(2025, 5, 1),
        aircraftType: 'Airbus A320',
        numberOfOvernightStays: 3,
        singleRoom: 8,
        doubleRoom: 4,
        singleReservedRoom: 1,
        singleRoomOther: 1,
        doubleRoomOther: 1,
        singleRoomEarly: 1,
        doubleRoomEarly: 1,
        reservedRoomEarly: 1,
        singleRoomLate: 1,
        doubleRoomLate: 1,
        reservedRoomLate: 1,
        totalCostOfCrewTransport: 800,
        totalCost: 4000,
        totalAmount: 4800,
        totalAmountVat: 5280
      },
      {
        periodStart: new Date(2025, 6, 1),
        aircraftType: 'Boeing 737',
        numberOfOvernightStays: 3,
        singleRoom: 8,
        doubleRoom: 4,
        singleReservedRoom: 1,
        singleRoomOther: 1,
        doubleRoomOther: 1,
        singleRoomEarly: 1,
        doubleRoomEarly: 1,
        reservedRoomEarly: 1,
        singleRoomLate: 1,
        doubleRoomLate: 1,
        reservedRoomLate: 1,
        totalCostOfCrewTransport: 800,
        totalCost: 4000,
        totalAmount: 4800,
        totalAmountVat: 5280
      },
      {
        periodStart: new Date(2025, 6, 1),
        aircraftType: 'Airbus A320',
        numberOfOvernightStays: 3,
        singleRoom: 8,
        doubleRoom: 4,
        singleReservedRoom: 1,
        singleRoomOther: 1,
        doubleRoomOther: 1,
        singleRoomEarly: 1,
        doubleRoomEarly: 1,
        reservedRoomEarly: 1,
        singleRoomLate: 1,
        doubleRoomLate: 1,
        reservedRoomLate: 1,
        totalCostOfCrewTransport: 800,
        totalCost: 4000,
        totalAmount: 4800,
        totalAmountVat: 5280
      },
      {
        periodStart: new Date(2025, 7, 1),
        aircraftType: 'Boeing 737',
        numberOfOvernightStays: 3,
        singleRoom: 8,
        doubleRoom: 4,
        singleReservedRoom: 1,
        singleRoomOther: 1,
        doubleRoomOther: 1,
        singleRoomEarly: 1,
        doubleRoomEarly: 1,
        reservedRoomEarly: 1,
        singleRoomLate: 1,
        doubleRoomLate: 1,
        reservedRoomLate: 1,
        totalCostOfCrewTransport: 800,
        totalCost: 4000,
        totalAmount: 4800,
        totalAmountVat: 5280
      },
      {
        periodStart: new Date(2025, 7, 1),
        aircraftType: 'Airbus A320',
        numberOfOvernightStays: 3,
        singleRoom: 8,
        doubleRoom: 4,
        singleReservedRoom: 1,
        singleRoomOther: 1,
        doubleRoomOther: 1,
        singleRoomEarly: 1,
        doubleRoomEarly: 1,
        reservedRoomEarly: 1,
        singleRoomLate: 1,
        doubleRoomLate: 1,
        reservedRoomLate: 1,
        totalCostOfCrewTransport: 800,
        totalCost: 4000,
        totalAmount: 4800,
        totalAmountVat: 5280
      },
      {
        periodStart: new Date(2025, 8, 1),
        aircraftType: 'Boeing 737',
        numberOfOvernightStays: 3,
        singleRoom: 8,
        doubleRoom: 4,
        singleReservedRoom: 1,
        singleRoomOther: 1,
        doubleRoomOther: 1,
        singleRoomEarly: 1,
        doubleRoomEarly: 1,
        reservedRoomEarly: 1,
        singleRoomLate: 1,
        doubleRoomLate: 1,
        reservedRoomLate: 1,
        totalCostOfCrewTransport: 800,
        totalCost: 4000,
        totalAmount: 4800,
        totalAmountVat: 5280
      },
      {
        periodStart: new Date(2025, 8, 1),
        aircraftType: 'Airbus A320',
        numberOfOvernightStays: 3,
        singleRoom: 8,
        doubleRoom: 4,
        singleReservedRoom: 1,
        singleRoomOther: 1,
        doubleRoomOther: 1,
        singleRoomEarly: 1,
        doubleRoomEarly: 1,
        reservedRoomEarly: 1,
        singleRoomLate: 1,
        doubleRoomLate: 1,
        reservedRoomLate: 1,
        totalCostOfCrewTransport: 800,
        totalCost: 4000,
        totalAmount: 4800,
        totalAmountVat: 5280
      }
    ];

    this.periodRowspan = this.dataSource.data.map((item: any) => item.aircraftType).filter((value: any, index: any, self: any) => self.indexOf(value) === index).length;

    this.dataSource.data.forEach((item: any) => {
      const period = `Tháng ${this.datePipe.transform(item.periodStart, Constant.MONTH_FORMAT)}`;
      if (!this.periods.includes(period)) {
        this.periods.push(period);
        item.period = period;
      }
    });

  }


  clickEdit(data: any, control: string) {
    data[control] = true;
  }
  clickOutside(data: any, control: string) {
    data[control] = false;
  }
}