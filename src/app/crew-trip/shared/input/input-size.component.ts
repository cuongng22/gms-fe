import { Component, ElementRef, inject, input, OnInit } from '@angular/core';

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
    this.inputField.nativeElement.children[0].classList.add(`size-input-${this.sizeInput()}`);
  }


}
