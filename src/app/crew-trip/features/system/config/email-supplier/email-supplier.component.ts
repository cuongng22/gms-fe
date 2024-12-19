import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputSizeComponent} from "src/app/crew-trip/shared/input/input-size.component";
import {
  MatOption
} from "@angular/material/autocomplete";
import {MatAnchor, MatButton, } from "@angular/material/button";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardTitle
} from "@angular/material/card";
import {MatError, MatFormField, MatFormFieldModule, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatSelect, MatSelectModule} from "@angular/material/select";
import {CommonModule, NgClass, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {
 MatTableModule
} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {CommonComponent} from "src/app/crew-trip/shared/common.component";
import {FlightMarketService} from "src/app/crew-trip/core/services/ flight-market.service";
import {EmailSupplierService} from "src/app/crew-trip/core/services/email-supplier-service";
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {Editor, NgxEditorModule, Toolbar} from "ngx-editor";
import {SelectMultipleComponent} from "src/app/crew-trip/shared/component/select-multiple/select-multiple.component";
import {HttpStatusCode} from "@angular/common/http";
import {MESSAGE} from "src/app/crew-trip/shared/utils/constant";
@Component({
  selector: 'app-email-supplier',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputSizeComponent,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatError,
    MatFormField,
    MatInput,
    MatCardModule,
    MatLabel,
    MatOption,
    MatSelect,
    MatTableModule,
    NgxTrimDirectiveModule,
    ReactiveFormsModule,
    MatCheckbox,
    MatFormFieldModule,
    MatInputModule,
    NgxEditorModule, SelectMultipleComponent, MatPaginator, MatAnchor],
  templateUrl: './email-supplier.component.html',
  styleUrl: './email-supplier.component.scss'
})
export class EmailSupplierComponent extends CommonComponent implements OnInit , OnDestroy{
  override baseService = inject(EmailSupplierService);
  flightMarketService = inject(FlightMarketService);
  fb = inject(FormBuilder);
  editor: Editor;
  targetPersonals: any[] = [];
  isUpdatingValue = false;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  override formGroupSearch = this.fb.group({
    s: [''], //Keyword Search
    emailClass: [''],
    marketClass: [''],
    active: [''],
  });

  override formGroupDetail = this.fb.group({
    id: ['',],
    content: ['', [Validators.required]],
    emailClass: ['', [Validators.required]],
    marketClass: ['', [Validators.required]],
    targetObject: [{ value: '', disabled: true }],
    title: ['',[Validators.maxLength(250)]],
    note: ['',[Validators.maxLength(500)]],
    active: [true,]
  });
  constructor() {
    super();
  }

  override async ngOnInit() {
    super.ngOnInit();
    this.editor = new Editor();
    this.displayedColumns = ['stt', 'emailClass', 'marketClass','targetPersonel','title','active','action'];
    this.search();
    this.targetPersonals = [{label:'Pilot',code:'PILOT'},{label:'Attandant',code:'ATTANDANT'}];

    this.formGroupDetail.get('emailClass')?.valueChanges.subscribe(value => {
      // @ts-ignore
      return this.updateTargetObjectValidation(value);
    });
  }

  updateTargetObjectValidation(value?: string): void {
    const targetObjectControl = this.formGroupDetail.get('targetObject');
    if (value === 'INVOICE_CONFIRMATION') {
      targetObjectControl?.clearValidators();
      targetObjectControl?.disable();
    } else {
      targetObjectControl?.setValidators([Validators.required]);
      targetObjectControl?.enable();
    }
    targetObjectControl?.updateValueAndValidity();
  }


  override async showDialogDetail(id?: any, type?: string) {
    this.formGroupDetail.enable();
    if (id != null && type === 'index') {
    } else if (id != null) {
      await this.detail(id);
    }
    this.toggleDialogCreate();
  }

  async onViewDetail(id?:any) {
    if (id != null) {
      await this.detail(id);
    }
    if (!this.formGroupDetail.disabled) {
      try {
        this.formGroupDetail.disable({ emitEvent: false });
      } catch (error) {
        console.error('Error disabling form:', error);
      }
    }
    this.toggleDialogCreate();
  }

  onEditorChange(value: string) {
    if (this.isUpdatingValue) {
      return; // Ngừng xử lý sự kiện nếu đang trong quá trình cập nhật giá trị
    }
    const cleanedValue = this.cleanHtml(value);
    this.isUpdatingValue = true;
    this.formGroupDetail.get('content')?.setValue(cleanedValue, { emitEvent: false });
    this.formGroupDetail.get('content')?.markAsTouched();
    this.formGroupDetail.get('content')?.updateValueAndValidity();
    this.isUpdatingValue = false;
  }

 override async save() {
    try {
      if(this.formGroupDetail.get('content')?.value == '<p></p>'){
        this.formGroupDetail.get('content')?.setValue("");
        this.formGroupDetail.get('content')?.markAsTouched();
        this.formGroupDetail.get('content')?.updateValueAndValidity();
      }
      this.formGroupDetail.markAllAsTouched();
      if (this.formGroupDetail.invalid) {
        this.findInvalidControls(this.formGroupDetail)
        return;
      }
      const update = !!this.formGroupDetail.getRawValue().id;
      await this.spinner.show();
      let res;
      if (update) {
        res = await this.baseService.update(this.formGroupDetail.getRawValue());
      } else {
        res = await this.baseService.create(this.formGroupDetail.getRawValue());
      }
      await this.search();
      this.baseService.showSuccess(update ? MESSAGE.UPDATE_SUCCESS : MESSAGE.CREATE_SUCCESS);
      await this.closeDetail();
      return res;
    } catch (e: any) {
      if ((e.status != HttpStatusCode.Conflict) && !(e.status == HttpStatusCode.InternalServerError && e.error?.error.includes('UNIQUE'))) {
        this.baseService.showError(e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR);
      }
      return e;
    } finally {
      await this.spinner.hide();
    }
  }

  cleanHtml(value: string): string {
    if (!value || value === '<p></p>') {
      return '';
    }
    return value;
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
