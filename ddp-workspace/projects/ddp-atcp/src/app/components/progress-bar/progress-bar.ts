import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.html',
  styleUrls: ['./progress-bar.scss']
})
export class ProgressBarComponent implements OnChanges {
  @Input() public count: number;
  @Input() public active = 0;
  @Input() public canChange = false;
  @Input() public canChooseeTab = true;
  @Output() public onChanged: EventEmitter<number> = new EventEmitter<number>();
  public tabs: any[] = [];

  ngOnChanges() {
    if (this.count) {
      this.tabs = new Array(this.count);
    }
  }

  public setActiveTab(event: Event, index: number) {
    event.preventDefault();
    this.onChanged.emit(index);
  }
}
