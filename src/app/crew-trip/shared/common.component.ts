import {Component, inject, OnInit, ViewChild, AfterViewInit, HostListener} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {CustomizerSettingsService} from 'src/app/customizer-settings/customizer-settings.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToggleService} from 'src/app/common/header/toggle.service';
import {BaseService} from 'src/app/crew-trip/core/services/base-service';
import {FormGroup} from '@angular/forms';
import {Constant, MESSAGE, removeNullValues} from 'src/app/crew-trip/shared/utils/constant';
import {HttpClient, HttpStatusCode} from '@angular/common/http';
import {saveAs} from 'file-saver';
import {UltilService} from 'src/app/crew-trip/core/services/ultil-service';
import {ListResponse} from './models/common.model';


@Component({
  selector: 'app-common', standalone: true, imports: [], template: ''
})
export class CommonComponent implements OnInit, AfterViewInit {
  Constant = Constant;
  MESSAGE = MESSAGE;
  spinner = inject(NgxSpinnerService);
  toggleService = inject(ToggleService);
  ultilService = inject(UltilService);
  themeService = inject(CustomizerSettingsService);
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource();
  selection = new SelectionModel<any>(true, []);
  pageSize = Constant.PAGE_SIZE;
  pageIndex = Constant.PAGE;
  pageSizeOptions = [10, 20, 50, 100];
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
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.search(null, true);
  }

  async search<T>(body?: any, isNextPage?: boolean) {
    try {
      await this.spinner.show();
      if (!isNextPage) {
        this.pageIndex = Constant.PAGE;
      }
      const res = await this.baseService.search<ListResponse<T>>({
        page: this.pageIndex,
        size: this.pageSize,
        limit: this.pageSize, ...removeNullValues(body) || removeNullValues(this.formGroupSearch.value)
      });
      if (res) {
        if (res.status === HttpStatusCode.Ok) {
          this.dataSource.data = res.data.content;
          this.dataSource.data = this.dataSource.data.map((s: any) => ({
            ...s,
            isActiveLabel: s.isActive === true || !!s.isActive ? MESSAGE.ACTIVE : MESSAGE.INACTIVE,
            activeLabel: s.active === true || !!s.active || s.status === true || !!s.status ? MESSAGE.ACTIVE : MESSAGE.INACTIVE
          }));
          this.totalElement = res.data.totalElements;
        }
        return res;
      }
    } catch (e: any) {
      this.baseService.showError(e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async detail(id: any) {
    try {
      await this.spinner.show();
      const res = await this.baseService.detail(id);
      this.formGroupDetail.patchValue(res?.data || res);
    } catch (e: any) {
      this.baseService.showError(e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR);
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
      const update = !!this.formGroupDetail.value.id;
      await this.spinner.show();
      let res;
      if (update) {
        res = await this.baseService.update(this.formGroupDetail.value);
      } else {
        res = await this.baseService.create(this.formGroupDetail.value);
      }
      await this.search();
      this.baseService.showSuccess(update ? MESSAGE.UPDATE_SUCCESS : MESSAGE.CREATE_SUCCESS);
      await this.closeDetail();
      return res;
    } catch (e: any) {
      this.baseService.showError(e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR);
      return e;
    } finally {
      await this.spinner.hide();
    }
  }


  async delete() {
    try {
      await this.spinner.show();
      const res = await this.baseService.delete(this.formGroupDetail.value.id);
      this.baseService.showSuccess(MESSAGE.DELETE_SUCCESS);
      await this.search();
      return res;
    } catch (e: any) {
      this.baseService.showError((e.error?.error) ?? (e.error?.error?.code) ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
      await this.closeConfirmDelete();
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
    if (id != null && type === 'index') {
      this.formGroupDetail.patchValue(this.dataSource.data[id] as JSON);
    } else if (id != null) {
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
  }

  downloadFile(blob: Blob, filename: string) {
    saveAs(blob, filename);
  }

  async exportFile(body?: any, filename?: string) {
    try {
      await this.spinner.show();
      const res = await this.baseService.exportData({...removeNullValues(body) || removeNullValues(this.formGroupSearch.value)});
      this.downloadFile(res.blob, filename ?? res.fileName);
    } catch (e: any) {
      this.baseService.showError((e.error?.error?.code) ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async exportFileOptions(body?: any, filename?: string, sourcePath?: string) {
    try {
      await this.spinner.show();
      this.formGroupSearch.patchValue({
        'export': true
      });
      const res = await this.baseService.exportDataOptions({...removeNullValues(body) || removeNullValues(this.formGroupSearch.value)}, sourcePath);
      this.downloadFile(res.blob, filename ?? res.fileName);
    } catch (e: any) {
      this.baseService.showError((e.error?.error?.code) ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  async downloadTemplate(filename?: string, body?: any, sourcePath?: string) {
    try {
      await this.spinner.show();
      const res = await this.baseService.exportData(body, sourcePath ?? 'download-template');
      this.downloadFile(res.blob, filename ?? res.fileName);
    } catch (e: any) {
      this.baseService.showError(e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  formattedNumber(value: number): string {
    return this.ultilService.formatNumber(value);
  }

  isSticky = false;
  configScrollY = 60;

  @HostListener('window:scroll', ['$event']) onScroll() {
    if (window.scrollY > this.configScrollY) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }
}
