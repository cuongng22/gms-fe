import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, signal, ViewChild } from '@angular/core';
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
import { PlanBudgetProcurementService } from 'src/app/crew-trip/core/services/plan-budget-procurement.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DataSummayRequest, summaryDataExample } from './budget-procurement-summary-detail.model';
import { CategoryEnum } from '../../budget-procurement.model';
import { set } from 'lodash';
import { exampleData } from '../../budget-procurement-common/budget-procurement-hotel/budget-procurement-hotel.model';

@Component({
  selector: 'app-budget-procurement-summary-detail',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule,
    BudgetProcurementGeneralComponent, MatExpansionModule, MatExpansionPanelContent,
    BudgetProcurementFlightRateComponent, BudgetProcurementFlightPeriodComponent, BudgetProcurementFlightOvernightComponent,
    BudgetProcurementHotelComponent, BudgetProcurementCarRentalComponent, BudgetProcurementCostAnalysisComponent],
  providers: [DataTransformPipe],
  templateUrl: './budget-procurement-summary-detail.component.html',
  styleUrl: './budget-procurement-summary-detail.component.scss'
})
export class BudgetProcurementSummaryDetailComponent extends CommonComponent implements OnInit {
  override baseService = inject(PlanBudgetProcurementService);
  dataTransformPipe = inject(DataTransformPipe);

  readonly panelCalBasisOpenState = signal(false);
  panelFlightRateYearState = signal(false);
  panelFlightPeriodState = signal(false);

  @ViewChild('budgetProcurementGeneral') budgetProcurementGeneral: BudgetProcurementGeneralComponent;
  @ViewChild('budgetProcurementFlightRate') budgetProcurementFlightRate: BudgetProcurementFlightRateComponent;
  @ViewChild('budgetProcurementFlightPeriod') budgetProcurementFlightPeriod: BudgetProcurementFlightPeriodComponent;
  @ViewChild('budgetProcurementFlightOvernight') budgetProcurementFlightOvernight: BudgetProcurementFlightOvernightComponent;
  @ViewChild('budgetHotel') budgetHotel: BudgetProcurementHotelComponent;
  @ViewChild('budgetCarRental') budgetCarRental: BudgetProcurementCarRentalComponent;
  @ViewChild('procurementHotel') procurementHotel: BudgetProcurementHotelComponent;
  @ViewChild('procurementCarRental') procurementCarRental: BudgetProcurementCarRentalComponent;
  @ViewChild('budgetProcurementCostAnalysis') budgetProcurementCostAnalysis: BudgetProcurementCostAnalysisComponent

  id = input.required<number>();
  planBudgetProcurementId = input<number>();
  yearPlan = input<number>();
  airportCode = input<string>();

  CategoryEnum = CategoryEnum;

  override ngOnInit(): void {
    console.log('id: ', this.id());
    console.log('planBudgetProcurementId: ', this.planBudgetProcurementId());
    console.log('yearPlan: ', this.yearPlan());
    console.log('airportCode: ', this.airportCode());
    this.getDetailSummary();
    // this.dataSummary();
  }

  async getDetailSummary(): Promise<any> {
    try {
      await this.spinner.show();
      const response = await this.baseService.getDetailSummary(this.id() ?? 0);
      this.budgetProcurementGeneral.formGroupDetail.patchValue(response.data);
      this.budgetProcurementGeneral.setDefaultValueGeneral();

    } catch (error) {
      console.error('loadData error: ', error);
    } finally {
      this.spinner.hide();
    }
  }

  async dataSummary() {
    try {
      this.spinner.show();
      const procStartDate = this.budgetProcurementGeneral.formGroupDetail.controls.procStartDate.value;
      const procEndDate = this.budgetProcurementGeneral.formGroupDetail.controls.procEndDate.value;
      const requestBody = new DataSummayRequest(this.id() ?? 0,
        this.planBudgetProcurementId() ?? 0,
        this.yearPlan() ?? 0,
        this.airportCode() ?? '',
        this.dataTransformPipe.transform(procStartDate, ['date', this.Constant.MONTH_FORMAT]),
        this.dataTransformPipe.transform(procEndDate, ['date', this.Constant.MONTH_FORMAT]),
        !!this.budgetProcurementGeneral.formGroupDetail.controls.earlyCheckinFlag.value,
        !!this.budgetProcurementGeneral.formGroupDetail.controls.lateCheckoutFlag.value
      );
      const response = summaryDataExample;//await this.baseService.dataSummary(requestBody);//
      this.budgetProcurementFlightRate.setDataSource(response.data.planFlightRates);
      this.budgetProcurementFlightPeriod.setDataSource(response.data.planFlightPeriods);

      this.budgetProcurementFlightOvernight.setDataSource(response.data.planOverightRates);
      this.budgetHotel.calculateSpan(response.data.listActype.length, response.data.planOverightRates.length);
      this.budgetHotel.setPlanFlightByOvernight(response.data.planOverightRates);
      this.budgetHotel.setPlanFlightPeriods(response.data.planFlightPeriods);
      this.budgetHotel.setDataSource(response.data.planBudgetHotels, this.budgetProcurementGeneral.formGroupDetail.value);

      this.procurementHotel.calculateSpan(response.data.listActype.length, response.data.planOverightRates.length);
      this.procurementHotel.setPlanFlightByOvernight(response.data.planOverightRates);
      this.procurementHotel.setPlanFlightPeriods(response.data.planFlightPeriods);
      this.procurementHotel.setDataSource(response.data.planProcurementHotels, this.budgetProcurementGeneral.formGroupDetail.value);

      this.budgetCarRental.setPlanFlightPeriods(response.data.planFlightPeriods);
      this.budgetCarRental.setDataSource(response.data.planBudgetCarentals);
      this.procurementCarRental.setPlanFlightPeriods(response.data.planFlightPeriods);
      this.procurementCarRental.setDataSource(response.data.planProcurementCarentals);
      this.setPanelState(response);
    } catch (error) {
      console.error('loadData error: ', error);
    } finally {
      this.spinner.hide();
    }
  }

  override async save(): Promise<any> {
    console.log('budgetProcurementCostAnalysis: ', this.budgetProcurementCostAnalysis.formGroupDetail.value);
  }

  setPanelState(response: any): void {
    this.panelFlightRateYearState.set(!!response.data.planFlightRates && response.data.planFlightRates.length > 0);
    this.panelFlightPeriodState.set(!!response.data.planFlightPeriods && response.data.planFlightPeriods.length > 0);
  }

  formGeneralValueChanges(event: any): void {
    this.budgetHotel.setGeneralData(event);
  }

  overnightValueChange(event: any): void {
    console.log('overnightValueChange: ', event);
    switch (event.actionType) {
      case 'edit':
        this.budgetHotel.setOvernightRates(event, event.actionType, event.overnightLength, this.budgetProcurementFlightOvernight.dataSource.data)
        break;
      case 'delete':
        this.budgetHotel.setOvernightRates(event, event.actionType, event.overnightLength, this.budgetProcurementFlightOvernight.dataSource.data)
        break;
      default:
        break;
    }
  }

}
