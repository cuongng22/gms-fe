import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgFor, NgIf } from '@angular/common';
import { TablesOfContentComponent } from './tables-of-content/tables-of-content.component';
import { CourseInstructorComponent } from './course-instructor/course-instructor.component';
import { EnrolledStudentsComponent } from './enrolled-students/enrolled-students.component';
import { ReviewsComponent } from './reviews/reviews.component';

@Component({
    selector: 'app-l-course-details',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, NgIf, NgFor, TablesOfContentComponent, CourseInstructorComponent, EnrolledStudentsComponent, ReviewsComponent],
    templateUrl: './l-course-details.component.html',
    styleUrl: './l-course-details.component.scss'
})
export class LCourseDetailsComponent {

    displayedColumns: string[] = ['id', 'courseName', 'category', 'instructor', 'enrolled', 'startDate', 'endDate', 'price', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

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
            // view: 'visibility',
            edit: 'edit'
            // delete: 'delete'
        }
    }
];