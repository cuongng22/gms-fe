import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgIf } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-my-tasks',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule],
    templateUrl: './my-tasks.component.html',
    styleUrl: './my-tasks.component.scss'
})
export class MyTasksComponent {

    displayedColumns: string[] = ['select', 'projectName', 'deadline', 'status'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    selection = new SelectionModel<PeriodicElement>(true, []);

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.dataSource.data);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: PeriodicElement): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.projectName + 1}`;
    }

	// isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

}

export interface PeriodicElement {
    projectName: string;
    deadline: string;
    status: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        projectName: 'Web Development',
        deadline: '10 Jan 2024',
        status: {
            completed: true,
            inProgress: false,
            pending: false,
            cancelled: false
        }
    },
    {
        projectName: 'UX/UI Design',
        deadline: '05 Feb 2024',
        status: {
            completed: false,
            inProgress: true,
            pending: false,
            cancelled: false
        }
    },
    {
        projectName: 'React Development',
        deadline: '28 Mar 2024',
        status: {
            completed: false,
            inProgress: false,
            pending: false,
            cancelled: true
        }
    },
    {
        projectName: 'Python Research',
        deadline: '09 Mar 2024',
        status: {
            completed: false,
            inProgress: false,
            pending: true,
            cancelled: false
        }
    },
    {
        projectName: 'Python Research',
        deadline: '09 Mar 2024',
        status: {
            completed: false,
            inProgress: false,
            pending: true,
            cancelled: false
        }
    },
    {
        projectName: 'React Development',
        deadline: '28 Mar 2024',
        status: {
            completed: false,
            inProgress: false,
            pending: false,
            cancelled: true
        }
    },
    {
        projectName: 'UX/UI Design',
        deadline: '05 Feb 2024',
        status: {
            completed: false,
            inProgress: true,
            pending: false,
            cancelled: false
        }
    },
    {
        projectName: 'Web Development',
        deadline: '10 Jan 2024',
        status: {
            completed: true,
            inProgress: false,
            pending: false,
            cancelled: false
        }
    }
];