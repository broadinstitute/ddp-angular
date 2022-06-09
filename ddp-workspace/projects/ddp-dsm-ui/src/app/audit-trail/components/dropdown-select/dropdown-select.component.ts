import { animate, style, transition, trigger } from "@angular/animations";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

export interface DropdownGroup {
  label: string;
  isChecked: boolean;
}
@Component({
  selector: "app-dropdown-select",
  templateUrl: "./dropdown-select.component.html",
  styleUrls: ["./dropdown-select.component.scss"],
  animations: [
    trigger("inOut", [
      transition("void => *", [
        style({ opacity: 0 }), // initial styles
        animate(
          "200ms",
          style({ opacity: 1 }) // final style after the transition has finished
        ),
      ]),
      transition("* => void", [
        animate(
          "200ms",
          style({ opacity: 0 }) // we asume the initial style will be always opacity: 1
        ),
      ]),
    ]),
  ],
})
export class DropdownSelectComponent implements OnInit {
  @Input() dropdownTittle: string;
  @Input() group: DropdownGroup[];
  @Input() isToggled: boolean = false;
  @Output() updatedGroups = new EventEmitter<DropdownGroup[]>();

  constructor() {}

  ngOnInit(): void {}

  onItemSelect(selectedFilter: string): void {
    const updatedFilters = this.group.map((filter) => {
      if (filter.label === selectedFilter) {
        filter.isChecked = !filter.isChecked;
      }
      return filter;
    });
    this.updatedGroups.emit(updatedFilters);
  }

  toggle() {
    this.isToggled = !this.isToggled;
  }
}
