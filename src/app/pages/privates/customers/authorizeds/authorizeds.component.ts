import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizedsBasicComponent } from './basic/authorizeds-basic.component';
import { OptionItem } from 'src/app/commons/components/simple-menu';
import { CheckComponentSelectedEventHandler } from 'src/app/commons/components/simple-menu/simple-menu.functions';


@Component({
  selector: 'app-authorizeds',
  templateUrl: './authorizeds.component.html',
  styleUrls: ['./authorizeds.component.scss']
})
export class AuthorizedsComponent implements OnInit {

  @ViewChild('routerOutlet', { read: ViewContainerRef, static: true })
  routerOutletRef!: ViewContainerRef;

  components: Map<string, any> = new Map();

  set page(value: string) {
    this.routerOutletRef.clear();
    this.routerOutletRef.createComponent(this.components.get(value));
  }

  options: OptionItem[] = [
    {
      label: 'General',
      component: 'basic',
      link: '/admin/customers/authorizeds',
      selected: false,
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.components.set('basic', AuthorizedsBasicComponent);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(query => {
      const page = query['page'] ?? 'basic';
      this.page = page;
      CheckComponentSelectedEventHandler(this.options, page);
    });
  }

}