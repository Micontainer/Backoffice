import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OptionItem } from 'src/app/commons/components/simple-menu';
import { UserBasicComponent } from './basic/user-basic.component';
import { UserDocumentationComponent } from './documentation/user-documentation.component';


@Component({
  selector: 'app-users-profile',
  templateUrl: './users-profile.component.html',
  styleUrls: ['./users-profile.component.scss']
})
export class UsersProfileComponent implements OnInit {

  private readonly DefaultLink: string = '/admin/settings/users/profile';

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
      label: 'Documentación',
      component: 'documentation',
      link: this.DefaultLink,
      selected: false,
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    this.components.set('basic', UserBasicComponent);
    this.components.set('documentation', UserDocumentationComponent);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(query => {
      const page = query['page'] ?? 'basic';
      this.page = page;
      this.checkComponentSelectedEventHandler(page);
    });
  }

  checkComponentSelectedEventHandler(component: string) {
    this.options.forEach((opt) => {
      opt.selected = opt.component === component;
    });
  }
}
