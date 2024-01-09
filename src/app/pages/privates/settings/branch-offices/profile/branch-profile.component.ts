import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OptionItem } from 'src/app/commons/components/simple-menu';
import { BranchBasicComponent } from './basic/branch-basic.component';
import { BranchBuildingsComponent } from './buildings/branch-buildings.component';
import { BranchContactsComponent } from './contacts/branch-contacts.component';
import { BranchSchedulesComponent } from './schedules/branch-schedules.component';
import { CheckComponentSelectedEventHandler } from 'src/app/commons/components/simple-menu/simple-menu.functions';
import { BranchAreaComponent } from './area/branch-area.component';


@Component({
  selector: 'app-branch-profile',
  templateUrl: './branch-profile.component.html',
  styleUrls: ['./branch-profile.component.scss']
})
export class BranchProfileComponent implements OnInit {

  branchUID: string = '';
  get isEdition(): boolean {
    return !!this.branchUID;
  }

  @ViewChild('routerOutlet', { read: ViewContainerRef, static: true })
  routerOutletRef!: ViewContainerRef;

  components: Map<string, any> = new Map();

  set page(value: string) {
    this.routerOutletRef.clear();
    this.routerOutletRef.createComponent(this.components.get(value));
  }

  options: OptionItem[] = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.components.set('basic', BranchBasicComponent);
    this.components.set('schedules', BranchSchedulesComponent);
    this.components.set('contacts', BranchContactsComponent);
    this.components.set('buildings', BranchBuildingsComponent);
    this.components.set('area', BranchAreaComponent);

    this.activatedRoute.queryParams.subscribe(query => {
      this.branchUID = query['ref'] || '';
    });

    this.options = [
      {
        label: 'General',
        component: 'basic',
        link: '/admin/settings/branch-offices/create',
        selected: false,
      },
      {
        label: 'Horarios',
        component: 'schedules',
        link: '/admin/settings/branch-offices/create',
        selected: false,
        disabled: !this.isEdition,
      },
      {
        label: 'Contactos',
        component: 'contacts',
        link: '/admin/settings/branch-offices/create',
        selected: false,
        disabled: !this.isEdition,
      },
      {
        label: 'Edificios',
        component: 'buildings',
        link: '/admin/settings/branch-offices/create',
        selected: false,
        disabled: !this.isEdition,
      },
      {
        label: 'Area',
        component: 'area',
        link: '/admin/settings/branch-offices/create',
        selected: false,
        disabled: !this.isEdition,
      },
    ];
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(query => {
      const page = query['page'] ?? 'basic';
      this.page = page;
      CheckComponentSelectedEventHandler(this.options, page);
    });
  }

}