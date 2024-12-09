import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { BudgetProcurementGeneralComponent } from '../../budget-procurement-common/budget-procurement-general/budget-procurement-general.component';
import { MatExpansionModule, MatExpansionPanelContent } from '@angular/material/expansion';
import { BudgetProcurementFlightRateComponent } from '../../budget-procurement-common/budget-procurement-flight-rate/budget-procurement-flight-rate.component';
import { BudgetProcurementFlightPeriodComponent } from '../../budget-procurement-common/budget-procurement-flight-period/budget-procurement-flight-period.component';
import { BudgetProcurementFlightOvernightComponent } from '../../budget-procurement-common/budget-procurement-flight-overnight/budget-procurement-flight-overnight.component';
import { BudgetProcurementHotelComponent } from '../../budget-procurement-common/budget-procurement-hotel/budget-procurement-hotel.component';
import { BudgetProcurementCarRentalComponent } from '../../budget-procurement-common/budget-procurement-car-rental/budget-procurement-car-rental.component';
import { BudgetProcurementCostAnalysisComponent } from '../../budget-procurement-common/budget-procurement-cost-analysis/budget-procurement-cost-analysis.component';

@Component({
  selector: 'app-budget-procurement-summary-detail',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule,
    BudgetProcurementGeneralComponent, MatExpansionModule, MatExpansionPanelContent,
    BudgetProcurementFlightRateComponent, BudgetProcurementFlightPeriodComponent, BudgetProcurementFlightOvernightComponent,
    BudgetProcurementHotelComponent, BudgetProcurementCarRentalComponent, BudgetProcurementCostAnalysisComponent],
  templateUrl: './budget-procurement-summary-detail.component.html',
  styleUrl: './budget-procurement-summary-detail.component.scss'
})
export class BudgetProcurementSummaryDetailComponent implements OnInit {
  readonly panelCalBasisOpenState = signal(false);

  @ViewChild('budgetProcurementGeneral') budgetProcurementGeneral: BudgetProcurementGeneralComponent;
  @ViewChild('budgetProcurementFlightRate') budgetProcurementFlightRate: BudgetProcurementFlightRateComponent;
  @ViewChild('budgetProcurementFlightPeriod') budgetProcurementFlightPeriod: BudgetProcurementFlightPeriodComponent;
  @ViewChild('budgetProcurementFlightOvernight') budgetProcurementFlightOvernight: BudgetProcurementFlightOvernightComponent;
  @ViewChild('budgetHotel') budgetHotel: BudgetProcurementHotelComponent;
  @ViewChild('budgetCarRental') budgetCarRental: BudgetProcurementCarRentalComponent;
  @ViewChild('procurementHotel') procurementHotel: BudgetProcurementHotelComponent;
  @ViewChild('procurementCarRental') procurementCarRental: BudgetProcurementCarRentalComponent;
  @ViewChild('budgetProcurementCostAnalysis') budgetProcurementCostAnalysis: BudgetProcurementCostAnalysisComponent


  ngOnInit(): void {
  }

  save(): void {
    console.log('budgetProcurementCostAnalysis: ', this.budgetProcurementCostAnalysis.formGroupDetail.value);
  }
}
