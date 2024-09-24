import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
    CdkDragDrop,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-pm-kanban-board',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, CdkDropList, CdkDrag, CdkDropListGroup, NgIf, NgClass, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
    templateUrl: './pm-kanban-board.component.html',
    styleUrl: './pm-kanban-board.component.scss'
})
export class PmKanbanBoardComponent {

    // To Do
    toDo : any = [
        {
            title: `Project Requirements`,
            description: `A brief description of the project, its objectives, and its importance to the organization.`,
            daysLeft: `5 days left`,
            bgClass: `bg-purple-100`,
            users: [
                {
                    img: `images/users/user6.jpg`
                },
                {
                    img: `images/users/user7.jpg`
                },
                {
                    img: `images/users/user8.jpg`
                }
            ]
        },
        {
            title: `WordPress Theme`,
            description: `A brief description of the project, its objectives, and its importance to the organization.`,
            daysLeft: `7 days left`,
            bgClass: `bg-secondary-100`,
            users: [
                {
                    img: `images/users/user9.jpg`
                },
                {
                    img: `images/users/user10.jpg`
                }
            ]
        },
        {
            title: `UX/UI Design`,
            description: `A brief description of the project, its objectives, and its importance to the organization.`,
            daysLeft: `10 days left`,
            bgClass: `bg-success-100`,
            users: [
                {
                    img: `images/users/user11.jpg`
                },
                {
                    img: `images/users/user12.jpg`
                },
                {
                    img: `images/users/user13.jpg`
                }
            ]
        },
        {
            title: `Project Analysis`,
            description: `A brief description of the project, its objectives, and its importance to the organization.`,
            daysLeft: `14 days left`,
            bgClass: `bg-orange-100`,
            users: [
                {
                    img: `images/users/user14.jpg`
                },
                {
                    img: `images/users/user15.jpg`
                }
            ]
        },
        {
            title: `Competitor Research `,
            description: `A brief description of the project, its objectives, and its importance to the organization.`,
            daysLeft: `15 days left`,
            bgClass: `bg-primary-100`,
            users: [
                {
                    img: `images/users/user16.jpg`
                },
                {
                    img: `images/users/user17.jpg`
                }
            ]
        }
    ];

    // Doing
    doing : any = [
        {
            title: `React Template`,
            description: `A brief description of the project, its objectives, and its importance to the organization.`,
            daysLeft: `3 days left`,
            bgClass: `bg-orange-100`,
            users: [
                {
                    img: `images/users/user18.jpg`
                },
                {
                    img: `images/users/user19.jpg`
                }
            ]
        },
        {
            title: `Laravel Project`,
            description: `A brief description of the project, its objectives, and its importance to the organization.`,
            daysLeft: `5 days left`,
            bgClass: `bg-purple-100`,
            users: [
                {
                    img: `images/users/user20.jpg`
                },
                {
                    img: `images/users/user21.jpg`
                },
                {
                    img: `images/users/user22.jpg`
                }
            ]
        },
        {
            title: `Project Requirements`,
            description: `A brief description of the project, its objectives, and its importance to the organization.`,
            daysLeft: `7 days left`,
            bgClass: `bg-danger-100`,
            users: [
                {
                    img: `images/users/user23.jpg`
                }
            ]
        },
        {
            title: `UX/UI Design`,
            description: `A brief description of the project, its objectives, and its importance to the organization.`,
            daysLeft: `9 days left`,
            bgClass: `bg-success-100`,
            users: [
                {
                    img: `images/users/user24.jpg`
                },
                {
                    img: `images/users/user25.jpg`
                }
            ]
        }
    ];

    // Done
    done : any = [
        {
            title: `Admin Template`,
            description: `A brief description of the project, its objectives, and its importance to the organization.`,
            daysLeft: `3 days left`,
            bgClass: `bg-primary-100`,
            users: [
                {
                    img: `images/users/user26.jpg`
                },
                {
                    img: `images/users/user27.jpg`
                },
                {
                    img: `images/users/user28.jpg`
                }
            ]
        },
        {
            title: `eCommerce Template`,
            description: `A brief description of the project, its objectives, and its importance to the organization.`,
            daysLeft: `7 days left`,
            bgClass: `bg-purple-100`,
            users: [
                {
                    img: `images/users/user29.jpg`
                },
                {
                    img: `images/users/user30.jpg`
                }
            ]
        },
        {
            title: `Shopify Theme`,
            description: `A brief description of the project, its objectives, and its importance to the organization.`,
            daysLeft: `10 days left`,
            bgClass: `bg-success-100`,
            users: [
                {
                    img: `images/users/user11.jpg`
                },
                {
                    img: `images/users/user12.jpg`
                },
                {
                    img: `images/users/user13.jpg`
                }
            ]
        }
    ];

    // Drag and Drop
    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
        }
    }

    // Popup Trigger
    classApplied = false;
    toggleClass() {
        this.classApplied = !this.classApplied;
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