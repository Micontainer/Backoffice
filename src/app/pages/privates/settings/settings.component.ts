import { CommonService } from 'src/app/commons/services/common.service';
import { Component, OnInit } from '@angular/core';
import { BranchOfficeService } from 'src/app/commons/services/branch-office.service';
import { FileService } from 'src/app/commons/services/file.service';
import { ShapeService } from 'src/app/commons/services/shape.service';
import { UserService } from 'src/app/commons/services/user.service';
import { NotificationService } from 'src/app/commons/services/notification.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  totalCounter = {
    branches: 0,
    shapes: 0,
    images: 0,
    users: 0,
    roles: 0,
  }

  constructor(
    private commonService: CommonService,
    private notificationService: NotificationService,
  ) {
    this.init();
  }

  async init(): Promise<void> {
    try {
      this.totalCounter = await this.commonService.fetchConfigurationTotals();
    }
    catch (error: any) {
      this.notificationService.showError(error.message);
    }
  }
}
