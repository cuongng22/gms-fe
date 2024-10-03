import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {CustomizerSettingsService} from "src/app/customizer-settings/customizer-settings.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToggleService} from "src/app/common/header/toggle.service";
import {BaseService} from "src/app/crew-trip/core/services/base-service";
import {FormGroup} from "@angular/forms";
import {Constant, MESSAGE} from "src/app/crew-trip/shared/utils/constant";
import {HttpStatusCode} from "@angular/common/http";

@Component({
  selector: 'app-common', standalone: true, imports: [], template: `

  `
})
export class CommonComponent implements OnInit {
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
  // New Popup Trigger
  showDialogCreate = false;
  showDialogDelete = false;

  constructor() {
    this.toggleService.isSidebarToggled$.subscribe(isSidebarToggled => {
      this.isSidebarToggled = isSidebarToggled;
    });
    this.themeService.isToggled$.subscribe(isToggled => {
      this.isToggled = isToggled;
    });
  }

  ngOnInit(): void {
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
        page: this.pageIndex, size: this.pageSize, ...body || this.formGroupSearch.value
      });
      console.log(res)
      if (res) {
        if (res.status === HttpStatusCode.Ok) {
          this.dataSource.data = res.data.content;
          this.dataSource.data = this.dataSource.data.map((s: any) => ({
            ...s,
            isActiveLabel: !!s.isActive ? $localize`:@@active:Active` : $localize`:@@inactive:Inactive`,
            activeLabel: !!s.active ? $localize`:@@active:Active` : $localize`:@@inactive:Inactive`
          }))
          this.totalElement = res.data.totalElements;
        }
        return res;
      }
    } catch (e: any) {
      console.log(e);
      this.baseService.showError((e.error?.error?.code) ?? MESSAGE.ERROR);
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
    } catch (e: any) {
      console.log(e);
      this.baseService.showError((e.error?.error?.code) ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async save() {
    try {
      this.formGroupDetail.markAllAsTouched();
      if (this.formGroupDetail.invalid) {
        return;
      }
      let update = !!this.formGroupDetail.value.id;
      await this.spinner.show();
      let res;
      if (update) {
        res = await this.baseService.update(this.formGroupDetail.value);
      } else {
        res = await this.baseService.create(this.formGroupDetail.value);
      }
      console.log(res)
      await this.search();
      this.baseService.showSuccess(update ? MESSAGE.UPDATE_SUCCESS : MESSAGE.CREATE_SUCCESS);
      await this.closeDetail();
      return res;
    } catch (e: any) {
      console.error(e);
      this.baseService.showError((e.error?.error?.code) ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }


  async delete() {
    try {
      await this.spinner.show();
      let res = await this.baseService.delete(this.formGroupDetail.value.id);
      console.log(res)
      this.baseService.showSuccess(MESSAGE.DELETE_SUCCESS);
      await this.search();
      await this.closeConfirmDelete();
      return res;
    } catch (e: any) {
      console.log(e);
      this.baseService.showError((e.error?.error?.code) ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  clear() {
    this.formGroup.reset();
  }

  toggleDialogCreate() {
    this.showDialogCreate = !this.showDialogCreate;
  }

  toggleDialogDelete() {
    this.showDialogDelete = !this.showDialogDelete;
  }

  async showDialogDetail(id?: any, type?: string) {
    if (id && type === 'index') {
      this.formGroupDetail.patchValue(this.dataSource.data[id] as JSON);
    } else if (id) {
      await this.detail(id);
    }
    this.toggleDialogCreate();
  }

  async closeDetail() {
    this.formGroupDetail.reset(this.formGroupDetailInit);
    this.formGroupDetail.markAsUntouched();
    this.formGroupDetail.markAsPristine();
    this.formGroupDetail.updateValueAndValidity();

    this.toggleDialogCreate();
    console.log(this.formGroupDetail.value)
  }

  async showConfirmDelete(id: any) {
    this.formGroupDetail.patchValue({id: id});
    this.toggleDialogDelete();
  }

  async closeConfirmDelete() {
    this.formGroupDetail.reset(this.formGroupDetailInit);
    this.formGroupDetail.markAsUntouched();
    this.formGroupDetail.markAsPristine();
    this.formGroupDetail.updateValueAndValidity();

    this.toggleDialogDelete();
    console.log(this.formGroupDetail.value)
  }
}
