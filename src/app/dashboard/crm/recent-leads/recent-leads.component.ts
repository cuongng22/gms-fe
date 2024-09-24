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
    selector: 'app-recent-leads',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, MatCheckboxModule],
    templateUrl: './recent-leads.component.html',
    styleUrl: './recent-leads.component.scss'
})
export class RecentLeadsComponent {

    displayedColumns: string[] = ['select', 'customer', 'email', 'source', 'status', 'action'];
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
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.customer + 1}`;
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
    customer: any;
    email: string;
    source: string;
    status: any;
    action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        customer: {
            img: 'images/users/user11.jpg',
            name: 'David Brown'
        },
        email: 'david@trezo.com',
        source: 'Organic',
        status: {
            confirmed: true,
            inProgress: false,
            pending: false,
            rejected: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        customer: {
            img: 'images/users/user12.jpg',
            name: 'Sarah Miller'
        },
        email: 'sarah@trezo.com',
        source: 'Social',
        status: {
            confirmed: false,
            inProgress: false,
            pending: true,
            rejected: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        customer: {
            img: 'images/users/user13.jpg',
            name: 'Michael Wilson'
        },
        email: 'micheal@trezo.com',
        source: 'Website',
        status: {
            confirmed: false,
            inProgress: true,
            pending: false,
            rejected: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        customer: {
            img: 'images/users/user8.jpg',
            name: 'Amanda Clark'
        },
        email: 'amanda@trezo.com',
        source: 'Paid',
        status: {
            confirmed: true,
            inProgress: false,
            pending: false,
            rejected: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        customer: {
            img: 'images/users/user14.jpg',
            name: 'Jennifer Taylor'
        },
        email: 'taylor@trezo.com',
        source: 'Others',
        status: {
            confirmed: false,
            inProgress: false,
            pending: false,
            rejected: true
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        customer: {
            img: 'images/users/user12.jpg',
            name: 'Sarah Miller'
        },
        email: 'sarah@trezo.com',
        source: 'Social',
        status: {
            confirmed: false,
            inProgress: false,
            pending: true,
            rejected: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        customer: {
            img: 'images/users/user14.jpg',
            name: 'Jennifer Taylor'
        },
        email: 'taylor@trezo.com',
        source: 'Others',
        status: {
            confirmed: false,
            inProgress: false,
            pending: false,
            rejected: true
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        customer: {
            img: 'images/users/user9.jpg',
            name: 'Amanda Clark'
        },
        email: 'amanda@trezo.com',
        source: 'Paid',
        status: {
            confirmed: true,
            inProgress: false,
            pending: false,
            rejected: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        customer: {
            img: 'images/users/user13.jpg',
            name: 'Michael Wilson'
        },
        email: 'micheal@trezo.com',
        source: 'Website',
        status: {
            confirmed: false,
            inProgress: true,
            pending: false,
            rejected: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        customer: {
            img: 'images/users/user11.jpg',
            name: 'David Brown'
        },
        email: 'david@trezo.com',
        source: 'Organic',
        status: {
            confirmed: true,
            inProgress: false,
            pending: false,
            rejected: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    }
];