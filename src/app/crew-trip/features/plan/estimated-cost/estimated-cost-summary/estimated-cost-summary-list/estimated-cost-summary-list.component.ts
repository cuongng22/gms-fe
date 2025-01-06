import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule, MatFormField } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { RouterLink, RouterModule } from "@angular/router";
import { PlanBudgetProcurementService } from "src/app/crew-trip/core/services/plan-budget-procurement.service";
import { CommonComponent } from "src/app/crew-trip/shared/common.component";
import { DataTransformPipe } from "src/app/crew-trip/shared/data-transform.pipe";
import { InputSizeComponent } from "src/app/crew-trip/shared/input/input-size.component";
import { ServiceType, PlanCategoryEnum } from "../../../budget-procurement/budget-procurement.model";
import { CategoriesEnum, StatusesSummary, StatusesSummaryEnum } from "../../estimated-cost.model";
import { getControlTotal, getDisplayedColumns, getDisplayedColumnTotals } from "./estimated-cost-summary-list.model";

@Component({
  selector: 'app-estimated-cost-summary-list',
  standalone: true,
  imports: [
    MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule, MatCheckboxModule,
    CommonModule, MatTableModule, DataTransformPipe, RouterLink, RouterModule, MatMenuModule
  ],
  templateUrl: './estimated-cost-summary-list.component.html',
  styleUrl: './estimated-cost-summary-list.component.scss'
})
export class EstimatedCostSummaryListComponent extends CommonComponent implements OnInit {
  readonly serviceType = ServiceType;
  PlanCategoryEnum = PlanCategoryEnum;
  StatusesSummary = StatusesSummary;
  StatusesSummaryEnum = StatusesSummaryEnum;
  CategoriesEnum = CategoriesEnum;

  categoryType = input<CategoriesEnum>(CategoriesEnum.ALL); //All,International,Domestic  loại quốc tế hay quốc nội
  planBudgetProcurementId = input<number>(); // id của kế hoạch

  displayedColumnTotals: string[] = [];

  override baseService = inject(PlanBudgetProcurementService);

  override ngOnInit(): void {
    this.setDisplayedColumns('');
    this.search();
  }

  setDisplayedColumns(type: string) {
    this.displayedColumns = getDisplayedColumns(type);
    this.displayedColumnTotals = getDisplayedColumnTotals(type);
  }

  override async search(bodySearch?: any) {
    try {
      this.spinner.show();
      this.setDisplayedColumns(bodySearch?.categoryOfPlan);
      const body = {
        planBudgetProcurementId: this.planBudgetProcurementId(),
        category: this.categoryType(),
        ...bodySearch
      }
      this.baseService.summarySearch(body).then((data: any) => {
        let firstHotelIndex = -1;
        let firstCarRentalIndex = -1;
        let lastHotelIndex = -1;
        let lastCarRentalIndex = -1;

        data.data.forEach((item: any, index: number) => {
          if (item.serviceType === this.serviceType.HOTEL) {
            lastHotelIndex = index;
            if (firstHotelIndex === -1) {
              firstHotelIndex = index;
            }
          } else if (item.serviceType === this.serviceType.CAR_RENTAL) {
            lastCarRentalIndex = index;
            if (firstCarRentalIndex === -1) {
              firstCarRentalIndex = index;
            }
          }
        });
        if (firstHotelIndex !== -1) {
          data.data[firstHotelIndex].isFirst = true;
        }
        if (firstCarRentalIndex !== -1) {
          data.data[firstCarRentalIndex].isFirst = true;
        }
        if (lastHotelIndex !== -1) {
          data.data[lastHotelIndex].isLast = true;
        }
        if (lastCarRentalIndex !== -1) {
          data.data[lastCarRentalIndex].isLast = true;
        }

        this.dataSource.data = data.data;
      })
    } finally {
      this.spinner.hide();
    }
  }

  getTotal(control: string, serviceType: string) {
    return this.dataSource.data.filter((t: any) => t.serviceType === serviceType)
      .map((t: any) => Number(t[getControlTotal(control, serviceType)])).reduce((acc, value) => acc + value, 0);
  }


  override toggleAllRows(serviceType?: string) {
    if (this.isAllSelected(serviceType)) {
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

  completed() {
    this.spinner.show();
    const selected = this.selection.selected;
    this.spinner.show();
    // this.baseService.completed(selected.map((item: any) => item.id)).then(() => {
    //   this.loadData();
    // }).finally(() => {
    //   this.spinner.hide();
    // })
  }

  async changeStatus(id: number, status: StatusesSummaryEnum) {
    try {
      await this.spinner.show();
      const res = await this.baseService.summaryUpdateStatus({ id: id, status: status });
      this.baseService.showSuccess(this.MESSAGE.UPDATE_SUCCESS);
      await this.search();
    } catch (e: any) {
      this.baseService.showError((e.error?.error) ?? (e.error?.error?.code) ?? this.MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  override async delete() {
    try {
      await this.spinner.show();
      const res = await this.baseService.summaryDelete(this.formGroupDetail.getRawValue().id);
      this.baseService.showSuccess(this.MESSAGE.DELETE_SUCCESS);
      await this.search();
      return res;
    } catch (e: any) {
      this.baseService.showError((e.error?.error) ?? (e.error?.error?.code) ?? this.MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
      await this.closeConfirmDelete();
    }
  }
}
