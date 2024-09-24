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
    selector: 'app-c-customers',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, NgIf, MatCheckboxModule, NgClass, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, FileUploadModule],
    templateUrl: './c-customers.component.html',
    styleUrl: './c-customers.component.scss'
})
export class CCustomersComponent {

    displayedColumns: string[] = ['select', 'id', 'customer', 'email', 'phone', 'lastLogin', 'received', 'due', 'status', 'action'];
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

}

export interface PeriodicElement {
    id: string;
    customer: any;
    email: string;
    phone: string;
    lastLogin: string;
    received: string;
    due: string;
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
        lastLogin: '19 Jun 2024',
        received: '$6,855',
        due: '$125',
        status: {
            active: true,
            deactive: false
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
        lastLogin: '18 Jun 2024',
        received: '$258',
        due: '$99',
        status: {
            active: true,
            deactive: false
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
        lastLogin: '17 Jun 2024',
        received: '$3,890',
        due: '$0',
        status: {
            active: false,
            deactive: true
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
        lastLogin: '16 Jun 2024',
        received: '$2,500',
        due: '$279',
        status: {
            active: true,
            deactive: false
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
        lastLogin: '15 Jun 2024',
        received: '$8,200',
        due: '$0',
        status: {
            active: false,
            deactive: true
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
        lastLogin: '14 Jun 2024',
        received: '$640',
        due: '$46',
        status: {
            active: true,
            deactive: false
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
        lastLogin: '13 Jun 2024',
        received: '$9,100',
        due: '$184',
        status: {
            active: true,
            deactive: false
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
        lastLogin: '12 Jun 2024',
        received: '$7,300',
        due: '$166',
        status: {
            active: true,
            deactive: false
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
        lastLogin: '11 Jun 2024',
        received: '$6,600',
        due: '$0',
        status: {
            active: false,
            deactive: true
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
        lastLogin: '10 Jun 2024',
        received: '$2,800',
        due: '$55',
        status: {
            active: true,
            deactive: false
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
        lastLogin: '10 Jun 2024',
        received: '$2,800',
        due: '$55',
        status: {
            active: true,
            deactive: false
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
        lastLogin: '11 Jun 2024',
        received: '$6,600',
        due: '$0',
        status: {
            active: false,
            deactive: true
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
        lastLogin: '12 Jun 2024',
        received: '$7,300',
        due: '$166',
        status: {
            active: true,
            deactive: false
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
        lastLogin: '13 Jun 2024',
        received: '$9,100',
        due: '$184',
        status: {
            active: true,
            deactive: false
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
        lastLogin: '14 Jun 2024',
        received: '$640',
        due: '$46',
        status: {
            active: true,
            deactive: false
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
        lastLogin: '15 Jun 2024',
        received: '$8,200',
        due: '$0',
        status: {
            active: false,
            deactive: true
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
        lastLogin: '16 Jun 2024',
        received: '$2,500',
        due: '$279',
        status: {
            active: true,
            deactive: false
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
        lastLogin: '17 Jun 2024',
        received: '$3,890',
        due: '$0',
        status: {
            active: false,
            deactive: true
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
        lastLogin: '18 Jun 2024',
        received: '$258',
        due: '$99',
        status: {
            active: true,
            deactive: false
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
        lastLogin: '19 Jun 2024',
        received: '$6,855',
        due: '$125',
        status: {
            active: true,
            deactive: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    }
];