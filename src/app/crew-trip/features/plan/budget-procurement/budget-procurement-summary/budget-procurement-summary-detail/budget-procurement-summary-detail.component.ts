import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, input, OnInit, signal, viewChild, ViewChild, HostListener, AfterViewChecked, ChangeDetectorRef, AfterViewInit, AfterContentInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink, RouterModule } from '@angular/router';
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
import { CategoryEnum, closePanel, openPanel, PlanCategoryEnum, StatusEnum, StatusSummaryEnum } from '../../budget-procurement.model';
import { MESSAGE } from 'src/app/crew-trip/shared/utils/constant';
import { DomesticBudgetProcurementFlightRateComponent } from '../../budget-procurement-common/domestic/domestic-budget-procurement-flight-rate/domestic-budget-procurement-flight-rate.component';
import { DomesticBudgetProcurementHotelComponent } from '../../budget-procurement-common/domestic/domestic-budget-procurement-hotel/domestic-budget-procurement-hotel.component';
import { DomesticBudgetProcurementCarRentalComponent } from '../../budget-procurement-common/domestic/domestic-budget-procurement-car-rental/domestic-budget-procurement-car-rental.component';
import { DomesticBudgetProcurementWetLeaseComponent } from '../../budget-procurement-common/domestic/domestic-budget-procurement-wet-lease/domestic-budget-procurement-wet-lease.component';
import { checkChange } from '../../budget-procurement-common/international/international-budget-procurement-hotel/international-budget-procurement-hotel.model';
import moment from 'moment';
import { CurrencyService } from 'src/app/crew-trip/core/services/currency.service';
import { ifValidator } from 'ngxtension/if-validator';

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
  styleUrl: './budget-procurement-summary-detail.component.scss',
})
export class BudgetProcurementSummaryDetailComponent extends CommonComponent implements OnInit, AfterViewChecked, AfterViewInit {
  override baseService = inject(PlanBudgetProcurementService);
  dataTransformPipe = inject(DataTransformPipe);
  private readonly currencyService = inject(CurrencyService);
  private readonly router = inject(Router)

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

  @ViewChild('panelBudgetProcurementCostAnalysisState', { static: false }) panelBudgetProcurementCostAnalysisState: MatExpansionPanel; // V


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
  showDialogSummary = false;
  showDialogClose = false;


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
    this.setPanelState();
  }
  override  ngAfterViewInit(): void {
    this.setPanelState();
  }



  async getDetailSummary() {
    try {
      await this.spinner.show();
      const response = await this.baseService.getDetailSummary(this.id() ?? 0); //dataDetailExample;//
      this.dataDetail = { ...response.data };
      this.budgetProcurementGeneral.formGroupDetail.patchValue(this.dataDetail, { emitEvent: false });
      this.budgetProcurementGeneral.formGroupDetail.controls.procurementPlanFlag.setValue(this.dataDetail.procurementPlanFlag)
      this.budgetProcurementGeneral.setDefaultValueGeneral(this.dataDetail.procurementPlanFlag);
      this.budgetProcurementGeneral.formGroupDetail.controls.category.disable();
      this.budgetProcurementGeneral.formGroupDetail.controls.airportCode.disable();
      this.budgetProcurementGeneral.unitPriceDoubleHotel = this.dataDetail?.unitPriceDoubleHotel;
      this.budgetProcurementGeneral.unitPriceSingleHotel = this.dataDetail?.unitPriceSingleHotel;
      this.budgetProcurementGeneral.inputPrice = this.dataDetail?.inputPrice;
      this.budgetProcurementGeneral.setVerionRate(this.dataDetail?.planBudgetProcurement.versionRate);
      this.budgetProcurementGeneral.currencyCodeChange({ value: this.dataDetail?.currencyCode });

      this.setDataDetail();
      this.setPanelState();
    } catch (error) {
      console.error('getDetailSummary error: ', error);
    } finally {
      this.spinner.hide();
    }
  }

  summaryData() {
    if (this.checkDataSummary()) {
      this.showDialogSummary = true;
    } else {
      this.confirmSummaryData();
    }
  }

  checkDataSummary() {
    return this.dataDetail && (this.dataDetail.planFlightRates
      || this.dataDetail.planFlightPeriods
      || this.dataDetail.planOverightRates
      || this.dataDetail.planBudgetHotels
      || this.dataDetail.planBudgetCarentals
      || this.dataDetail.planProcurementHotels
      || this.dataDetail.planProcurementCarentals
      || this.dataDetail.planBudgetWetLease
      || this.dataDetail.planProcumentWetLease)
  }

  async confirmSummaryData() {
    try {
      this.showDialogSummary = false;
      this.spinner.show();

      this.budgetProcurementGeneral.formGroupDetail.controls.procStartDate.updateValueAndValidity();
      this.budgetProcurementGeneral.formGroupDetail.controls.procEndDate.updateValueAndValidity();
      if (!this.budgetProcurementGeneral.checkRequiredCurrency()) {
        this.budgetProcurementGeneral.formGroupDetail.controls.currencyCode.clearValidators();
        this.budgetProcurementGeneral.formGroupDetail.controls.currencyCode.updateValueAndValidity();
      }
      this.budgetProcurementGeneral.formGroupDetail.markAllAsTouched();
      this.budgetProcurementGeneral.formGroupDetail.updateValueAndValidity();
      if (this.budgetProcurementGeneral.formGroupDetail.invalid) {
        console.log('this.budgetProcurementGeneral.formGroupDetail.invalid: ', this.budgetProcurementGeneral.formGroupDetail)
        return;
      }

      const procStartDate = this.budgetProcurementGeneral.formGroupDetail.controls.procStartDate.value;
      const procEndDate = this.budgetProcurementGeneral.formGroupDetail.controls.procEndDate.value;
      const requestBody = new DataSummayRequest(this.id() ?? 0,
        this.planBudgetProcurementId() ?? 0,
        this.yearPlan() ?? 0,
        this.airportCode() ?? '',
        procStartDate ? this.dataTransformPipe.transform(procStartDate, ['date', this.Constant.MONTH_FORMAT]) : null,
        procEndDate ? this.dataTransformPipe.transform(procEndDate, ['date', this.Constant.MONTH_FORMAT]) : null,
        !!this.budgetProcurementGeneral.formGroupDetail.controls.earlyCheckinFlag.value,
        !!this.budgetProcurementGeneral.formGroupDetail.controls.lateCheckoutFlag.value
      );
      const response = await this.baseService.dataSummary(requestBody);//summaryDataExample;//summaryDataExample1;//
      this.dataDetail = {
        ...response.data,
        ...this.budgetProcurementGeneral.formGroupDetail.getRawValue(),
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

      this.setPriceAndExchangeRate();

      this.setDataDetail();
      this.isSetPanelState = false;
      this.setPanelState();
    } catch (error) {
      console.error(error)
    } finally {
      this.showDialogSummary = false;
      this.spinner.hide();
    }
  }

  setPriceAndExchangeRate() {
    // set đơn giá cho trường hợp chưa có hợp đồng
    const _priceData = this.budgetProcurementGeneral.budgetProcurementPrice?.dataSource?.data;

    if (_priceData && _priceData.length > 0 && !this.dataDetail?.haveContract) {
      const _priceSingleRoom = _priceData.find((item: any) => item.code === 'singleRoom') as any;
      const _priceDoubleRoom = _priceData.find((item: any) => item.code === 'doubleRoom') as any;
      const _priceEarlyCheckinSingleRoom = _priceData.find((item: any) => item.code === 'earlyCheckinSingleRoom') as any;
      const _priceEarlyCheckinDoubleRoom = _priceData.find((item: any) => item.code === 'earlyCheckinDoubleRoom') as any;
      const _priceLateCheckoutSingleRoom = _priceData.find((item: any) => item.code === 'lateCheckoutSingleRoom') as any;
      const _priceLateCheckoutDoubleRoom = _priceData.find((item: any) => item.code === 'lateCheckoutDoubleRoom') as any;
      const _priceTransportation = _priceData.find((item: any) => item.code === 'transportation') as any;
      const price = {
        priceData: _priceData,
        priceSingleRoom: _priceSingleRoom,
        priceDoubleRoom: _priceDoubleRoom,
        priceEarlyCheckinSingleRoom: _priceEarlyCheckinSingleRoom,
        priceEarlyCheckinDoubleRoom: _priceEarlyCheckinDoubleRoom,
        priceLateCheckoutSingleRoom: _priceLateCheckoutSingleRoom,
        priceLateCheckoutDoubleRoom: _priceLateCheckoutDoubleRoom,
        priceTransportation: _priceTransportation
      }

      this.dataDetail?.planBudgetHotels.forEach((item: any) => {
        this.setPrice(item, price);
        this.setExchangeRateBudget(item, this.budgetProcurementGeneral.exchangeRate)

      });
      this.dataDetail?.planProcurementHotels.forEach((item: any) => {
        this.setPrice(item, price);
        this.setExchangeRateProcurement(item, this.budgetProcurementGeneral.exchangeRate)
      });

      this.dataDetail?.planBudgetCarentals.forEach((item: any) => {
        this.setPrice(item, price);
        this.setExchangeRateBudget(item, this.budgetProcurementGeneral.exchangeRate)
      })

      this.dataDetail?.planProcurementCarentals.forEach((item: any) => {
        this.setPrice(item, price);
        this.setExchangeRateProcurement(item, this.budgetProcurementGeneral.exchangeRate)
      })
    }
  }
  setPrice(item: any, price: any) {
    item.priceSingleRoom = price.priceSingleRoom?.priceBeforeTax ?? 0;
    item.priceSingleRoomVat = price.priceSingleRoom?.priceAfterTax ?? 0;

    item.priceDoubleRoom = price.priceDoubleRoom?.priceBeforeTax ?? 0;;
    item.priceDoubleRoomVat = price.priceDoubleRoom?.priceAfterTax ?? 0;

    item.priceSingleRoomEarly = price.priceEarlyCheckinSingleRoom?.priceBeforeTax ?? 0;;
    item.priceSingleRoomEarlyVat = price.priceEarlyCheckinSingleRoom?.priceAfterTax ?? 0;;

    item.priceDoubleRoomEarly = price.priceEarlyCheckinDoubleRoom?.priceBeforeTax ?? 0;;
    item.priceDoubleRoomEarlyVat = price.priceEarlyCheckinDoubleRoom?.priceAfterTax ?? 0;;

    item.priceSingleRoomLate = price.priceLateCheckoutSingleRoom?.priceBeforeTax ?? 0;;
    item.priceSingleRoomLateVat = price.priceLateCheckoutSingleRoom?.priceAfterTax ?? 0;;

    item.priceDoubleRoomLate = price.priceLateCheckoutDoubleRoom?.priceBeforeTax ?? 0;;
    item.priceDoubleRoomLateVat = price.priceLateCheckoutDoubleRoom?.priceAfterTax ?? 0;;

    item.priceCrewTransport = price.priceTransportation?.priceBeforeTax ?? 0;;
    item.priceCrewTransportVat = price.priceTransportation?.priceAfterTax ?? 0;;

    item.unitPrice = price.priceTransportation?.priceBeforeTax ?? 0;;
    item.unitPriceVat = price.priceTransportation?.priceAfterTax ?? 0;;
  }

  /**
   * Set tỉ giá cho phần kế hoạch ngân sách theo hàng tháng
   * @param item 
   * @param exchangeRate 
   */
  setExchangeRateBudget(item: any, exchangeRate: any) {
    if (exchangeRate) {
      const _periodStart = moment(item.periodStart).locale('en');
      const _exchangeRate = exchangeRate[_periodStart.format('MMMM').toLowerCase()]
      console.log(_periodStart, _exchangeRate);
      if (_exchangeRate) {
        item.rateInPeriod = _exchangeRate;
      }
    }
  }

  /**
   * Set tỉ giá cho phần kế hoạch mua sắm
   * @param item 
   * @param exchangeRate 
   */
  setExchangeRateProcurement(item: any, exchangeRate: any) {
    if (exchangeRate) {
      item.rateInPeriod = exchangeRate.average;
    }
  }


  override async save(): Promise<any> {
    try {
      await this.spinner.show();
      const resSave = await this.processSave();
      if (resSave.result) {
        this.baseService.showSuccess(resSave.isUpdate ? MESSAGE.UPDATE_SUCCESS : MESSAGE.CREATE_SUCCESS);
        this.getDetailSummary()
      }
    } catch (error) {
      console.error('save error: ', error);
    } finally {
      this.spinner.hide();
    }
  }

  async confirmClose() {
    try {
      await this.spinner.show()
      const resSave = await this.processSave();
      if (resSave.result) {
        this.router.navigate(['/plan/est-plan/budget-procurement', this.planBudgetProcurementId(), 'summary']);
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.spinner.hide()
    }

  }

  async processSave(): Promise<{ result: boolean, isUpdate?: boolean }> {
    try {
      if (!this.budgetProcurementGeneral.checkRequiredCurrency()) {
        this.budgetProcurementGeneral.formGroupDetail.controls.currencyCode.clearValidators();
        this.budgetProcurementGeneral.formGroupDetail.controls.currencyCode.updateValueAndValidity();
      }
      this.budgetProcurementGeneral.formGroupDetail.updateValueAndValidity()
      this.budgetProcurementGeneral.formGroupDetail.markAllAsTouched();
      this.budgetProcurementCostAnalysis.formGroupDetail.markAllAsTouched();
      console.log(this.budgetProcurementGeneral.formGroupDetail)
      if (this.budgetProcurementGeneral.formGroupDetail.invalid ||
        (this.category() === CategoryEnum.INTERNATIONAL && this.internationalFlightOvernight.invalid()) ||
        this.budgetProcurementCostAnalysis.formGroupDetail.invalid) {
        return Promise.resolve({ result: false });
      }
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
      let inputPrice: string = '';

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
      if (this.budgetProcurementGeneral.budgetProcurementPrice?.dataSource.data) {
        inputPrice = JSON.stringify(this.budgetProcurementGeneral.budgetProcurementPrice?.dataSource.data);
      }

      const data = {
        ...this.dataDetail,
        ...this.budgetProcurementGeneral.formGroupDetail.getRawValue(),
        planFlightRates: planFlightRates,
        planFlightPeriods: planFlightPeriods,
        planOverightRates: planOverightRates,
        planBudgetHotels: planBudgetHotels,
        planBudgetCarentals: planBudgetCarentals,
        planProcurementHotels: planProcurementHotels,
        planProcurementCarentals: planProcurementCarentals,
        planBudgetWetLease: planBudgetWetLease,
        planProcumentWetLease: planProcumentWetLease,
        ...this.budgetProcurementCostAnalysis.formGroupDetail.value,
        inputPrice: inputPrice
      };
      console.log('data: ', data);
      const response = await this.baseService.save(data);
      console.log('response: ', response);
      return Promise.resolve({ result: true, isUpdate: update })
    } catch (error) {
      console.error('save error: ', error);
      return Promise.resolve({ result: false })
    }
  }

  private isSetPanelState = false;
  setPanelState() {
    try {
      if (!this.isSetPanelState && this.dataDetail) {
        if (this.category() === CategoryEnum.DOMESTIC) {
          this.setDomesticPanelState();
        } else {
          this.setInternationalPanelState();
        }
        this.setPanelStateCommon();
        this.isSetPanelState = true;
      }
    } catch (error) {
      console.error(error);
    }
  }

  private setDomesticPanelState(): void {
    openPanel(this.panelBudgetPlanCarRentalState, true, this.dataDetail?.planBudgetCarentals);
    if (this.dataDetail?.haveContract) {
      openPanel(this.panelBudgetPlanWetLeaseState);
    }
    if (this.dataDetail?.wetLeaseFlag) {
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
    } else {
      if (checkChange(this.dataDetail.wetLeaseFlag, event.wetLeaseFlag)) {
        this.dataDetail.wetLeaseFlag = event.wetLeaseFlag;
        this.setDomesticPanelState()
      }
    }
  }

  exchangeRateChange(event: any) {
    console.log('exchangeRateChange: ', event)
    this.internationalBudgetHotel?.setExchangeRate(event);
    this.internationalProcurementHotel?.setExchangeRate(event);
    this.internationalBudgetCarRental?.setExchangeRate(event)
    this.internationalProcurementCarRental?.setExchangeRate(event)
  }

  overnightValueChange(event: any): void {
    console.log('overnightValueChange: ', event);
    this.internationalBudgetHotel.setOvernightRates(event, event.actionType, event.overnightLength, this.internationalFlightOvernight.dataSource.data);
  }

  priceChange(event: any[]) {
    this.internationalBudgetHotel?.setPrice(event);
    this.internationalProcurementHotel?.setPrice(event);
    this.internationalBudgetCarRental?.setPrice(event);
    this.internationalProcurementCarRental?.setPrice(event);
  }
  cleanData(data: any[]): any[] {
    return data.map((item: any) => ({ ...item, id: !item.id || item.id < 0 ? null : item.id }));
  }

  async completed() {
    const resSave = await this.processSave();
    if (resSave.result) {
      this.baseService.summaryUpdateStatus({ id: this.id(), status: StatusSummaryEnum.COMPLETED }).then(() => {
        this.baseService.showSuccess(MESSAGE.UPDATE_SUCCESS);
        this.getDetailSummary();
      });
    }
  }



  // Lấy data cho các component con
  setDataDetail() {
    // set đơn giá phòng đơn, đơn giá phòng đôi
    this.budgetProcurementGeneral.unitPriceDoubleHotel = this.dataDetail?.unitPriceDoubleHotel;
    this.budgetProcurementGeneral.unitPriceSingleHotel = this.dataDetail?.unitPriceSingleHotel;
    this.budgetProcurementGeneral.inputPrice = this.dataDetail?.inputPrice;
    this.budgetProcurementGeneral.cdRef.detectChanges()

    this.planFlightRatesData = [...this.dataDetail?.planFlightRates ?? []];
    this._internationalFlightPeriodData = {
      planFlightPeriods: [...this.dataDetail?.planFlightPeriods ?? []],
      periodRowspan: (this.dataDetail?.listActype ?? []).length
    }
    this.internationalFlightOvernightData = [...this.dataDetail?.planOverightRates ?? []];
    this.domesticBudgetHotelData = [...this.dataDetail?.planBudgetHotels ?? []]

    this.internationalBudgetHotelData = {
      aircraftTypeRowspan: (this.dataDetail?.listActype ?? []).length,
      overnightRowspan: (this.dataDetail?.planOverightRates ?? []).length,
      planOverightRates: [...this.dataDetail?.planOverightRates ?? []],
      planFlightPeriods: [...this.dataDetail.planFlightPeriods ?? []],
      planHotels: [...this.dataDetail?.planBudgetHotels ?? []],
      general: this.budgetProcurementGeneral.formGroupDetail.getRawValue()
    };

    this.domesticBudgetCarRentalData = [...this.dataDetail?.planBudgetCarentals ?? []];
    this.internationalBudgetCarRentalData = {
      planFlightPeriods: [...this.dataDetail.planFlightPeriods ?? []],
      planCarentals: [...this.dataDetail?.planBudgetCarentals ?? []]
    }
    this.domesticBudgetWetLeaseData = [...this.dataDetail?.planBudgetWetLease ?? []];
    this.domesticProcurementHotelData = [...this.dataDetail?.planProcurementHotels ?? []];
    this.internationalProcurementHotelData = {
      aircraftTypeRowspan: (this.dataDetail?.listActype ?? []).length,
      overnightRowspan: (this.dataDetail?.planOverightRates ?? []).length,
      planOverightRates: [...this.dataDetail?.planOverightRates ?? []],
      planFlightPeriods: [...this.dataDetail.planFlightPeriods ?? []],
      planHotels: [...this.dataDetail?.planProcurementHotels ?? []],
      general: this.budgetProcurementGeneral.formGroupDetail.getRawValue()
    }
    this.domesticProcurementCarRentalData = [...this.dataDetail?.planProcurementCarentals ?? []];
    this.internationalProcurementCarRentalData = {
      planFlightPeriods: [...this.dataDetail.planFlightPeriods ?? []],
      planCarentals: [...this.dataDetail?.planProcurementCarentals ?? []]
    }
    this.domesticProcurementWetLeaseData = [...this.dataDetail?.planProcumentWetLease ?? []];
  }

  private _planFlightRatesData: any[] = [];
  private _internationalFlightPeriodData: any = {};
  private _internationalFlightOvernightData: any[] = [];
  private _domesticBudgetHotelData: any[] = [];
  private _internationalBudgetHotelData: any = {};
  private _domesticBudgetCarRentalData: any[] = [];
  private _internationalBudgetCarRentalData: any = {};
  private _domesticBudgetWetLeaseData: any[] = [];
  private _domesticProcurementHotelData: any[] = [];
  private _internationalProcurementHotelData: any = {};
  private _domesticProcurementCarRentalData: any[] = [];
  private _internationalProcurementCarRentalData = {};
  private _domesticProcurementWetLeaseData: any[] = [];

  get planFlightRatesData() {
    return this._planFlightRatesData;
  }
  set planFlightRatesData(value: any[]) {
    this._planFlightRatesData = value;
  }

  get internationalFlightPeriodData() {
    return this._internationalFlightPeriodData;
  }
  set internationalFlightPeriodData(value: any) {
    this._internationalFlightPeriodData = value;
  }

  get internationalFlightOvernightData() {
    return this._internationalFlightOvernightData
  }
  set internationalFlightOvernightData(value: any[]) {
    this._internationalFlightOvernightData = value;
  }

  get domesticBudgetHotelData() {
    return this._domesticBudgetHotelData;
  }
  set domesticBudgetHotelData(value: any[]) {
    this._domesticBudgetHotelData = value;
  }

  get internationalBudgetHotelData() {
    return this._internationalBudgetHotelData;
  }
  set internationalBudgetHotelData(value: any) {
    this._internationalBudgetHotelData = value;

  }

  get domesticBudgetCarRentalData() {
    return this._domesticBudgetCarRentalData;
  }
  set domesticBudgetCarRentalData(value: any[]) {
    this._domesticBudgetCarRentalData = value;
  }

  get internationalBudgetCarRentalData() {
    return this._internationalBudgetCarRentalData;
  }
  set internationalBudgetCarRentalData(value: any) {
    this._internationalBudgetCarRentalData = value;
  }

  get domesticBudgetWetLeaseData() {
    return this._domesticBudgetWetLeaseData;
  }
  set domesticBudgetWetLeaseData(value: any[]) {
    this._domesticBudgetWetLeaseData = value;
  }

  get domesticProcurementHotelData() {
    return this._domesticProcurementHotelData;
  }
  set domesticProcurementHotelData(value: any[]) {
    this._domesticProcurementHotelData = value;
  }

  get internationalProcurementHotelData() {
    return this._internationalProcurementHotelData;
  }
  set internationalProcurementHotelData(value: any) {
    this._internationalProcurementHotelData = value;
  }

  get domesticProcurementCarRentalData() {
    return this._domesticProcurementCarRentalData;
  }
  set domesticProcurementCarRentalData(value: any[]) {
    this._domesticProcurementCarRentalData = value;
  }

  get internationalProcurementCarRentalData() {
    return this._internationalProcurementCarRentalData;

  }
  set internationalProcurementCarRentalData(value: any) {
    this._internationalProcurementCarRentalData = value;
  }

  get domesticProcurementWetLeaseData() {
    return this._domesticProcurementWetLeaseData;
  }
  set domesticProcurementWetLeaseData(value: any[]) {
    this._domesticProcurementWetLeaseData = value;
  }

  toggleDialogSummary() {
    this.showDialogSummary = !this.showDialogSummary;
  }

  toggleDialogClose() {
    this.showDialogClose = !this.showDialogClose;
  }

  checkStatusCompelted(): boolean {
    return this.dataDetail?.status === StatusSummaryEnum.COMPLETED;
  }

}
