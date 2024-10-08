import {Component, ElementRef, inject, input, OnInit} from '@angular/core';

@Component({
  selector: 'sizeInput,[sizeInput]',
  standalone: true,
  imports: [],
  templateUrl: './input-size.component.html',
  styleUrl: './input-size.component.scss'
})
export class InputSizeComponent implements OnInit {

  sizeInput = input<string>('md');
  inputField = inject(ElementRef);

  ngOnInit(): void {
    let form = Array.from(this.inputField.nativeElement.children);
    form.forEach((s: any) => {
      if (s.localName === 'mat-form-field') {
        s.classList.add(`size-input-${this.sizeInput()}`);
      }
    })
  }


}
