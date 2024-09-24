import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgClass, NgIf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FileUploadModule } from '@iplab/ngx-file-upload';

@Component({
    selector: 'app-c-deals',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, NgIf, MatCheckboxModule, NgClass, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, FileUploadModule],
    templateUrl: './c-deals.component.html',
    styleUrl: './c-deals.component.scss'
})
export class CDealsComponent {

    displayedColumns: string[] = ['select', 'id', 'companyName', 'contactPerson', 'amount', 'stage', 'probability', 'createdAt', 'closeDate', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    selection = new SelectionModel<PeriodicElement>(true, []);

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    // Search Filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
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
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.companyName + 1}`;
    }

    // New Popup Trigger
    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }

    // Edit Popup Trigger
    classApplied2 = false;
    toggleClass2() {
        this.classApplied2 = !this.classApplied2;
    }

    // Select Value
    stageSelected = 'option3';

}

export interface PeriodicElement {
    id: string;
    companyName: string;
    contactPerson: string;
    amount: string;
    stage: string;
    probability: number;
    closeDate: string;
    createdAt: string;
    action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        id: '#854',
        companyName: 'Tech Solutions',
        contactPerson: 'Shawn Kennedy',
        amount: '$25,000.00',
        stage: 'Proposal',
        probability: 80,
        closeDate: '15 Nov 2024',
        createdAt: '08 Nov 2024 10:30 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#853',
        companyName: 'Acma Industries',
        contactPerson: 'Roberto Cruz',
        amount: '$15,000.00',
        stage: 'Presentation',
        probability: 50,
        closeDate: '14 Nov 2024',
        createdAt: '09 Nov 2024 02:15 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#852',
        companyName: 'Synergy Ltd',
        contactPerson: 'Juli Johnson',
        amount: '$30,000.00',
        stage: 'Negotiation',
        probability: 75,
        closeDate: '13 Nov 2024',
        createdAt: '10 Nov 2024 09:45 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#851',
        companyName: 'Tech Enterprises',
        contactPerson: 'Catalina Engles',
        amount: '$20,000.00',
        stage: 'Discovery',
        probability: 90,
        closeDate: '12 Nov 2024',
        createdAt: '11 Nov 2024 03:45 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#850',
        companyName: 'Synetic Solutions',
        contactPerson: 'Louis Nagle',
        amount: '$40,000.00',
        stage: 'Contract Sent',
        probability: 60,
        closeDate: '13 Nov 2024',
        createdAt: '12 Nov 2024 01:00 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#849',
        companyName: 'GlobalTech Solutions',
        contactPerson: 'Patrick Madsen',
        amount: '$50,000.00',
        stage: 'Proposal',
        probability: 55,
        closeDate: '19 Nov 2024',
        createdAt: '13 Nov 2024 01:00 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#848',
        companyName: 'Quantum Solutions',
        contactPerson: 'Lillian McCreary',
        amount: '$45,000.00',
        stage: 'Negotiation',
        probability: 79,
        closeDate: '26 Nov 2024',
        createdAt: '14 Nov 2024 01:00 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#847',
        companyName: 'Synetic Pinnacle Ltd',
        contactPerson: 'Beverly Caulkins',
        amount: '$35,000.00',
        stage: 'Presentation',
        probability: 85,
        closeDate: '23 Nov 2024',
        createdAt: '15 Nov 2024 01:00 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#846',
        companyName: 'IT Solutions',
        contactPerson: 'Alina Smith',
        amount: '$23,423.00',
        stage: 'Proposal',
        probability: 11,
        closeDate: '14 Nov 2024',
        createdAt: '08 Nov 2024 10:30 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#845',
        companyName: 'Trezo Admin',
        contactPerson: 'David Warner',
        amount: '$12,421.00',
        stage: 'Discovery',
        probability: 53,
        closeDate: '11 Nov 2024',
        createdAt: '07 Nov 2024 10:30 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#845',
        companyName: 'Trezo Admin',
        contactPerson: 'David Warner',
        amount: '$12,421.00',
        stage: 'Discovery',
        probability: 53,
        closeDate: '11 Nov 2024',
        createdAt: '07 Nov 2024 10:30 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#846',
        companyName: 'IT Solutions',
        contactPerson: 'Alina Smith',
        amount: '$23,423.00',
        stage: 'Proposal',
        probability: 11,
        closeDate: '14 Nov 2024',
        createdAt: '08 Nov 2024 10:30 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#847',
        companyName: 'Synetic Pinnacle Ltd',
        contactPerson: 'Beverly Caulkins',
        amount: '$35,000.00',
        stage: 'Presentation',
        probability: 85,
        closeDate: '23 Nov 2024',
        createdAt: '15 Nov 2024 01:00 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#848',
        companyName: 'Quantum Solutions',
        contactPerson: 'Lillian McCreary',
        amount: '$45,000.00',
        stage: 'Negotiation',
        probability: 79,
        closeDate: '26 Nov 2024',
        createdAt: '14 Nov 2024 01:00 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#849',
        companyName: 'GlobalTech Solutions',
        contactPerson: 'Patrick Madsen',
        amount: '$50,000.00',
        stage: 'Proposal',
        probability: 55,
        closeDate: '19 Nov 2024',
        createdAt: '13 Nov 2024 01:00 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#850',
        companyName: 'Synetic Solutions',
        contactPerson: 'Louis Nagle',
        amount: '$40,000.00',
        stage: 'Contract Sent',
        probability: 60,
        closeDate: '13 Nov 2024',
        createdAt: '12 Nov 2024 01:00 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#851',
        companyName: 'Tech Enterprises',
        contactPerson: 'Catalina Engles',
        amount: '$20,000.00',
        stage: 'Discovery',
        probability: 90,
        closeDate: '12 Nov 2024',
        createdAt: '11 Nov 2024 03:45 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#852',
        companyName: 'Synergy Ltd',
        contactPerson: 'Juli Johnson',
        amount: '$30,000.00',
        stage: 'Negotiation',
        probability: 75,
        closeDate: '13 Nov 2024',
        createdAt: '10 Nov 2024 09:45 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#853',
        companyName: 'Acma Industries',
        contactPerson: 'Roberto Cruz',
        amount: '$15,000.00',
        stage: 'Presentation',
        probability: 50,
        closeDate: '14 Nov 2024',
        createdAt: '09 Nov 2024 02:15 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#854',
        companyName: 'Tech Solutions',
        contactPerson: 'Shawn Kennedy',
        amount: '$25,000.00',
        stage: 'Proposal',
        probability: 80,
        closeDate: '15 Nov 2024',
        createdAt: '08 Nov 2024 10:30 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    }
];