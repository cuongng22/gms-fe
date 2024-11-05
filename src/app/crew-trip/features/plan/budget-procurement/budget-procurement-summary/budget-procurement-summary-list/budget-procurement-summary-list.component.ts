import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
  selector: 'app-budget-procurement-summary-list',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule],
  templateUrl: './budget-procurement-summary-list.component.html',
  styleUrl: './budget-procurement-summary-list.component.scss'
})
export class BudgetProcurementSummaryListComponent extends CommonComponent implements OnInit {
  readonly HOTEL = 'Hotel';
  readonly CAR_RENTAL = 'CarRental';

  override ngOnInit(): void {
    this.displayedColumns = ['select', 'stt', 'category', 'name', 'division', 'num', 'unit', 'unitPrice', 'cost', 'budget', 'procurementValueExVat', 'procurementValue', 'supplierMethod', 'estimatedTime', 'totalTime', 'time', 'vat', 'planVsEstimate', 'planVsEstimateRate', 'unitPriceYear', 'notes', 'status', 'action'];
    this.dataSource.data = [
      {
        isFirst: true,
        category: 'International',
        serviceType: 'Hotel',
        name: 'Thuê khách sạn tổ bay tại SGN',
        division: 'Travel',
        num: 10,
        unit: 'nights',
        unitPrice: 100,
        unitPriceDouble: 200,
        budget: 1000,
        procurementValue: 900,
        procurementValueExVat: 850,
        supplierMethod: 'Direct',
        cost: 950,
        totalTime: 10,
        time: '2023-10-01',
        vat: 50,
        planVsEstimate: 100,
        planVsEstimateRate: 10,
        estimatedTime: '2023-10-05',
        notes: 'Includes breakfast',
        status: 'Confirmed',
        budgetPlanFlag: true,
        procurementPlanFlag: false,
        airportCode: 'JFK',
        unitPriceYear: 1200,
        rateForSingle: 100,
        procStartDate: '2023-09-25',
        procEndDate: '2023-10-05',
        earlyCheckinFlag: true,
        lateCheckout: false
      },
      {
        category: 'International',
        serviceType: 'Hotel',
        name: 'Thuê khách sạn tổ bay tại HAN',
        division: 'Travel',
        num: 10,
        unit: 'nights',
        unitPrice: 100,
        unitPriceDouble: 200,
        budget: 1000,
        procurementValue: 900,
        procurementValueExVat: 850,
        supplierMethod: 'Direct',
        cost: 950,
        totalTime: 10,
        time: '2023-10-01',
        vat: 50,
        planVsEstimate: 100,
        planVsEstimateRate: 10,
        estimatedTime: '2023-10-05',
        notes: 'Includes breakfast',
        status: 'Confirmed',
        budgetPlanFlag: true,
        procurementPlanFlag: false,
        airportCode: 'JFK',
        unitPriceYear: 1200,
        rateForSingle: 100,
        procStartDate: '2023-09-25',
        procEndDate: '2023-10-05',
        earlyCheckinFlag: true,
        lateCheckout: false
      },
      {
        isFirst: true,
        category: 'Domestic',
        serviceType: 'CarRental',
        name: 'Thuê xe chở tổ bay tại SGN',
        division: 'Travel',
        num: 10,
        unit: 'nights',
        unitPrice: 100,
        unitPriceDouble: 200,
        budget: 1000,
        procurementValue: 900,
        procurementValueExVat: 850,
        supplierMethod: 'Direct',
        cost: 950,
        totalTime: 10,
        time: '2023-10-01',
        vat: 50,
        planVsEstimate: 100,
        planVsEstimateRate: 10,
        estimatedTime: '2023-10-05',
        notes: 'Includes breakfast',
        status: 'Confirmed',
        budgetPlanFlag: true,
        procurementPlanFlag: false,
        airportCode: 'JFK',
        unitPriceYear: 1200,
        rateForSingle: 100,
        procStartDate: '2023-09-25',
        procEndDate: '2023-10-05',
        earlyCheckinFlag: true,
        lateCheckout: false
      },
      {
        category: 'Domestic',
        serviceType: 'CarRental',
        name: 'Thuê xe chở tổ bay tại HAN',
        division: 'Travel',
        num: 2,
        unit: 'tickets',
        unitPrice: 500,
        unitPriceDouble: 1000,
        budget: 1200,
        procurementValue: 1100,
        procurementValueExVat: 1050,
        supplierMethod: 'Agency',
        cost: 1150,
        totalTime: 5,
        time: '2023-10-02',
        vat: 100,
        planVsEstimate: 150,
        planVsEstimateRate: 12,
        estimatedTime: '2023-10-06',
        notes: 'Economy class',
        status: 'Pending',
        budgetPlanFlag: true,
        procurementPlanFlag: true,
        airportCode: 'LAX',
        unitPriceYear: 6000,
        rateForSingle: 500,
        procStartDate: '2023-09-20',
        procEndDate: '2023-10-06',
        earlyCheckinFlag: false,
        lateCheckout: true
      }
    ];
  }


  override toggleAllRows(serviceType?: string) {
    if (this.isAllSelected()) {
      if (serviceType) {
        this.selection.deselect(...this.dataSource.data.filter((row: any) => row.serviceType === serviceType));
      } else {
        this.selection.clear();
      }
      return;
    }
    if (serviceType) {
      this.selection.select(...this.dataSource.data.filter((row: any) => row.serviceType === serviceType));
    } else {
      this.selection.select(...this.dataSource.data);
    }
  }

  override isAllSelected(serviceType?: string) {
    if (serviceType) {
      const numSelected = this.selection.selected.filter((row: any) => row.serviceType === serviceType).length;
      const numRows = this.dataSource.data.filter((row: any) => row.serviceType === serviceType).length;
      return numSelected === numRows;
    }
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  indeterminateSelection(serviceType?: string) {
    if (serviceType) {
      const numSelected = this.selection.selected.filter((row: any) => row.serviceType === serviceType).length;
      const numRows = this.dataSource.data.filter((row: any) => row.serviceType === serviceType).length;
      return numSelected > 0 && numSelected < numRows;
    }
    return this.selection.hasValue() && !this.isAllSelected();
  }
}
