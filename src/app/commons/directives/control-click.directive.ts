import { Directive, ElementRef, EventEmitter, Host, OnDestroy, OnInit, Optional, Output, Renderer2, Self } from '@angular/core';


@Directive({
  selector: '[ctrlClick]'
})
export class ControlClickDirective implements OnInit, OnDestroy {

  @Output() ctrlClickEvent: EventEmitter<void>;

  private unsubscribe: any;

  private element: HTMLDivElement;

  constructor(
    @Host() @Self() @Optional() hostDiv: ElementRef<HTMLDivElement>,
    private readonly renderer: Renderer2
  ) {
    this.ctrlClickEvent = new EventEmitter();
    this.element = hostDiv.nativeElement;
  }

  ngOnInit(): void {
    this.unsubscribe = this.renderer.listen(this.element, 'click', event => {
      if (event.ctrlKey) {
        event.preventDefault();
        event.stopPropagation();
        this.ctrlClickEvent.emit(event);
        return;
      }
    });
  }

  ngOnDestroy(): void {
    if (!this.unsubscribe) {
      return;
    }

    this.unsubscribe();
  }

}
