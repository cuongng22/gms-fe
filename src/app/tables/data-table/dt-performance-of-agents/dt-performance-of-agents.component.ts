import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgFor, NgIf } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-dt-performance-of-agents',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, NgFor, MatProgressSpinnerModule],
    templateUrl: './dt-performance-of-agents.component.html',
    styleUrl: './dt-performance-of-agents.component.scss'
})
export class DtPerformanceOfAgentsComponent {

    displayedColumns: string[] = ['id', 'agentName', 'totalTickets', 'openTickets', 'resolvedTickets', 'avgResolutionTime', 'satisfactionRate', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

}

export interface PeriodicElement {
    id: string;
    agentName: any;
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    avgResolutionTime: string;
    satisfactionRate: any;
    action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        id: '#854',
        agentName: {
            img: 'images/users/user12.jpg',
            name: 'Oliver Khan'
        },
        totalTickets: 230,
        openTickets: 20,
        resolvedTickets: 75,
        avgResolutionTime: '2.5 hours',
        satisfactionRate: {
            percentage: 80,
            primaryClassName: true,
            successClassName: false,
            orangeClassName: false,
            purpleClassName: false,
            secondaryClassName: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#853',
        agentName: {
            img: 'images/users/user13.jpg',
            name: 'Ava Cooper'
        },
        totalTickets: 180,
        openTickets: 16,
        resolvedTickets: 35,
        avgResolutionTime: '1.4 hours',
        satisfactionRate: {
            percentage: 75,
            primaryClassName: false,
            successClassName: false,
            orangeClassName: false,
            purpleClassName: true,
            secondaryClassName: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#852',
        agentName: {
            img: 'images/users/user14.jpg',
            name: 'Isabella Evans'
        },
        totalTickets: 150,
        openTickets: 35,
        resolvedTickets: 45,
        avgResolutionTime: '3.2 hours',
        satisfactionRate: {
            percentage: 80,
            primaryClassName: false,
            successClassName: true,
            orangeClassName: false,
            purpleClassName: false,
            secondaryClassName: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#851',
        agentName: {
            img: 'images/users/user15.jpg',
            name: 'Mia Hughes'
        },
        totalTickets: 75,
        openTickets: 86,
        resolvedTickets: 25,
        avgResolutionTime: '4.5 hours',
        satisfactionRate: {
            percentage: 100,
            primaryClassName: false,
            successClassName: false,
            orangeClassName: false,
            purpleClassName: false,
            secondaryClassName: true
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#850',
        agentName: {
            img: 'images/users/user16.jpg',
            name: 'Noah Mitchell'
        },
        totalTickets: 320,
        openTickets: 90,
        resolvedTickets: 10,
        avgResolutionTime: '3.8 hours',
        satisfactionRate: {
            percentage: 80,
            primaryClassName: false,
            successClassName: false,
            orangeClassName: true,
            purpleClassName: false,
            secondaryClassName: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#849',
        agentName: {
            img: 'images/users/user17.jpg',
            name: 'Sophia Carter'
        },
        totalTickets: 120,
        openTickets: 55,
        resolvedTickets: 20,
        avgResolutionTime: '5.3 hours',
        satisfactionRate: {
            percentage: 60,
            primaryClassName: true,
            successClassName: false,
            orangeClassName: false,
            purpleClassName: false,
            secondaryClassName: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#849',
        agentName: {
            img: 'images/users/user17.jpg',
            name: 'Sophia Carter'
        },
        totalTickets: 120,
        openTickets: 55,
        resolvedTickets: 20,
        avgResolutionTime: '5.3 hours',
        satisfactionRate: {
            percentage: 60,
            primaryClassName: true,
            successClassName: false,
            orangeClassName: false,
            purpleClassName: false,
            secondaryClassName: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#850',
        agentName: {
            img: 'images/users/user16.jpg',
            name: 'Noah Mitchell'
        },
        totalTickets: 320,
        openTickets: 90,
        resolvedTickets: 10,
        avgResolutionTime: '3.8 hours',
        satisfactionRate: {
            percentage: 80,
            primaryClassName: false,
            successClassName: false,
            orangeClassName: true,
            purpleClassName: false,
            secondaryClassName: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#851',
        agentName: {
            img: 'images/users/user15.jpg',
            name: 'Mia Hughes'
        },
        totalTickets: 75,
        openTickets: 86,
        resolvedTickets: 25,
        avgResolutionTime: '4.5 hours',
        satisfactionRate: {
            percentage: 100,
            primaryClassName: false,
            successClassName: false,
            orangeClassName: false,
            purpleClassName: false,
            secondaryClassName: true
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#852',
        agentName: {
            img: 'images/users/user14.jpg',
            name: 'Isabella Evans'
        },
        totalTickets: 150,
        openTickets: 35,
        resolvedTickets: 45,
        avgResolutionTime: '3.2 hours',
        satisfactionRate: {
            percentage: 80,
            primaryClassName: false,
            successClassName: true,
            orangeClassName: false,
            purpleClassName: false,
            secondaryClassName: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#853',
        agentName: {
            img: 'images/users/user13.jpg',
            name: 'Ava Cooper'
        },
        totalTickets: 180,
        openTickets: 16,
        resolvedTickets: 35,
        avgResolutionTime: '1.4 hours',
        satisfactionRate: {
            percentage: 75,
            primaryClassName: false,
            successClassName: false,
            orangeClassName: false,
            purpleClassName: true,
            secondaryClassName: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#854',
        agentName: {
            img: 'images/users/user12.jpg',
            name: 'Oliver Khan'
        },
        totalTickets: 230,
        openTickets: 20,
        resolvedTickets: 75,
        avgResolutionTime: '2.5 hours',
        satisfactionRate: {
            percentage: 80,
            primaryClassName: true,
            successClassName: false,
            orangeClassName: false,
            purpleClassName: false,
            secondaryClassName: false
        },
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    }
];