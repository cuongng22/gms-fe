import { CommonModule } from '@angular/common';
import { Component, effect, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { ClickOutside } from 'ngxtension/click-outside';
import { Subject, debounceTime } from 'rxjs';
import { ShowMessageComponent } from 'src/app/crew-trip/shared/component/show-message/show-message.component';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { checkChange } from '../international-estimated-cost-hotel/international-estimated-cost-hotel.model';

@Component({
  selector: 'app-international-estimated-cost-overnight',
  standalone: true,
  imports: [
    MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside, MatButtonModule, DigitOnlyModule, MatCardModule, MatTooltipModule
  ],
  templateUrl: './international-estimated-cost-overnight.component.html',
  styleUrl: './international-estimated-cost-overnight.component.scss'
})
export class InternationalEstimatedCostOvernightComponent extends ShowMessageComponent {
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ["numberOfOvernight", "flightRate", "action"];
  indexDelete = -1;
  showDialogDelete = false;
  valueChange = output<any>();
  overnightChange = new Subject<any>();

  data = input<any>();
  disabled = input<boolean>(false);
  prevData: any[] = [];

  constructor() {
    super();
    effect(() => {
      console.log('effect data InternationalEstimatedCostOvernightComponent: ', this.data())
      if (this.data()) {
        this.setDataSource(this.data());
      }
    })
  }

  ngOnInit(): void {
    this.overnightChange.subscribe((data: any) => {
      if (this.invalid()) {
        return;
      }
      if (this.dataSource.data.some((item: any) => !item.numberOfOverNight || !item.flightRate)) {
        console.log('có 1 bản ghi bị null')
        return;
      }

      const overnight = this.dataSource.data.find((item: any) => item.id === data.id) as any;
      const prevOvernight = this.prevData.find((item: any) => item.id === data.id);
      if (overnight && !!overnight.numberOfOverNight && !!overnight.flightRate
        && (checkChange(overnight.numberOfOverNight, prevOvernight?.numberOfOverNight) || checkChange(overnight.flightRate, prevOvernight?.flightRate))) {
        this.prevData = JSON.parse(JSON.stringify([...this.dataSource.data]))
        this.valueChange.emit({ ...overnight, actionType: 'edit', overnightLength: this.dataSource.data.length });
      }
    });
  }

  setDataSource(data: any[]) {
    this.dataSource.data = [...data];
    this.prevData = JSON.parse(JSON.stringify([...data]))
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
    this.prevData = JSON.parse(JSON.stringify([...this.dataSource.data]))
  }

  edit(element: any) {
    this.overnightChange.next(element);
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
    this.edit(data);
  }
  toggleDialogDelete() {
    this.showDialogDelete = !this.showDialogDelete;
  }

  showConfirmDelete(index: number) {
    this.indexDelete = index;
    this.toggleDialogDelete();
  }


}
