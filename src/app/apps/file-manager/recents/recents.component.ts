import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-recents',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatCheckboxModule, MatTableModule, MatPaginatorModule],
    templateUrl: './recents.component.html',
    styleUrl: './recents.component.scss'
})
export class RecentsComponent {

    displayedColumns: string[] = ['fileName', 'owner', 'listedDate', 'fileType', 'fileSize', 'fileItems', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

}

export interface PeriodicElement {
    fileName: string;
    owner: string;
    listedDate: string;
    fileType: string;
    fileSize: string;
    fileItems: string;
    action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        fileName: 'Dashboard Design',
        owner: 'Linda Maddox',
        listedDate: '20 Nov 2024',
        fileType: '.pdf',
        fileSize: '1.2 GB',
        fileItems: '69',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        fileName: 'Important Documents',
        owner: 'Juanita Lavigne',
        listedDate: '18 Nov 2024',
        fileType: '.zip',
        fileSize: '2.6 GB',
        fileItems: '236',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        fileName: 'Product Design',
        owner: 'Roy Pope',
        listedDate: '17 Nov 2024',
        fileType: '.psd',
        fileSize: '3.2 GB',
        fileItems: '365',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        fileName: 'Dashboard Design File',
        owner: 'Cecil Jones',
        listedDate: '15 Nov 2024',
        fileType: '.fig',
        fileSize: '1 GB',
        fileItems: '25',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        fileName: 'Media Files',
        owner: 'Trudy Venegas',
        listedDate: '14 Nov 2024',
        fileType: '.jpg',
        fileSize: '1.5 GB',
        fileItems: '153',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        fileName: 'Graphic Design File',
        owner: 'Sharilyn Goodall',
        listedDate: '13 Nov 2024',
        fileType: '.png',
        fileSize: '1.6 GB',
        fileItems: '142',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        fileName: 'Personal Photo',
        owner: 'Annie Carver',
        listedDate: '09 Nov 2024',
        fileType: '.gif',
        fileSize: '1.2 GB',
        fileItems: '175',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        fileName: 'Audio File',
        owner: 'Winona Etzel',
        listedDate: '08 Nov 2024',
        fileType: '.mp3',
        fileSize: '1.3 GB',
        fileItems: '136',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        fileName: 'Audio File',
        owner: 'Winona Etzel',
        listedDate: '08 Nov 2024',
        fileType: '.mp3',
        fileSize: '1.3 GB',
        fileItems: '136',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        fileName: 'Personal Photo',
        owner: 'Annie Carver',
        listedDate: '09 Nov 2024',
        fileType: '.gif',
        fileSize: '1.2 GB',
        fileItems: '175',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        fileName: 'Graphic Design File',
        owner: 'Sharilyn Goodall',
        listedDate: '13 Nov 2024',
        fileType: '.png',
        fileSize: '1.6 GB',
        fileItems: '142',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        fileName: 'Media Files',
        owner: 'Trudy Venegas',
        listedDate: '14 Nov 2024',
        fileType: '.jpg',
        fileSize: '1.5 GB',
        fileItems: '153',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        fileName: 'Dashboard Design File',
        owner: 'Cecil Jones',
        listedDate: '15 Nov 2024',
        fileType: '.fig',
        fileSize: '1 GB',
        fileItems: '25',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        fileName: 'Product Design',
        owner: 'Roy Pope',
        listedDate: '17 Nov 2024',
        fileType: '.psd',
        fileSize: '3.2 GB',
        fileItems: '365',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        fileName: 'Important Documents',
        owner: 'Juanita Lavigne',
        listedDate: '18 Nov 2024',
        fileType: '.zip',
        fileSize: '2.6 GB',
        fileItems: '236',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        fileName: 'Dashboard Design',
        owner: 'Linda Maddox',
        listedDate: '20 Nov 2024',
        fileType: '.pdf',
        fileSize: '1.2 GB',
        fileItems: '69',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    }
];