import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-no-content-component',
  template: `
  <div id="no-content-component">
      <p class="material-icons">{{icon}}</p>
      <h2>{{text}}</h2>
  </div>`,
  styles: [`
    :host {}

    #no-content-component {
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column;

      .material-icons {
        font-size: 5em;
      }
    }
  `],
})
export class NoContentComponent {
  @Input('text') text: string = 'No hay contentido para mostrar';
  @Input('icon') icon: string = 'sentiment_dissatisfied';

  constructor() { }
}