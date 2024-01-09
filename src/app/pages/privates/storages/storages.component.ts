import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BranchOfficePair, BranchOfficeService } from 'src/app/commons/services/branch-office.service';
import { BranchBoard, BuildingBoard, CommonService } from 'src/app/commons/services/common.service';
import { NotificationService } from 'src/app/commons/services/notification.service';

@Component({
  selector: 'app-storages',
  templateUrl: './storages.component.html',
  styleUrls: ['./storages.component.scss']
})
export class StoragesComponent implements OnInit {

  branchModel: string = '0';
  branchesOptions: BranchOfficePair[] = new Array<BranchOfficePair>();
  branchBoard: BranchBoard = {} as BranchBoard;

  get buildingsBoard(): BuildingBoard[] {
    return this.branchBoard.buildings;
  }

  get hasSelectedBranch(): boolean {
    return (this.branchModel !== '0');
  }

  colorStates: ColorState[] = [
    { label: 'Ocupado', state: 'busy', },
    { label: 'Reservado', state: 'reserved', },
    { label: 'Disponible', state: 'available', },
    { label: 'No Disponible', state: 'unavailable', },
  ];

  constructor(
    private branchOfficeService: BranchOfficeService,
    private notificationService: NotificationService,
    private router: Router,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    (async () => {
      try {
        // read branch office key value object
        const branches = await this.branchOfficeService.fetchKeyValueList();

        this.branchesOptions = branches;
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }

  ngAfterViewInit(): void { }

  async fetchStorageBoards(): Promise<void> {
    try {
      this.branchBoard = await this.commonService.fetchStorageBoards(this.branchModel);

      return Promise.resolve();
    }
    catch (error: any) {
      this.notificationService.showError(error.message);
      return Promise.resolve();
    }
  }

  branchChangeEventHandler(event: any): void {
    (async () => {
      console.log({
        branch: this.branchModel,
        event,
      });
      if (this.branchModel === '0') {
        return;
      }

      await this.fetchStorageBoards();
    })();
  }

}

interface ColorState {
  label: string;
  state: string;
}
