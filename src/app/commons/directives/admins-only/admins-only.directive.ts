import { IdentityService } from 'src/app/commons/services/identity.service';
import { Directive, OnInit, ViewContainerRef, TemplateRef, Input, HostListener } from "@angular/core";

@Directive({
  selector: '[adminsOnly]',
})
export class AdminsOnlyDirective implements OnInit {

  currentUserRole: string = '';
  adminRoles: string[] = ['role-sudo', 'role-admin', 'role-owner'];

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private identityService: IdentityService,
  ) {
    this.currentUserRole = this.identityService.getLoggedUser()?.user.role.code || '';
  }

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    this.viewContainerRef.clear();
    if (this.checkPermission()) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  private checkPermission(): boolean {
    let hasPermission = false;
    for (const permission of this.adminRoles) {
      if (permission === this.currentUserRole) {
        hasPermission = true;
        break;
      }
    }
    return hasPermission;
  }
}
