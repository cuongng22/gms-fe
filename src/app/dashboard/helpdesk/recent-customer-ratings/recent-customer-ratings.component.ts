import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgFor } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
    selector: 'app-recent-customer-ratings',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgFor],
    templateUrl: './recent-customer-ratings.component.html',
    styleUrl: './recent-customer-ratings.component.scss'
})
export class RecentCustomerRatingsComponent {

    displayedColumns: string[] = ['user', 'date', 'ratings'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

}

export interface PeriodicElement {
    user: any;
    date: string;
    ratings: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        user: {
            img: 'images/users/user13.jpg',
            name: 'Olivia Clark',
            email: 'Big Data'
        },
        date: '28 April 2024',
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
            name: 'Ethan Parker',
            email: 'Python'
        },
        date: '25 April 2024',
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
            name: 'Ava Turner',
            email: 'UX/UI'
        },
        date: '23 April 2024',
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
            name: 'Lucas Morgan',
            email: 'Developer'
        },
        date: '20 April 2024',
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
                star: 'ri-star-half-fill'
            },
            {
                star: 'ri-star-line'
            }
        ]
    },
    {
        user: {
            img: 'images/users/user19.jpg',
            name: 'Isabella Cooper',
            email: 'Designer'
        },
        date: '15 April 2024',
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
            img: 'images/users/user19.jpg',
            name: 'Isabella Cooper',
            email: 'Designer'
        },
        date: '15 April 2024',
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
            img: 'images/users/user18.jpg',
            name: 'Lucas Morgan',
            email: 'Developer'
        },
        date: '20 April 2024',
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
                star: 'ri-star-half-fill'
            },
            {
                star: 'ri-star-line'
            }
        ]
    },
    {
        user: {
            img: 'images/users/user16.jpg',
            name: 'Ethan Parker',
            email: 'Python'
        },
        date: '25 April 2024',
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
            name: 'Ava Turner',
            email: 'UX/UI'
        },
        date: '23 April 2024',
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
            img: 'images/users/user13.jpg',
            name: 'Olivia Clark',
            email: 'Big Data'
        },
        date: '28 April 2024',
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