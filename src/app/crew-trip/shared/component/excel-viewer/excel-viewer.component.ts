// import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
// import * as wjcCore from '@grapecity/wijmo';
// import * as wjcXlsx from '@grapecity/wijmo.xlsx';
// import {CommonModule} from "@angular/common";
//
// @Component({
//   selector: 'app-excel-viewer',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './excel-viewer.component.html',
//   styleUrl: './excel-viewer.component.scss'
// })
// export class ExcelViewerComponent implements OnChanges {
//   @Input() file: File | Blob | null = null;
//
//   workbook: wjcXlsx.Workbook = new wjcXlsx.Workbook();
//   sheetIndex: number = 0;
//
//   constructor() {
//   }
//
//   ngOnInit(): void {
//   }
//
//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['file'] && this.file) {
//       this._loadWorkbook(this.file);
//     }
//   }
//
//   tabClicked(e: MouseEvent, index: number) {
//     e.preventDefault();
//     this._drawSheet(index);
//   }
//
//   private _loadWorkbook(file: File | Blob) {
//     let reader = new FileReader();
//     reader.onload = (e) => {
//       let workbook = new wjcXlsx.Workbook();
//       workbook.loadAsync(<string>reader.result, (result: wjcXlsx.Workbook) => {
//         this.workbook = result;
//         this._drawSheet(this.workbook.activeWorksheet || 0);
//       });
//     };
//     if (file) {
//       reader.readAsDataURL(file);
//     }
//   }
//
//   private _drawSheet(sheetIndex: number) {
//     let drawRoot = document.getElementById('tableHost');
//     if (drawRoot) {
//       drawRoot.textContent = '';
//       this.sheetIndex = sheetIndex;
//       this._drawWorksheet(this.workbook, sheetIndex, drawRoot, 200, 100);
//     }
//   }
//
//   private _drawWorksheet(workbook: wjcXlsx.IWorkbook, sheetIndex: number, rootElement: HTMLElement, maxRows: number, maxColumns: number) {
//     if (!workbook || !workbook.sheets || sheetIndex < 0 || workbook.sheets.length == 0) {
//       return;
//     }
//
//     sheetIndex = Math.min(sheetIndex, workbook.sheets.length - 1);
//     maxRows = maxRows || 200;
//     maxColumns = maxColumns || 100;
//
//     let sheet = workbook.sheets[sheetIndex],
//       defaultRowHeight = 20,
//       tableEl = document.createElement('table');
//
//     tableEl.className = 'table table-bordered';
//     tableEl.style.width = '100%'; // Set table to full width
//
//     let maxRowCells = 0;
//     for (let r = 5; sheet.rows && r < sheet.rows.length; r++) {
//       if (sheet.rows[r] && sheet.rows[r].cells) {
//         let cellLength = sheet?.rows[r]?.cells?.length;
//         if (cellLength != null) {
//           maxRowCells = Math.max(maxRowCells, cellLength);
//         }
//       }
//     }
//     let columns = sheet.columns || [],
//       invisColCnt = columns.filter(col => col.visible === false).length;
//
//     if (sheet.columns) {
//       maxRowCells = Math.min(Math.max(maxRowCells, columns.length), maxColumns);
//       for (let c = 0; c < maxRowCells; c++) {
//         let col = columns[c];
//         if (col && !col.visible) {
//           continue;
//         }
//         let colEl = document.createElement('col');
//         tableEl.appendChild(colEl);
//         colEl.style.width = (100 / maxRowCells) + '%'; // Set column width to be equal
//       }
//     }
//
//     let tbody = document.createElement('tbody');
//     tableEl.appendChild(tbody);
//
//     let rowCount = Math.min(maxRows, sheet.rows ? sheet.rows.length : 0);
//     for (let r = 5; sheet.rows && r < rowCount; r++) { // Start from row 6 (index 5)
//       let row = sheet.rows[r],
//         cellsCnt = 0;
//       if (row && row.cells && row.cells.every(cell => !cell.value)) {
//         continue;
//       }
//
//       let rowEl = document.createElement('tr');
//       tableEl.appendChild(rowEl);
//
//       if (row) {
//         this._importStyle(rowEl.style, row.style);
//         if (row.height != null) {
//           rowEl.style.height = row.height + 'px';
//         }
//
//         for (let c = 0; row.cells && c < row.cells.length; c++) {
//           let cell = row.cells[c],
//             cellEl = document.createElement('td'),
//             col = columns[c];
//           if (col && !col.visible) {
//             continue;
//           }
//           cellsCnt++;
//           rowEl.appendChild(cellEl);
//           if (cell) {
//             this._importStyle(cellEl.style, cell.style);
//             let value = cell.value;
//             if (!(value == null || value !== value)) {
//               if (wjcCore.isString(value) && value.charAt(0) == "'") {
//                 value = value.substr(1);
//               }
//               let netFormat = '';
//               if (cell.style && cell.style.format) {
//                 netFormat = wjcXlsx.Workbook.fromXlsxFormat(cell.style.format)[0];
//               }
//               let fmtValue = netFormat ? wjcCore.Globalize.format(value, netFormat) : value;
//               cellEl.innerHTML = wjcCore.escapeHtml(fmtValue);
//             }
//             if (cell.colSpan && cell.colSpan > 1) {
//               cellEl.colSpan = this._getVisColSpan(columns, c, cell.colSpan);
//               cellsCnt += cellEl.colSpan - 1;
//               c += cell.colSpan - 1;
//             }
//             if (cell.note) {
//               wjcCore.addClass(cellEl, 'cell-note');
//               cellEl.title = cell.note.text ? cell.note.text : '';
//             }
//           }
//         }
//       }
//       let padCellsCount = maxRowCells - cellsCnt - invisColCnt;
//       for (let i = 0; i < padCellsCount; i++) {
//         rowEl.appendChild(document.createElement('td'));
//       }
//
//       if (!rowEl.style.height) {
//         rowEl.style.height = defaultRowHeight + 'px';
//       }
//     }
//     rootElement.appendChild(tableEl);
//   }
//
//   private _getVisColSpan(columns: wjcXlsx.IWorkbookColumn[], startFrom: number, colSpan: number) {
//     let res = colSpan;
//     for (let i = startFrom; i < columns.length && i < startFrom + colSpan; i++) {
//       let col = columns[i];
//       if (col && !col.visible) {
//         res--;
//       }
//     }
//     return res;
//   }
//
//   private _importStyle(cssStyle: CSSStyleDeclaration, xlsxStyle?: wjcXlsx.IWorkbookStyle) {
//     if (!xlsxStyle) {
//       return;
//     }
//     if (xlsxStyle.fill) {
//       if (xlsxStyle.fill.color) {
//         cssStyle.backgroundColor = xlsxStyle.fill.color;
//       }
//     }
//     if (xlsxStyle.hAlign && xlsxStyle.hAlign != wjcXlsx.HAlign.Fill) {
//       cssStyle.textAlign = wjcXlsx.HAlign[xlsxStyle.hAlign].toLowerCase();
//     }
//     let font = xlsxStyle.font;
//     if (font) {
//       if (font.family) {
//         cssStyle.fontFamily = 'Arial';
//       }
//       if (font.bold) {
//         cssStyle.fontWeight = 'bold';
//       }
//       if (font.italic) {
//         cssStyle.fontStyle = 'normal';
//       }
//       if (font.size != null) {
//         cssStyle.fontSize = font.size + 'px';
//       }
//       if (font.underline) {
//         cssStyle.textDecoration = 'underline';
//       }
//       if (font.color) {
//         cssStyle.color = font.color;
//       }
//     }
//   }
//
//   onFileChange(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input?.files && input.files.length > 0) {
//       const file = input.files[0];
//       this._loadWorkbook(file);
//     }
//   }
// }
