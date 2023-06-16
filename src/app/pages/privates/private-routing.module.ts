import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from './layout/layout.component';


const PRIVATE_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.module').then(module => module.DashboardModule),
      },
      // {
      //   path: 'branch-offices',
      //   loadChildren: () => import('./branch-offices/branch-offices.module').then(module => module.BranchOfficesModule),
      // },
      {
        path: 'storages',
        loadChildren: () => import('./storages/storages.module').then(module => module.StoragesModule),
      },
      {
        path: 'shapes',
        loadChildren: () => import('./shapes/shapes.module').then(module => module.ShapesModule),
      },
      {
        path: 'orders',
        loadChildren: () => import('./orders/bookings.module').then(module => module.BookingsModule),
      },
      {
        path: 'customers',
        loadChildren: () => import('./customers/customers.module').then(module => module.CustomersModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(module => module.SettingsModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(module => module.ProfileModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(PRIVATE_ROUTES)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
