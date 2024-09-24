import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgClass, NgIf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
    selector: 'app-pm-users',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, NgIf, MatCheckboxModule, MatPaginatorModule, NgClass, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
    templateUrl: './pm-users.component.html',
    styleUrl: './pm-users.component.scss'
})
export class PmUsersComponent {

    displayedColumns: string[] = ['select', 'id', 'user', 'email', 'role', 'projectAccess', 'status', 'action'];
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
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.user + 1}`;
    }

    // Popup Trigger
    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }

}

export interface PeriodicElement {
    id: string;
    user: any;
    email: string;
    role: string;
    projectAccess: string;
    status: any;
    action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        id: '#999',
        user: {
            img: 'images/users/user6.jpg',
            name: 'Sarah Johnson'
        },
        email: 'sarah@trezo.com',
        role: 'Project Manager',
        projectAccess: 'Hotel Management System, Python Upgrade',
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
        id: '#998',
        user: {
            img: 'images/users/user7.jpg',
            name: 'Carolyn Barnes'
        },
        email: 'carolyn@trezo.com',
        role: 'Developer',
        projectAccess: 'Project Monitoring, Project Alpho',
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
        id: '#997',
        user: {
            img: 'images/users/user8.jpg',
            name: 'Donna Miller'
        },
        email: 'donna@trezo.com',
        role: 'Business Analyst',
        projectAccess: 'Aegis Accounting Service, Beja Banking Finance',
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
        id: '#996',
        user: {
            img: 'images/users/user9.jpg',
            name: 'Barbara Cross'
        },
        email: 'barbara@trezo.com',
        role: 'UI/UX Designer',
        projectAccess: 'Aoriv AI Design, Vaxo App Design',
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
        id: '#995',
        user: {
            img: 'images/users/user10.jpg',
            name: 'Rebecca Block'
        },
        email: 'rebecca@trezo.com',
        role: 'QA Tester',
        projectAccess: 'Product Development, Trezo Dashboard Design',
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
        id: '#994',
        user: {
            img: 'images/users/user11.jpg',
            name: 'Ramiro McCarty'
        },
        email: 'ramiro@trezo.com',
        role: 'Admin',
        projectAccess: 'Hotel Management System, Python Upgrade',
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
        id: '#993',
        user: {
            img: 'images/users/user12.jpg',
            name: 'Robert Fairweather'
        },
        email: 'robert@trezo.com',
        role: 'Editor',
        projectAccess: 'Project Monitoring, Project Alpho',
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
        id: '#992',
        user: {
            img: 'images/users/user13.jpg',
            name: 'Marcelino Haddock'
        },
        email: 'marcelino@trezo.com',
        role: 'Project Manager',
        projectAccess: 'Aegis Accounting Service, Beja Banking Finance',
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
        id: '#991',
        user: {
            img: 'images/users/user14.jpg',
            name: 'Thomas Wilson'
        },
        email: 'thomas@trezo.com',
        role: 'UI/UX Designer',
        projectAccess: 'Aoriv AI Design, Vaxo App Design',
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
        id: '#990',
        user: {
            img: 'images/users/user15.jpg',
            name: 'Nathaniel Hulsey'
        },
        email: 'nathaniel@trezo.com',
        role: 'Web Developer',
        projectAccess: 'Product Development, Trezo Dashboard Design',
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
        id: '#990',
        user: {
            img: 'images/users/user15.jpg',
            name: 'Nathaniel Hulsey'
        },
        email: 'nathaniel@trezo.com',
        role: 'Web Developer',
        projectAccess: 'Product Development, Trezo Dashboard Design',
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
        id: '#991',
        user: {
            img: 'images/users/user14.jpg',
            name: 'Thomas Wilson'
        },
        email: 'thomas@trezo.com',
        role: 'UI/UX Designer',
        projectAccess: 'Aoriv AI Design, Vaxo App Design',
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
        id: '#992',
        user: {
            img: 'images/users/user13.jpg',
            name: 'Marcelino Haddock'
        },
        email: 'marcelino@trezo.com',
        role: 'Project Manager',
        projectAccess: 'Aegis Accounting Service, Beja Banking Finance',
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
        id: '#993',
        user: {
            img: 'images/users/user12.jpg',
            name: 'Robert Fairweather'
        },
        email: 'robert@trezo.com',
        role: 'Editor',
        projectAccess: 'Project Monitoring, Project Alpho',
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
        id: '#994',
        user: {
            img: 'images/users/user11.jpg',
            name: 'Ramiro McCarty'
        },
        email: 'ramiro@trezo.com',
        role: 'Admin',
        projectAccess: 'Hotel Management System, Python Upgrade',
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
        id: '#995',
        user: {
            img: 'images/users/user10.jpg',
            name: 'Rebecca Block'
        },
        email: 'rebecca@trezo.com',
        role: 'QA Tester',
        projectAccess: 'Product Development, Trezo Dashboard Design',
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
        id: '#996',
        user: {
            img: 'images/users/user9.jpg',
            name: 'Barbara Cross'
        },
        email: 'barbara@trezo.com',
        role: 'UI/UX Designer',
        projectAccess: 'Aoriv AI Design, Vaxo App Design',
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
        id: '#997',
        user: {
            img: 'images/users/user8.jpg',
            name: 'Donna Miller'
        },
        email: 'donna@trezo.com',
        role: 'Business Analyst',
        projectAccess: 'Aegis Accounting Service, Beja Banking Finance',
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
        id: '#998',
        user: {
            img: 'images/users/user7.jpg',
            name: 'Carolyn Barnes'
        },
        email: 'carolyn@trezo.com',
        role: 'Developer',
        projectAccess: 'Project Monitoring, Project Alpho',
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
        id: '#999',
        user: {
            img: 'images/users/user6.jpg',
            name: 'Sarah Johnson'
        },
        email: 'sarah@trezo.com',
        role: 'Project Manager',
        projectAccess: 'Hotel Management System, Python Upgrade',
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