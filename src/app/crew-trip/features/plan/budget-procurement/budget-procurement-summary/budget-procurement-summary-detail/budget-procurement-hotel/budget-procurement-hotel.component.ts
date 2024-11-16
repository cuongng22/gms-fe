import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ClickOutside } from 'ngxtension/click-outside';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { Constant } from 'src/app/crew-trip/shared/utils/constant';
import { After } from 'v8';
import { contractData, exampleData, formula, getGeaderRowDef1, getGeaderRowDef2, getRowDef, rawData } from './budget-procurement-hotel.model';
import { co } from 'node_modules/@fullcalendar/core/internal-common';

@Component({
  selector: 'app-budget-procurement-hotel',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatFormFieldModule, MatFormField, MatInputModule, InputSizeComponent,
    FormsModule, ReactiveFormsModule, ClickOutside, MatButtonModule, DataTransformPipe],
  templateUrl: './budget-procurement-hotel.component.html',
  styleUrl: './budget-procurement-hotel.component.scss',
  providers: [DatePipe, DataTransformPipe]
})
export class BudgetProcurementHotelComponent implements OnInit, AfterViewChecked {

  dataSource = new MatTableDataSource();
  periodRowspan = 0;
  aircraftTypeRowspan = 0;
  periods: string[] = [];
  aircraftTypes: string[] = [];

  contractData = contractData;

  headerRowDef1: string[] = [];
  headerRowDef2: string[] = [];
  rowDef: string[] = [];



  constructor(private datePipe: DatePipe, private cdRef: ChangeDetectorRef) { }
  ngAfterViewChecked(): void {
    this.cdRef.detectChanges(); // Phát hiện và cập nhật các thay đổi
  }

  ngOnInit(): void {


    this.headerRowDef1 = getGeaderRowDef1(contractData);
    this.headerRowDef2 = getGeaderRowDef2(contractData);
    this.rowDef = getRowDef(contractData);

    // for (let j = 0; j < 13; j++) {
    //   for (let i = 0; i < 4; i++) {
    //     let data = JSON.parse(JSON.stringify(rawData));
    //     if (j > 0) {
    //       data.periodStart = new Date(new Date(data.periodStart).setMonth(new Date(data.periodStart).getMonth() + j));
    //     } else {
    //       data.periodStart = new Date(data.periodStart);
    //     }
    //     if (i % 2 === 0) {
    //       data.overnight = 1
    //     } else {
    //       data.overnight = 2
    //     }

    //     if (i < 2) {
    //       data.aircraftType = 'B787';
    //     } else {
    //       data.aircraftType = 'A321';
    //     }
    //     this.dataSource.data.push(data);
    //   }
    // }
    // console.log(JSON.stringify(this.dataSource.data));
    this.dataSource.data = exampleData;


    this.aircraftTypeRowspan = this.dataSource.data.map((item: any) => item.aircraftType).filter((value: any, index: any, self: any) => self.indexOf(value) === index).length;
    const overnightRowspan = this.dataSource.data.map((item: any) => item.overnight).filter((value: any, index: any, self: any) => self.indexOf(value) === index).length;
    this.periodRowspan = overnightRowspan * this.aircraftTypeRowspan;

    this.dataSource.data.forEach((item: any, index) => {
      const period = `Tháng ${this.datePipe.transform(item.periodStart, Constant.MONTH_FORMAT)}`;
      if (!this.periods.includes(period)) {
        this.periods.push(period);
        item.period = period;
        item.aircraftTypeLabel = item.aircraftType;
      }
      if (!this.aircraftTypes.includes(`${period}_${item.aircraftType}`)) {
        this.aircraftTypes.push(`${period}_${item.aircraftType}`)
        item.aircraftTypeLabel = item.aircraftType;
      }

      //Số phòng đơn
      this.calculate(index, 'singleRoom');
      //Số phòng đôi
      this.calculate(index, 'doubleRoom');
      //Số phòng đơn dự phòng do lẻ nam nữ
      this.calculate(index, 'singleRoomReserved');
      //Số phòng đơn early-checkin dự kiến
      this.calculate(index, 'singleRoomEarly');
      //Số phòng đôi early-checkin dự kiến
      this.calculate(index, 'doubleRoomEarly');
      //Số phòng đơn early-checkin dự kiến do lẻ nam nữ
      this.calculate(index, 'singleRoomEarlyReserved');
      //Số phòng đơn late checkout dự kiến
      this.calculate(index, 'singleRoomLate');
      //Số phòng đôi late checkout dự kiến
      this.calculate(index, 'doubleRoomLate');
      //Số phòng đơn late checkout dự kiến do lẻ nam nữ
      this.calculate(index, 'singleRoomLateReserved');
      //Thành tiền ngoại tệ, - phòng đơn 
      this.calculate(index, 'totalAmountForeignSingleRoom');
      //Thành tiền ngoại tệ,  - phòng đôi
      this.calculate(index, 'totalAmountForeignDoubleRoom');
      if (contractData.earlyCheckinFeeFlag) {
        //Thành tiền ngoại tệ,  - phòng early-checkin
        this.calculate(index, 'totalAmountForeignEarly');
      }
      if (contractData.lateCheckoutFeeFlag) {
        //Thành tiền ngoại tệ, - phòng late checkout
        this.calculate(index, 'totalAmountForeignLate');
      }
      //Tổng tiền xe chở tổ bay (ngoại tệ)
      this.calculate(index, 'totalAmountForeignTransport');
      //Tổng tiền theo loại máy bay
      this.calculate(index, 'totalAmountAircraft');
      // Tổng tiền ngoại tệ
      this.calculate(index, 'totalAmountForeign');
      //Tổng tiền VND - bao gồm VAT
      this.calculate(index, 'totalAmountVat');
      //Tổng tiền VND - chưa bao gồm VAT
      this.calculate(index, 'totalAmount');
    });

    // Tính toán dòng tổng rowspan
    this.dataSource.data.forEach((item: any, index) => {
      this.getTotalByGroup(index, 'totalAmountForeignTransport', 'totalAmountForeignTransportGroup');
      this.getTotalByGroup(index, 'totalAmountForeign', 'totalAmountForeignGroup');
      this.getTotalByGroup(index, 'totalAmount', 'totalAmountGroup');
      this.getTotalByGroup(index, 'totalAmountVat', 'totalAmountVatGroup');
    });
  }


  clickEdit(data: any, control: string) {
    data[control] = true;
  }
  clickOutside(data: any, control: string) {
    data[control] = false;
  }

  // TÍnh dòng tổng 
  getTotal(control: string) {
    return Math.round(this.dataSource.data.map((t: any) => Number(t[control])).reduce((acc, value) => acc + value, 0));
  }

  // hàm công thức tính chung
  calculate(index: number, key: string) {
    let data: any = this.dataSource.data[index];
    data[key] = this.calculateFormula(data, formula[key].formula);
    const groupFormula = formula[key].groupFormula;
    return data[key];
  }

  // hàm tính tổng theo group (rowspan)
  getTotalByGroup(index: number, key: string, control: string) {
    let data: any = this.dataSource.data[index];
    const filterData = this.dataSource.data.filter((item: any) => this.groupFormula(item, data, formula[key].groupFormula));
    data[control] = filterData.map((t: any) => t[key]).reduce((acc, value) => acc + value, 0);
  }

  // Hàm tính toán dựa trên công thức động
  calculateFormula(data: any, formula: string): number {
    // Sử dụng Function để tạo hàm động từ công thức
    const dynamicFunction = new Function(
      'data',   // Truyền tên các biến trong data
      `return ${formula};`    // Công thức cần tính
    );
    return Math.round(dynamicFunction(data));
  }

  // hàm filter theo group
  groupFormula(dataSource: any, dataTarget: any, formula: string): any {
    let formulaArr = formula.split(' ').map((item: string) => item.trim());
    if (formulaArr.length > 0) {
      formulaArr.forEach((item: string, index: number) => {
        if (!(item.includes('&&') || item.includes('||'))) {
          formulaArr[index] = `dataSource.${item} === dataTarget.${item}`;
        }
      });
      formula = formulaArr.join(' ');
      const dynamicFunction = new Function(
        'dataSource', 'dataTarget',
        `return ${formula};`
      );
      const calFormular = dynamicFunction(dataSource, dataTarget);
      return calFormular;
    }
    return false
  }
}
