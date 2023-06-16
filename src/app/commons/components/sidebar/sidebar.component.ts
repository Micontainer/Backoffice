import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { threadSleep } from '../../functions/thread-sleep.function';


@Component({
  selector: 'app-slide-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  private readonly DEFAULT_ANIMATION_TIME: number = 300;
  private readonly SIDEBAR_CLASS: string = 'sidebar-visible';

  @Input() panelTitle: string = '';

  display: boolean = false;
  toggle: boolean = false;
  toggleSpinner: boolean = true;

  onCloseEvent: Subject<void>;

  private get body(): HTMLElement {
    return this.dom.body;
  }

  private get bodyHasSidebarClass(): boolean {
    return this.body.classList.contains(this.SIDEBAR_CLASS);
  }

  constructor(
    @Inject(DOCUMENT) private dom: Document,
    private renderer: Renderer2,
  ) {
    this.onCloseEvent = new Subject();
  }

  show(toggleSpinne: boolean = true): void {
    this.toggleBodyClass();
    this.toggleSpinner = toggleSpinne;
    this.toggle = true;
    this.display = true;
  }

  hide(): void {
    this.toggle = false;
    threadSleep(this.DEFAULT_ANIMATION_TIME).then(() => {
      this.display = false;
      this.onCloseEvent.next();
      this.toggleSpinner = true;
      this.toggleBodyClass();
    });
  }

  closePanelEventHandler(): void {
    this.hide();
  }

  hideSpinner(): void {
    this.toggleSpinner = false;
  }

  private toggleBodyClass(): void {
    if (this.bodyHasSidebarClass) {
      this.renderer.removeClass(this.body, this.SIDEBAR_CLASS);
      return;
    }
    this.renderer.addClass(this.body, this.SIDEBAR_CLASS);
  }

}
