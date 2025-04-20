import {CommonModule} from '@angular/common';
import {HttpStatusCode} from '@angular/common/http';
import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule, ValidationErrors, ValidatorFn,
  Validators,
} from '@angular/forms';
import {MatOption} from '@angular/material/autocomplete';
import {MatAnchor, MatButton} from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardTitle,
} from '@angular/material/card';
import {MatCheckbox} from '@angular/material/checkbox';
import {
  MatError,
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatListOption, MatSelectionList} from '@angular/material/list';
import {MatPaginator} from '@angular/material/paginator';
import {MatSelect} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {Editor, NgxEditorModule, Toolbar} from 'ngx-editor';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {EmailSupplierService} from 'src/app/crew-trip/core/services/email-supplier-service';
import {FlightMarketService} from 'src/app/crew-trip/core/services/flight-market.service';
import {CommonComponent} from 'src/app/crew-trip/shared/common.component';
import {SelectMultipleComponent} from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MESSAGE} from 'src/app/crew-trip/shared/utils/constant';
import {SanitizeService} from "src/app/crew-trip/core/services/sanitize.service";
import { HasPermissionDirective } from 'src/app/crew-trip/shared/directive/has-permission.directive';

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
    NgxEditorModule,
    SelectMultipleComponent,
    MatPaginator,
    MatAnchor,
    MatSelectionList,
    MatListOption, HasPermissionDirective
  ],
  templateUrl: './email-supplier.component.html',
  styleUrl: './email-supplier.component.scss',
  providers:[HasPermissionDirective]
})
export class EmailSupplierComponent
  extends CommonComponent
  implements OnInit, OnDestroy {
  override baseService = inject(EmailSupplierService);
  flightMarketService = inject(FlightMarketService);
  fb = inject(FormBuilder);
  editor: Editor;
  targetPersonals: any[] = [];
  isUpdatingValue = false;
  sanitizedContent: string = '';
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  isView = false;

  override formGroupSearch = this.fb.group({
    s: [''], //Keyword Search
    emailClass: [''],
    marketClass: [''],
    active: [''],
  });

  override formGroupDetail = this.fb.group({
    id: [''],
    content: ['', [Validators.required]],
    emailClass: ['', [Validators.required]],
    marketClass: ['', [Validators.required]],
    targetObject: [{value: '', disabled: true}],
    title: ['', [Validators.maxLength(250)]],
    note: ['', [Validators.maxLength(500)]],
    active: [true],
  });

  constructor(private sanitizeService: SanitizeService) {
    super();
    this.formGroupDetailInit = {...this.formGroupDetail.value};
  }

  override async ngOnInit() {
    super.ngOnInit();
    this.editor = new Editor();
    this.displayedColumns = [
      'stt',
      'emailClass',
      'marketClass',
      'targetPersonel',
      'title',
      'active',
      'action',
    ];
    this.search();
    this.targetPersonals = [
      {label: 'Flight crew', code: 'PILOT'},
      {label: 'Cabin crew', code: 'ATTENDANT'},
    ];

    this.formGroupDetail.get('emailClass')?.valueChanges.subscribe((value) => {
      return this.updateTargetObjectValidation(value);
    });
  }

  updateTargetObjectValidation(value?: string | null): void {
    const targetObjectControl = this.formGroupDetail.get('targetObject');
    if (value === 'INVOICE_CONFIRMATION' || value === 'INVOICE_REMINDER') {
      targetObjectControl?.clearValidators();
      targetObjectControl?.disable();
      targetObjectControl?.setValue('');
    } else {
      targetObjectControl?.setValidators([Validators.required]);
      targetObjectControl?.enable();
    }
    targetObjectControl?.updateValueAndValidity();
  }

  override async showDialogDetail(id?: any, type?: string) {
    this.isView = false;
    this.formGroupDetail.enable();
    if (id != null && type === 'index') {
    } else if (id != null) {
      await this.detail(id);
    }
    this.toggleDialogCreate();
  }

  async onViewDetail(id?: any) {
    if (id != null) {
      await this.detail(id);
      this.isView = true;
    }
    if (!this.formGroupDetail.disabled) {
      try {
        this.formGroupDetail.disable({emitEvent: false});
        // this.formGroupDetail.patchValue();
      } catch (error) {
        console.error('Error disabling form:', error);
      }
    }
    this.toggleDialogCreate();
  }

  // onEditorChange(value: string) {
  //   if (this.isUpdatingValue) {
  //     return;
  //   }
  //   const cleanedValue = this.cleanHtml(value);
  //   this.isUpdatingValue = true;
  //   this.formGroupDetail
  //     .get('content')
  //     ?.setValue(cleanedValue, {emitEvent: false});
  //   this.formGroupDetail.get('content')?.markAsTouched();
  //   this.formGroupDetail.get('content')?.updateValueAndValidity();
  //   this.isUpdatingValue = false;
  // }

  override async save() {
    try {
      if (this.formGroupDetail.get('content')?.value == '<p></p>') {
        this.formGroupDetail.get('content')?.setValue('');
        this.formGroupDetail.get('content')?.markAsTouched();
        this.formGroupDetail.get('content')?.updateValueAndValidity();
      }
      this.formGroupDetail.markAllAsTouched();
      if (this.formGroupDetail.invalid) {
        this.findInvalidControls(this.formGroupDetail);
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
      this.baseService.showSuccess(
        update ? MESSAGE.UPDATE_SUCCESS : MESSAGE.CREATE_SUCCESS,
      );
      await this.closeDetail();
      return res;
    } catch (e: any) {
      if (
        (e.status = HttpStatusCode.Conflict) &&
        !(
          e.status == HttpStatusCode.InternalServerError &&
          e.error?.error.includes('UNIQUE')
        )
      ) {
        this.baseService.showError(
          e.error?.data ?? e.error?.error ?? e.error ?? MESSAGE.ERROR,
        );
      }
      return e;
    } finally {
      await this.spinner.hide();
    }
  }

  onEditorChange(value: string) {
    if (!value || value === '<p></p>') {
      this.sanitizedContent = '';
    } else {
      const sanitizedValue = this.sanitizeService.sanitizeInput(value);
      console.log("sanitizedValuesanitizedValue:",sanitizedValue)
      if (sanitizedValue !== this.formGroupDetail.get('content')?.value) {
        this.sanitizedContent = sanitizedValue;
        this.formGroupDetail.get('content')?.setValue(this.sanitizedContent, { emitEvent: false });
        this.formGroupDetail.get('content')?.updateValueAndValidity({ onlySelf: true });
      }
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }


}
