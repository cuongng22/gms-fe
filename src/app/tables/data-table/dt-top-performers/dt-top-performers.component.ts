import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgClass } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-dt-top-performers',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgClass],
    templateUrl: './dt-top-performers.component.html',
    styleUrl: './dt-top-performers.component.scss'
})
export class DtTopPerformersComponent {

    displayedColumns: string[] = ['user', 'link'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    // isToggled
    isToggled = false;

    constructor(
        public themeService: CustomizerSettingsService
    ) {
        this.themeService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

}

export interface PeriodicElement {
    user: any;
    link: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        user: {
            img: 'images/users/user6.jpg',
            name: 'Alex Davis',
            email: 'alex@trezo.com'
        },
        link: 'arrow_outward'
    },
    {
        user: {
            img: 'images/users/user7.jpg',
            name: 'Laura Martinez',
            email: 'laura@trezo.com'
        },
        link: 'arrow_outward'
    },
    {
        user: {
            img: 'images/users/user8.jpg',
            name: 'Mark Thompson',
            email: 'mark@trezo.com'
        },
        link: 'arrow_outward'
    },
    {
        user: {
            img: 'images/users/user9.jpg',
            name: 'Rachel White',
            email: 'rachel@trezo.com'
        },
        link: 'arrow_outward'
    },
    {
        user: {
            img: 'images/users/user10.jpg',
            name: 'Kevin Lee',
            email: 'kevin@trezo.com'
        },
        link: 'arrow_outward'
    },
    {
        user: {
            img: 'images/users/user10.jpg',
            name: 'Kevin Lee',
            email: 'kevin@trezo.com'
        },
        link: 'arrow_outward'
    },
    {
        user: {
            img: 'images/users/user9.jpg',
            name: 'Rachel White',
            email: 'rachel@trezo.com'
        },
        link: 'arrow_outward'
    },
    {
        user: {
            img: 'images/users/user7.jpg',
            name: 'Laura Martinez',
            email: 'laura@trezo.com'
        },
        link: 'arrow_outward'
    },
    {
        user: {
            img: 'images/users/user8.jpg',
            name: 'Mark Thompson',
            email: 'mark@trezo.com'
        },
        link: 'arrow_outward'
    },
    {
        user: {
            img: 'images/users/user6.jpg',
            name: 'Alex Davis',
            email: 'alex@trezo.com'
        },
        link: 'arrow_outward'
    }
];