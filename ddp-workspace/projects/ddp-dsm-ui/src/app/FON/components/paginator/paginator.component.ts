import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';


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

/* Defaults */
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50];
const DEFAULT_ROWS_PER_PAGE = 10;
const DEFAULT_CURRENT_PAGE_INDEX = 1;
const DEFAULT_VISIBLE_PAGES = 3;


@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent implements OnChanges {
  @Input() totalCount: number;
  @Input() rowsPerPage = 10;
  @Input() currentPageIndex: number;
  @Input() pageSizeOptions: number[];
  @Input() visiblePages: number;

  @Output() pageChanged = new EventEmitter<pageProps>();

  ngOnChanges(): void {
    this.setDefaultParams();
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
        this.currentPageIndex = this.generatePagesArray().length;
        break;
      case SHIFT_PAGE.ONE_MORE:
        this.currentPageIndex = Math.min(this.currentPageIndex + 1, this.generatePagesArray().length);
        break;
      case SHIFT_PAGE.ONE_LESS:
        this.currentPageIndex = Math.max(this.currentPageIndex - 1, 1);
        break;
      default:
        return;
    }
    this.pageChanged.emit(this.pageProps);
  }

  public setRows(rows: number): void {
    this.rowsPerPage = rows;
    this.changePage(1);
    this.generatePagesArray();
  }

  /* Paginator Engine */

  private setDefaultParams(): void {
    if(!this.rowsPerPage || typeof this.rowsPerPage !== 'number')
      {this.rowsPerPage = DEFAULT_ROWS_PER_PAGE;}
    if(!(this.pageSizeOptions instanceof Array) || this.pageSizeOptions.length < 1)
      {this.pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS;}
    if(!this.currentPageIndex || typeof this.currentPageIndex !== 'number')
      {this.currentPageIndex = DEFAULT_CURRENT_PAGE_INDEX;}
    if(!this.visiblePages || typeof this.visiblePages !== 'number')
      {this.visiblePages = DEFAULT_VISIBLE_PAGES;}
  }

  private get filteredCurrentPageRange(): any[] {
    return this.generatePagesArray()
      .filter(
        (page, _, array) => this.shouldBeDisplayed(page, array)
      );
  }

  private fillWithDots(pagesArray: any[]): void {
    pagesArray
      .forEach(
        (page, index, array) =>
          page - array[index + 1] < -1 &&
          array.splice(index + 1, 0, '...')
      );
  }

  private shouldBeDisplayed(page: number, array: number[]): boolean {
    return (page === 1 ||
      page === array.length ||
      page === this.currentPageIndex ||
      page > this.currentPageIndex - (this.visiblePages + 1) && page < this.currentPageIndex + (this.visiblePages + 1));
  }

  private get pageProps(): pageProps {
    const from = (this.currentPageIndex - 1) * this.rowsPerPage;
    const to = from + this.rowsPerPage;
    return {from, to};
  }

  private generatePagesArray(): number[] {
    const numberOfPages = Math.ceil(this.totalCount / this.rowsPerPage) || 1;
    return this.arrayFromNumber(numberOfPages);
  }

  private arrayFromNumber(number: number): number[] {
    return Array.from({length: number}, (_, i) => i + 1);
  }

}
