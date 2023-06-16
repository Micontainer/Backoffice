import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { IdentityService } from 'src/app/commons/services/identity.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  @Output() toggleSidebarEvent: EventEmitter<void>;

  userName: string;
  sessionSubscription: Subscription;

  constructor(
    private identityService: IdentityService
  ) {
    this.toggleSidebarEvent = new EventEmitter();
    this.userName = this.identityService.getLoggedUser()?.user.fullName || '';
    this.sessionSubscription = new Subscription()
  }

  ngOnInit(): void {
    this.sessionSubscription = this.identityService.sessionSubscription.subscribe((user) => {
      if (!user) {
        return;
      }
      this.userName = user.user.fullName;
    })
  }

  ngOnDestroy(): void {
    this.sessionSubscription.unsubscribe();
  }

  notificationClickEventHandler(): void {
    this.toggleSidebarEvent.emit();
  }

}
