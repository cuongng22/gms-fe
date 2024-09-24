import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-edit-an-event',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, FileUploadModule, NgxEditorModule, MatNativeDateModule],
    templateUrl: './edit-an-event.component.html',
    styleUrl: './edit-an-event.component.scss'
})
export class EditAnEventComponent {

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

    // File Uploader
    public multiple: boolean = false;

    // Select Value
    ticketTypeSelected = 'option1';
    eventTypeSelected = 'option1';
    eventCountrySelected = 'option1';
    eventStateSelected = 'option1';
    eventCitySelected = 'option1';
    eventTimeSelected = 'option1';

}