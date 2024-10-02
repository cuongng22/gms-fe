import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { CustomizerSettingsService } from "src/app/customizer-settings/customizer-settings.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToggleService } from "src/app/common/header/toggle.service";
import { BaseService } from "src/app/crew-trip/core/services/base-service";
import { FormGroup } from "@angular/forms";
import { Constant, MESSAGE } from "src/app/crew-trip/shared/utils/constant";
import { HttpStatusCode } from "@angular/common/http";
import { throwError } from 'rxjs';

@Component({
  selector: 'app-header-list-base',
  standalone: true,
  imports: [],
  templateUrl: './header-list-base.component.html',
  styleUrl: './header-list-base.component.scss',
})
export class HeaderListBaseComponent implements OnInit {
  Constant = Constant;
  MESSAGE = MESSAGE;
  spinner = inject(NgxSpinnerService);
  toggleService = inject(ToggleService);
  themeService = inject(CustomizerSettingsService);
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource();
  selection = new SelectionModel<any>(true, []);
  pageSize = Constant.PAGE_SIZE;
  pageIndex = Constant.PAGE;
  pageSizeOptions = [10, 50, 100]
  totalElement = 0;
  showFirstLastButtons = true;
  // isSidebarToggled
  isSidebarToggled = false;
  // isToggled
  isToggled = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  baseService = new BaseService();
  formGroup!: FormGroup;
  formGroupSearch!: FormGroup;
  formGroupDetail!: FormGroup;
  formGroupSearchInit: any = {};
  formGroupDetailInit: any = {};


  ngOnInit(): void {
  }


  constructor() {
    this.toggleService.isSidebarToggled$.subscribe(isSidebarToggled => {
      this.isSidebarToggled = isSidebarToggled;
    });
    this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  ngAfterViewInit() {
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.projectName + 1}`;
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize
    this.pageIndex = event.pageIndex
    this.search();
  }

  async search(body?: any) {
    try {
      await this.spinner.show();
      let res = await this.baseService.search({
        page: this.pageIndex,
        size: this.pageSize,
        ...body || this.formGroupSearch.value
      });
      console.log(res)
      if (res && res.status === HttpStatusCode.Ok) {
        this.dataSource.data = res.data.content;
        this.dataSource.data = this.dataSource.data.map((s: any) => ({
          ...s,
          isActiveLabel: (!!s.isActive || !!s.active) ? $localize`:@@active:Active` : $localize`:@@inactive:Inactive`
        }))
        this.totalElement = res.data.totalElements;
      }
    } catch (e) {
      console.log(e);
      // this.baseService.showError(MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async detail(id: any) {
    try {
      await this.spinner.show();
      let res = await this.baseService.detail(id);
      console.log(res)
      this.formGroupDetail.patchValue(res);
    } catch (e) {
      console.log(e);
    } finally {
      await this.spinner.hide();
    }
  }

  async save(data: any) {
    try {
      await this.spinner.show();
      let res;
      if (data.id || data.roleId) {
        res = await this.baseService.update(data);
      } else {
        res = await this.baseService.create(data);
      }
      console.log(res)
      await this.search();
      return res;
    } catch (e: any) {
      console.error(e);
      this.baseService.showError(MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async delete(id: any) {
    try {
      await this.spinner.show();
      let res = await this.baseService.delete(id);
      console.log(res)
      await this.search();
    } catch (e) {
      console.log(e);
      this.baseService.showError(MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  clear() {
    this.formGroup.reset();
  }

  // New Popup Trigger
  classApplied = false;

  toggleClass() {
    this.classApplied = !this.classApplied;
  }

  async showDetail(id?: any) {
    console.log(this.formGroupDetail.controls['roleName'])
    if (id) {
      await this.detail(id);
    }
    this.toggleClass();
  }

  async closeDetail() {
    this.formGroupDetail.reset(this.formGroupDetailInit);
    this.formGroupDetail.markAsUntouched();
    this.formGroupDetail.markAsPristine();
    this.formGroupDetail.updateValueAndValidity();

    this.toggleClass();
    console.log(this.formGroupDetail.value)
  }
}
