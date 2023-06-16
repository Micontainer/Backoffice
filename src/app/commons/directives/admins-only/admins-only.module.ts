import { NgModule } from '@angular/core';
import { AdminsOnlyDirective } from './admins-only.directive';

@NgModule({
  declarations: [AdminsOnlyDirective],
  exports: [AdminsOnlyDirective],
})
export class AdminsOnlyModule { }
