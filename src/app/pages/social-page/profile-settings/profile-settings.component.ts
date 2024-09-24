import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { MatSelectModule } from '@angular/material/select';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';

@Component({
    selector: 'app-profile-settings',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatCheckboxModule, MatRadioModule, MatButtonModule, MatFormFieldModule, MatInputModule, FileUploadModule, MatSelectModule],
    templateUrl: './profile-settings.component.html',
    styleUrl: './profile-settings.component.scss'
})
export class ProfileSettingsComponent {

    // Password Hide
    hide = true;
    hide2 = true;

    // Select Value
    countrySelected = 'option1';
    skillsSelected = 'option2';
    professionSelected = 'option3';

    // File Uploader
    public multiple: boolean = false;

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