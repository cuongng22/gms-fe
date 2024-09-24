import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FileUploadModule } from '@iplab/ngx-file-upload';

@Component({
    selector: 'app-e-edit-product',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, NgxEditorModule, FileUploadModule, MatDatepickerModule, MatNativeDateModule],
    templateUrl: './e-edit-product.component.html',
    styleUrl: './e-edit-product.component.scss'
})
export class EEditProductComponent {

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
    public multiple: boolean = true;

    // Select Value
    productTypeSelected = 'option1';
    brandTypeSelected = 'option1';
    categorySelected = 'option1';
    vendorSelected = 'option1';
    collectionSelected = 'option1';

}