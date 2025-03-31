import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, inject, input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule, MatExpansionPanel, MatExpansionPanelContent } from '@angular/material/expansion';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { EstimatedCostGeneralComponent } from '../../estimated-cost-common/estimated-cost-general/estimated-cost-general.component';
import { CategoryEnum, PlanCategoryEnum } from '../../../budget-procurement/budget-procurement.model';
import { StatusSummaryEnum } from '../../estimated-cost.model';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { PlanBudgetProcurementService } from 'src/app/crew-trip/core/services/plan-budget-procurement.service';
import { InternationalEstimatedCostOvernightComponent } from '../../estimated-cost-common/international/international-estimated-cost-overnight/international-estimated-cost-overnight.component';
import { DomesticEstimatedCostFlightRateComponent } from '../../estimated-cost-common/domestic/domestic-estimated-cost-flight-rate/domestic-estimated-cost-flight-rate.component';
import { InternationalEstimatedCostHotelComponent } from '../../estimated-cost-common/international/international-estimated-cost-hotel/international-estimated-cost-hotel.component';
import { InternationalEstimatedCostCarRentalComponent } from '../../estimated-cost-common/international/international-estimated-cost-car-rental/international-estimated-cost-car-rental.component';
import { DataSummayRequest } from '../../../budget-procurement/budget-procurement-summary/budget-procurement-summary-detail/budget-procurement-summary-detail.model';
import { DomesticEstimatedCostHotelComponent } from '../../estimated-cost-common/domestic/domestic-estimated-cost-hotel/domestic-estimated-cost-hotel.component';
import { DomesticEstimatedCostCarRentalComponent } from '../../estimated-cost-common/domestic/domestic-estimated-cost-car-rental/domestic-estimated-cost-car-rental.component';

@Component({
  selector: 'app-estimated-cost-summary-detail',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule,
    MatExpansionModule, MatExpansionPanelContent,
    EstimatedCostGeneralComponent, InternationalEstimatedCostOvernightComponent, DomesticEstimatedCostFlightRateComponent,
    InternationalEstimatedCostHotelComponent, InternationalEstimatedCostCarRentalComponent,
    DomesticEstimatedCostHotelComponent, DomesticEstimatedCostCarRentalComponent
  ],
  templateUrl: './estimated-cost-summary-detail.component.html',
  styleUrl: './estimated-cost-summary-detail.component.scss',
  providers: [DataTransformPipe, DatePipe]
})
export class EstimatedCostSummaryDetailComponent extends CommonComponent implements OnInit, AfterViewChecked, AfterViewInit {

  dataTransformPipe = inject(DataTransformPipe);
  override baseService = inject(PlanBudgetProcurementService);
  private datePipe = inject(DatePipe);
  private cdRef = inject(ChangeDetectorRef);
  private readonly router = inject(Router)


  id = input.required<number>();
  estCostId = input<number>(0, { alias: 'est-cost-id' });
  yearPlan = input<number>(0, { alias: 'year-plan' });
  airportCode = input<string>('', { alias: 'airport-code' });
  planType = input<PlanCategoryEnum | null>(null, { alias: 'plan-type' });
  category = input.required<CategoryEnum>();

  CategoryEnum = CategoryEnum;
  PlanCategoryEnum = PlanCategoryEnum;

  dataDetail: any;
  showDialogSummary = false;
  showDialogClose = false;

  @ViewChild('panelCalculationBasisState', { static: false }) panelCalculationBasisState: MatExpansionPanel; // II
  @ViewChild('panelFlightOvernightState', { static: false }) panelFlightOvernightState: MatExpansionPanel; // tỉ lệ ngủ đêm

  @ViewChild('panelEstimateCostState', { static: false }) panelEstimateCostState: MatExpansionPanel; // III
  @ViewChild('panelEstimateCostHotelState', { static: false }) panelEstimateCostHotelState: MatExpansionPanel; // 3.1
  @ViewChild('panelEstimateCostCarRentalState', { static: false }) panelEstimateCostCarRentalState: MatExpansionPanel; // 3.2



  @ViewChild('estimatedCostGeneral', { static: false }) estimatedCostGeneral: EstimatedCostGeneralComponent; //I
  @ViewChild('domesticFlightRate', { static: false }) domesticFlightRate: DomesticEstimatedCostFlightRateComponent; //II
  @ViewChild('internationalEstimatedCostOvernight', { static: false }) internationalEstimatedCostOvernight: InternationalEstimatedCostOvernightComponent; //II
  @ViewChild('internationalEstimatedCostHotel', { static: false }) internationalEstimatedCostHotel: InternationalEstimatedCostHotelComponent;// III 3.1
  @ViewChild('internationalEstimatedCostCarRental', { static: false }) internationalEstimatedCostCarRental: InternationalEstimatedCostCarRentalComponent;  //3.2
  @ViewChild('domesticEstimatedCostHotel', { static: false }) domesticEstimatedCostHotel: DomesticEstimatedCostHotelComponent; //3.1
  @ViewChild('domesticEstimatedCostCarRental', { static: true }) domesticEstimatedCostCarRental: DomesticEstimatedCostCarRentalComponent; //3.2

  private _planFlightRatesData: any[] = [];
  private _internationalFlightOvernightData: any[] = [];
  private _internationalEstimatedCostHotelData: any;
  private _internationalEstimatedCostCarRentalData: any[] = [];
  private _domesticEstimatedCostHotelData: any = {};
  private _domesticEstimatedCostCarRentalData: any = {};

  constructor() {
    super();
  }

  override ngOnInit(): void {
    console.log('id: ', this.id());
    console.log('estCostId: ', this.estCostId());
    console.log('yearPlan: ', this.yearPlan());
    console.log('airportCode: ', this.airportCode());
    this.getDetailSummary();
  }

  ngAfterViewChecked(): void {
  }



  async getDetailSummary() {
    try {
      await this.spinner.show();
      const response = await this.baseService.getDetailSummary(this.id() ?? 0); //dataDetailExample;//
      this.dataDetail = { ...response.data };
      this.estimatedCostGeneral.formGroupDetail.patchValue(this.dataDetail);
      this.estimatedCostGeneral.unitPriceDoubleHotel = this.dataDetail?.unitPriceDoubleHotel;
      this.estimatedCostGeneral.unitPriceSingleHotel = this.dataDetail?.unitPriceSingleHotel;
      this.estimatedCostGeneral.setDefaultValueGeneral();
      this.setDataDetail();
    } catch (error) {
      console.error('getDetailSummary error: ', error);
    } finally {
      this.spinner.hide();
    }
  }


  summaryData() {
    if (this.dataDetail.planFlightRates
      || this.dataDetail.planOverightRates
      || this.dataDetail.planBudgetHotels
      || this.dataDetail.planBudgetCarentals) {
      this.showDialogSummary = true;
    } else {
      this.confirmSummaryData();
    }
  }

  async confirmSummaryData() {
    try {
      this.spinner.show();
      const requestBody =
      {
        id: this.id() ?? 0,
        planBudgetProcurementId: this.estCostId() ?? 0,
        yearPlan: this.yearPlan() ?? 0,
        airportCode: this.airportCode() ?? '',
        earlyCheckinFlag: !!this.estimatedCostGeneral.formGroupDetail.controls.earlyCheckinFlag.value,
        lateCheckoutFlag: !!this.estimatedCostGeneral.formGroupDetail.controls.lateCheckoutFlag.value,
        haveContract: !!this.estimatedCostGeneral.formGroupDetail.controls.haveContract.value,
        earlyCheckinContractFlag: !!this.estimatedCostGeneral.formGroupDetail.controls.earlyCheckinContractFlag.value,
        lateCheckoutContractFlag: !!this.estimatedCostGeneral.formGroupDetail.controls.lateCheckoutContractFlag.value,
      }
      const response = await this.baseService.dataSummary(requestBody);//summaryDataExample;//summaryDataExample1;//
      this.dataDetail = {
        ...response.data,
        ...this.estimatedCostGeneral.formGroupDetail.getRawValue(),
        crewTransportFeeFlag: response.data.crewTransportFeeFlag,
        planFlightRates: response.data.planFlightRates ?? [],
        planOverightRates: response.data.planOverightRates ?? [],
        planBudgetHotels: response.data.planBudgetHotels ?? [],
        planBudgetCarentals: response.data.planBudgetCarentals ?? [],
        listActype: response.data.listActype ?? [],
      };
      this.setDataDetail(true);
    } catch (error) {
    } finally {
      this.showDialogSummary = false;
      this.spinner.hide();
    }
  }

  override async save(): Promise<any> {
    try {
      await this.spinner.show();
      const resSave = await this.processSave();
      if (resSave.result) {
        this.baseService.showSuccess(resSave.isUpdate ? this.MESSAGE.UPDATE_SUCCESS : this.MESSAGE.CREATE_SUCCESS);
        this.getDetailSummary()
      }
    } catch (error) {
      console.error('save error: ', error);
    } finally {
      this.spinner.hide();
    }
  }
  async processSave(): Promise<{ result: boolean, isUpdate?: boolean }> {
    try {
      this.estimatedCostGeneral.formGroupDetail.markAllAsTouched();
      console.log(this.estimatedCostGeneral.formGroupDetail)
      if (this.estimatedCostGeneral.formGroupDetail.invalid ||
        (this.category() === CategoryEnum.INTERNATIONAL && this.internationalEstimatedCostOvernight.invalid())
      ) {
        return Promise.resolve({ result: false });
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
        planBudgetHotels = [...this.cleanData(this.domesticEstimatedCostHotel?.getDataSource() ?? [])];
        planBudgetCarentals = [...this.cleanData(this.domesticEstimatedCostCarRental?.dataSource.data ?? [])];
        // planProcurementHotels = [...this.cleanData(this.domesticProcurementHotel.dataSource.data ?? [])];
        // planProcurementCarentals = [...this.cleanData(this.domesticProcurementCarRental.dataSource.data ?? [])];
        // if (this.dataDetail?.wetLeaseFlag) {
        //   planBudgetWetLease = [...this.cleanData(this.domesticBudgetWetLease.dataSource.data ?? [])];
        //   planProcumentWetLease = [...this.cleanData(this.domesticProcurementWetLease.dataSource.data ?? [])];
        // }
      } else {
        planOverightRates = [...this.cleanData(this.internationalEstimatedCostOvernight.dataSource.data ?? [])];
        planBudgetHotels = [...this.cleanData(this.internationalEstimatedCostHotel?.getDataSource() ?? [])];
        planBudgetCarentals = [...this.cleanData(this.internationalEstimatedCostCarRental?.getDataSource() ?? [])];
      }

      const data = {
        ...this.dataDetail,
        ...this.estimatedCostGeneral.formGroupDetail.value,
        planFlightRates: planFlightRates,
        planOverightRates: planOverightRates,
        planBudgetHotels: planBudgetHotels,
        planBudgetCarentals: planBudgetCarentals
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

  cleanData(data: any[]): any[] {
    return data.map((item: any) => ({ ...item, id: !item.id || item.id < 0 ? null : item.id }));
  }

  async completed() {
    const resSave = await this.processSave();
    if (resSave.result) {
      this.baseService.summaryUpdateStatus({ id: this.id(), status: StatusSummaryEnum.COMPLETED }).then(() => {
        this.baseService.showSuccess(this.MESSAGE.UPDATE_SUCCESS);
        this.getDetailSummary();
      });
    }

  }

  formGeneralValueChanges(event: any): void {
    if (this.category() === CategoryEnum.INTERNATIONAL) {
      // this.internationalBudgetHotel.setGeneralData(event);
    }
  }


  overnightValueChange(event: any): void {
    console.log('overnightValueChange: ', event);
    this.internationalEstimatedCostHotel.setOvernightRates(event, event.actionType, this.internationalEstimatedCostOvernight.dataSource.data);
  }

  checkDataSummary() {
    return this.dataDetail && (this.dataDetail.planFlightRates
      || this.dataDetail.planFlightPeriods
      || this.dataDetail.planOverightRates
      || this.dataDetail.planBudgetHotels
      || this.dataDetail.planBudgetCarentals
      // || this.dataDetail.planProcurementHotels
      // || this.dataDetail.planProcurementCarentals
      // || this.dataDetail.planBudgetWetLease
      // || this.dataDetail.planProcumentWetLease
    )
  }

  // Lấy data cho các component con
  setDataDetail(isSummary: boolean = false) {
    // set đơn giá phòng đơn, đơn giá phòng đôi
    this.estimatedCostGeneral.unitPriceDoubleHotel = this.dataDetail?.unitPriceDoubleHotel;
    this.estimatedCostGeneral.unitPriceSingleHotel = this.dataDetail?.unitPriceSingleHotel;
    this.estimatedCostGeneral.formGroupDetail.controls.crewTransportFeeFlag.setValue(this.dataDetail?.crewTransportFeeFlag);

    this.planFlightRatesData = [...this.dataDetail?.planFlightRates ?? []];
    // this._internationalFlightPeriodData = {
    //   planFlightPeriods: [...this.dataDetail?.planFlightPeriods ?? []],
    //   periodRowspan: (this.dataDetail?.listActype ?? []).length
    // }
    this.internationalFlightOvernightData = [...this.dataDetail?.planOverightRates ?? []];
    this.domesticEstimatedCostHotelData =
    {
      isSummary: isSummary,
      planHotels: [...this.dataDetail?.planBudgetHotels ?? []],
    }
      ;
    this.internationalEstimatedCostHotelData = {
      isSummary: isSummary,
      aircraftTypeRowspan: (this.dataDetail?.listActype ?? []).length,
      overnightRowspan: (this.dataDetail?.planOverightRates ?? []).length,
      planOverightRates: [...this.dataDetail?.planOverightRates ?? []],
      planFlightPeriods: [...this.dataDetail.planFlightPeriods ?? []],
      planHotels: [...this.dataDetail?.planBudgetHotels ?? []],
      general: this.estimatedCostGeneral.formGroupDetail.getRawValue()
    };
    this.domesticEstimatedCostCarRentalData = {
      isSummary: isSummary,
      planCarentals: [...this.dataDetail?.planBudgetCarentals ?? []]
    }
    this.internationalEstimatedCostCarRentalData = {
      isSummary: isSummary,
      planFlightPeriods: [...this.dataDetail.planFlightPeriods ?? []],
      planCarentals: [...this.dataDetail?.planBudgetCarentals ?? []]
    }
    // this.domesticBudgetWetLeaseData = [...this.dataDetail?.planBudgetWetLease ?? []];
    // this.domesticProcurementHotelData = [...this.dataDetail?.planProcurementHotels ?? []];
    // this.internationalProcurementHotelData = {
    //   aircraftTypeRowspan: (this.dataDetail?.listActype ?? []).length,
    //   overnightRowspan: (this.dataDetail?.planOverightRates ?? []).length,
    //   planOverightRates: [...this.dataDetail?.planOverightRates ?? []],
    //   planFlightPeriods: [...this.dataDetail.planFlightPeriods ?? []],
    //   planHotels: [...this.dataDetail?.planProcurementHotels ?? []],
    //   general: this.budgetProcurementGeneral.formGroupDetail.value
    // }
    // this.domesticProcurementCarRentalData = [...this.dataDetail?.planProcurementCarentals ?? []];
    // this.internationalProcurementCarRentalData = {
    //   planFlightPeriods: [...this.dataDetail.planFlightPeriods ?? []],
    //   planCarentals: [...this.dataDetail?.planProcurementCarentals ?? []]
    // }
    // this.domesticProcurementWetLeaseData = [...this.dataDetail?.planProcumentWetLease ?? []];
  }
  get planFlightRatesData() {
    return this._planFlightRatesData;
  }

  set planFlightRatesData(value: any[]) {
    this._planFlightRatesData = value;
  }

  get internationalFlightOvernightData() {
    return this._internationalFlightOvernightData
  }
  set internationalFlightOvernightData(value: any[]) {
    this._internationalFlightOvernightData = value;
  }

  get internationalEstimatedCostHotelData() {
    return this._internationalEstimatedCostHotelData;
  }

  set internationalEstimatedCostHotelData(value: any) {
    this._internationalEstimatedCostHotelData = value
  }

  get internationalEstimatedCostCarRentalData() {
    return this._internationalEstimatedCostCarRentalData;
  }

  set internationalEstimatedCostCarRentalData(value: any) {
    this._internationalEstimatedCostCarRentalData = value;
  }

  get domesticEstimatedCostHotelData() {
    return this._domesticEstimatedCostHotelData;
  }

  set domesticEstimatedCostHotelData(value: any) {
    this._domesticEstimatedCostHotelData = value;
  }

  get domesticEstimatedCostCarRentalData() {
    return this._domesticEstimatedCostCarRentalData;
  }

  set domesticEstimatedCostCarRentalData(value: any) {
    this._domesticEstimatedCostCarRentalData = value;
  }


  toggleDialogSummary() {
    this.showDialogSummary = !this.showDialogSummary;
  }

  checkStatusCompelted(): boolean {
    return this.dataDetail?.status === StatusSummaryEnum.COMPLETED;
  }

  toggleDialogClose() {
    this.showDialogClose = !this.showDialogClose;
  }

  closeEvent() {
    if (this.checkStatusCompelted()) {
      this.router.navigate(['/plan/est-plan/est-cost', this.estCostId(), 'summary']);
    } else {
      this.toggleDialogClose();
    }
  }


  async confirmClose() {
    try {
      await this.spinner.show()
      const resSave = await this.processSave();
      this.showSuccess(this.MESSAGE.UPDATE_SUCCESS)
      if (resSave.result) {
        this.router.navigate(['/plan/est-plan/est-cost', this.estCostId(), 'summary']);
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.spinner.hide()
    }

  }
}
