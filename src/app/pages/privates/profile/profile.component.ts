import { CheckComponentSelectedEventHandler } from 'src/app/commons/components/simple-menu/simple-menu.functions';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OptionItem } from 'src/app/commons/components/simple-menu';
import { ProfileBasicComponent } from './basic/basic.component';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  private readonly DefaultLink: string = '/admin/profile';

  options: OptionItem[] = [
    {
      label: 'General',
      component: 'basic',
      link: this.DefaultLink,
      selected: true,
    },
  ];

  @ViewChild('routerOutlet', { read: ViewContainerRef, static: true })
  routerOutletRef!: ViewContainerRef;

  components: Map<string, any> = new Map();
  queryParamsSubscription: Subscription = new Subscription();

  set page(value: string) {
    this.routerOutletRef.clear();
    this.routerOutletRef.createComponent(this.components.get(value));
  }

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    this.components.set('basic', ProfileBasicComponent);
  }

  ngOnInit(): void {
    this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe(query => {
      const page = query['page'] ?? 'basic';
      this.page = page;
      CheckComponentSelectedEventHandler(this.options, page);
    });
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription.unsubscribe();
  }
}
