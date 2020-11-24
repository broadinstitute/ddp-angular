import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.html',
  styleUrls: ['./progress-bar.scss']
})
export class ProgressBarComponent implements OnChanges {
  @Input() public count: number;
  @Input() public active = 0;
  @Output() public onChange: EventEmitter<number> = new EventEmitter<number>();

  public tabs: undefined[] = [];

  public ngOnChanges(): void {
    if (this.count) {
      this.tabs = new Array(this.count);
    }
  }

  public setActiveTab(event: Event, index: number): void {
    event.preventDefault();
    this.onChange.emit(index);
  }
}
