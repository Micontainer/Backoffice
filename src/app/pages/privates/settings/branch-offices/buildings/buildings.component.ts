import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingBasicComponent } from './basic/building-basic.component';
import { BuildingLevelsComponent } from './levels/building-levels.component';
import { OptionItem } from 'src/app/commons/components/simple-menu';
import { CheckComponentSelectedEventHandler } from 'src/app/commons/components/simple-menu/simple-menu.functions';


@Component({
  selector: 'app-branch-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss']
})
export class BuildingsComponent implements OnInit {

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
      link: '/admin/settings/branch-offices/buildings',
      selected: false,
    },
    {
      label: 'Niveles',
      component: 'levels',
      link: '/admin/settings/branch-offices/buildings',
      selected: false,
    },
    // {
    //   label: 'Contactos',
    //   component: 'contacts',
    //   link: '/admin/settings/branch-offices/buildings',
    // },
    // {
    //   label: 'Edificios',
    //   component: 'buildings',
    //   link: '/admin/settings/branch-offices/buildings',
    // },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.components.set('basic', BuildingBasicComponent);
    this.components.set('levels', BuildingLevelsComponent);
    // this.components.set('schedules', BranchSchedulesComponent);
    // this.components.set('contacts', BranchContactsComponent);
    // this.components.set('buildings', BranchBuildingsComponent);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(query => {
      const page = query['page'] ?? 'basic';
      this.page = page;
      CheckComponentSelectedEventHandler(this.options, page);
    });
  }

}