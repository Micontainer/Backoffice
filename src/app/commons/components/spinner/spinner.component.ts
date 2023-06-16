import { Component, Input } from "@angular/core";


@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {

  @Input() native: boolean = false;

  @Input() toggle: boolean = true;

  @Input() message: string = '';
  
}