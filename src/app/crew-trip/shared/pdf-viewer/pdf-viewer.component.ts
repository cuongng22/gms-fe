import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
	selector: 'app-pdf-viewer',
	standalone: true,
	imports: [PdfViewerModule, MatDialogContent],
	templateUrl: './pdf-viewer.component.html',
	styleUrl: './pdf-viewer.component.scss',
})
export class PdfViewerComponent implements OnInit, OnDestroy {
	@Input() pdfSrc!: any;
	sanitize: any;
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { pdfSrc: string },
		sanitizer: DomSanitizer,
	) {
		this.sanitize = sanitizer;
	}

	ngOnInit(): void {
		this.pdfSrc = this.data.pdfSrc;
	}

	ngOnDestroy(): void {
		this.pdfSrc = ''; // Reset URL để tránh lỗi resource
	}
}
