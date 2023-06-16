import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  title: string;

  menuDataSource: MenuDataModel[];

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    this.title = "";
    this.menuDataSource = new Array<MenuDataModel>();
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      console.log({data});
    });

    this.menuDataSource.push({
      id: 1,
      label: 'Inicio',
      path: '/admin/dashboard',
      icon: 'dashboard',
      state: 'active',
      code: 'DASHBOARD',
      order: 0,
    });
    this.menuDataSource.push({
      id: 1,
      label: 'Ordenes',
      path: '/admin/orders',
      icon: 'request_page',
      state: 'active',
      code: 'ORDERS',
      order: 1,
    });
    this.menuDataSource.push({
      id: 2,
      label: 'Clientes',
      path: '/admin/customers',
      icon: 'manage_accounts',
      state: 'active',
      code: 'MANAGE_ACCOUNTS',
      order: 2,
    });
    this.menuDataSource.push({
      id: 3,
      label: 'Tablero',
      path: '/admin/storages',
      icon: 'meeting_room',
      state: 'active',
      code: 'STORAGES',
      order: 3,
    });
    // this.menuDataSource.push({
    //   id: 4,
    //   label: 'Objetos',
    //   path: '/admin/shapes',
    //   icon: 'interests',
    //   state: 'active',
    //   code: 'SHAPES',
    //   order: 4,
    // });
    this.menuDataSource.push({
      id: 5,
      label: 'Configuración',
      path: '/admin/settings',
      icon: 'settings',
      state: 'active',
      code: 'SETTINGS',
      order: 5,
    });
  }

}

export class MenuDataModel {
  id: number;
  label: string;
  path: string;
  icon: string;
  state: string;
  code: string;
  order: number;

  constructor() {
    this.id = 0;
    this.label = '';
    this.path = '';
    this.icon = '';
    this.state = '';
    this.code = '';
    this.order = 0;
  }
}
