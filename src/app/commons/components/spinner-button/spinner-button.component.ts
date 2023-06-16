import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-spinner-button',
  templateUrl: './spinner-button.component.html',
  styleUrls: ['./spinner-button.component.scss'],
})
export class SpinnerButtonComponent {

  @Input() dynamicClass: string = '';
  @Input() label: string = '';
  @Input() toggle: boolean = false;
  @Input() icon: string = '';
  @Input() disabled: boolean = false;
  @Input() type: string = 'button';

  @Output() click: EventEmitter<void>;

  constructor() {
    this.click = new EventEmitter();
  }

}