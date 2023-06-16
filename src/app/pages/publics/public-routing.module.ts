import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";


const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: ''
  }
]


@NgModule({
  imports: [RouterModule.forChild(PUBLIC_ROUTES)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
