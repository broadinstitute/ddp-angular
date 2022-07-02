import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";


interface pageProps {
  from: number;
  to: number;
}

enum SHIFT_PAGE {
  START = 'START',
  END = 'END',
  ONE_MORE = 'ONE_MORE',
  ONE_LESS = 'ONE_LESS'
}

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent implements OnChanges {
  @Input() totalCount: number;
  @Input() rowsPerPage: number = 10;
  @Input() currentPageIndex: number;
  @Input() pageSizeOptions: number[] = [10, 25, 50];

  @Output() pageChanged: EventEmitter<pageProps> = new EventEmitter();

  constructor() {}

  ngOnChanges(_): void {
    this.generatePagesArray;
  }

  public get currentPageRange(): (string|number)[] {
    const currentRange = this.filteredCurrentPageRange;
    this.fillWithDots(currentRange);
    return currentRange;
  }

  public changePage(page: number): void {
    if (typeof page === 'number') {
      this.currentPageIndex = page;
      this.pageChanged.emit(this.pageProps);
    }
  }

  public shiftPage(order: string): void {
    switch (order) {
      case SHIFT_PAGE.START:
        this.currentPageIndex = 1;
        break;
      case SHIFT_PAGE.END:
        this.currentPageIndex = this.generatePagesArray.length;
        break;
      case SHIFT_PAGE.ONE_MORE:
        this.currentPageIndex = Math.min(this.currentPageIndex + 1, this.generatePagesArray.length);
        break;
      case SHIFT_PAGE.ONE_LESS:
        this.currentPageIndex = Math.max(this.currentPageIndex - 1, 1);
        break;
    }
    this.pageChanged.emit(this.pageProps);
  }

  public setRows(rows: number): void {
    this.rowsPerPage = rows;
    this.changePage(1);
    this.generatePagesArray;
  }

  /* Paginator Engine */

  private get filteredCurrentPageRange(): any[] {
    return this.generatePagesArray
      .filter(
        (page, _, array) => this.displayOrNot(page, array, 3, 3)
      )
  }

  private fillWithDots(pagesArray: any[]): void {
    pagesArray
      .forEach(
        (page, index, array) =>
          page - array[index + 1] < -1 &&
          array.splice(index + 1, 0, '...')
      )
  }

  private displayOrNot(page: number, array: number[], left: number, right: number): boolean {
    return (page === 1 ||
      page === array.length ||
      page === this.currentPageIndex ||
      page > this.currentPageIndex - (left + 1) && page < this.currentPageIndex + (right + 1));
  }

  private get pageProps(): pageProps {
    const from = (this.currentPageIndex - 1) * this.rowsPerPage;
    const to = from + this.rowsPerPage;
    return {from, to};
  }

  private get generatePagesArray(): any[] {
    const numberOfPages = Math.ceil(this.totalCount / this.rowsPerPage) || 1;
    return this.arrayFromNumber(numberOfPages);
  }

  private arrayFromNumber(number: number): number[] {
    return Array.from({length: number}, (_, i) => i + 1);
  }

}
