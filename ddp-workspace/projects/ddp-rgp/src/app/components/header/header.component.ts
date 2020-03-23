import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class HeaderComponent {
  @Input() currentRoute: string = '';
  inHome: boolean = true;
  inLGMD: boolean = true;
  inEligiblityCrit: boolean = true;
  hoverEdit: boolean = false;
  constructor(private router: Router) {
    router.events.subscribe(e => this.trackNav(e));
  }

  public isForFamiliesCollapsed: boolean = true;
  public isForResearchersCollapsed: boolean = true;
  public isSpecialtyProjectsCollapsed: boolean = true;

  public collapsed(event: any): void { }

  public expanded(event: any): void { }

  trackNav(evt): void {
    this.currentPath(evt.urlAfterRedirects);
  }

  currentPath(rt: string): void {
    if (rt == null || rt == undefined || rt.indexOf('/home') == 0 || rt.indexOf('/password') == 0 || rt.indexOf('/limb-girdle-muscular-dystrophy') == 0 || rt.indexOf('/craniofacial') == 0 || rt.indexOf('/eligibility-criteria') == 0) {
      this.inHome = true;
      this.inLGMD = true;
      this.inEligiblityCrit = true;
      return;
    }

    if (rt.indexOf('/about-us') == 0) {
      this.inHome = false;
      this.inLGMD = false;
      this.inEligiblityCrit = false;
      return;
    }

    this.inLGMD = false;
    this.inHome = false;
    this.inEligiblityCrit = false;
  }

  hoverIn(): void {
    this.hoverEdit = true;
    console.log('hoverIn ' + this.hoverEdit);
  }

  hoverOut(): void {
    this.hoverEdit = false;
    console.log('hoverOut ' + this.hoverEdit);
  }
}
