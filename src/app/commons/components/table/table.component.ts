import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { TableAction } from './interfaces/table-action';
import { TableColumn } from './interfaces/table-column';
import { TableEvent } from './interfaces/table-event';
import { TableOptions } from './interfaces/table-options';
import { TablePagination } from './interfaces/table-pagination';
import { TablePaginationComponent } from './table-pagination/table-pagination.component';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  static readonly DEFAULT_PAGESIZE: number = 10;

  @ViewChild(TablePaginationComponent) paginator!: TablePaginationComponent;

  @Input() tableTitle: string = '';

  @Input() set options(source: TableOptions) {
    if (!source.columns) return;

    this.columns = source.columns.map(header => header.label);
    this.columnsCollection = source.columns;

    if (!source.collection || !source.collection.length) return;

    this.updateData(source.collection);
  }

  columns: string[];
  columnsCollection: TableColumn[];
  dataSource: any[];
  rawDataSource: any[]
  pageSizeOptions: number[];

  pageSize: number = TableComponent.DEFAULT_PAGESIZE;

  pageChangedEvent: Subject<TableEvent>;
  actionEvent: Subject<TableEvent>;
  syncEvent: Subject<TableEvent>;
  pageInfo: Subject<TableEvent>;

  debounceSearch: Subject<string>;

  get hasData(): boolean {
    return (this.dataSource.length > 0);
  }

  get length(): number {
    return this.rawDataSource.length;
  }

  private searchValueCache = '';
  set searchValue(value: string) {
    this.searchValueCache = value;
    this.debounceSearch.next(value);
  }

  get searchValue(): string {
    return this.searchValueCache;
  }

  readonly ModelOptions = {
    standalone: true,
  };

  constructor() {
    this.columns = new Array<string>();
    this.columnsCollection = new Array<TableColumn>();
    this.dataSource = new Array<any>();
    this.rawDataSource = new Array<any>();
    this.pageSizeOptions = [10, 15, 20, 100];

    this.pageChangedEvent = new Subject();
    this.actionEvent = new Subject();
    this.syncEvent = new Subject();
    this.pageInfo = new Subject();
    this.debounceSearch = new Subject();
  }

  ngOnInit(): void {
    this.debounceSearch.pipe(debounceTime(500)).subscribe(value => {
      value = String(value).toLowerCase().trim();

      if (!value || value.length < 3 || !this.hasData) {
        this.paginateSource(this.rawDataSource, this.pageSize, 1);
        return;
      }

      const filterableColumns = this.columnsCollection.filter(column => column.filterable);

      const collection = new Array<any>();
      for (const row of this.rawDataSource) {
        for (const column of filterableColumns) {
          let cell = row[column.property];
          cell = String(cell).toLowerCase().trim();
          if (cell.includes(value)) {
            collection.push(row);
            break;
          }
        }
      }

      this.paginateSource(collection, this.pageSize, 1);
    });
  }

  updateData(dataSource: any[]): void {
    this.rawDataSource = dataSource;
    this.paginateSource(this.rawDataSource, this.pageSize, 1);
  }

  changePageSizeEventHandler(value: string): void {
    console.log(+value);
  }

  pageEventHandler(event: TablePagination): void {
    this.paginateSource(this.rawDataSource, event.pageSize, event.pageIndex);
  }

  actionClickEventHandler(data: any, action: TableAction): void {
    this.actionEvent.next({
      type: 'click',
      source: data,
      action
    } as TableEvent);
  }

  customActionClickEventHandler(data: any, type: string, property: string): void {
    const tableAction = {
      slug: type,
      property,
    } as TableAction;

    this.actionClickEventHandler(data, tableAction);
  }

  private paginateSource(source: any[], pageSize: number, pageIndex: number): void {
    this.dataSource = source.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
  }

}
