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
import { RouterLink, RouterModule } from '@angular/router';
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

@Component({
  selector: 'app-estimated-cost-summary-detail',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule,
    MatExpansionModule, MatExpansionPanelContent,
    EstimatedCostGeneralComponent, InternationalEstimatedCostOvernightComponent, DomesticEstimatedCostFlightRateComponent,
    InternationalEstimatedCostHotelComponent, InternationalEstimatedCostCarRentalComponent
  ],
  templateUrl: './estimated-cost-summary-detail.component.html',
  styleUrl: './estimated-cost-summary-detail.component.scss',
  providers: [DataTransformPipe]
})
export class EstimatedCostSummaryDetailComponent extends CommonComponent implements OnInit, AfterViewChecked, AfterViewInit {

  dataTransformPipe = inject(DataTransformPipe);
  override baseService = inject(PlanBudgetProcurementService);
  private datePipe = inject(DatePipe);
  private cdRef = inject(ChangeDetectorRef);


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

  private _internationalFlightOvernightData: any[] = [];
  private _internationalEstimatedCostHotelData: any[] = [];
  private _internationalEstimatedCostCarRentalData: any[] = [];

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
      this.setPanelState();
    } catch (error) {
      console.error('getDetailSummary error: ', error);
    } finally {
      this.spinner.hide();
    }
  }

  summaryData() {

  }

  completed() {
    this.baseService.summaryUpdateStatus({ id: this.id(), status: StatusSummaryEnum.COMPLETED }).then(() => {
      this.baseService.showSuccess(this.MESSAGE.UPDATE_SUCCESS);
      // this.getDetailSummary();
    });
  }

  formGeneralValueChanges(event: any): void {
    if (this.category() === CategoryEnum.INTERNATIONAL) {
      // this.internationalBudgetHotel.setGeneralData(event);
    }
  }

  checkStatusCompelted(): boolean {
    return this.dataDetail?.status === StatusSummaryEnum.COMPLETED;
  }

  overnightValueChange(event: any): void {
    console.log('overnightValueChange: ', event);
    // this.internationalBudgetHotel.setOvernightRates(event, event.actionType, event.overnightLength, this.internationalFlightOvernight.dataSource.data);
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

  set internationalEstimatedCostHotelData(value: any[]) {
    this._internationalEstimatedCostHotelData = value
  }

  get internationalEstimatedCostCarRentalData() {
    return this._internationalEstimatedCostCarRentalData;
  }

  set internationalEstimatedCostCarRentalData(value: any) {
    this._internationalEstimatedCostCarRentalData = value;
  }
}
