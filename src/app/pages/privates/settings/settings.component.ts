import { Component, OnInit } from '@angular/core';
import { BranchOfficeService } from 'src/app/commons/services/branch-office.service';
import { FileService } from 'src/app/commons/services/file.service';
import { ShapeService } from 'src/app/commons/services/shape.service';
import { UserService } from 'src/app/commons/services/user.service';


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
    private branchOfficeService: BranchOfficeService,
    private shapeService: ShapeService,
    private fileService: FileService,
    private userService: UserService,
  ) {
    this.init();
  }

  async init(): Promise<void> {
    this.totalCounter.branches = (await this.branchOfficeService.fetchAllV2()).length;
    this.totalCounter.shapes = (await this.shapeService.fetchAllV2()).length;
    this.totalCounter.images = (await this.fileService.get('image', 'GALLERY')).length
    this.totalCounter.users = (await this.userService.getUsers()).length;
    this.totalCounter.roles = (await this.userService.getRoles()).length;
  }

}
