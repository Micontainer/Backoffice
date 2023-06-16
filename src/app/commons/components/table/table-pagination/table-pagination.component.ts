import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TablePagination } from '../interfaces/table-pagination';


@Component({
  selector: 'app-table-pagination',
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.scss']
})
export class TablePaginationComponent implements OnInit {

  readonly Forward: string = 'FORWARD';
  readonly Backward: string = 'BACKWARD';

  @Input() set length(value: number) {
    if (!value) return;

    this.pageTotal = Math.ceil(value / this.pageSize);
    this.disabledForwardButton = this.indexMatchTotal;
    this.totalLength = value;
  }

  @Input() pageSize: number = 0;

  @Input() pageSizeOptions: number[];

  @Output() pageEvent: EventEmitter<TablePagination>;

  pageIndex: number = 1;
  pageTotal: number = 1;
  totalLength: number = 0;

  get indexMatchTotal(): boolean {
    return (this.pageIndex === this.pageTotal);
  }

  disabledBackwardButton: boolean = true;
  disabledForwardButton: boolean = true;

  constructor() {
    this.pageSizeOptions = new Array<number>();
    this.pageEvent = new EventEmitter();
  }

  ngOnInit(): void { }

  changePageSizeEventHandler(pageSize: string): void {
    this.calculate(this.totalLength, this.pageIndex, +pageSize);
  }

  paginationEventHandler(cardinality: string): void {
    try {
      if (cardinality === this.Forward) {
        if (this.indexMatchTotal) {
          return;
        }

        this.pageIndex += 1;
        this.disabledBackwardButton = false;

        if (this.indexMatchTotal) {
          this.disabledForwardButton = true;
        }

        return;
      }

      if (this.pageIndex === 1) {
        return;
      }

      this.pageIndex -= 1;
      this.disabledForwardButton = false;

      if (this.pageIndex === 1) {
        this.disabledBackwardButton = true;
      }
    }
    finally {
      this.emitPageEvent(this.totalLength, this.pageIndex, this.pageSize);
    }
  }

  calculate(length: number, pageIndex: number, pageSize: number): void {
    this.pageTotal = Math.ceil(length / pageSize);
    this.pageIndex = pageIndex;
    this.totalLength = length;
    this.pageSize = pageSize;

    this.disabledForwardButton = this.indexMatchTotal;

    this.emitPageEvent(length, pageIndex, pageSize);
  }

  emitPageEvent(length: number, pageIndex: number, pageSize: number): void {
    const pageEvent = {
      length: length,
      pageIndex: pageIndex,
      pageSize: pageSize,
    } as TablePagination;

    this.pageEvent.emit(pageEvent);
  }

}
