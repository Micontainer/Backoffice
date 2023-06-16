import { ImageGalleryBasicComponent } from './basic/image-gallery-basic.component';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OptionItem } from 'src/app/commons/components/simple-menu';
import { CheckComponentSelectedEventHandler } from 'src/app/commons/components/simple-menu/simple-menu.functions';


@Component({
  selector: 'app-image-gallery-profile',
  templateUrl: './image-gallery-profile.component.html',
  styleUrls: ['./image-gallery-profile.component.scss']
})
export class ImageGalleryProfileComponent implements OnInit {

  private readonly DefaultLink: string = '/admin/settings/shapes/profile';

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
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    this.components.set('basic', ImageGalleryBasicComponent);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(query => {
      const page = query['page'] ?? 'basic';
      this.page = page;
      CheckComponentSelectedEventHandler(this.options, page);
    });
  }

}
