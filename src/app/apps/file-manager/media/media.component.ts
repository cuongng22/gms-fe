import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-media',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatCheckboxModule, MatTableModule, MatPaginatorModule, MatTooltipModule],
    templateUrl: './media.component.html',
    styleUrl: './media.component.scss'
})
export class MediaComponent {

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
        fileName: 'dashboard_design1',
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
        fileName: 'important_documents',
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
        fileName: 'product_design',
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
        fileName: 'dashboard_design2',
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
        fileName: 'media_files',
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
        fileName: 'graphic_design_file',
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
        fileName: 'personal_photo',
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
        fileName: 'audio_file',
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
        fileName: 'audio_file',
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
        fileName: 'personal_photo',
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
        fileName: 'graphic_design_file',
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
        fileName: 'media_files',
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
        fileName: 'dashboard_design2',
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
        fileName: 'product_design',
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
        fileName: 'important_documents',
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
        fileName: 'dashboard_design1',
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