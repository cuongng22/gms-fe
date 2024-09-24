import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FileUploadModule } from '@iplab/ngx-file-upload';

@Component({
    selector: 'app-l-instructors',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatPaginatorModule, NgFor, NgIf, NgClass, MatFormFieldModule, MatInputModule, MatSelectModule, FileUploadModule],
    templateUrl: './l-instructors.component.html',
    styleUrl: './l-instructors.component.scss'
})
export class LInstructorsComponent {

    displayedColumns: string[] = ['id', 'user', 'courses', 'totalEarnings', 'email', 'ratings', 'status', 'action'];
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

    // New Popup Trigger
    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
    }

}

export interface PeriodicElement {
    id: string;
    user: any;
    courses: number;
    totalEarnings: string;
    email: string;
    ratings: any;
    status: any;
    action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        id: '#A-1217',
        user: {
            img: 'images/users/user13.jpg',
            name: 'Olivia Clark',
            email: 'Big Data'
        },
        courses: 55,
        totalEarnings: '$6,855.00',
        email: 'olivia@trezo.com',
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
        ],
        status: {
            active: true,
            deactive: false
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-1364',
        user: {
            img: 'images/users/user16.jpg',
            name: 'Ava Turner',
            email: 'UX/UI'
        },
        courses: 120,
        totalEarnings: '$258.00',
        email: 'ava@trezo.com',
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
        ],
        status: {
            active: false,
            deactive: true
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-2951',
        user: {
            img: 'images/users/user17.jpg',
            name: 'Lucas Morgan',
            email: 'Developer'
        },
        courses: 86,
        totalEarnings: '$3890.00',
        email: 'lucas@trezo.com',
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
        ],
        status: {
            active: true,
            deactive: false
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-7342',
        user: {
            img: 'images/users/user18.jpg',
            name: 'Isabella Cooper',
            email: 'Designer'
        },
        courses: 75,
        totalEarnings: '$2500.00',
        email: 'isabella@trezo.com',
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
        ],
        status: {
            active: true,
            deactive: false
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-1217',
        user: {
            img: 'images/users/user13.jpg',
            name: 'Olivia Clark',
            email: 'Big Data'
        },
        courses: 55,
        totalEarnings: '$6,855.00',
        email: 'olivia@trezo.com',
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
        ],
        status: {
            active: true,
            deactive: false
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-1364',
        user: {
            img: 'images/users/user16.jpg',
            name: 'Ava Turner',
            email: 'UX/UI'
        },
        courses: 120,
        totalEarnings: '$258.00',
        email: 'ava@trezo.com',
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
        ],
        status: {
            active: false,
            deactive: true
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-2951',
        user: {
            img: 'images/users/user17.jpg',
            name: 'Lucas Morgan',
            email: 'Developer'
        },
        courses: 86,
        totalEarnings: '$3890.00',
        email: 'lucas@trezo.com',
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
        ],
        status: {
            active: true,
            deactive: false
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-7342',
        user: {
            img: 'images/users/user18.jpg',
            name: 'Isabella Cooper',
            email: 'Designer'
        },
        courses: 75,
        totalEarnings: '$2500.00',
        email: 'isabella@trezo.com',
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
        ],
        status: {
            active: true,
            deactive: false
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-1217',
        user: {
            img: 'images/users/user13.jpg',
            name: 'Olivia Clark',
            email: 'Big Data'
        },
        courses: 55,
        totalEarnings: '$6,855.00',
        email: 'olivia@trezo.com',
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
        ],
        status: {
            active: true,
            deactive: false
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-1364',
        user: {
            img: 'images/users/user16.jpg',
            name: 'Ava Turner',
            email: 'UX/UI'
        },
        courses: 120,
        totalEarnings: '$258.00',
        email: 'ava@trezo.com',
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
        ],
        status: {
            active: false,
            deactive: true
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-2951',
        user: {
            img: 'images/users/user17.jpg',
            name: 'Lucas Morgan',
            email: 'Developer'
        },
        courses: 86,
        totalEarnings: '$3890.00',
        email: 'lucas@trezo.com',
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
        ],
        status: {
            active: true,
            deactive: false
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-7342',
        user: {
            img: 'images/users/user18.jpg',
            name: 'Isabella Cooper',
            email: 'Designer'
        },
        courses: 75,
        totalEarnings: '$2500.00',
        email: 'isabella@trezo.com',
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
        ],
        status: {
            active: true,
            deactive: false
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-1217',
        user: {
            img: 'images/users/user13.jpg',
            name: 'Olivia Clark',
            email: 'Big Data'
        },
        courses: 55,
        totalEarnings: '$6,855.00',
        email: 'olivia@trezo.com',
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
        ],
        status: {
            active: true,
            deactive: false
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-1364',
        user: {
            img: 'images/users/user16.jpg',
            name: 'Ava Turner',
            email: 'UX/UI'
        },
        courses: 120,
        totalEarnings: '$258.00',
        email: 'ava@trezo.com',
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
        ],
        status: {
            active: false,
            deactive: true
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-2951',
        user: {
            img: 'images/users/user17.jpg',
            name: 'Lucas Morgan',
            email: 'Developer'
        },
        courses: 86,
        totalEarnings: '$3890.00',
        email: 'lucas@trezo.com',
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
        ],
        status: {
            active: true,
            deactive: false
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-7342',
        user: {
            img: 'images/users/user18.jpg',
            name: 'Isabella Cooper',
            email: 'Designer'
        },
        courses: 75,
        totalEarnings: '$2500.00',
        email: 'isabella@trezo.com',
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
        ],
        status: {
            active: true,
            deactive: false
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-1217',
        user: {
            img: 'images/users/user13.jpg',
            name: 'Olivia Clark',
            email: 'Big Data'
        },
        courses: 55,
        totalEarnings: '$6,855.00',
        email: 'olivia@trezo.com',
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
        ],
        status: {
            active: true,
            deactive: false
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-1364',
        user: {
            img: 'images/users/user16.jpg',
            name: 'Ava Turner',
            email: 'UX/UI'
        },
        courses: 120,
        totalEarnings: '$258.00',
        email: 'ava@trezo.com',
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
        ],
        status: {
            active: false,
            deactive: true
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-2951',
        user: {
            img: 'images/users/user17.jpg',
            name: 'Lucas Morgan',
            email: 'Developer'
        },
        courses: 86,
        totalEarnings: '$3890.00',
        email: 'lucas@trezo.com',
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
        ],
        status: {
            active: true,
            deactive: false
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    },
    {
        id: '#A-7342',
        user: {
            img: 'images/users/user18.jpg',
            name: 'Isabella Cooper',
            email: 'Designer'
        },
        courses: 75,
        totalEarnings: '$2500.00',
        email: 'isabella@trezo.com',
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
        ],
        status: {
            active: true,
            deactive: false
        },
        action: {
            // view: 'visibility',
            // edit: 'edit',
            delete: 'delete'
        }
    }
];