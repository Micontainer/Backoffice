import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnInit, ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-simple-table',
  template: `
  <section class="st-element" [ngStyle]="style">
    <ng-content></ng-content>
  </section>
  `,
  styles: [`
  .st-element {
    background: rgb(255, 255, 255);
    border-radius: 6px;
    border: 1px solid rgb(219, 214, 225);
    box-shadow: rgb(43 34 51 / 4%) 0px 1px 4px;
    margin-bottom: 16px;
    position: relative;
    display: grid;
    /* grid-template-columns: repeat(3, auto); */
    overflow: auto;

    & > * {
      padding: 16px;
    }

    /* & > :nth-last-child(n+4) {
      border-bottom: 1px solid rgb(219, 214, 225);
    } */

    .st-header {
      color: rgb(128, 112, 143);
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      border-radius: 4px 4px 0px 0px;
      background: rgb(250, 249, 251);
      line-height: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 45px;
      border-bottom: 1px solid rgb(219, 214, 225);
    }

    .st-row {
      display: flex;
      align-items: center;
      line-height: 1.2;
      font-size: 12px;
      min-width: 250px;
      border-bottom: 1px solid rgb(219, 214, 225);
    }
  }
  `],
  host: {
    class: 'simple-table',
  },
  encapsulation: ViewEncapsulation.None,
})
export class SimpleTableComponent implements OnInit {

  style!: Style;

  @Input() set columns(value: number) {
    if (!value) {
      value = 3;
    }

    this.style = {
      'grid-template-columns': `repeat(${value}, auto)`,
    }
  }

  constructor() { }

  ngOnInit(): void { }

}

interface Style {
  [name: string]: string;
}

@NgModule({
  declarations: [SimpleTableComponent],
  imports: [CommonModule],
  exports: [SimpleTableComponent],
})
export class SimpleTableModule { }
