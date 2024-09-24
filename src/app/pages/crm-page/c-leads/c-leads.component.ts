import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevenueGrowthComponent } from '../../../dashboard/crm/revenue-growth/revenue-growth.component';
import { LeadConversionComponent } from '../../../dashboard/crm/lead-conversion/lead-conversion.component';
import { TotalOrdersComponent } from '../../../dashboard/crm/total-orders/total-orders.component';
import { AnnualProfitComponent } from '../../../dashboard/crm/annual-profit/annual-profit.component';
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
    selector: 'app-c-leads',
    standalone: true,
    imports: [RouterLink, RevenueGrowthComponent, LeadConversionComponent, TotalOrdersComponent, AnnualProfitComponent, MatCardModule, MatButtonModule, MatMenuModule, NgClass, NgIf, MatTableModule, MatPaginatorModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, FileUploadModule],
    templateUrl: './c-leads.component.html',
    styleUrl: './c-leads.component.scss'
})
export class CLeadsComponent {

    displayedColumns: string[] = ['select', 'id', 'customer', 'email', 'phone', 'createdDate', 'company', 'leadSource', 'status', 'action'];
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
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.customer + 1}`;
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
    leadCompanySelected = 'option3';
    leadSourceSelected = 'option2';
    leadStatusSelected = 'option1';

}

export interface PeriodicElement {
    id: string;
    customer: any;
    email: string;
    phone: string;
    createdDate: string;
    company: string;
    leadSource: string;
    status: any;
    action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        id: '#854',
        customer: {
            img: 'images/users/user6.jpg',
            name: 'Oliver Khan'
        },
        email: 'oliver@trezo.com',
        phone: '+1 555-123-4567',
        createdDate: '19 Jun 2024',
        company: 'ABC Corporation',
        leadSource: 'Organic',
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
        id: '#853',
        customer: {
            img: 'images/users/user7.jpg',
            name: 'Carolyn Barnes'
        },
        email: 'carolyn@trezo.com',
        phone: '+1 555-987-6543',
        createdDate: '18 Jun 2024',
        company: 'XYZ Ltd',
        leadSource: 'Social',
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
        id: '#852',
        customer: {
            img: 'images/users/user8.jpg',
            name: 'Donna Miller'
        },
        email: 'donna@trezo.com',
        phone: '+1 555-456-7890',
        createdDate: '17 Jun 2024',
        company: 'Tech Solutions',
        leadSource: 'Website',
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
        id: '#851',
        customer: {
            img: 'images/users/user9.jpg',
            name: 'Barbara Cross'
        },
        email: 'barbara@trezo.com',
        phone: '+1 555-369-7878',
        createdDate: '16 Jun 2024',
        company: 'Global Solutions',
        leadSource: 'Paid',
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
        id: '#850',
        customer: {
            img: 'images/users/user10.jpg',
            name: 'Rebecca Block'
        },
        email: 'rebecca@trezo.com',
        phone: '+1 555-658-4488',
        createdDate: '15 Jun 2024',
        company: 'Acma Industries',
        leadSource: 'Others',
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
        id: '#849',
        customer: {
            img: 'images/users/user11.jpg',
            name: 'Ramiro McCarty'
        },
        email: 'ramiro@trezo.com',
        phone: '+1 555-558-9966',
        createdDate: '14 Jun 2024',
        company: 'Synergy Ltd',
        leadSource: 'Facebook',
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
        id: '#848',
        customer: {
            img: 'images/users/user12.jpg',
            name: 'Robert Fairweather'
        },
        email: 'robert@trezo.com',
        phone: '+1 555-357-5888',
        createdDate: '13 Jun 2024',
        company: 'Summit Solutions',
        leadSource: 'Instagram',
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
        id: '#847',
        customer: {
            img: 'images/users/user13.jpg',
            name: 'Marcelino Haddock'
        },
        email: 'marcelino@trezo.com',
        phone: '+1 555-456-8877',
        createdDate: '12 Jun 2024',
        company: 'Strategies Ltd',
        leadSource: 'X',
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
        id: '#846',
        customer: {
            img: 'images/users/user14.jpg',
            name: 'Thomas Wilson'
        },
        email: 'thomas@trezo.com',
        phone: '+1 555-622-4488',
        createdDate: '11 Jun 2024',
        company: 'Tech Enterprises',
        leadSource: 'LinkedIn',
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
        id: '#845',
        customer: {
            img: 'images/users/user15.jpg',
            name: 'Nathaniel Hulsey'
        },
        email: 'nathaniel@trezo.com',
        phone: '+1 555-225-4488',
        createdDate: '10 Jun 2024',
        company: 'Synetic Solutions',
        leadSource: 'Pinterest',
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
        id: '#845',
        customer: {
            img: 'images/users/user15.jpg',
            name: 'Nathaniel Hulsey'
        },
        email: 'nathaniel@trezo.com',
        phone: '+1 555-225-4488',
        createdDate: '10 Jun 2024',
        company: 'Synetic Solutions',
        leadSource: 'Pinterest',
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
        id: '#846',
        customer: {
            img: 'images/users/user14.jpg',
            name: 'Thomas Wilson'
        },
        email: 'thomas@trezo.com',
        phone: '+1 555-622-4488',
        createdDate: '11 Jun 2024',
        company: 'Tech Enterprises',
        leadSource: 'LinkedIn',
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
        id: '#847',
        customer: {
            img: 'images/users/user13.jpg',
            name: 'Marcelino Haddock'
        },
        email: 'marcelino@trezo.com',
        phone: '+1 555-456-8877',
        createdDate: '12 Jun 2024',
        company: 'Strategies Ltd',
        leadSource: 'X',
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
        id: '#848',
        customer: {
            img: 'images/users/user12.jpg',
            name: 'Robert Fairweather'
        },
        email: 'robert@trezo.com',
        phone: '+1 555-357-5888',
        createdDate: '13 Jun 2024',
        company: 'Summit Solutions',
        leadSource: 'Instagram',
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
        id: '#849',
        customer: {
            img: 'images/users/user11.jpg',
            name: 'Ramiro McCarty'
        },
        email: 'ramiro@trezo.com',
        phone: '+1 555-558-9966',
        createdDate: '14 Jun 2024',
        company: 'Synergy Ltd',
        leadSource: 'Facebook',
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
        id: '#850',
        customer: {
            img: 'images/users/user10.jpg',
            name: 'Rebecca Block'
        },
        email: 'rebecca@trezo.com',
        phone: '+1 555-658-4488',
        createdDate: '15 Jun 2024',
        company: 'Acma Industries',
        leadSource: 'Others',
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
        id: '#851',
        customer: {
            img: 'images/users/user9.jpg',
            name: 'Barbara Cross'
        },
        email: 'barbara@trezo.com',
        phone: '+1 555-369-7878',
        createdDate: '16 Jun 2024',
        company: 'Global Solutions',
        leadSource: 'Paid',
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
        id: '#852',
        customer: {
            img: 'images/users/user8.jpg',
            name: 'Donna Miller'
        },
        email: 'donna@trezo.com',
        phone: '+1 555-456-7890',
        createdDate: '17 Jun 2024',
        company: 'Tech Solutions',
        leadSource: 'Website',
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
        id: '#853',
        customer: {
            img: 'images/users/user7.jpg',
            name: 'Carolyn Barnes'
        },
        email: 'carolyn@trezo.com',
        phone: '+1 555-987-6543',
        createdDate: '18 Jun 2024',
        company: 'XYZ Ltd',
        leadSource: 'Social',
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
        id: '#854',
        customer: {
            img: 'images/users/user6.jpg',
            name: 'Oliver Khan'
        },
        email: 'oliver@trezo.com',
        phone: '+1 555-123-4567',
        createdDate: '19 Jun 2024',
        company: 'ABC Corporation',
        leadSource: 'Organic',
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
    }
];