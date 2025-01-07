import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, inject, input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule, MatExpansionPanelContent } from '@angular/material/expansion';
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

@Component({
  selector: 'app-estimated-cost-summary-detail',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule,
    MatExpansionModule, MatExpansionPanelContent, EstimatedCostGeneralComponent
  ],
  templateUrl: './estimated-cost-summary-detail.component.html',
  styleUrl: './estimated-cost-summary-detail.component.scss',
  providers: [DataTransformPipe]
})
export class EstimatedCostSummaryDetailComponent extends CommonComponent implements OnInit, AfterViewChecked, AfterViewInit {

  dataTransformPipe = inject(DataTransformPipe);
  override baseService = inject(PlanBudgetProcurementService);

  id = input.required<number>();
  estimatedCostId = input<number>(0, { alias: 'estimated-cost-id' });
  yearPlan = input<number>(0, { alias: 'year-plan' });
  airportCode = input<string>('', { alias: 'airport-code' });
  planType = input<PlanCategoryEnum | null>(null, { alias: 'plan-type' });
  category = input.required<CategoryEnum>();

  CategoryEnum = CategoryEnum;
  PlanCategoryEnum = PlanCategoryEnum;

  dataDetail: any;
  showDialogSummary = false;

  ngAfterViewChecked(): void {
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
}
