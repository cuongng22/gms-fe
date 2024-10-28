import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit, model, DestroyRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { debounceTime, map, Observable, startWith, Subject } from 'rxjs';
import { FlightMarketService } from 'src/app/crew-trip/core/services/ flight-market.service';
import { AirplaneService } from 'src/app/crew-trip/core/services/airplane-service';
import { EstimatedAnnualProductionService } from 'src/app/crew-trip/core/services/estimated-annual-production';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';
import { InputSizeComponent } from 'src/app/crew-trip/shared/input/input-size.component';
import { EstAnnualProduction } from './est-annual-production.model';
import { Constant } from 'src/app/crew-trip/shared/utils/constant';

@Component({
  selector: 'app-est-annual-production',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule,
    MatFormField, MatInputModule, InputSizeComponent, MatDatepickerModule,
    MatNativeDateModule, NgxMaterialTimepickerModule, MatAutocompleteModule, CommonModule,
    MatTableModule, MatPaginatorModule, DataTransformPipe, RouterLink, RouterModule, AsyncPipe],
  templateUrl: './est-annual-production.component.html',
  styleUrl: './est-annual-production.component.scss'
})
export class EstAnnualProductionComponent extends CommonComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  override baseService = inject(EstimatedAnnualProductionService);
  private readonly flightMarketService = inject(FlightMarketService);
  private readonly airplaneService = inject(AirplaneService);

  formBuilder = inject(FormBuilder);

  @ViewChild('ori') ori: ElementRef<HTMLInputElement>;
  oriList: string[] = []; // danh sách chọn sân bay đi
  filteredOptionsOri = model<string[]>([]); // filterd Ori
  keySearchOri = new Subject<string>();

  @ViewChild('des') des: ElementRef<HTMLInputElement>;
  desList: string[] = []; // danh sách chọn sân bay đến
  filteredOptionsDes = model<string[]>([]); // filtered Des
  keySearchDes = new Subject<string>();

  fltMonthList: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // danh sách chọn tháng bay

  @ViewChild('acId') acId: ElementRef<HTMLInputElement>;
  acIdList: string[] = []; // danh sách chọn máy bay
  filteredOptionsAcId = model<string[]>([]); // filtered Des
  keySearchAcId = new Subject<string>();

  @ViewChild('acGroup') acGroup: ElementRef<HTMLInputElement>;
  acGroupList: string[] = []; // danh sách chọn nhóm máy bay
  filteredOptionsAcGroup = model<string[]>([]); // filtered Des
  keySearchAcGroup = new Subject<string>();

  @ViewChild('version') version: ElementRef<HTMLInputElement>;
  versionList: string[] = []; // danh sách chọn phiên bản
  filteredOptionsVersion = model<string[]>([]); // filtered Des
  keySearchVersion = new Subject<string>();

  // "id": "4332369",
  // "verType": "E",
  // "network": "DOM",
  // "route": "VKGSGN",
  // "routeId": 9059,
  // "route2w": "SGNVKG",
  // "ori": "VKG",
  // "des": "SGN",
  // "oriCountry": "VN",
  // "desCountry": "VN",
  // "verId": 2567,
  // "acId": "AT7",
  // "acGroup": "AT7",
  // "carrier": "0V",
  // "fltDate": "2025-01-01T00:00:00.000+00:00",
  // "fltMonth": 1,
  // "fltYear": 2025,
  // "bh": 14.08333333,
  // "fls": 13,
  // "rateBhFls": 1.083333333076923


  //   - ROUTE_ID
  // - ROUTE_2W
  // - ORI
  // - DES
  // - ORI_COUNTRY
  // - DES_COUNTRY
  // - VER_ID
  // - AC_ID
  // - AC_GROUP
  // - CARRIER
  // - FLT_DATE
  // - FLT_MONTH
  // - FLT_YEAR
  // - BH
  // - FLS
  // - BH/FLS
  _displayedColumns: { label: string; value: string, type?: string, format?: string }[] = [
    { label: $localize`:@@id:ID`, value: 'id' },
    { label: $localize`:@@network:NETWORK`, value: 'network' },
    { label: $localize`:@@routeId:ROUTE_ID`, value: 'routeId' },
    { label: $localize`:@@route:ROUTE`, value: 'route' },
    { label: $localize`:@@route2w:ROUTE_2W`, value: 'route2w' },
    { label: $localize`:@@ori:ORI`, value: 'ori' },
    { label: $localize`:@@des:DES`, value: 'des' },
    { label: $localize`:@@oriCountry:ORI_COUNTRY`, value: 'oriCountry' },
    { label: $localize`:@@desCountry:DES_COUNTRY`, value: 'desCountry' },
    { label: $localize`:@@verId:VER_ID`, value: 'verId' },
    { label: $localize`:@@acId:AC_ID`, value: 'acId' },
    { label: $localize`:@@acGroup:AC_GROUP`, value: 'acGroup' },
    { label: $localize`:@@carrier:CARRIER`, value: 'carrier' },
    { label: $localize`:@@fltDate:FLT_DATE`, value: 'fltDate', type: Constant.DATE, format: Constant.DATE_FORMAT },
    { label: $localize`:@@fltMonth:FLT_MONTH`, value: 'fltMonth' },
    { label: $localize`:@@fltYear:FLT_YEAR`, value: 'fltYear' },
    { label: $localize`:@@bh:BH`, value: 'bh' },
    { label: $localize`:@@fls:FLS`, value: 'fls' },
    { label: $localize`:@@rateBhFls:BH/FLS`, value: 'rateBhFls' },
  ];

  override formGroupSearch = this.formBuilder.group({
    s: new FormControl(''),
    ori: new FormControl(''),
    des: new FormControl(''),
    fltMonth: new FormControl(''),
    acId: new FormControl(''),
    acGroup: new FormControl(''),
    versionId: new FormControl(''),
    myControl: new FormControl('')
  });

  showDialogUpload: boolean = false;

  constructor() {
    super();
  }

  override ngOnInit() {
    this.flightMarketService.search<{ data: string[] }>({ option: 1 }).then((res) => {
      this.oriList = res.data;
      this.filteredOptionsOri.set(this.oriList);

      this.desList = res.data;
      this.filteredOptionsDes.set(this.desList);
    });

    this.airplaneService.listAirplanes('AC_TYPE').then((res) => {
      this.acIdList = res.data;
      this.filteredOptionsAcId.set(this.acIdList);
    });

    this.airplaneService.listAirplanes('AC_GROUP').then((res) => {
      this.acGroupList = res.data;
      this.filteredOptionsAcGroup.set(this.acGroupList);
    });

    this.baseService.getVersion(0).then((res) => {
      this.versionList = res.data;
      if (this.versionList.length > 0) {
        this.formGroupSearch.controls['versionId'].setValue(this.versionList[0]);
      }
      this.filteredOptionsVersion.set(this.versionList);
      this.search();
    });


    // --------------------handle valueChange for filterd-----------------
    this.keySearchOri.pipe(
      debounceTime(500),
      startWith(''))
      .subscribe(value => {
        console.log(value)
        if (!value) {
          this.filteredOptionsOri.set(this.oriList);
          return;
        }
        const filterValue = value.toLowerCase();
        this.filteredOptionsOri.set(this.oriList.filter(ori => ori.toLowerCase().includes(filterValue)));
      });

    this.keySearchDes.pipe(
      debounceTime(500),
      startWith(''))
      .subscribe(value => {
        if (!value) {
          this.filteredOptionsDes.set(this.desList);
          return;
        }
        const filterValue = value.toLowerCase();
        this.filteredOptionsDes.set(this.desList.filter(des => des.toLowerCase().includes(filterValue)));
      });

    this.keySearchAcId.pipe(
      debounceTime(500),
      startWith(''))
      .subscribe(value => {
        if (!value) {
          this.filteredOptionsAcId.set(this.acIdList);
          return;
        }
        const filterValue = value.toLowerCase();
        this.filteredOptionsAcId.set(this.acIdList.filter(acId => acId.toLowerCase().includes(filterValue)));
      });

    this.keySearchAcGroup.pipe(
      debounceTime(500),
      startWith(''))
      .subscribe(value => {
        if (!value) {
          this.filteredOptionsAcGroup.set(this.acGroupList);
          return;
        }
        const filterValue = value.toLowerCase();
        this.filteredOptionsAcGroup.set(this.acGroupList.filter(acGroup => acGroup.toLowerCase().includes(filterValue)));
      });

    this.keySearchVersion.pipe(
      debounceTime(500),
      startWith(''))
      .subscribe(value => {
        if (!value) {
          this.filteredOptionsVersion.set(this.versionList);
          return;
        }
        const filterValue = value.toLowerCase();
        this.filteredOptionsVersion.set(this.versionList.filter(version => version?.toString().toLowerCase().includes(filterValue)));
      });

    this.destroyRef.onDestroy(() => {
      this.keySearchOri.unsubscribe();
      this.keySearchDes.unsubscribe();
      this.keySearchAcId.unsubscribe();
      this.keySearchAcGroup.unsubscribe();
    });
    // --------------------------------------------------------

    // -----------------List Est Annual Production-------------

    this.displayedColumns = ['stt', ...this._displayedColumns.map(s => s.value)];

    // --------------------------------------------------------

  }

  override search(): any {
    super.search<EstAnnualProduction>({ ...this.formGroupSearch.value, option: 0, export: false, versionId: this.formGroupSearch.controls.versionId.value });
  }

  // ------------------------filter----------------------------
  filterOri(): void {
    this.keySearchOri.next(this.ori.nativeElement.value);
  }

  filterDes(): void {
    this.keySearchDes.next(this.des.nativeElement.value);
  }

  filterAcId(): void {
    this.keySearchAcId.next(this.acId.nativeElement.value);
  }

  filterAcGroup(): void {
    this.keySearchAcGroup.next(this.acGroup.nativeElement.value);
  }

  filterVersion(): void {
    this.keySearchVersion.next(this.version.nativeElement.value);
  }
  // --------------------------------------------------------


  toggleDialogUpload() {
    this.showDialogUpload = !this.showDialogUpload;
  }
}
