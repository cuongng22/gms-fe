import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, input, OnInit, signal, viewChild, ViewChild, HostListener, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
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
import { MatExpansionModule, MatExpansionPanel, MatExpansionPanelContent } from '@angular/material/expansion';
import { InternationalBudgetProcurementFlightRateComponent } from '../../budget-procurement-common/international/international-budget-procurement-flight-rate/international-budget-procurement-flight-rate.component';
import { BudgetProcurementFlightPeriodComponent } from '../../budget-procurement-common/budget-procurement-flight-period/budget-procurement-flight-period.component';
import { BudgetProcurementFlightOvernightComponent } from '../../budget-procurement-common/budget-procurement-flight-overnight/budget-procurement-flight-overnight.component';
import { InternationalBudgetProcurementHotelComponent } from '../../budget-procurement-common/international/international-budget-procurement-hotel/international-budget-procurement-hotel.component';
import { InternationalBudgetProcurementCarRentalComponent } from '../../budget-procurement-common/international/international-budget-procurement-car-rental/international-budget-procurement-car-rental.component';
import { BudgetProcurementCostAnalysisComponent } from '../../budget-procurement-common/budget-procurement-cost-analysis/budget-procurement-cost-analysis.component';
import { PlanBudgetProcurementService } from 'src/app/crew-trip/core/services/plan-budget-procurement.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DataSummayRequest, summaryDataExample, summaryDataExample1 } from './budget-procurement-summary-detail.model';
import { CategoryEnum, PlanCategoryEnum } from '../../budget-procurement.model';
import { MESSAGE } from 'src/app/crew-trip/shared/utils/constant';
import { DomesticBudgetProcurementFlightRateComponent } from '../../budget-procurement-common/domestic/domestic-budget-procurement-flight-rate/domestic-budget-procurement-flight-rate.component';
import { DomesticBudgetProcurementHotelComponent } from '../../budget-procurement-common/domestic/domestic-budget-procurement-hotel/domestic-budget-procurement-hotel.component';
import { DomesticBudgetProcurementCarRentalComponent } from '../../budget-procurement-common/domestic/domestic-budget-procurement-car-rental/domestic-budget-procurement-car-rental.component';
import { DomesticBudgetProcurementWetLeaseComponent } from '../../budget-procurement-common/domestic/domestic-budget-procurement-wet-lease/domestic-budget-procurement-wet-lease.component';

@Component({
  selector: 'app-budget-procurement-summary-detail',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule,
    BudgetProcurementGeneralComponent, MatExpansionModule, MatExpansionPanelContent,
    InternationalBudgetProcurementFlightRateComponent, BudgetProcurementFlightPeriodComponent, BudgetProcurementFlightOvernightComponent,
    InternationalBudgetProcurementHotelComponent, InternationalBudgetProcurementCarRentalComponent, BudgetProcurementCostAnalysisComponent,
    DomesticBudgetProcurementFlightRateComponent, DomesticBudgetProcurementHotelComponent,
    DomesticBudgetProcurementCarRentalComponent, DomesticBudgetProcurementWetLeaseComponent],
  providers: [DatePipe, DataTransformPipe],
  templateUrl: './budget-procurement-summary-detail.component.html',
  styleUrl: './budget-procurement-summary-detail.component.scss'
})
export class BudgetProcurementSummaryDetailComponent extends CommonComponent implements OnInit, AfterViewChecked {
  override baseService = inject(PlanBudgetProcurementService);
  dataTransformPipe = inject(DataTransformPipe);

  @ViewChild('panelFlightRateYearState', { static: false }) panelFlightRateYearState: MatExpansionPanel;
  @ViewChild('panelFlightPeriodState', { static: false }) panelFlightPeriodState: MatExpansionPanel;
  @ViewChild('panelBudgetPlanState', { static: false }) panelBudgetPlanState: MatExpansionPanel;
  @ViewChild('panelProcurementPlanState', { static: false }) panelProcurementPlanState: MatExpansionPanel;
  @ViewChild('budgetPlanForWetLease', { static: false }) budgetPlanForWetLease: MatExpansionPanel;

  @ViewChild('budgetProcurementGeneral', { static: false }) budgetProcurementGeneral: BudgetProcurementGeneralComponent;
  // budgetProcurementGeneral = viewChild<BudgetProcurementGeneralComponent>('budgetProcurementGeneral');
  @ViewChild('budgetProcurementFlightPeriod', { static: false }) budgetProcurementFlightPeriod: BudgetProcurementFlightPeriodComponent;
  // budgetProcurementFlightPeriod = viewChild<BudgetProcurementFlightPeriodComponent>('budgetProcurementFlightPeriod');
  @ViewChild('budgetProcurementFlightOvernight', { static: false }) budgetProcurementFlightOvernight: BudgetProcurementFlightOvernightComponent;
  // budgetProcurementFlightOvernight = viewChild<BudgetProcurementFlightOvernightComponent>('budgetProcurementFlightOvernight');

  @ViewChild('internationalBudgetProcurementFlightRate', { static: false }) internationalBudgetProcurementFlightRate: InternationalBudgetProcurementFlightRateComponent;
  // internationalBudgetProcurementFlightRate = viewChild<InternationalBudgetProcurementFlightRateComponent>('InternationalBudgetProcurementFlightRateComponent');
  @ViewChild('internationalBudgetHotel', { static: false }) internationalBudgetHotel: InternationalBudgetProcurementHotelComponent;
  // internationalBudgetHotel = viewChild<InternationalBudgetProcurementHotelComponent>('internationalBudgetHotel');
  @ViewChild('internationalBudgetCarRental', { static: false }) internationalBudgetCarRental: InternationalBudgetProcurementCarRentalComponent;
  // internationalBudgetCarRental = viewChild<InternationalBudgetProcurementCarRentalComponent>('internationalBudgetCarRental');
  @ViewChild('internationalProcurementHotel', { static: false }) internationalProcurementHotel: InternationalBudgetProcurementHotelComponent;
  // internationalProcurementHotel = viewChild<InternationalBudgetProcurementHotelComponent>('internationalProcurementHotel');
  @ViewChild('internationalProcurementCarRental', { static: false }) internationalProcurementCarRental: InternationalBudgetProcurementCarRentalComponent;
  // internationalProcurementCarRental = viewChild<InternationalBudgetProcurementCarRentalComponent>('internationalProcurementCarRental');

  @ViewChild('domesticBudgetProcurementFlightRate', { static: false }) domesticBudgetProcurementFlightRate: DomesticBudgetProcurementFlightRateComponent;
  // domesticBudgetProcurementFlightRate = viewChild<DomesticBudgetProcurementFlightRateComponent>('domesticBudgetProcurementFlightRate');
  @ViewChild('domesticBudgetProcurementHotel', { static: false }) domesticBudgetProcurementHotel: DomesticBudgetProcurementHotelComponent;
  // domesticBudgetProcurementHotel = viewChild<DomesticBudgetProcurementHotelComponent>('domesticBudgetProcurementHotel');
  @ViewChild('domesticBudgetProcurementCarRental', { static: false }) domesticBudgetProcurementCarRental: DomesticBudgetProcurementCarRentalComponent;
  // domesticBudgetProcurementCarRental = viewChild<DomesticBudgetProcurementCarRentalComponent>('domesticBudgetProcurementCarRental');
  @ViewChild('domesticBudgetWetLease', { static: false }) domesticBudgetWetLease: DomesticBudgetProcurementWetLeaseComponent;
  // domesticBudgetWetLease = viewChild<DomesticBudgetProcurementWetLeaseComponent>('domesticBudgetWetLease');

  @ViewChild('budgetProcurementCostAnalysis', { static: false }) budgetProcurementCostAnalysis: BudgetProcurementCostAnalysisComponent;
  // budgetProcurementCostAnalysis = viewChild<BudgetProcurementCostAnalysisComponent>('budgetProcurementCostAnalysis');

  id = input.required<number>();
  planBudgetProcurementId = input<number>(0, { alias: 'plan-budget-procurement-id' });
  yearPlan = input<number>(0, { alias: 'year-plan' });
  airportCode = input<string>('', { alias: 'airport-code' });
  planType = input<PlanCategoryEnum | null>(null, { alias: 'plan-type' });
  category = input.required<CategoryEnum>();

  CategoryEnum = CategoryEnum;

  summayData: any;
  detailData: any;

  constructor(private datePipe: DatePipe, private cdRef: ChangeDetectorRef) {
    super();
  }
  override ngOnInit(): void {
    console.log('id: ', this.id());
    console.log('planBudgetProcurementId: ', this.planBudgetProcurementId());
    console.log('yearPlan: ', this.yearPlan());
    console.log('airportCode: ', this.airportCode());
    this.getDetailSummary();
    // this.dataSummary();
    this.setPanelState({})
  }
  ngAfterViewChecked(): void {
    this.cdRef.detectChanges(); // Phát hiện và cập nhật các thay đổi
  }

  async getDetailSummary(): Promise<any> {
    try {
      await this.spinner.show();
      const response = await this.baseService.getDetailSummary(this.id() ?? 0);
      this.detailData = { ...response.data };
      this.budgetProcurementGeneral.formGroupDetail.patchValue(this.summayData);
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
      const response = summaryDataExample1;// await this.baseService.dataSummary(requestBody);//summaryDataExample;//
      this.summayData = { ...response.data }

      if (this.category() === CategoryEnum.DOMESTIC) {
        this.domesticBudgetProcurementFlightRate.setDataSource(this.summayData.planFlightRates);

        this.domesticBudgetProcurementHotel.setDataSource(this.summayData.planBudgetHotels, this.budgetProcurementGeneral.formGroupDetail.value);
        if (this.detailData?.wetLeaseFlag) {
          this.domesticBudgetWetLease.setDataSource(this.summayData.planBudgetWetLease ?? []);
        }
        // this.domesticBudgetWetLease()?.setDataSource(this.summayData.planBudgetWetLease ?? []);
      } else {
        this.internationalBudgetProcurementFlightRate.setDataSource(this.summayData.planFlightRates);
        this.budgetProcurementFlightPeriod.setDataSource(this.summayData.planFlightPeriods ?? []);
        this.budgetProcurementFlightOvernight.setDataSource(this.summayData.planOverightRates ?? []);

        this.internationalBudgetHotel.calculateSpan((this.summayData.listActype ?? []).length, this.summayData.planOverightRates ?? length);
        this.internationalBudgetHotel.setPlanFlightByOvernight(this.summayData.planOverightRates ?? []);
        this.internationalBudgetHotel.setPlanFlightPeriods(this.summayData.planFlightPeriods ?? []);
        this.internationalBudgetHotel.setDataSource(this.summayData.planBudgetHotels, this.budgetProcurementGeneral.formGroupDetail.value);

        this.internationalProcurementHotel.calculateSpan((this.summayData.listActype ?? []).length, (this.summayData.planOverightRates ?? []).length);
        this.internationalProcurementHotel.setPlanFlightByOvernight(this.summayData.planOverightRates ?? []);
        this.internationalProcurementHotel.setPlanFlightPeriods(this.summayData.planFlightPeriods ?? []);
        this.internationalProcurementHotel.setDataSource(this.summayData.planProcurementHotels ?? [], this.budgetProcurementGeneral.formGroupDetail.value);


        this.internationalBudgetCarRental.setPlanFlightPeriods(this.summayData.planFlightPeriods ?? []);
        this.internationalBudgetCarRental.setDataSource(this.summayData.planBudgetCarentals ?? []);
        this.internationalProcurementCarRental.setPlanFlightPeriods(this.summayData.planFlightPeriods ?? []);
        this.internationalProcurementCarRental.setDataSource(this.summayData.planProcurementCarentals ?? []);
      }


      this.setPanelState(response);
    } catch (error) {
      console.error('loadData error: ', error);
    } finally {
      this.spinner.hide();
    }
  }

  override async save(): Promise<any> {
    try {
      this.budgetProcurementGeneral.formGroupDetail.markAllAsTouched();
      this.budgetProcurementCostAnalysis.formGroupDetail.markAllAsTouched();
      if (this.budgetProcurementGeneral.formGroupDetail.invalid ||
        this.budgetProcurementFlightOvernight.invalid() ||
        this.budgetProcurementCostAnalysis.formGroupDetail.invalid) {
        return;
      }
      await this.spinner.show();
      const update = !!this.summayData.data.id;

      let planFlightRates: any[] = [];
      let planFlightPeriods: any[] = [];
      let planBudgetHotels: any[] = [];

      if (this.category() === CategoryEnum.DOMESTIC) {
        planFlightRates = [...this.domesticBudgetProcurementFlightRate.dataSource.data ?? [].map((item: any) => ({ ...item, id: !item.id || item.id < 0 ? null : item.id }))];
      } else {
        planFlightRates = [...this.internationalBudgetProcurementFlightRate.dataSource.data ?? [].map((item: any) => ({ ...item, id: !item.id || item.id < 0 ? null : item.id }))]
        planFlightPeriods = [...this.budgetProcurementFlightPeriod.dataSource.data ?? [].map((item: any) => ({ ...item, id: !item.id || item.id < 0 ? null : item.id }))]
      }

      const data = {
        ...this.summayData.data,
        ...this.budgetProcurementGeneral.formGroupDetail.value,
        planFlightRates: planFlightRates,
        planFlightPeriods: planFlightPeriods,
        planOverightRates: [...this.budgetProcurementFlightOvernight.dataSource.data ?? [].map((item: any) => ({ ...item, id: !item.id || item.id < 0 ? null : item.id }))],
        planBudgetHotels: [...this.internationalBudgetHotel.dataSource.data ?? [].map((item: any) => ({ ...item, id: !item.id || item.id < 0 ? null : item.id }))],
        planBudgetCarentals: [...this.internationalBudgetCarRental.dataSource.data ?? [].map((item: any) => ({ ...item, id: !item.id || item.id < 0 ? null : item.id }))],
        planProcurementHotels: [...this.internationalProcurementHotel.dataSource.data ?? [].map((item: any) => ({ ...item, id: !item.id || item.id < 0 ? null : item.id }))],
        planProcurementCarentals: [...this.internationalProcurementCarRental.dataSource.data ?? [].map((item: any) => ({ ...item, id: !item.id || item.id < 0 ? null : item.id }))],
        ...this.budgetProcurementCostAnalysis.formGroupDetail.value
      };
      console.log('data: ', data);
      const response = await this.baseService.save(data);
      this.baseService.showSuccess(update ? MESSAGE.UPDATE_SUCCESS : MESSAGE.CREATE_SUCCESS);
      console.log('response: ', response);
    } catch (error) {
      console.error('save error: ', error);
    } finally {
      this.spinner.hide();
    }
  }

  setPanelState(response: any,): void {
    let panelFlightRateYearState = this.panelFlightRateYearState;
    let panelFlightPeriodState = this.panelFlightPeriodState;
    let panelBudgetPlanState = this.panelBudgetPlanState;
    let panelProcurementPlanState = this.panelProcurementPlanState;

    if (this.category() === CategoryEnum.DOMESTIC) {
      if (this.detailData?.wetLeaseFlag) {
        this.budgetPlanForWetLease.open();
      }

    } else {
      if (!!response?.data?.planFlightRates && response?.data?.planFlightRates.length > 0) {
        if (panelFlightRateYearState) {
          panelFlightRateYearState.open();
          panelFlightRateYearState.disabled = false;
        }
      } else if (panelFlightRateYearState) {
        panelFlightRateYearState.close();
        panelFlightRateYearState.disabled = true;
      }

      if (!!response?.data?.planFlightPeriods && response?.data?.planFlightPeriods.length > 0) {
        if (panelFlightPeriodState) {
          panelFlightPeriodState.open();
          panelFlightPeriodState.disabled = false;
        }
      } else if (panelFlightPeriodState) {
        panelFlightPeriodState.close();
        panelFlightPeriodState.disabled = true;
      }
    }



    switch (this.planType()) {
      case PlanCategoryEnum.PROCUREMENT:
        if (panelBudgetPlanState) {
          panelBudgetPlanState.close();
          panelBudgetPlanState.disabled = true;
        }
        if (panelProcurementPlanState) {
          panelProcurementPlanState.open();
          panelProcurementPlanState.disabled = false;
        }
        break;
      case PlanCategoryEnum.BUDGET:
        if (panelBudgetPlanState) {
          panelBudgetPlanState.open();
          panelBudgetPlanState.disabled = false;
        }
        if (panelProcurementPlanState) {
          panelProcurementPlanState.close();
          panelProcurementPlanState.disabled = true;
        }
        break;
      default:
        if (panelBudgetPlanState) {
          panelBudgetPlanState.open();
          panelBudgetPlanState.disabled = false;
        }
        if (panelProcurementPlanState) {
          panelProcurementPlanState.open();
          panelProcurementPlanState.disabled = false;
        }
        break;
    }
  }

  formGeneralValueChanges(event: any): void {
    if (this.category() === CategoryEnum.DOMESTIC) {
    } else {
      this.internationalBudgetHotel.setGeneralData(event);
    }
  }

  overnightValueChange(event: any): void {
    console.log('overnightValueChange: ', event);
    switch (event.actionType) {
      case 'edit':
        this.internationalBudgetHotel.setOvernightRates(event, event.actionType, event.overnightLength, this.budgetProcurementFlightOvernight.dataSource.data)
        break;
      case 'delete':
        this.internationalBudgetHotel.setOvernightRates(event, event.actionType, event.overnightLength, this.budgetProcurementFlightOvernight.dataSource.data)
        break;
      default:
        break;
    }
  }

}
