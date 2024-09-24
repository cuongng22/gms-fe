import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-important',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatCheckboxModule, MatTableModule],
    templateUrl: './important.component.html',
    styleUrl: './important.component.scss'
})
export class ImportantComponent {

    displayedColumns: string[] = ['fileName', 'owner', 'listedDate', 'fileType', 'fileSize', 'fileItems', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

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
    }
];