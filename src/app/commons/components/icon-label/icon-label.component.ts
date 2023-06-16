import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-icon-label',
  templateUrl: './icon-label.component.html',
  styleUrls: ['./icon-label.component.scss']
})
export class IconLabelComponent {

  @Input() icon: string = "info";
  @Input() label: string = "Se require más información.";
  @Input() styleClass: string = "";
  @Input() styleWrapper: string = "";

}
