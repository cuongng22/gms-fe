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


  ngOnInit(): void {
    this.overnightChange.pipe(debounceTime(2000)).subscribe((data: any) => {
      if (data.control === 'numberOfOverNight') {
        if (this.invalid()) {
          return;
        }
      }
      const overnight = this.dataSource.data.find((item: any) => item.id === data.id) as any;
      if (overnight && !!overnight.numberOfOverNight && !!overnight.flightRate) {
        this.valueChange.emit({ ...overnight, actionType: 'edit', overnightLength: this.dataSource.data.length });
      }
    });
  }

  setDataSource(data: any[]) {
    this.dataSource.data = data;
  }

  add() {
    const addItem = {
      id: -Date.now(),
      numberOfOverNight: null,
      flightRate: null,
      actionType: 'add'
    }
    this.dataSource.data.push(addItem);
    this.dataSource.data = [...this.dataSource.data];
    // this.valueChange.emit({ id: addItem.id, type: 'add', overnightLength: this.dataSource.data.length });
  }

  edit(event: any, id: number, control?: string) {
    console.log(event);
    this.overnightChange.next({ id, value: event, control });
  }

  delete() {
    const id = (this.dataSource.data[this.indexDelete] as any).id;
    this.dataSource.data.splice(this.indexDelete, 1);
    this.dataSource.data = [...this.dataSource.data];
    this.toggleDialogDelete();
    this.valueChange.emit({ id, actionType: 'delete', overnightLength: this.dataSource.data.length });
  }

  invalid() {
    const unique = new Set();
    if (this.dataSource.data) {
      for (const item of this.dataSource.data) {
        const numberOfOverNight = (item as any).numberOfOverNight?.toString();
        if (unique.has(numberOfOverNight)) {
          return true;
        }
        unique.add(numberOfOverNight);
      }
    }
    return false;
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

}
