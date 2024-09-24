import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { NgIf } from '@angular/common';
import { AttachmentsComponent } from './attachments/attachments.component';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-hd-ticket-details',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, NgIf, AttachmentsComponent, NgxEditorModule],
    templateUrl: './hd-ticket-details.component.html',
    styleUrl: './hd-ticket-details.component.scss'
})
export class HdTicketDetailsComponent {

    displayedColumns: string[] = ['id', 'ticketTitle', 'requester', 'assignedTo', 'createdDate', 'dueDate', 'priority', 'status', 'action'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

    // Text Editor
    editor: Editor;
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['link', 'image'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

    ngOnInit(): void {
        this.editor = new Editor();
    }

    // make sure to destory the editor
    ngOnDestroy(): void {
        this.editor.destroy();
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
    id: string;
    ticketTitle: string;
    requester: string;
    assignedTo: string;
    createdDate: string;
    dueDate: string;
    priority: string;
    status: any;
    action: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        id: '#JAN-854',
        ticketTitle: 'Network Infrastructure',
        requester: 'Walter Frazier',
        assignedTo: 'Oliver Clark',
        createdDate: '20 Apr 2024',
        dueDate: '30 Apr 2024',
        priority: 'High',
        status: {
            finished: true,
            pending: false,
            inProgress: false,
            cancelled: false
        },
        action: {
            edit: 'edit'
        }
    }
];