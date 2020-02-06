import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
  selector: 'about-us',
  template: `
  <toolkit-header [showButtons]="true"></toolkit-header>
  <div class="Wrapper">
    <div class="PageHeader">
      <div class="PageHeader-image">
        <span class="PageHeader-imageSpan" role="img" aria-label="About Us Image">
          <span class="PageHeader-imageInner"></span>
        </span>
      </div>
      <div class="PageHeader-box">
        <div class="PageHeader-boxContent">
          <span translate>AboutUs.PageHeader.Part1</span>
          <span class="Italic" translate>Toolkit.Common.Organization</span>,
          <span translate>AboutUs.PageHeader.Part2</span>
        </div>
        <div class="PageHeader-boxFooter">
          <a [href]="countMeInUrl" class="Link" target="_blank">
            <span translate>AboutUs.PageHeaderLink.Part1</span>
            <span class="Italic" translate>Toolkit.Common.Organization </span>
            <span translate>AboutUs.PageHeaderLink.Part2</span>
          </a>
        </div>
      </div>
      <div class="PageHeader-backgroundAboutUs">
        <div class="PageLayout">
          <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <h1 class="PageHeader-title PageHeader-titleAboutUs" translate>AboutUs.Title</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    <article class="PageContent PageContent-sectionAboutUs">
      <div class="PageLayout">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <section class="PageContent-section">
            <p class="PageContent-text">
              <span class="Italic" translate>Toolkit.Common.Organization</span>
              <span translate>AboutUs.Organization.Section1.Part1</span>
              <span class="Italic" translate>Toolkit.Common.Organization</span>,
              <span translate>AboutUs.Organization.Section1.Part2</span>
              <a href="countMeInUrl" class="Link" target="_blank" translate>AboutUs.Organization.Section1.Part3</a>
            </p>
            <p class="PageContent-text">
              <span translate>AboutUs.Organization.Section2.Part1</span>
              <a href="http://bass.dfci.harvard.edu/" class="Link" target="_blank" translate>AboutUs.Organization.Section2.Part2</a>,
              <span translate>AboutUs.Organization.Section2.Part3</span>
              <span class="Italic" translate>AboutUs.Organization.Section2.Part4</span>
              <span translate>AboutUs.Organization.Section2.Part5</span>
            </p>
          </section>
          <img lazy-resource src="./assets/images/about-page-broad-building.png" class="PageContent-image" alt="Broad Building">
        </div>
      </div>
      <div class="row council-row">
        <div class="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 no-padding">
          <ng-container *ngFor="let team of 'AboutUs.Teams' | translate">
            <section class="PageContent-section council">
              <h1 class="PageContent-title council">{{team.Title}}</h1>
                <ng-container *ngFor="let member of team.Members; odd as isOdd; last as isLast">
                  <div class="row" [ngClass]="{'reverse-row': isOdd}">
                    <div class="col-lg-2 col-md-3 col-sm-2 col-xs-8 col-xs-offset-2">
                      <img lazy-resource class="PageContent-image" [alt]="member.Alt" [src]="member.Photo">
                    </div>
                    <div class="col-lg-10 col-md-9 col-sm-10 col-xs-12">
                      <h2 class="PageContent-subtitle council">{{member.Name}}</h2>
                      <ng-container *ngFor="let paragraph of member.Bio">
                        <p class="PageContent-text" [innerHTML]="paragraph"></p>
                      </ng-container>
                    </div>
                  </div>
                  <hr *ngIf="!isLast" class="HorizontalLine">
                </ng-container>
            </section>
          </ng-container>
        </div>
      </div>
    </article>
  </div>`
})
export class AboutUsComponent implements OnInit {
  public countMeInUrl: string;

  constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.countMeInUrl = this.toolkitConfiguration.countMeInUrl;
  }
}
