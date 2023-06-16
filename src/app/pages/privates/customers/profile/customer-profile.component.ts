import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OptionItem } from 'src/app/commons/components/simple-menu';
import { CustomerBasicComponent } from './basic/customer-basic.component';
import { CustomerHistoryComponent } from './history/customer-history.component';
import { CustomerUserComponent } from './user/customer-user.component';
import { CustomerAuthorizedsComponent } from './authorizeds/customer-authorizeds.component';
import { CheckComponentSelectedEventHandler } from 'src/app/commons/components/simple-menu/simple-menu.functions';


@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {
  private readonly DefaultLink: string = '/admin/customers/profile';

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
      link: this.DefaultLink,
      selected: false,
    },
    {
      label: 'Autenticación',
      component: 'user',
      link: this.DefaultLink,
      selected: false,
    },
    {
      label: 'Autorizados',
      component: 'authorizeds',
      link: this.DefaultLink,
      selected: false,
    },
    {
      label: 'Historial',
      component: 'history',
      link: this.DefaultLink,
      selected: false,
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    this.components.set('basic', CustomerBasicComponent);
    this.components.set('user', CustomerUserComponent);
    this.components.set('history', CustomerHistoryComponent);
    this.components.set('authorizeds', CustomerAuthorizedsComponent);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(query => {
      const page = query['page'] ?? 'basic';
      this.page = page;
      CheckComponentSelectedEventHandler(this.options, page);
    });
  }

}
