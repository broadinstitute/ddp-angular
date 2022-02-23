import {Component, ElementRef} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ddp-singular';
  constructor(private elRef: ElementRef) {}

    onActivate() {
        this.elRef.nativeElement.scrollTo(0,0)
    }
}
