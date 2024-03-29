import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: [ './search-bar.component.css' ],
})
export class SearchBarComponent {
  @Input() textQuery: string;
  @Input() filters: {};
  @Input() allFieldNames: Set<string>;
  @Input() showHelp: boolean;
  @Output() queryText = new EventEmitter();

  filterQuery: string;
  edit: boolean;
  wrongQuery: boolean;

  checkQuery(): void {
    for (const key of Object.keys(this.filters)) {
      for (const filter of this.filters[ key ]) {
        filter.clearFilter();
      }
    }
    const str = this.textQuery;
    const regex = /(\s*(AND\s*)|\s*(and\s*))/g;
    if (this.textQuery === null || this.textQuery.length === 0 || this.textQuery.search(regex) !== 0) {
      if (this.textQuery === null) {
        this.textQuery = '';
      }
      this.textQuery = 'AND ' + (this.textQuery.length > 0 ? this.textQuery : '');
    }
    this.wrongQuery = !this.checkQueryWithAutomata(this.textQuery);
    if (this.wrongQuery) {
      return;
    }
    let p = 0;
    let q = 0;
    for (const c of str) {
      if (c === ')') {
        p--;
        if (p < 0) {
          this.wrongQuery = true;
          break;
        }
      } else if (c === '(') {
        p++;
      } else if (c === '\'') {
        if (q === 0) {
          q++;
        } else if (q === 1) {
          q--;
        }
      }

    }
    if (p !== 0 || q !== 0) {
      this.wrongQuery = true;
    }
  }

  putFilterQueryBack(): void {
    this.textQuery = '';
    this.edit = true;
  }

  doFilterByQuery(): void {
    if (this.textQuery !== '' && this.textQuery != null) {
      this.queryText.emit(this.textQuery);
    }
  }

  checkQueryWithAutomata(query: string): boolean {
    const logicalOperators = [ 'AND', 'OR', 'and', 'or' ];
    const parenthesis = [ '(', ')' ];
    const operators = [ 'LIKE', '=', '<=', '>=', '<>', 'like' ];
    const initialState = -1;
    let state = initialState;
    const queryParts = query.split(' ');
    let i = 0;
    let longword = false;
    while (i < queryParts.length) {
      const part = queryParts[ i ];
      if (part === '') {
        i++;
        continue;
      }
      switch (state) {
        case -1:
          if (logicalOperators.includes(part)) {
            state = 1;
            break;
          } else {
            return false;
          }
        case 1:
          if (part === '(') {
            state = 0;
            break;
          } else if (this.isColumn(part)) {
            state = 2;
            break;
          } else {
            return false;
          }
        case 0:
          if (part === '(') {
            state = 0;
            break;
          }
          if (this.isColumn(part)) {
            state = 2;
            break;
          } else {
            return false;
          }
        case 2:
          if (part === 'IS' || part === 'is') {
            state = 6;
            break;
          } else if (part === 'like' || part === 'LIKE') {
            state = 8;
            break;
          } else if (operators.includes(part)) {
            state = 3;
            break;
          } else {
            return false;
          }
        case 3:
          if (part === 'today') {
            state = 9;
            break;
          } else if (logicalOperators.includes(part) || operators.includes(part) || parenthesis.includes(part)) {
            return false;
          } else {
            if (!longword) {
              if (part.includes('\'') && part.indexOf('\'') !== part.lastIndexOf('\'')) {// no spaces
                state = 4;
                break;
              } else if (part.includes('\'')) {// start of a new long word
                state = 3;
                longword = true;
                break;
              } else {
                return false;
              }
            } else {
              if (!part.includes('\'')) {
                state = 3;
                break;
              } else {
                longword = false;
                state = 4;
                break;
              }
            }
          }
        case 4:
          if (part === '(') {
            state = 0;
            break;
          } else if (logicalOperators.includes(part)) {
            state = 1;
            break;
          } else if (part === ')') {
            state = 5;
            break;
          } else {
            return false;
          }
        case 5:
          if (part === ')') {
            state = 5;
            break;
          }
          if (logicalOperators.includes(part)) {
            state = 1;
            break;
          } else {
            return false;
          }
        case 6:
          if (part === 'NOT' || part === 'not') {
            state = 7;
            break;
          } else if (part === 'NULL' || part === 'null') {
            state = 4;
            break;
          } else {
            return false;
          }
        case 7:
          if (part === 'NULL' || part === 'null') {
            state = 4;
            break;
          } else {
            return false;
          }
        case 8:
          if (
            logicalOperators.includes(part) || operators.includes(part)
            || parenthesis.includes(part) || (part.substring(1, part.length - 1).includes('\''))
          ) {
            return false;
          } else {
            if (!longword) {
              if (part.includes('\'') && part.indexOf('\'') !== part.lastIndexOf('\'')) {// no spaces
                state = 4;
                break;
              } else if (part.includes('\'')) {// start of a new long word
                state = 8;
                longword = true;
                break;
              } else {
                return false;
              }
            } else {
              if (!part.includes('\'')) {
                state = 8;
                break;
              } else {
                longword = false;
                state = 4;
                break;
              }
            }
          }
        case 9:
          if (logicalOperators.includes(part)) {
            state = 1;
            break;
          } else if (part === '+' || part === '-') {
            state = 10;
            break;
          } else {
            return false;
          }
        case 10:
          if (part.indexOf('d') !== -1) {
            state = 4;
            break;
          } else {
            return false;
          }

        default:
          return false;
      }
      i += 1;
    }

    return state === 5 || state === 4 || state === 9;
  }

  isColumn(name): boolean {
    if (this.allFieldNames != null) {
      return this.allFieldNames.has(name);
    }
    return false;
  }

  public search(event): void {
    if (event.keyCode === 13) {
      this.checkQuery();
      if (!this.wrongQuery && this.textQuery.length > 0) {
        this.doFilterByQuery();
      }
    } else {
      return;
    }
  }

}
