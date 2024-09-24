import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgFor, NgIf } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
    selector: 'app-notifications-page',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, NgFor],
    templateUrl: './notifications-page.component.html',
    styleUrl: './notifications-page.component.scss'
})
export class NotificationsPageComponent {

    displayedColumns: string[] = ['id', 'timestamp', 'type', 'content', 'status', 'action'];
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
    timestamp: string;
    type: string;
    content: string;
    status: any;
    action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        id: '#JAN-854',
        timestamp: '01 Dec 2024 09:30 AM',
        type: 'Information',
        content: 'New software update available. Click here to download.',
        status: {
            read: false,
            unread: true
        },
        action: {
            view: 'visibility'
        }
    },
    {
        id: '#JAN-853',
        timestamp: '30 Nov 2024 09:30 AM',
        type: 'Alert',
        content: 'Urgent: Server maintenance scheduled for tomorrow at 10:00 PM.',
        status: {
            read: true,
            unread: false
        },
        action: {
            view: 'visibility'
        }
    },
    {
        id: '#JAN-852',
        timestamp: '28 Nov 2024 09:30 AM',
        type: 'Announcement',
        content: 'Welcome to our new team member, Jane Smith, as Head of Sales.',
        status: {
            read: true,
            unread: false
        },
        action: {
            view: 'visibility'
        }
    },
    {
        id: '#JAN-851',
        timestamp: '27 Nov 2024 09:30 AM',
        type: 'Information',
        content: 'Check out our latest blog post for tips on improving efficiency.',
        status: {
            read: true,
            unread: false
        },
        action: {
            view: 'visibility'
        }
    },
    {
        id: '#JAN-850',
        timestamp: '26 Nov 2024 09:30 AM',
        type: 'Alert',
        content: 'Attention: Upcoming webinar on cybersecurity best practices.',
        status: {
            read: false,
            unread: true
        },
        action: {
            view: 'visibility'
        }
    },
    {
        id: '#JAN-849',
        timestamp: '25 Nov 2024 09:30 AM',
        type: 'Announcement',
        content: 'Happy Thanksgiving! Our office will be closed on Nov 30.',
        status: {
            read: true,
            unread: false
        },
        action: {
            view: 'visibility'
        }
    },
    {
        id: '#JAN-848',
        timestamp: '24 Nov 2024 09:30 AM',
        type: 'Information',
        content: 'Year-end financial reports are now available for download.',
        status: {
            read: true,
            unread: false
        },
        action: {
            view: 'visibility'
        }
    },
    {
        id: '#JAN-847',
        timestamp: '23 Nov 2024 09:30 AM',
        type: 'Announcement',
        content: 'Critical security update. Update your passwords immediately.',
        status: {
            read: true,
            unread: false
        },
        action: {
            view: 'visibility'
        }
    },
    {
        id: '#JAN-846',
        timestamp: '22 Nov 2024 09:30 AM',
        type: 'Information',
        content: 'Holiday Office Party on Dec 20. Save the date!',
        status: {
            read: true,
            unread: false
        },
        action: {
            view: 'visibility'
        }
    },
    {
        id: '#JAN-845',
        timestamp: '20 Nov 2024 09:30 AM',
        type: 'Alert',
        content: 'Year-end sale: Up to 20% off on selected products.',
        status: {
            read: true,
            unread: false
        },
        action: {
            view: 'visibility'
        }
    }
];