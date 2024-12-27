import {Component, inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule,} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelect} from '@angular/material/select';
import {CommonModule, NgClass, NgIf} from '@angular/common';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {UsersService} from 'src/app/crew-trip/core/services/users-service';
import {InfoPlaneService} from 'src/app/crew-trip/core/services/InfoPlaneService.service';
import {MatMenuModule} from '@angular/material/menu';
import {MESSAGE} from 'src/app/crew-trip/shared/utils/constant';
import {HttpStatusCode} from '@angular/common/http';

@Component({
  selector: 'app-aircraft-data',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatSuffix, NgxTrimDirectiveModule, MatHint
  ],
  templateUrl: './aircraft-data.component.html',
  styleUrl: './aircraft-data.component.scss'
})
export class AircraftDataComponent extends CommonComponent implements OnInit {
  override baseService = inject(InfoPlaneService);
  usersService = inject(UsersService);
  fb = inject(FormBuilder);
  existCheck = false;


  constructor() {
    super();
    this.formGroupSearch = this.fb.group({
      s: ['',], active: ['',], area: ['',],
    });
    this.formGroupDetail = this.fb.group({
      id: ['',],
      acGroup: ['', [Validators.required, this.existValidator.bind(this), Validators.maxLength(5)]],
      acType: ['', [Validators.required, this.existValidator.bind(this), Validators.maxLength(5)]],
      note: ['', [Validators.maxLength(500)]],
      active: [true,]
    });
    this.formGroupSearchInit = {...this.formGroupSearch.value};
    this.formGroupDetailInit = {...this.formGroupDetail.value};
  }

  override async ngOnInit() {
    this.displayedColumns = ['stt', 'acgroup', 'actype', 'note', 'active', 'action'];
    await Promise.all([this.search(),]).then(() => {
    });
  }

  override async showDialogDetail(id?: any, type?: string) {
    if (id != null && type === 'index') {
      this.formGroupDetail.patchValue(this.dataSource.data[id] as JSON);
    } else if (id != null) {
      await this.detail(id);
    }
    this.toggleDialogCreate();
  }

  override async showConfirmDelete(id: any, actype?: any) {
    this.formGroupDetail.patchValue({
      id: id,
      acType: actype
    });
    this.toggleDialogDelete();
  }

  override async delete() {
    try {
      await this.spinner.show();
      const res = await this.baseService.delete(this.formGroupDetail.getRawValue().id);
      this.baseService.showSuccess(MESSAGE.UPDATE_SUCCESS);
      await this.search();
      return res;
    } catch (e: any) {
      this.baseService.showError((e.error?.error) ?? (e.error?.error?.code) ?? MESSAGE.ERROR);
    } finally {
      await this.spinner.hide();
      await this.closeConfirmDelete();
    }
  }


  override async save(): Promise<any> {
    super.save().then(value => {
      if (value.status == HttpStatusCode.Conflict) {
        this.existCheck = true;
        this.formGroupDetail.controls['acGroup'].updateValueAndValidity();
        this.formGroupDetail.controls['acType'].updateValueAndValidity();
        this.existCheck = false;
      }
    });
  }

  existValidator(control: AbstractControl): ValidationErrors | null {
    return this.existCheck ? {existCheck: true} : null;
  }
}
