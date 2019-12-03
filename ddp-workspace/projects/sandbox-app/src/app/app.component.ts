import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('class') componentCssClass;

  constructor(private router: Router,
    public translate: TranslateService,
    public overlayContainer: OverlayContainer) {
    let locale = 'en';
    this.translate.setDefaultLang(locale);
    const session = localStorage.getItem('session_key');
    if (session != null) {
      locale = JSON.parse(session).locale;
    }
    this.translate.use(locale);
  }

  public setTheme(theme): void {
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
  }

  public navigate(url: string): void {
    this.router.navigateByUrl(url);
  }
}
