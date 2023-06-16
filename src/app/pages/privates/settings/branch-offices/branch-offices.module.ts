import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SpinnerButtonModule } from 'src/app/commons/components/spinner-button/spinner-button.module';
import { TableModule } from 'src/app/commons/components/table/table.module';
import { SearchPlacesModule } from 'src/app/commons/directives/search-places/search-places.module';
import { BranchOfficeService } from 'src/app/commons/services/branch-office.service';
import { NotificationService } from 'src/app/commons/services/notification.service';
import { BranchOfficesComponent } from './branch-offices.component';
import { BreadcrumbModule } from 'src/app/commons/components/breadcrumb/breadcrumb.module';
import { VolumeCalculatorModule } from 'src/app/commons/components/volume-calculator/volume-calculator.module';
import { IconLabelModule } from 'src/app/commons/components/icon-label/icon-label.module';
import { DataListModule } from 'src/app/commons/components/data-list/data-list.module';
import { BranchProfileComponent } from './profile/branch-profile.component';
import { SimpleCardModule } from 'src/app/commons/components/simple-card';
import { BranchBasicComponent } from './profile/basic/branch-basic.component';
import { BranchBuildingsComponent } from './profile/buildings/branch-buildings.component';
import { BranchSchedulesComponent } from './profile/schedules/branch-schedules.component';
import { BranchContactsComponent } from './profile/contacts/branch-contacts.component';
import { SimpleTableModule } from 'src/app/commons/components/simple-table';
import { BuildingsComponent } from './buildings/buildings.component';
import { BuildingBasicComponent } from './buildings/basic/building-basic.component';
import { BuildingLevelsComponent } from './buildings/levels/building-levels.component';
import { BuildingService } from 'src/app/commons/services/building.service';
import { SimpleMenuModule } from 'src/app/commons/components/simple-menu';
import { LevelService } from 'src/app/commons/services/level.service';
import { LevelsComponent } from './levels/levels.component';
import { LevelBasicComponent } from './levels/basic/level-basic.component';
import { LevelSpacesComponent } from './levels/spaces/level-spaces.component';
import { SpaceService } from 'src/app/commons/services/space.service';
import { SpacesComponent } from './spaces/spaces.component';
import { SpaceBasicComponent } from './spaces/basic/spaces-basic.component';
import { CommonService } from 'src/app/commons/services/common.service';
import { SimpleTablexModule } from 'src/app/commons/components/simple-tablex';
import { AdminsOnlyModule } from 'src/app/commons/directives/admins-only/admins-only.module';
import { BranchAreaComponent } from './profile/area/branch-area.component';
import { ImageGalleryComponentModule } from 'src/app/commons/components/image-gallery/image-gallery.module';
import { NoContentModule } from 'src/app/commons/components/no-content/no-content.module';


@NgModule({
  declarations: [
    BranchOfficesComponent,
    BranchProfileComponent,
    BranchBasicComponent,
    BranchBuildingsComponent,
    BranchSchedulesComponent,
    BranchContactsComponent,
    BranchAreaComponent,
    BuildingsComponent,
    BuildingBasicComponent,
    BuildingLevelsComponent,
    LevelsComponent,
    LevelBasicComponent,
    LevelSpacesComponent,
    SpacesComponent,
    SpaceBasicComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: BranchOfficesComponent,
      },
      {
        path: 'create',
        component: BranchProfileComponent,
      },
      {
        path: 'buildings',
        component: BuildingsComponent,
      },
      {
        path: 'levels',
        component: LevelsComponent,
      },
      {
        path: 'spaces',
        component: SpacesComponent,
      }
    ]),
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerButtonModule,
    SearchPlacesModule,
    BreadcrumbModule,
    VolumeCalculatorModule,
    IconLabelModule,
    DataListModule,
    SimpleCardModule,
    SimpleTableModule,
    SimpleMenuModule,
    SimpleTablexModule,
    AdminsOnlyModule,
    ImageGalleryComponentModule,
    NoContentModule,
  ],
  providers: [
    NotificationService,
    BranchOfficeService,
    BuildingService,
    LevelService,
    SpaceService,
    CommonService,
  ],
})
export class BranchOfficesModule { }
