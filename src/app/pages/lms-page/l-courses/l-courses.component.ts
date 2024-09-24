import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgFor, NgIf } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
    selector: 'app-l-courses',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgIf, NgFor],
    templateUrl: './l-courses.component.html',
    styleUrl: './l-courses.component.scss'
})
export class LCoursesComponent {

    displayedColumns: string[] = ['id', 'courseName', 'category', 'instructor', 'enrolled', 'startDate', 'endDate', 'price', 'action'];
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
    courseName: string;
    category: string;
    instructor: any;
    enrolled: number;
    startDate: string;
    endDate: string;
    price: any;
    action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        id: '#854',
        courseName: 'Cybersecurity Awareness',
        category: 'Technology',
        instructor: {
            img: 'images/users/user6.jpg',
            name: 'Oliver Khan'
        },
        enrolled: 180,
        startDate: '25 Mar 2024',
        endDate: '25 Apr 2024',
        price: '$49.99',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#853',
        courseName: 'Python Programming',
        category: 'Science',
        instructor: {
            img: 'images/users/user7.jpg',
            name: 'Ava Cooper'
        },
        enrolled: 250,
        startDate: '20 Mar 2024',
        endDate: '20 Apr 2024',
        price: '$45.32',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#852',
        courseName: 'Big Data Analytics',
        category: 'Health & Wellness',
        instructor: {
            img: 'images/users/user8.jpg',
            name: 'Isabella Evans'
        },
        enrolled: 320,
        startDate: '15 Mar 2024',
        endDate: '15 Apr 2024',
        price: '$99.00',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#851',
        courseName: 'Introduction to Blockchain',
        category: 'Education',
        instructor: {
            img: 'images/users/user9.jpg',
            name: 'Mia Hughes'
        },
        enrolled: 135,
        startDate: '10 Mar 2024',
        endDate: '10 Apr 2024',
        price: '$29.75',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#850',
        courseName: 'Network Administration',
        category: 'Food & Cooking',
        instructor: {
            img: 'images/users/user10.jpg',
            name: 'Noah Mitchell'
        },
        enrolled: 460,
        startDate: '05 Mar 2024',
        endDate: '05 Apr 2024',
        price: '$56.99',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#849',
        courseName: 'Artificial Intelligence',
        category: 'Lifestyle & Fashion',
        instructor: {
            img: 'images/users/user11.jpg',
            name: 'Oliver Khan'
        },
        enrolled: 515,
        startDate: '10 Feb 2024',
        endDate: '10 Mar 2024',
        price: '$78.75',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#854',
        courseName: 'Introduction Of Python',
        category: 'Technology',
        instructor: {
            img: 'images/users/user6.jpg',
            name: 'Oliver Khan'
        },
        enrolled: 180,
        startDate: '25 Mar 2024',
        endDate: '25 Apr 2024',
        price: '$49.99',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#853',
        courseName: 'Graphic Design Basics',
        category: 'Science',
        instructor: {
            img: 'images/users/user7.jpg',
            name: 'Ava Cooper'
        },
        enrolled: 250,
        startDate: '20 Mar 2024',
        endDate: '20 Apr 2024',
        price: '$45.32',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#852',
        courseName: 'Business Finance',
        category: 'Health & Wellness',
        instructor: {
            img: 'images/users/user8.jpg',
            name: 'Isabella Evans'
        },
        enrolled: 320,
        startDate: '15 Mar 2024',
        endDate: '15 Apr 2024',
        price: '$99.00',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#851',
        courseName: 'Photoshop Mastery',
        category: 'Education',
        instructor: {
            img: 'images/users/user9.jpg',
            name: 'Mia Hughes'
        },
        enrolled: 135,
        startDate: '10 Mar 2024',
        endDate: '10 Apr 2024',
        price: '$29.75',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#851',
        courseName: 'Photoshop Mastery',
        category: 'Education',
        instructor: {
            img: 'images/users/user9.jpg',
            name: 'Mia Hughes'
        },
        enrolled: 135,
        startDate: '10 Mar 2024',
        endDate: '10 Apr 2024',
        price: '$29.75',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#852',
        courseName: 'Business Finance',
        category: 'Health & Wellness',
        instructor: {
            img: 'images/users/user8.jpg',
            name: 'Isabella Evans'
        },
        enrolled: 320,
        startDate: '15 Mar 2024',
        endDate: '15 Apr 2024',
        price: '$99.00',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#853',
        courseName: 'Graphic Design Basics',
        category: 'Science',
        instructor: {
            img: 'images/users/user7.jpg',
            name: 'Ava Cooper'
        },
        enrolled: 250,
        startDate: '20 Mar 2024',
        endDate: '20 Apr 2024',
        price: '$45.32',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#854',
        courseName: 'Introduction Of Python',
        category: 'Technology',
        instructor: {
            img: 'images/users/user6.jpg',
            name: 'Oliver Khan'
        },
        enrolled: 180,
        startDate: '25 Mar 2024',
        endDate: '25 Apr 2024',
        price: '$49.99',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#849',
        courseName: 'Artificial Intelligence',
        category: 'Lifestyle & Fashion',
        instructor: {
            img: 'images/users/user11.jpg',
            name: 'Oliver Khan'
        },
        enrolled: 515,
        startDate: '10 Feb 2024',
        endDate: '10 Mar 2024',
        price: '$78.75',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#850',
        courseName: 'Network Administration',
        category: 'Food & Cooking',
        instructor: {
            img: 'images/users/user10.jpg',
            name: 'Noah Mitchell'
        },
        enrolled: 460,
        startDate: '05 Mar 2024',
        endDate: '05 Apr 2024',
        price: '$56.99',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#851',
        courseName: 'Introduction to Blockchain',
        category: 'Education',
        instructor: {
            img: 'images/users/user9.jpg',
            name: 'Mia Hughes'
        },
        enrolled: 135,
        startDate: '10 Mar 2024',
        endDate: '10 Apr 2024',
        price: '$29.75',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#852',
        courseName: 'Big Data Analytics',
        category: 'Health & Wellness',
        instructor: {
            img: 'images/users/user8.jpg',
            name: 'Isabella Evans'
        },
        enrolled: 320,
        startDate: '15 Mar 2024',
        endDate: '15 Apr 2024',
        price: '$99.00',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#853',
        courseName: 'Python Programming',
        category: 'Science',
        instructor: {
            img: 'images/users/user7.jpg',
            name: 'Ava Cooper'
        },
        enrolled: 250,
        startDate: '20 Mar 2024',
        endDate: '20 Apr 2024',
        price: '$45.32',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#854',
        courseName: 'Cybersecurity Awareness',
        category: 'Technology',
        instructor: {
            img: 'images/users/user6.jpg',
            name: 'Oliver Khan'
        },
        enrolled: 180,
        startDate: '25 Mar 2024',
        endDate: '25 Apr 2024',
        price: '$49.99',
        action: {
            view: 'visibility',
            edit: 'edit',
            delete: 'delete'
        }
    }
];