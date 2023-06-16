import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OptionItem } from 'src/app/commons/components/simple-menu';
import { LevelBasicComponent } from './basic/level-basic.component';
import { LevelSpacesComponent } from './spaces/level-spaces.component';
import { CheckComponentSelectedEventHandler } from 'src/app/commons/components/simple-menu/simple-menu.functions';


@Component({
  selector: 'app-branch-levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.scss']
})
export class LevelsComponent implements OnInit {

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
      link: '/admin/settings/branch-offices/levels',
      selected: false,
    },
    {
      label: 'Espacios',
      component: 'spaces',
      link: '/admin/settings/branch-offices/levels',
      selected: false,
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.components.set('basic', LevelBasicComponent);
    this.components.set('spaces', LevelSpacesComponent);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(query => {
      const page = query['page'] ?? 'basic';
      this.page = page;
      CheckComponentSelectedEventHandler(this.options, page);
    });
  }

}
