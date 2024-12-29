import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, input, OnInit, signal, viewChild, ViewChild, HostListener, AfterViewChecked, ChangeDetectorRef, AfterViewInit, AfterContentInit } from '@angular/core';
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
import { DataSummayRequest, dataDetailExample, summaryDataExample, summaryDataExample1 } from './budget-procurement-summary-detail.model';
import { CategoryEnum, closePanel, openPanel, PlanCategoryEnum } from '../../budget-procurement.model';
import { MESSAGE } from 'src/app/crew-trip/shared/utils/constant';
import { DomesticBudgetProcurementFlightRateComponent } from '../../budget-procurement-common/domestic/domestic-budget-procurement-flight-rate/domestic-budget-procurement-flight-rate.component';
import { DomesticBudgetProcurementHotelComponent } from '../../budget-procurement-common/domestic/domestic-budget-procurement-hotel/domestic-budget-procurement-hotel.component';
import { DomesticBudgetProcurementCarRentalComponent } from '../../budget-procurement-common/domestic/domestic-budget-procurement-car-rental/domestic-budget-procurement-car-rental.component';
import { DomesticBudgetProcurementWetLeaseComponent } from '../../budget-procurement-common/domestic/domestic-budget-procurement-wet-lease/domestic-budget-procurement-wet-lease.component';
import { V } from '@angular/cdk/keycodes';

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
export class BudgetProcurementSummaryDetailComponent extends CommonComponent implements OnInit, AfterViewChecked, AfterViewInit {
  override baseService = inject(PlanBudgetProcurementService);
  dataTransformPipe = inject(DataTransformPipe);

  @ViewChild('panelCalculationBasisState', { static: false }) panelCalculationBasisState: MatExpansionPanel; // II
  @ViewChild('panelFlightRateYearState', { static: false }) panelFlightRateYearState: MatExpansionPanel; // 2.1
  @ViewChild('panelFlightPeriodState', { static: false }) panelFlightPeriodState: MatExpansionPanel; // 2.2
  @ViewChild('panelFlightOvernightState', { static: false }) panelFlightOvernightState: MatExpansionPanel; // 2.3

  @ViewChild('panelBudgetPlanState', { static: false }) panelBudgetPlanState: MatExpansionPanel; // III
  @ViewChild('panelBudgetPlanHotelState', { static: false }) panelBudgetPlanHotelState: MatExpansionPanel; // 3.1
  @ViewChild('panelBudgetPlanCarRentalState', { static: false }) panelBudgetPlanCarRentalState: MatExpansionPanel; // 3.2
  @ViewChild('panelBudgetPlanWetLeaseState', { static: false }) panelBudgetPlanWetLeaseState: MatExpansionPanel; // 3.3

  @ViewChild('panelProcurementPlanState', { static: false }) panelProcurementPlanState: MatExpansionPanel; // IV
  @ViewChild('panelProcurementPlanHotelState', { static: false }) panelProcurementPlanHotelState: MatExpansionPanel; // 4.1
  @ViewChild('panelProcurementPlanCarRentalState', { static: false }) panelProcurementPlanCarRentalState: MatExpansionPanel; // 4.2
  @ViewChild('panelProcurementPlanWetLeaseState', { static: false }) panelProcurementPlanWetLeaseState: MatExpansionPanel; // 4.3


  @ViewChild('budgetProcurementGeneral', { static: false }) budgetProcurementGeneral: BudgetProcurementGeneralComponent;

  @ViewChild('internationalFlightRate', { static: false }) internationalFlightRate: InternationalBudgetProcurementFlightRateComponent; // 2.1
  @ViewChild('internationalFlightPeriod', { static: false }) internationalFlightPeriod: BudgetProcurementFlightPeriodComponent; // 2.2
  @ViewChild('internationalFlightOvernight', { static: false }) internationalFlightOvernight: BudgetProcurementFlightOvernightComponent; // 2.3
  @ViewChild('internationalBudgetHotel', { static: false }) internationalBudgetHotel: InternationalBudgetProcurementHotelComponent; // 3.1
  @ViewChild('internationalBudgetCarRental', { static: false }) internationalBudgetCarRental: InternationalBudgetProcurementCarRentalComponent; // 3.2
  @ViewChild('internationalProcurementHotel', { static: false }) internationalProcurementHotel: InternationalBudgetProcurementHotelComponent; // 4.1
  @ViewChild('internationalProcurementCarRental', { static: false }) internationalProcurementCarRental: InternationalBudgetProcurementCarRentalComponent; // 4.2

  @ViewChild('domesticFlightRate', { static: false }) domesticFlightRate: DomesticBudgetProcurementFlightRateComponent;  // II
  @ViewChild('domesticBudgetHotel', { static: false }) domesticBudgetHotel: DomesticBudgetProcurementHotelComponent; // 3.1
  @ViewChild('domesticBudgetCarRental', { static: false }) domesticBudgetCarRental: DomesticBudgetProcurementCarRentalComponent; // 3.2
  @ViewChild('domesticBudgetWetLease', { static: false }) domesticBudgetWetLease: DomesticBudgetProcurementWetLeaseComponent; // 3.3
  @ViewChild('domesticProcurementHotel', { static: false }) domesticProcurementHotel: DomesticBudgetProcurementHotelComponent; // 4.1
  @ViewChild('domesticProcurementCarRental', { static: false }) domesticProcurementCarRental: DomesticBudgetProcurementCarRentalComponent; // 4.2
  @ViewChild('domesticProcurementWetLease', { static: false }) domesticProcurementWetLease: DomesticBudgetProcurementWetLeaseComponent; // 4.3

  @ViewChild('budgetProcurementCostAnalysis', { static: false }) budgetProcurementCostAnalysis: BudgetProcurementCostAnalysisComponent;

  id = input.required<number>();
  planBudgetProcurementId = input<number>(0, { alias: 'plan-budget-procurement-id' });
  yearPlan = input<number>(0, { alias: 'year-plan' });
  airportCode = input<string>('', { alias: 'airport-code' });
  planType = input<PlanCategoryEnum | null>(null, { alias: 'plan-type' });
  category = input.required<CategoryEnum>();

  CategoryEnum = CategoryEnum;
  PlanCategoryEnum = PlanCategoryEnum;

  dataDetail: any;

  constructor(private datePipe: DatePipe, private cdRef: ChangeDetectorRef) {
    super();
  }

  override ngOnInit(): void {
    console.log('id: ', this.id());
    console.log('planBudgetProcurementId: ', this.planBudgetProcurementId());
    console.log('yearPlan: ', this.yearPlan());
    console.log('airportCode: ', this.airportCode());
    this.getDetailSummary();
  }
  ngAfterViewChecked(): void {
    this.cdRef.detectChanges(); // Phát hiện và cập nhật các thay đổi
  }
  override  ngAfterViewInit(): void {
    this.setPanelState();
    this.setDataDetail();
  }



  async getDetailSummary(): Promise<any> {
    try {
      await this.spinner.show();
      const response = await this.baseService.getDetailSummary(this.id() ?? 0); //dataDetailExample;//
      this.dataDetail = { ...response.data };
      this.budgetProcurementGeneral.formGroupDetail.patchValue(this.dataDetail);
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
      const response = await this.baseService.dataSummary(requestBody);//summaryDataExample;//summaryDataExample1;//
      this.dataDetail = {
        ...this.dataDetail,
        planFlightRates: response.data.planFlightRates ?? [],
        planFlightPeriods: response.data.planFlightPeriods ?? [],
        planOverightRates: response.data.planOverightRates ?? [],
        planBudgetHotels: response.data.planBudgetHotels ?? [],
        planBudgetCarentals: response.data.planBudgetCarentals ?? [],
        planProcurementHotels: response.data.planProcurementHotels ?? [],
        planProcurementCarentals: response.data.planProcurementCarentals ?? [],
        planBudgetWetLease: response.data.planBudgetWetLease ?? [],
        planProcumentWetLease: response.data.planProcumentWetLease ?? [],
        listActype: response.data.listActype ?? [],
      };

      this.setPanelState();
    } catch (error) {
      console.error('loadData error: ', error);
    } finally {
      this.spinner.hide();
    }
  }

  setDataDetail() {
    if (this.category() === CategoryEnum.DOMESTIC) {
      // this.domesticFlightRate.setDataSource(this.dataDetail.planFlightRates ?? []);
      // this.domesticBudgetHotel.setDataSource(this.dataDetail.planBudgetHotels ?? []);
      // this.domesticProcurementHotel.setDataSource(this.dataDetail.planProcurementHotels ?? []);
      // this.domesticBudgetCarRental.setDataSource(this.dataDetail.planBudgetCarentals ?? []);
      // this.domesticProcurementCarRental.setDataSource(this.dataDetail.planProcurementCarentals ?? []);

      if (this.dataDetail?.wetLeaseFlag) {
        // this.domesticBudgetWetLease.setDataSource(this.dataDetail.planBudgetWetLease ?? []);
        // this.domesticProcurementWetLease.setDataSource(this.dataDetail.planProcumentWetLease ?? []);
      }
    } else {
      // this.internationalFlightRate.setDataSource(this.dataDetail.planFlightRates);
      // this.internationalFlightPeriod.setDataSource(this.dataDetail.planFlightPeriods ?? []);
      // this.internationalFlightOvernight.setDataSource(this.dataDetail.planOverightRates ?? []);

      // this.internationalBudgetHotel.calculateSpan((this.dataDetail.listActype ?? []).length, this.dataDetail.planOverightRates ?? length);
      // this.internationalBudgetHotel.setPlanFlightByOvernight(this.dataDetail.planOverightRates ?? []);
      // this.internationalBudgetHotel.setPlanFlightPeriods(this.dataDetail.planFlightPeriods ?? []);
      // this.internationalBudgetHotel.setDataSource(this.dataDetail.planBudgetHotels, this.budgetProcurementGeneral.formGroupDetail.value);

      // this.internationalProcurementHotel.calculateSpan((this.dataDetail.listActype ?? []).length, (this.dataDetail.planOverightRates ?? []).length);
      // this.internationalProcurementHotel.setPlanFlightByOvernight(this.dataDetail.planOverightRates ?? []);
      // this.internationalProcurementHotel.setPlanFlightPeriods(this.dataDetail.planFlightPeriods ?? []);
      // this.internationalProcurementHotel.setDataSource(this.dataDetail.planProcurementHotels ?? [], this.budgetProcurementGeneral.formGroupDetail.value);


      // this.internationalBudgetCarRental.setPlanFlightPeriods(this.dataDetail.planFlightPeriods ?? []);
      // this.internationalBudgetCarRental.setDataSource(this.dataDetail.planBudgetCarentals ?? []);

      // this.internationalProcurementCarRental.setPlanFlightPeriods(this.dataDetail.planFlightPeriods ?? []);
      // this.internationalProcurementCarRental.setDataSource(this.dataDetail.planProcurementCarentals ?? []);
    }


    this.setPanelState();
  }

  override async save(): Promise<any> {
    try {
      this.budgetProcurementGeneral.formGroupDetail.markAllAsTouched();
      this.budgetProcurementCostAnalysis.formGroupDetail.markAllAsTouched();
      if (this.budgetProcurementGeneral.formGroupDetail.invalid ||
        (this.category() === CategoryEnum.INTERNATIONAL && this.internationalFlightOvernight.invalid()) ||
        this.budgetProcurementCostAnalysis.formGroupDetail.invalid) {
        return;
      }
      await this.spinner.show();
      const update = !!this.dataDetail.id;

      let planFlightRates: any[] = [];
      let planFlightPeriods: any[] = [];
      let planOverightRates: any[] = [];
      let planBudgetHotels: any[] = [];
      let planBudgetCarentals: any[] = [];
      let planProcurementHotels: any[] = [];
      let planProcurementCarentals: any[] = [];
      let planBudgetWetLease: any[] = [];
      let planProcumentWetLease: any[] = [];

      if (this.category() === CategoryEnum.DOMESTIC) {
        planFlightRates = [...this.cleanData(this.domesticFlightRate.dataSource.data ?? [])];
        planBudgetHotels = [...this.cleanData(this.domesticBudgetHotel.dataSource.data ?? [])];
        planBudgetCarentals = [...this.cleanData(this.domesticBudgetCarRental.dataSource.data ?? [])];
        planProcurementHotels = [...this.cleanData(this.domesticProcurementHotel.dataSource.data ?? [])];
        planProcurementCarentals = [...this.cleanData(this.domesticProcurementCarRental.dataSource.data ?? [])];
        if (this.dataDetail?.wetLeaseFlag) {
          planBudgetWetLease = [...this.cleanData(this.domesticBudgetWetLease.dataSource.data ?? [])];
          planProcumentWetLease = [...this.cleanData(this.domesticProcurementWetLease.dataSource.data ?? [])];
        }
      } else {
        planFlightRates = [...this.cleanData(this.internationalFlightRate.dataSource.data ?? [])]
        planFlightPeriods = [...this.cleanData(this.internationalFlightPeriod.dataSource.data ?? [])];
        planOverightRates = [...this.cleanData(this.internationalFlightOvernight.dataSource.data ?? [])];
        planBudgetHotels = [...this.cleanData(this.internationalBudgetHotel.dataSource.data ?? [])];
        planBudgetCarentals = [...this.cleanData(this.internationalBudgetCarRental.dataSource.data ?? [])];
        planProcurementHotels = [...this.cleanData(this.internationalProcurementHotel.dataSource.data ?? [])];
        planProcurementCarentals = [...this.cleanData(this.internationalProcurementCarRental.dataSource.data ?? [])];
      }

      const data = {
        ...this.dataDetail,
        ...this.budgetProcurementGeneral.formGroupDetail.value,
        planFlightRates: planFlightRates,
        planFlightPeriods: planFlightPeriods,
        planOverightRates: planOverightRates,
        planBudgetHotels: planBudgetHotels,
        planBudgetCarentals: planBudgetCarentals,
        planProcurementHotels: planProcurementHotels,
        planProcurementCarentals: planProcurementCarentals,
        planBudgetWetLease: planBudgetWetLease,
        planProcumentWetLease: planProcumentWetLease,
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

  setPanelState(): void {
    if (this.category() === CategoryEnum.DOMESTIC) {
      this.setDomesticPanelState();
    } else {
      this.setInternationalPanelState();
    }
    this.setPanelStateCommon();
  }

  private setDomesticPanelState(): void {
    openPanel(this.panelBudgetPlanCarRentalState, true, this.dataDetail?.planBudgetCarentals);
    if (this.dataDetail?.wetLeaseFlag) {
      openPanel(this.panelBudgetPlanWetLeaseState);
      openPanel(this.panelProcurementPlanWetLeaseState)
    }
  }

  private setInternationalPanelState(): void {
    openPanel(this.panelFlightRateYearState, true, this.dataDetail?.planFlightRates);
    openPanel(this.panelFlightPeriodState, true, this.dataDetail?.planFlightPeriods);
    openPanel(this.panelBudgetPlanCarRentalState);
  }

  private setPanelStateCommon(): void {
    openPanel(this.panelProcurementPlanHotelState, true, this.dataDetail?.planProcurementHotels);
    openPanel(this.panelProcurementPlanCarRentalState, true, this.dataDetail?.planProcurementCarentals);

    switch (this.planType()) {
      case PlanCategoryEnum.PROCUREMENT:
        closePanel(this.panelBudgetPlanState);
        break;
      case PlanCategoryEnum.BUDGET:
        closePanel(this.panelProcurementPlanState);
        break;
      default:
        break;
    }
  }

  formGeneralValueChanges(event: any): void {
    if (this.category() === CategoryEnum.INTERNATIONAL) {
      this.internationalBudgetHotel.setGeneralData(event);
    }
  }

  overnightValueChange(event: any): void {
    console.log('overnightValueChange: ', event);
    this.internationalBudgetHotel.setOvernightRates(event, event.actionType, event.overnightLength, this.internationalFlightOvernight.dataSource.data);
  }

  cleanData(data: any[]): any[] {
    return data.map((item: any) => ({ ...item, id: !item.id || item.id < 0 ? null : item.id }));
  }

  // Lấy data cho các component con
  get planFlightRatesData() {
    return [...this.dataDetail?.planFlightRates ?? []];
  }

  get internationalFlightPeriodData() {
    return {
      planFlightPeriods: [...this.dataDetail?.planFlightPeriods ?? []],
      periodRowspan: (this.dataDetail?.listActype ?? []).length
    }
  }

  get internationalFlightOvernightData() {
    return [...this.dataDetail?.planOverightRates ?? []]
  }

  get domesticBudgetHotelData() {
    return [...this.dataDetail?.planBudgetHotels ?? []]
  }

  get internationalBudgetHotelData() {
    return {
      aircraftTypeRowspan: (this.dataDetail?.listActype ?? []).length,
      overnightRowspan: (this.dataDetail?.planOverightRates ?? []).length,
      planOverightRates: [...this.dataDetail?.planOverightRates ?? []],
      planFlightPeriods: [...this.dataDetail.planFlightPeriods ?? []],
      planHotels: [...this.dataDetail?.planBudgetHotels ?? []],
      general: this.budgetProcurementGeneral.formGroupDetail.value
    }
  }

  get domesticBudgetCarRentalData() {
    return [...this.dataDetail?.planBudgetCarentals ?? []];
  }

  get internationalBudgetCarRentalData() {
    return {
      planFlightPeriods: [...this.dataDetail.planFlightPeriods ?? []],
      planCarentals: [...this.dataDetail?.planBudgetCarentals ?? []]
    }
  }

  get domesticBudgetWetLeaseData() {
    return [...this.dataDetail?.planBudgetWetLease ?? []];
  }

  get domesticProcurementHotelData() {
    return [...this.dataDetail?.planProcurementHotels ?? []];
  }

  get internationalProcurementHotelData() {
    return {
      aircraftTypeRowspan: (this.dataDetail?.listActype ?? []).length,
      overnightRowspan: (this.dataDetail?.planOverightRates ?? []).length,
      planOverightRates: [...this.dataDetail?.planOverightRates ?? []],
      planFlightPeriods: [...this.dataDetail.planFlightPeriods ?? []],
      planHotels: [...this.dataDetail?.planProcurementHotels ?? []],
      general: this.budgetProcurementGeneral.formGroupDetail.value
    }
  }

  get domesticProcurementCarRentalData() {
    return [...this.dataDetail?.planProcurementCarentals ?? []];
  }

  get internationalProcurementCarRentalData() {
    return {
      planFlightPeriods: [...this.dataDetail.planFlightPeriods ?? []],
      planCarentals: [...this.dataDetail?.planProcurementCarentals ?? []]
    }
  }

  get domesticProcurementWetLeaseData() {
    return [...this.dataDetail?.planProcumentWetLease ?? []];
  }
}
