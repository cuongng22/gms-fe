import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgFor, NgIf } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
    selector: 'app-members-page',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, NgFor],
    templateUrl: './members-page.component.html',
    styleUrl: './members-page.component.scss'
})
export class MembersPageComponent {

    displayedColumns: string[] = ['id', 'member', 'email', 'phone', 'location', 'joiningDate', 'lastActive', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    // Search Filter
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}

export interface PeriodicElement {
    id: string;
    member: any;
    email: string;
    phone: string;
    location: string;
    joiningDate: string;
    lastActive: string;
    action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        id: '#JAN-854',
        member: {
            img: 'images/users/user6.jpg',
            name: 'Oliver Khan'
        },
        email: 'oliver@trezo.com',
        phone: '+1 555-123-4567',
        location: 'Washington D.C',
        joiningDate: '10 Oct 2024',
        lastActive: '01 Dec 2024 08:23 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-853',
        member: {
            img: 'images/users/user7.jpg',
            name: 'Carolyn Barnes'
        },
        email: 'carolyn@trezo.com',
        phone: '+1 555-987-6543',
        location: 'Chicago',
        joiningDate: '11 Sep 2024',
        lastActive: '02 Dec 2024 05:09 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-852',
        member: {
            img: 'images/users/user8.jpg',
            name: 'Donna Miller'
        },
        email: 'donna@trezo.com',
        phone: '+1 555-456-7890',
        location: 'Oklahoma City',
        joiningDate: '12 Aug 2024',
        lastActive: '03 Dec 2024 09:30 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-851',
        member: {
            img: 'images/users/user9.jpg',
            name: 'Barbara Cross'
        },
        email: 'barbara@trezo.com',
        phone: '+1 555-369-7878',
        location: 'San Diego',
        joiningDate: '13 Jul 2024',
        lastActive: '04 Dec 2024 10:22 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-850',
        member: {
            img: 'images/users/user10.jpg',
            name: 'Rebecca Block'
        },
        email: 'rebecca@trezo.com',
        phone: '+1 555-658-4488',
        location: 'Los Angeles',
        joiningDate: '14 Jun 2024',
        lastActive: '05 Dec 2024 08:49 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-849',
        member: {
            img: 'images/users/user11.jpg',
            name: 'Ramiro McCarty'
        },
        email: 'ramiro@trezo.com',
        phone: '+1 555-558-9966',
        location: 'Las Vegas',
        joiningDate: '15 May 2024',
        lastActive: '06 Dec 2024 04:35 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-848',
        member: {
            img: 'images/users/user12.jpg',
            name: 'Robert Fairweather'
        },
        email: 'robert@trezo.com',
        phone: '+1 555-357-5888',
        location: 'San Francisco',
        joiningDate: '16 Apr 2024',
        lastActive: '07 Dec 2024 06:13 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-847',
        member: {
            img: 'images/users/user13.jpg',
            name: 'Marcelino Haddock'
        },
        email: 'marcelino@trezo.com',
        phone: '+1 555-456-8877',
        location: 'Washington D.C',
        joiningDate: '17 Mar 2024',
        lastActive: '08 Dec 2024 02:20 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-846',
        member: {
            img: 'images/users/user14.jpg',
            name: 'Thomas Wilson'
        },
        email: 'thomas@trezo.com',
        phone: '+1 555-622-4488',
        location: 'San Diego',
        joiningDate: '18 Feb 2024',
        lastActive: '09 Dec 2024 12:09 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-845',
        member: {
            img: 'images/users/user15.jpg',
            name: 'Nathaniel Hulsey'
        },
        email: 'nathaniel@trezo.com',
        phone: '+1 555-225-4488',
        location: 'Chicago',
        joiningDate: '19 Jan 2024',
        lastActive: '10 Dec 2024 06:03 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-845',
        member: {
            img: 'images/users/user15.jpg',
            name: 'Nathaniel Hulsey'
        },
        email: 'nathaniel@trezo.com',
        phone: '+1 555-225-4488',
        location: 'Chicago',
        joiningDate: '19 Jan 2024',
        lastActive: '10 Dec 2024 06:03 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-846',
        member: {
            img: 'images/users/user14.jpg',
            name: 'Thomas Wilson'
        },
        email: 'thomas@trezo.com',
        phone: '+1 555-622-4488',
        location: 'San Diego',
        joiningDate: '18 Feb 2024',
        lastActive: '09 Dec 2024 12:09 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-847',
        member: {
            img: 'images/users/user13.jpg',
            name: 'Marcelino Haddock'
        },
        email: 'marcelino@trezo.com',
        phone: '+1 555-456-8877',
        location: 'Washington D.C',
        joiningDate: '17 Mar 2024',
        lastActive: '08 Dec 2024 02:20 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-848',
        member: {
            img: 'images/users/user12.jpg',
            name: 'Robert Fairweather'
        },
        email: 'robert@trezo.com',
        phone: '+1 555-357-5888',
        location: 'San Francisco',
        joiningDate: '16 Apr 2024',
        lastActive: '07 Dec 2024 06:13 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-849',
        member: {
            img: 'images/users/user11.jpg',
            name: 'Ramiro McCarty'
        },
        email: 'ramiro@trezo.com',
        phone: '+1 555-558-9966',
        location: 'Las Vegas',
        joiningDate: '15 May 2024',
        lastActive: '06 Dec 2024 04:35 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-850',
        member: {
            img: 'images/users/user10.jpg',
            name: 'Rebecca Block'
        },
        email: 'rebecca@trezo.com',
        phone: '+1 555-658-4488',
        location: 'Los Angeles',
        joiningDate: '14 Jun 2024',
        lastActive: '05 Dec 2024 08:49 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-851',
        member: {
            img: 'images/users/user9.jpg',
            name: 'Barbara Cross'
        },
        email: 'barbara@trezo.com',
        phone: '+1 555-369-7878',
        location: 'San Diego',
        joiningDate: '13 Jul 2024',
        lastActive: '04 Dec 2024 10:22 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-852',
        member: {
            img: 'images/users/user8.jpg',
            name: 'Donna Miller'
        },
        email: 'donna@trezo.com',
        phone: '+1 555-456-7890',
        location: 'Oklahoma City',
        joiningDate: '12 Aug 2024',
        lastActive: '03 Dec 2024 09:30 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-853',
        member: {
            img: 'images/users/user7.jpg',
            name: 'Carolyn Barnes'
        },
        email: 'carolyn@trezo.com',
        phone: '+1 555-987-6543',
        location: 'Chicago',
        joiningDate: '11 Sep 2024',
        lastActive: '02 Dec 2024 05:09 PM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-854',
        member: {
            img: 'images/users/user6.jpg',
            name: 'Oliver Khan'
        },
        email: 'oliver@trezo.com',
        phone: '+1 555-123-4567',
        location: 'Washington D.C',
        joiningDate: '10 Oct 2024',
        lastActive: '01 Dec 2024 08:23 AM',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    }
];