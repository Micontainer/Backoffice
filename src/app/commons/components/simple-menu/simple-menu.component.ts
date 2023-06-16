import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, NgModule, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { OptionItem } from './simple-menu.api';


@Component({
  selector: 'app-simple-menu',
  template: `
  <section class="simple-menu-element">
    <div class="options list-group">
      <div class="option-heading list-group-item">{{headerText}}</div>
      <ng-template *ngTemplateOutlet="
        optionsTemplate || defaultTemplate"></ng-template>
    </div>
  </section>
  <ng-template #defaultTemplate>
    No hay opciones disponibles
  </ng-template>
  `,
  styleUrls: [`simple-menu.component.scss`],
  host: {
    class: 'simple-menu',
  },
  encapsulation: ViewEncapsulation.None,
})
export class SimpleMenuComponent implements OnInit {

  @Input() headerText: string = '';

  @Input() options: OptionItem[] = new Array<OptionItem>();

  @ContentChild('optionsTemplate') optionsTemplate: TemplateRef<any> | undefined;

  constructor() { }

  ngOnInit(): void { }

}


@NgModule({
  declarations: [SimpleMenuComponent],
  imports: [CommonModule],
  exports: [SimpleMenuComponent],
})
export class SimpleMenuModule { }
