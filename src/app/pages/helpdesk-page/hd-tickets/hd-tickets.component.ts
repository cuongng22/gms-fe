import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TicketsResolvedComponent } from '../../../dashboard/helpdesk/tickets-resolved/tickets-resolved.component';
import { TicketsInProgressComponent } from '../../../dashboard/helpdesk/tickets-in-progress/tickets-in-progress.component';
import { TicketsDueComponent } from '../../../dashboard/helpdesk/tickets-due/tickets-due.component';
import { TicketsNewOpenComponent } from '../../../dashboard/helpdesk/tickets-new-open/tickets-new-open.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
    selector: 'app-hd-tickets',
    standalone: true,
    imports: [RouterLink, TicketsResolvedComponent, TicketsInProgressComponent, TicketsDueComponent, TicketsNewOpenComponent, MatCardModule, MatButtonModule, MatMenuModule, MatPaginatorModule, MatTableModule, NgIf, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
    templateUrl: './hd-tickets.component.html',
    styleUrl: './hd-tickets.component.scss'
})
export class HdTicketsComponent {

    displayedColumns: string[] = ['id', 'ticketTitle', 'requester', 'assignedTo', 'createdDate', 'dueDate', 'priority', 'status', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    // New Popup Trigger
    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }

}

export interface PeriodicElement {
    id: string;
    ticketTitle: string;
    requester: string;
    assignedTo: string;
    createdDate: string;
    dueDate: string;
    priority: string;
    status: any;
    action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        id: '#JAN-854',
        ticketTitle: 'Network Infrastructure',
        requester: 'Walter Frazier',
        assignedTo: 'Oliver Clark',
        createdDate: '20 Apr 2024',
        dueDate: '30 Apr 2024',
        priority: 'High',
        status: {
            finished: true,
            pending: false,
            inProgress: false,
            cancelled: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-853',
        ticketTitle: 'Cloud Migration',
        requester: 'Kimberly Anderson',
        assignedTo: 'Ethan Baker',
        createdDate: '21 Apr 2024',
        dueDate: '25 Apr 2024',
        priority: 'Low',
        status: {
            finished: false,
            pending: true,
            inProgress: false,
            cancelled: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#DEC-852',
        ticketTitle: 'Website Revamp',
        requester: 'Roscoe Guerrero',
        assignedTo: 'Sophia Carter',
        createdDate: '17 Apr 2024',
        dueDate: '20 Apr 2024',
        priority: 'Medium',
        status: {
            finished: false,
            pending: false,
            inProgress: true,
            cancelled: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#DEC-851',
        ticketTitle: 'Mobile Application',
        requester: 'Robert Stewart',
        assignedTo: 'Ava Cooper',
        createdDate: '10 Apr 2024',
        dueDate: '15 Apr 2024',
        priority: 'High',
        status: {
            finished: true,
            pending: false,
            inProgress: false,
            cancelled: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#DEC-850',
        ticketTitle: 'System Deployment',
        requester: 'Dustin Fritch',
        assignedTo: 'Isabella Evans',
        createdDate: '05 Apr 2024',
        dueDate: '10 Apr 2024',
        priority: 'Low',
        status: {
            finished: false,
            pending: false,
            inProgress: false,
            cancelled: true
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-849',
        ticketTitle: 'Login Issues',
        requester: 'Walter Frazier',
        assignedTo: 'Oliver Clark',
        createdDate: '20 Apr 2024',
        dueDate: '30 Apr 2024',
        priority: 'High',
        status: {
            finished: true,
            pending: false,
            inProgress: false,
            cancelled: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#FEB-848',
        ticketTitle: 'Email Configuration',
        requester: 'Kimberly Anderson',
        assignedTo: 'Ethan Baker',
        createdDate: '21 Apr 2024',
        dueDate: '25 Apr 2024',
        priority: 'Low',
        status: {
            finished: false,
            pending: true,
            inProgress: false,
            cancelled: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#MAR-847',
        ticketTitle: 'Application Error',
        requester: 'Roscoe Guerrero',
        assignedTo: 'Sophia Carter',
        createdDate: '17 Apr 2024',
        dueDate: '20 Apr 2024',
        priority: 'Medium',
        status: {
            finished: false,
            pending: false,
            inProgress: true,
            cancelled: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-846',
        ticketTitle: 'Software Installation',
        requester: 'Robert Stewart',
        assignedTo: 'Ava Cooper',
        createdDate: '10 Apr 2024',
        dueDate: '15 Apr 2024',
        priority: 'High',
        status: {
            finished: true,
            pending: false,
            inProgress: false,
            cancelled: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#DEC-845',
        ticketTitle: 'System Upgrade',
        requester: 'Dustin Fritch',
        assignedTo: 'Isabella Evans',
        createdDate: '05 Apr 2024',
        dueDate: '10 Apr 2024',
        priority: 'Low',
        status: {
            finished: false,
            pending: false,
            inProgress: false,
            cancelled: true
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#DEC-845',
        ticketTitle: 'System Upgrade',
        requester: 'Dustin Fritch',
        assignedTo: 'Isabella Evans',
        createdDate: '05 Apr 2024',
        dueDate: '10 Apr 2024',
        priority: 'Low',
        status: {
            finished: false,
            pending: false,
            inProgress: false,
            cancelled: true
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-846',
        ticketTitle: 'Software Installation',
        requester: 'Robert Stewart',
        assignedTo: 'Ava Cooper',
        createdDate: '10 Apr 2024',
        dueDate: '15 Apr 2024',
        priority: 'High',
        status: {
            finished: true,
            pending: false,
            inProgress: false,
            cancelled: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#MAR-847',
        ticketTitle: 'Application Error',
        requester: 'Roscoe Guerrero',
        assignedTo: 'Sophia Carter',
        createdDate: '17 Apr 2024',
        dueDate: '20 Apr 2024',
        priority: 'Medium',
        status: {
            finished: false,
            pending: false,
            inProgress: true,
            cancelled: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#FEB-848',
        ticketTitle: 'Email Configuration',
        requester: 'Kimberly Anderson',
        assignedTo: 'Ethan Baker',
        createdDate: '21 Apr 2024',
        dueDate: '25 Apr 2024',
        priority: 'Low',
        status: {
            finished: false,
            pending: true,
            inProgress: false,
            cancelled: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-849',
        ticketTitle: 'Login Issues',
        requester: 'Walter Frazier',
        assignedTo: 'Oliver Clark',
        createdDate: '20 Apr 2024',
        dueDate: '30 Apr 2024',
        priority: 'High',
        status: {
            finished: true,
            pending: false,
            inProgress: false,
            cancelled: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#DEC-850',
        ticketTitle: 'System Deployment',
        requester: 'Dustin Fritch',
        assignedTo: 'Isabella Evans',
        createdDate: '05 Apr 2024',
        dueDate: '10 Apr 2024',
        priority: 'Low',
        status: {
            finished: false,
            pending: false,
            inProgress: false,
            cancelled: true
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#DEC-851',
        ticketTitle: 'Mobile Application',
        requester: 'Robert Stewart',
        assignedTo: 'Ava Cooper',
        createdDate: '10 Apr 2024',
        dueDate: '15 Apr 2024',
        priority: 'High',
        status: {
            finished: true,
            pending: false,
            inProgress: false,
            cancelled: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#DEC-852',
        ticketTitle: 'Website Revamp',
        requester: 'Roscoe Guerrero',
        assignedTo: 'Sophia Carter',
        createdDate: '17 Apr 2024',
        dueDate: '20 Apr 2024',
        priority: 'Medium',
        status: {
            finished: false,
            pending: false,
            inProgress: true,
            cancelled: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-853',
        ticketTitle: 'Cloud Migration',
        requester: 'Kimberly Anderson',
        assignedTo: 'Ethan Baker',
        createdDate: '21 Apr 2024',
        dueDate: '25 Apr 2024',
        priority: 'Low',
        status: {
            finished: false,
            pending: true,
            inProgress: false,
            cancelled: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#JAN-854',
        ticketTitle: 'Network Infrastructure',
        requester: 'Walter Frazier',
        assignedTo: 'Oliver Clark',
        createdDate: '20 Apr 2024',
        dueDate: '30 Apr 2024',
        priority: 'High',
        status: {
            finished: true,
            pending: false,
            inProgress: false,
            cancelled: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    }
];