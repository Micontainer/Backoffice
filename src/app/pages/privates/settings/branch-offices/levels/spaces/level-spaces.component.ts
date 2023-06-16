import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceDTO } from 'src/app/commons/models/global-dto';
import { NotificationService } from 'src/app/commons/services/notification.service';
import { SpaceService } from 'src/app/commons/services/space.service';


@Component({
  selector: 'app-level-spaces',
  templateUrl: './level-spaces.component.html',
  styleUrls: ['./level-spaces.component.scss']
})
export class LevelSpacesComponent implements OnInit {

  branchUID: string = '';
  buildingUID: string = '';
  levelUID: string = '';

  storages: ResourceDTO[] = new Array<ResourceDTO>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private spaceService: SpaceService,
  ) {
    this.activatedRoute.queryParams.subscribe(query => {
      const ref = query['ref'] ?? '';
      const buildingRef = query['ref.building'] ?? '';
      const levelRef = query['ref.level'] ?? '';

      if (!ref || !buildingRef || !levelRef) {
        // FIXME take me to safe zone;
        return;
      }

      this.branchUID = ref;
      this.buildingUID = buildingRef;
      this.levelUID = levelRef;
    });
  }

  ngOnInit(): void {
    (async () => {
      await this.fetchData();
    })();
  }

  async fetchData(): Promise<void> {
    try {
      this.storages = await this.spaceService
        .fetchAllByBranchBuildingLevelUID(this.branchUID, this.buildingUID, this.levelUID);
    }
    catch (error: any) {
      this.notificationService.errorDialog(error);
    }
  }

}
