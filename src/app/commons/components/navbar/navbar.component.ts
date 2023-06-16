
import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  @Input("section") section = "";
  @Input("subSection") subSection = "";

  // private readonly SidebarToggle: string = 'sidebar-toggle';
  private readonly SidebarToggleClass: string = 'sb-sidenav-toggled';

  private toggleSidenav: boolean = false;

  get domBody(): HTMLElement {
    return this.dom.body;
  }

  constructor(
    @Inject(DOCUMENT) private dom: Document,
    private renderer: Renderer2,
  ) { }

  toggleSidebarClickEventHandler(): void {
    try {
      // let sidebarToggle = this.storageService.get(this.SidebarToggle);

      // if (sidebarToggle && sidebarToggle === 'true') {
      //   this.updateSidebarClass(false);
      //   this.updateSidebarToggle('false');
      //   return;
      // }
      if (this.toggleSidenav) {
        this.updateSidebarClass(false);
        this.updateSidebarToggle('false');
        return;
      }

      this.updateSidebarClass();
      this.updateSidebarToggle();
    }
    finally {
      this.toggleSidenav = !this.toggleSidenav;
    }
  }

  updateSidebarToggle(value: string = 'true'): void {
    // this.storageService.set(this.SidebarToggle, value);
  }

  updateSidebarClass(add: boolean = true): void {
    if (add) {
      this.renderer.addClass(this.domBody, this.SidebarToggleClass);
      return;
    }
    this.renderer.removeClass(this.domBody, this.SidebarToggleClass);
  }

  logoutEventHandler(): void { }

}
