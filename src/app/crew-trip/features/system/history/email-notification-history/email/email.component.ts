import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatAnchor } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardModule } from '@angular/material/card';
import { MatDateRangeInput, MatDateRangePicker, MatDatepickerToggle, MatDatepickerCancel, MatDatepickerActions, MatDatepickerApply, MatDatepickerModule } from '@angular/material/datepicker';
import { MatLabel, MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatCell, MatCellDef, MatFooterRow, MatFooterRowDef, MatFooterCell, MatFooterCellDef } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NgxControlError } from 'ngxtension/control-error';
import { BaseService } from 'src/app/crew-trip/core/services/base-service';
import { EmailHistoryService } from 'src/app/crew-trip/core/services/email-history.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { SelectMultipleComponent } from 'src/app/crew-trip/shared/component/select-multiple/select-multiple.component';
import { DataCalculateTotal } from 'src/app/crew-trip/shared/data-calculate-total';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [
    FormsModule, InputSizeComponent, MatCard, MatCardContent, ReactiveFormsModule, MatDateRangeInput,
    MatDateRangePicker, MatLabel, MatFormFieldModule, MatDatepickerToggle,
    NgxTrimDirectiveModule, MatButton, MatDatepickerCancel, MatDatepickerActions,
    MatDatepickerApply, NgxControlError, NgxEditorModule, MatMenuModule,
    MatDatepickerModule, MatCardModule, MatAnchor, MatTable, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatCell, MatCellDef, MatFooterRow, MatFooterRowDef, MatFooterCell, MatFooterCellDef, DecimalPipe, DataCalculateTotal, SelectMultipleComponent, MatPaginator, RouterLink, DataTransformPipe,
    MatFormField, MatInputModule,
  ],
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss'
})
export class EmailComponent extends CommonComponent {
  override baseService: EmailHistoryService = inject(EmailHistoryService);
  override displayedColumns: string[] = ['stt', 'receiver', 'title', 'timeSend', 'status', 'action'];
  editor: Editor;
  override formGroupDetail = this.formBuilder.group({
    receiver: [],
    content: []
  });

  override ngOnInit(): void {
    this.editor = new Editor();
    this.search()
  }

  showDetail(id: any) {
    this.formGroupDetail.reset()
    this.formGroupDetail.disable();
    this.detail(id);
    this.toggleDialogCreate()
  }
}
