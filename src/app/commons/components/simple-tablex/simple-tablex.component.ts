import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, NgModule, OnInit, TemplateRef } from '@angular/core';
import { SimpleColumn } from './simple-tablex.api';


@Component({
  selector: 'app-simple-tablex',
  templateUrl: './simple-tablex.component.html',
  styleUrls: ['./simple-tablex.component.scss']
})
export class SimpleTablexComponent implements OnInit {

  @Input() set columns(value: SimpleColumn[]) {
    console.log({value});
    this.columnsRef = value;
    this.style = {
      'grid-template-columns': `repeat(${value.length}, auto)`,
    };
  }

  @Input() source: any[] = new Array<any>();

  @ContentChild('simpleHeader') simpleHeader: TemplateRef<any> | undefined;
  @ContentChild('headers') headers: TemplateRef<any> | undefined;
  @ContentChild('rows') rows: TemplateRef<any> | undefined;
  @ContentChild('simpleFooter') simpleFooter: TemplateRef<any> | undefined;

  columnsRef: SimpleColumn[] = new Array<SimpleColumn>();
  rowsRef: any[] = new Array<any>();

  style!: Style;

  constructor() { }

  ngOnInit(): void { }

}

interface Style {
  [name: string]: string;
}

@NgModule({
  declarations: [SimpleTablexComponent],
  imports: [CommonModule],
  exports: [SimpleTablexComponent],
})
export class SimpleTablexModule { }
