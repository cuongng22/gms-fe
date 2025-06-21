import { SelectionModel } from '@angular/cdk/collections';
import { Component, inject, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import {
	MatCell,
	MatCellDef,
	MatColumnDef,
	MatHeaderCell,
	MatHeaderCellDef,
	MatHeaderRow,
	MatHeaderRowDef,
	MatNoDataRow,
	MatRow,
	MatRowDef,
	MatTable,
} from '@angular/material/table';
import { NgxEditorModule } from 'ngx-editor';
import { NgxTrimDirectiveModule } from 'ngx-trim-directive';
import { NotificationService } from 'src/app/crew-trip/core/services/notification.service';
import { CommonComponent } from 'src/app/crew-trip/shared/common.component';
import { DataTransformPipe } from 'src/app/crew-trip/shared/data-transform.pipe';

@Component({
	selector: 'app-notification',
	standalone: true,
	imports: [
		FormsModule,
		MatCard,
		MatCardContent,
		ReactiveFormsModule,
		MatFormFieldModule,
		NgxTrimDirectiveModule,
		MatButton,
		NgxEditorModule,
		MatMenuModule,
		MatDatepickerModule,
		MatCardModule,
		MatTable,
		MatColumnDef,
		MatHeaderCell,
		MatHeaderCellDef,
		MatHeaderRow,
		MatHeaderRowDef,
		MatNoDataRow,
		MatRow,
		MatRowDef,
		MatCell,
		MatCellDef,
		MatPaginator,
		DataTransformPipe,
		MatInputModule,
		MatCheckboxModule,
	],
	templateUrl: './notification.component.html',
	styleUrl: './notification.component.scss',
})
export class NotificationComponent extends CommonComponent {
	override baseService: NotificationService = inject(NotificationService);
	override displayedColumns: string[] = [
		'select',
		'receiver',
		'title',
		'content',
		'timeSend',
		'status',
	];
	override selection = new SelectionModel<any>(true, []);
	READ = $localize`:@@read:Read`;
	UNREAD = $localize`:@@unread:Unread`;

	reloadSearch = output<string>();

	override ngOnInit(): void {
		this.search({ mode: 1 });
	}

	markAsRead() {
		if (this.selection.isEmpty()) {
			this.showError(
				$localize`:@@:Cannot mask as read notifications if no notifications is selected`,
			);
			return;
		}
		this.toggleDialogDelete();
	}

	async confirmMaskAsRead() {
		const _ids = this.selection.selected.map((item) => item.id);
		try {
			await this.spinner.show();
			const response = await this.baseService.maskAsRead(_ids);
			this.showSuccess(this.MESSAGE.UPDATE_SUCCESS);
			this.reloadSearch.emit('Reload');
		} catch (error) {
			console.error(error);
		} finally {
			this.toggleDialogDelete();
		}
	}
}
