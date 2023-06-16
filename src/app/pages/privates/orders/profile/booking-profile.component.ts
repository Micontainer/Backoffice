import { BookingInvoicesComponent } from './invoices/booking-invoices.component';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OptionItem } from 'src/app/commons/components/simple-menu';
import { BookingBasicComponent } from './basic/booking-basic.component';
import { CheckComponentSelectedEventHandler } from 'src/app/commons/components/simple-menu/simple-menu.functions';


@Component({
  selector: 'app-booking-profile',
  templateUrl: './booking-profile.component.html',
  styleUrls: ['./booking-profile.component.scss']
})
export class BookingProfileComponent implements OnInit {
  private readonly DefaultLink: string = '/admin/orders/profile';

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
      label: 'Facturas',
      component: 'invoices',
      link: this.DefaultLink,
      selected: false,
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    this.components.set('basic', BookingBasicComponent);
    this.components.set('invoices', BookingInvoicesComponent);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(query => {
      const page = query['page'] ?? 'basic';
      this.page = page;
      CheckComponentSelectedEventHandler(this.options, page);
    });
  }
}
