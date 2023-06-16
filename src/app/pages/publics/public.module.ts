import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { PublicRoutingModule } from "./public-routing.module";
import { LoginComponent } from "./login/login.component";

import { PublicService } from "src/app/commons/services/public.service";


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    PublicService,
  ],
})
export class PublicModule { }
