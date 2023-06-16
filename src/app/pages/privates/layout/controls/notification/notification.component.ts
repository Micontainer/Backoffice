import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

  @Input() source: any = {
    name: 'Notification Name',
    subject: 'An awesome notification',
    type: 'default'
  };

  @Output() selectedEvent: EventEmitter<any>;

  get name(): string {
    return this.source.name;
  }

  get subject(): string {
    return this.source.subject;
  }

  get severity(): string {
    return this.source.severity;
  }

  constructor() {
    this.selectedEvent = new EventEmitter();
  }

}
