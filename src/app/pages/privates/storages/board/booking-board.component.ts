import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-booking-board',
  templateUrl: './booking-board.component.html',
  styleUrls: ['./booking-board.component.scss']
})
export class BookingBoardComponent implements OnInit {

  @Input() source: BuildingBoard = {} as BuildingBoard;

  get levels(): LevelBoard[] {
    return this.source.levels;
  }

  constructor() { }

  ngOnInit(): void { }

}

interface StorageBoard {
  uid: string;
  description: string;
  status: string;
  coefficient: number;
  dimensionsM2: number;
}

interface LevelBoard {
  uid: string;
  description: string;
  status: string;
  coefficient: number;
  storages: StorageBoard[];
}

interface BuildingBoard {
  uid: string;
  description: string;
  status: string;
  coefficient: number;
  levels: LevelBoard[];
}
