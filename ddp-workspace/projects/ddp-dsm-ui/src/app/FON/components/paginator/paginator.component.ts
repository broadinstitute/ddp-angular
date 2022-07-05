import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';


interface PageProps {
  from: number;
  to: number;
}

interface Configuration {
  totalCount: number;
  rowsPerPage: number;
  currentPageIndex: number;
  pageSizeOptions?: number[];
  visiblePages?: number;
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
export class PaginatorComponent {
  public pageSizeOptions: number[];

  private totalCount: number;
  private rowsPerPage: number;
  private currentPageIndex: number;
  private visiblePages: number;

  @Output() pageChanged = new EventEmitter<PageProps>();

  @Input('config') set setConfiguration(configuration: Configuration) {
    const {totalCount, currentPageIndex, rowsPerPage, pageSizeOptions, visiblePages} = configuration;

    this.rowsPerPage = this.isNumber(rowsPerPage) ? rowsPerPage : DEFAULT_ROWS_PER_PAGE;
    this.currentPageIndex = this.isNumber(currentPageIndex) ? currentPageIndex : DEFAULT_CURRENT_PAGE_INDEX;
    this.visiblePages = this.isNumber(visiblePages) ? visiblePages : DEFAULT_VISIBLE_PAGES;
    this.pageSizeOptions = this.isArray(pageSizeOptions) ? pageSizeOptions : DEFAULT_PAGE_SIZE_OPTIONS;

    this.totalCount = totalCount;
  }

  public get currentPageRange(): (string | number)[] {
    const currentRange = this.filteredCurrentPageRange;
    return this.fillWithDots(currentRange);
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
      default:
        return;
    }
    this.pageChanged.emit(this.pageProps);
  }

  public setRows(rows: number): void {
    this.rowsPerPage = rows;
    this.changePage(1);
  }

  /* Paginator Engine */

  private get filteredCurrentPageRange(): any[] {
    return this.generatePagesArray
      .filter(
        (page, _, array) => this.shouldBeDisplayed(page, array)
      );
  }

  private fillWithDots(pagesArray: any[]): [number | string] {
    return pagesArray
      .reduce((accumulator, currPage, currIndex, array) => {
        accumulator.push(currPage);
        currPage - array[currIndex + 1] < -1 && accumulator.splice(currIndex + 2, 0, '...');
        return accumulator;
      }, []);
  }

  private shouldBeDisplayed(page: number, array: number[]): boolean {
    return (page === array[0] ||
      page === array.length ||
      page === this.currentPageIndex ||
      page > this.currentPageIndex - (this.visiblePages + 1)
      && page < this.currentPageIndex + (this.visiblePages + 1));
  }

  private get pageProps(): PageProps {
    const from = (this.currentPageIndex - 1) * this.rowsPerPage;
    const to = from + this.rowsPerPage;
    return {from, to};
  }

  private get generatePagesArray(): number[] {
    const numberOfPages = Math.ceil(this.totalCount / this.rowsPerPage) || 1;
    return this.arrayFromNumber(numberOfPages);
  }

  private arrayFromNumber(number: number): number[] {
    return Array.from({length: number}, (_, i) => i + 1);
  }

  /* conditional checking functions */

  private isNumber(value: any): boolean {
    return value && typeof value === 'number';
  }

  private isArray(value: any): boolean {
    return value?.length && value instanceof Array;
  }

}
