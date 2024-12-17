import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClickOutside } from 'ngxtension/click-outside';
import { debounceTime, Subject } from 'rxjs';
import { ShowMessageComponent } from 'src/app/crew-trip/shared/component/show-message/show-message.component';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';

@Component({
  selector: 'app-budget-procurement-flight-overnight',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside, MatButtonModule, DigitOnlyModule, MatCardModule, MatTooltipModule],
  templateUrl: './budget-procurement-flight-overnight.component.html',
  styleUrl: './budget-procurement-flight-overnight.component.scss'
})
export class BudgetProcurementFlightOvernightComponent extends ShowMessageComponent {
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ["numberOfOvernight", "flightRate", "action"];
  indexDelete = -1;
  showDialogDelete = false;
  valueChange = output<any>();
  overnightChange = new Subject<any>();
  private _invalid: any = {};


  ngOnInit(): void {
    this.overnightChange.pipe(debounceTime(2000)).subscribe((data: any) => {
      if (data.control === 'numberOfOverNight') {
        const isDuplicate = this.dataSource.data.some((item: any, index) => item.numberOfOverNight == data.value && item.id !== data.id);
        if (isDuplicate) {
          this._invalid[data.id] = true;
          console.log(document.getElementById(data.id.toString()));
          this.showError('Duplicate Number of Overnight Stays');
          return;
        } else {
          this._invalid[data.id] = false;
        }
      }
      this.valueChange.emit({ ...data, type: 'edit' });

    });
  }

  setDataSource(data: any[]) {
    this.dataSource.data = data;
  }

  add() {
    this.dataSource.data.push({
      numberOfOvernight: null,
      flightRate: null
    });
    this.dataSource.data = [...this.dataSource.data];
  }

  modelChange(event: any, id: number, control?: string) {
    console.log(event);
    this.overnightChange.next({ id, value: event, control });
  }

  clickEdit(data: any, control: string) {
    data[control] = true;
  }
  clickOutside(data: any, control: string) {
    data[control] = false;
  }
  toggleDialogDelete() {
    this.showDialogDelete = !this.showDialogDelete;
  }

  showConfirmDelete(index: number) {
    this.indexDelete = index;
    this.toggleDialogDelete();
  }

  delete() {
    const id = (this.dataSource.data[this.indexDelete] as any).id;
    this.dataSource.data.splice(this.indexDelete, 1);
    this.dataSource.data = [...this.dataSource.data];
    this.toggleDialogDelete();
    this.valueChange.emit({ id, type: 'delete', overnightLength: this.dataSource.data.length });
  }


  get invalid() {
    let result = false;
    Object.keys(this._invalid).forEach(key => {
      if (this._invalid[key]) {
        result = true;
        return;
      }
    });
    return result;
  }
}
