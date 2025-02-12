import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as wjcCore from '@grapecity/wijmo';
import * as wjcXlsx from '@grapecity/wijmo.xlsx';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-excel-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './excel-viewer.component.html',
  styleUrl: './excel-viewer.component.scss'
})
export class ExcelViewerComponent implements OnChanges {
  @Input() file: File | Blob | null = null;

  workbook: wjcXlsx.Workbook = new wjcXlsx.Workbook();
  sheetIndex: number = 0;

  //
  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['file'] && this.file) {
      this._loadWorkbook(this.file);
    }
  }


  //
  tabClicked(e: MouseEvent, index: number) {
    e.preventDefault();
    this._drawSheet(index);
  }

  //
  _loadWorkbook(file: File | Blob) {
    let reader = new FileReader();
    //
    reader.onload = (e) => {
      let workbook = new wjcXlsx.Workbook();
      workbook.loadAsync(<string>reader.result, (result: wjcXlsx.Workbook) => {
        this.workbook = result;
        this._drawSheet(this.workbook.activeWorksheet || 0);
      });
    };
    //
    // let file = (<HTMLInputElement>document.getElementById('importFile')).files[0];
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  //
  private _drawSheet(sheetIndex: number) {
    let drawRoot = document.getElementById('tableHost');
    if (drawRoot) {
      drawRoot.textContent = '';
      this.sheetIndex = sheetIndex;
      this._drawWorksheet(this.workbook, sheetIndex, drawRoot, 200, 100);
    }
  }

  //
  private _drawWorksheet(workbook: wjcXlsx.IWorkbook, sheetIndex: number, rootElement: HTMLElement, maxRows: number, maxColumns: number) {
    //NOTES:
    //Empty cells' values are numeric NaN, format is "General"
    //
    //Excessive empty properties:
    //fill.color = undefined
    //
    // netFormat should return '' for ''. What is 'General'?
    // font.color should start with '#'?
    // Column/row styles are applied to each cell style, this is convenient, but Column/row style info should be kept,
    // for column/row level styling
    // formats conversion is incorrect - dates and virtually everything; netFormat - return array of formats?
    // ?row heights - see hello.xlsx
    if (!workbook || !workbook.sheets || sheetIndex < 0 || workbook.sheets.length == 0) {
      return;
    }
    //
    sheetIndex = Math.min(sheetIndex, workbook.sheets.length - 1);
    //
    if (maxRows == null) {
      maxRows = 200;
    }
    //
    if (maxColumns == null) {
      maxColumns = 100;
    }
    //
    // Namespace and XlsxConverter shortcuts.
    let sheet = workbook.sheets[sheetIndex],
      defaultRowHeight = 20,
      defaultColumnWidth = 60,
      tableEl = document.createElement('table');
    //
    // tableEl.border = '1';
    // tableEl.style.borderCollapse = 'collapse';
    tableEl.className = 'table table-bordered';
    //
    let maxRowCells = 0;
    for (let r = 0; sheet.rows && r < sheet.rows.length; r++) {
      if (sheet.rows[r] && sheet.rows[r].cells) {
        let cellLength = sheet.rows[r] && sheet.rows[r].cells ? sheet.rows[r].cells?.length : 0
        maxRowCells = Math.max(maxRowCells, cellLength ? cellLength : 0);
      }
    }
    //
    // add columns
    let columns = sheet.columns || [],
      invisColCnt = columns.filter(col => col.visible === false).length;

    if (sheet.columns) {
      maxRowCells = Math.min(Math.max(maxRowCells, columns.length), maxColumns);
      //
      for (let c = 0; c < maxRowCells; c++) {
        let col = columns[c];
        //
        if (col && !col.visible) {
          continue;
        }
        //
        let colEl = document.createElement('col');
        tableEl.appendChild(colEl);
        let colWidth = defaultColumnWidth + 'px';
        if (col) {
          this._importStyle(colEl.style, col.style);
          if (col.autoWidth) {
            colWidth = '';
          } else if (col.width != null) {
            colWidth = col.width + 'px';
          }
        }
        colEl.style.width = colWidth;
      }
    }
    let tbody = document.createElement('tbody');
    tableEl.appendChild(tbody);
    // generate rows
    let rowCount = Math.min(maxRows, sheet.rows ? sheet.rows.length : 0);
    for (let r = 0; sheet.rows && r < rowCount; r++) {
      let row = sheet.rows[r],
        cellsCnt = 0; // including colspan
      let colInvalid = row?.cells?.filter(cell => cell.value ? false : true).length;
      if (row && colInvalid && colInvalid > 0 && !row.visible) {
        continue;
      }
      //
      let rowEl = document.createElement('tr');
      tableEl.appendChild(rowEl);
      //
      if (row) {
        this._importStyle(rowEl.style, row.style);
        if (row.height != null) {
          rowEl.style.height = row.height + 'px';
        }
        //
        for (let c = 0; row.cells && c < row.cells.length; c++) {
          let cell = row.cells[c],
            cellEl = document.createElement('td'),
            col = columns[c];
          //
          if (col && !col.visible) {
            continue;
          }
          //
          cellsCnt++;
          //
          rowEl.appendChild(cellEl);
          if (cell) {
            this._importStyle(cellEl.style, cell.style);
            let value = cell.value;
            //
            if (!(value == null || value !== value)) { // TBD: check for NaN should be eliminated
              if (wjcCore.isString(value) && value.charAt(0) == "'") {
                value = value.substr(1);
              }
              let netFormat = '';
              if (cell.style && cell.style.format) {
                netFormat = wjcXlsx.Workbook.fromXlsxFormat(cell.style.format)[0];
              }
              let fmtValue = netFormat ? wjcCore.Globalize.format(value, netFormat) : value;
              cellEl.innerHTML = wjcCore.escapeHtml(fmtValue);
            }
            //
            if (cell.colSpan && cell.colSpan > 1) {
              cellEl.colSpan = this._getVisColSpan(columns, c, cell.colSpan);
              cellsCnt += cellEl.colSpan - 1;
              c += cell.colSpan - 1;
            }
            //
            if (cell.note) {
              wjcCore.addClass(cellEl, 'cell-note');
              cellEl.title = cell.note.text ? cell.note.text : '';
            }
          }
        }
      }
      //
      // pad with empty cells
      let padCellsCount = maxRowCells - cellsCnt - invisColCnt;
      for (let i = 0; i < padCellsCount; i++) {
        rowEl.appendChild(document.createElement('td'));
      }
      //
      if (!rowEl.style.height) {
        rowEl.style.height = defaultRowHeight + 'px';
      }
    }
    //
    // do it at the end for performance
    rootElement.appendChild(tableEl);
  }

  //
  private _getVisColSpan(columns: wjcXlsx.IWorkbookColumn[], startFrom: number, colSpan: number) {
    let res = colSpan;
    //
    for (let i = startFrom; i < columns.length && i < startFrom + colSpan; i++) {
      let col = columns[i];
      if (col && !col.visible) {
        res--;
      }
    }
    //
    return res;
  }

  //
  private _importStyle(cssStyle: CSSStyleDeclaration, xlsxStyle?: wjcXlsx.IWorkbookStyle) {
    if (!xlsxStyle) {
      return;
    }
    //
    if (xlsxStyle.fill) {
      if (xlsxStyle.fill.color) {
        cssStyle.backgroundColor = xlsxStyle.fill.color;
      }
    }
    //
    if (xlsxStyle.hAlign && xlsxStyle.hAlign != wjcXlsx.HAlign.Fill) {
      cssStyle.textAlign = wjcXlsx.HAlign[xlsxStyle.hAlign].toLowerCase();
    }
    //
    let font = xlsxStyle.font;
    if (font) {
      if (font.family) {
        cssStyle.fontFamily = 'Arial';
      }
      if (font.bold) {
        cssStyle.fontWeight = 'bold';
      }
      if (font.italic) {
        cssStyle.fontStyle = 'normal';
      }
      if (font.size != null) {
        cssStyle.fontSize = font.size + 'px';
      }
      if (font.underline) {
        cssStyle.textDecoration = 'underline';
      }
      if (font.color) {
        cssStyle.color = font.color;
      }
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file = input.files[0];
      this._loadWorkbook(file);
    }
  }
}
