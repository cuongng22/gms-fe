import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SellerOverviewComponent } from './seller-overview/seller-overview.component';
import { RevenueComponent } from './revenue/revenue.component';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductsComponent } from './products/products.component';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-e-seller-details',
    standalone: true,
    imports: [RouterLink, SellerOverviewComponent, RevenueComponent, MatCardModule, MatMenuModule, MatButtonModule, NgxEditorModule, MatFormFieldModule, MatInputModule, ProductsComponent],
    templateUrl: './e-seller-details.component.html',
    styleUrl: './e-seller-details.component.scss'
})
export class ESellerDetailsComponent {

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