import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgFor } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
    selector: 'app-top-instructors',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgFor],
    templateUrl: './top-instructors.component.html',
    styleUrl: './top-instructors.component.scss'
})
export class TopInstructorsComponent {

    displayedColumns: string[] = ['user', 'courses', 'ratings'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

}

export interface PeriodicElement {
    user: any;
    courses: number;
    ratings: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        user: {
            img: 'images/users/user13.jpg',
            name: 'Olivia Clark',
            email: 'Big Data'
        },
        courses: 55,
        ratings: [
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            }
        ]
    },
    {
        user: {
            img: 'images/users/user16.jpg',
            name: 'Ava Turner',
            email: 'UX/UI'
        },
        courses: 120,
        ratings: [
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-half-fill'
            }
        ]
    },
    {
        user: {
            img: 'images/users/user17.jpg',
            name: 'Lucas Morgan',
            email: 'Developer'
        },
        courses: 86,
        ratings: [
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-line'
            }
        ]
    },
    {
        user: {
            img: 'images/users/user18.jpg',
            name: 'Isabella Cooper',
            email: 'Designer'
        },
        courses: 75,
        ratings: [
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-half-fill'
            }
        ]
    },
    {
        user: {
            img: 'images/users/user18.jpg',
            name: 'Isabella Cooper',
            email: 'Designer'
        },
        courses: 75,
        ratings: [
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-half-fill'
            }
        ]
    },
    {
        user: {
            img: 'images/users/user17.jpg',
            name: 'Lucas Morgan',
            email: 'Developer'
        },
        courses: 86,
        ratings: [
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-line'
            }
        ]
    },
    {
        user: {
            img: 'images/users/user16.jpg',
            name: 'Ava Turner',
            email: 'UX/UI'
        },
        courses: 120,
        ratings: [
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-half-fill'
            }
        ]
    },
    {
        user: {
            img: 'images/users/user13.jpg',
            name: 'Olivia Clark',
            email: 'Big Data'
        },
        courses: 55,
        ratings: [
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            },
            {
                star: 'ri-star-fill'
            }
        ]
    }
];