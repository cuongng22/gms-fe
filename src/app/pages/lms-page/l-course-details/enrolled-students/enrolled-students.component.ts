import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-enrolled-students',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatTableModule],
    templateUrl: './enrolled-students.component.html',
    styleUrl: './enrolled-students.component.scss'
})
export class EnrolledStudentsComponent {

    displayedColumns: string[] = ['id', 'user', 'email'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

}

export interface PeriodicElement {
    id: string;
    user: any;
    email: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        id: '#A-1217',
        user: {
            img: 'images/users/user13.jpg',
            name: 'Olivia Clark'
        },
        email: 'olivia@trezo.com'
    },
    {
        id: '#A1364',
        user: {
            img: 'images/users/user16.jpg',
            name: 'Ava Turner'
        },
        email: 'ava@trezo.com'
    },
    {
        id: '#A-2951',
        user: {
            img: 'images/users/user17.jpg',
            name: 'Lucas Morgan'
        },
        email: 'lucas@trezo.com'
    },
    {
        id: '#A-7342',
        user: {
            img: 'images/users/user18.jpg',
            name: 'Isabella Cooper'
        },
        email: 'isabella@trezo.com'
    },
    {
        id: '#A-1217',
        user: {
            img: 'images/users/user13.jpg',
            name: 'Olivia Clark'
        },
        email: 'olivia@trezo.com'
    },
    {
        id: '#A1364',
        user: {
            img: 'images/users/user16.jpg',
            name: 'Ava Turner'
        },
        email: 'ava@trezo.com'
    },
    {
        id: '#A-2951',
        user: {
            img: 'images/users/user17.jpg',
            name: 'Lucas Morgan'
        },
        email: 'lucas@trezo.com'
    },
    {
        id: '#A-7342',
        user: {
            img: 'images/users/user18.jpg',
            name: 'Isabella Cooper'
        },
        email: 'isabella@trezo.com'
    },
    {
        id: '#A-1217',
        user: {
            img: 'images/users/user13.jpg',
            name: 'Olivia Clark'
        },
        email: 'olivia@trezo.com'
    },
    {
        id: '#A1364',
        user: {
            img: 'images/users/user16.jpg',
            name: 'Ava Turner'
        },
        email: 'ava@trezo.com'
    },
    {
        id: '#A-2951',
        user: {
            img: 'images/users/user17.jpg',
            name: 'Lucas Morgan'
        },
        email: 'lucas@trezo.com'
    },
    {
        id: '#A-7342',
        user: {
            img: 'images/users/user18.jpg',
            name: 'Isabella Cooper'
        },
        email: 'isabella@trezo.com'
    },
    {
        id: '#A-1217',
        user: {
            img: 'images/users/user13.jpg',
            name: 'Olivia Clark'
        },
        email: 'olivia@trezo.com'
    },
    {
        id: '#A1364',
        user: {
            img: 'images/users/user16.jpg',
            name: 'Ava Turner'
        },
        email: 'ava@trezo.com'
    },
    {
        id: '#A-2951',
        user: {
            img: 'images/users/user17.jpg',
            name: 'Lucas Morgan'
        },
        email: 'lucas@trezo.com'
    },
    {
        id: '#A-7342',
        user: {
            img: 'images/users/user18.jpg',
            name: 'Isabella Cooper'
        },
        email: 'isabella@trezo.com'
    },
    {
        id: '#A-1217',
        user: {
            img: 'images/users/user13.jpg',
            name: 'Olivia Clark'
        },
        email: 'olivia@trezo.com'
    },
    {
        id: '#A1364',
        user: {
            img: 'images/users/user16.jpg',
            name: 'Ava Turner'
        },
        email: 'ava@trezo.com'
    },
    {
        id: '#A-2951',
        user: {
            img: 'images/users/user17.jpg',
            name: 'Lucas Morgan'
        },
        email: 'lucas@trezo.com'
    },
    {
        id: '#A-7342',
        user: {
            img: 'images/users/user18.jpg',
            name: 'Isabella Cooper'
        },
        email: 'isabella@trezo.com'
    }
];