import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CommonModule, NgClass, NgIf, TitleCasePipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {DataTransformPipe} from 'src/app/crew-trip/shared/data-transform.pipe';
import {MatError, MatFormField, MatHint, MatLabel, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {InputSizeComponent} from 'src/app/crew-trip/shared/input/input-size.component';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {RoleFunctionComponent} from 'src/app/crew-trip/features/roles/role-function/role-function.component';
import {NoDataRowOutlet} from '@angular/cdk/table';
import {ContractDetailComponent} from 'src/app/crew-trip/features/contract/contract-detail/contract-detail.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {InvoiceFormComponent} from "src/app/crew-trip/features/invoice/form/invoice-form.component";
import {
  InvoiceFormDetailComponent
} from "src/app/crew-trip/features/invoice/form/form-detail/invoice-form-detail.component";
import {InvoiceDocumentDetailComponent} from "src/app/crew-trip/features/invoice/document/document-detail/invoice-document-detail.component";
import {InvoiceDocumentReviewComponent} from "src/app/crew-trip/features/invoice/document/document-detail/invoice-document-review.component";
import {InvoiceDocumentComponent} from "src/app/crew-trip/features/invoice/document/invoice-document.component";
import {
  InvoiceDocumentRemindComponent
} from "src/app/crew-trip/features/invoice/document/invoice-document-remind.component";


@Component({
  selector: 'app-invoice-document-tab',
  standalone: true,
  imports: [RouterLink, CommonModule, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule, TitleCasePipe, DataTransformPipe, NgClass, MatFormField, MatSelect, MatOption, MatInput, MatLabel, ReactiveFormsModule, InputSizeComponent, MatError, MatPrefix, MatSuffix, MatTab, MatTabGroup, RoleFunctionComponent, NoDataRowOutlet, ContractDetailComponent, MatDatepickerModule, MatHint, InvoiceFormComponent, InvoiceFormDetailComponent, InvoiceDocumentDetailComponent, InvoiceDocumentDetailComponent, InvoiceDocumentReviewComponent, InvoiceDocumentComponent, InvoiceDocumentRemindComponent],
  templateUrl: './invoice-document-tab.component.html',
  styleUrl: './invoice-document-tab.component.scss',
})


export class InvoiceDocumentTabComponent implements OnInit {
  tabType = 'INVOICE';
  step = 1;
  id: any;
  readMode: any;

  constructor() {
  }

  async ngOnInit() {

  }

  onTabChange($event: any) {
    if ($event.index === 0) {
      this.tabType = 'INVOICE';
    } else {
      this.tabType = 'REMINDER';
    }
  }

  nextStepEmit($event: any) {
    this.step = $event[2];;
    this.id = $event[0];
    this.readMode = $event[1];
  }

  backStepEmit($event: any) {
    this.step = 1;
    this.tabType = 'INVOICE';
  }
}
