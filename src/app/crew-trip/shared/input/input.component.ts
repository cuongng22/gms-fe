import { Component, ElementRef, inject, input, OnInit } from '@angular/core';

@Component({
  selector: 'sizeInput,[sizeInput]',
  standalone: true,
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent implements OnInit {

  sizeInput = input<string>('md');
  inputField = inject(ElementRef);

  ngOnInit(): void {
    this.inputField.nativeElement.children[0].classList.add(`size-input-${this.sizeInput()}`);
  }


}
