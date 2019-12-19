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
          <span translate>Toolkit.AboutUs.PageHeader.Pt1</span>
          <span class="Italic" translate>Toolkit.Common.Organization</span>,
          <span translate>Toolkit.AboutUs.PageHeader.Pt2</span>
        </div>
        <div class="PageHeader-boxFooter">
          <a [href]="countMeInUrl" class="Link" target="_blank">
            <span translate>Toolkit.AboutUs.PageHeaderLink.Pt1</span>
            <span class="Italic" translate>Toolkit.Common.Organization</span>
            <span translate>Toolkit.AboutUs.PageHeaderLink.Pt2</span>
          </a>
        </div>
      </div>
      <div class="PageHeader-backgroundAboutUs">
        <div class="PageLayout">
          <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <h1 class="PageHeader-title PageHeader-titleAboutUs" translate>Toolkit.AboutUs.Title</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    <article class="PageContent">
      <div class="PageLayout">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <section class="PageContent-section">
            <p class="PageContent-text">
              <a [href]="countMeInUrl" class="Link" target="_blank">
                <span class="Italic" translate>Toolkit.Common.Organization</span>
              </a>
              <span translate>Toolkit.AboutUs.Content1</span>
            </p>
            <p class="PageContent-text" [innerHTML]="'Toolkit.AboutUs.Content2' | translate"></p>
          </section>
        </div>

        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row--moreTopMargin">
          <section class="Message">
            <h1 class="Message-title" translate>Toolkit.AboutUs.AdvisoryCouncil.Title</h1>
          </section>
          <p class="PageContent-text row--moreTopMargin" translate>Toolkit.AboutUs.AdvisoryCouncil.Content1</p>
          <h1 class="PageContent-title Council" [innerHTML]="'Toolkit.AboutUs.AdvisoryCouncil.Subtitle' | translate"></h1>

          <div class="Position--relative">
            <div class="PageContent-memberPhoto Member1" translate></div>
            <h2 class="PageContent-subtitle" translate>Toolkit.AboutUs.AdvisoryCouncil.Name1</h2>
            <p class="PageContent-text" translate>Toolkit.AboutUs.AdvisoryCouncil.Bio1</p>
          </div>
          <div class="Position--relative">
            <div class="PageContent-memberPhoto Member2" translate></div>
            <h2 class="PageContent-subtitle" translate>Toolkit.AboutUs.AdvisoryCouncil.Name2</h2>
            <p class="PageContent-text" translate>Toolkit.AboutUs.AdvisoryCouncil.Bio2</p>
          </div>
          <div class="Position--relative">
            <div class="PageContent-memberPhoto Member3" translate></div>
            <h2 class="PageContent-subtitle" translate>Toolkit.AboutUs.AdvisoryCouncil.Name3</h2>
            <p class="PageContent-text" translate>Toolkit.AboutUs.AdvisoryCouncil.Bio3</p>
          </div>
          <div class="Position--relative">
            <div class="PageContent-memberPhoto Member4" translate></div>
            <h2 class="PageContent-subtitle" translate>Toolkit.AboutUs.AdvisoryCouncil.Name4</h2>
            <p class="PageContent-text" translate>Toolkit.AboutUs.AdvisoryCouncil.Bio4</p>
          </div>
          <div class="Position--relative">
            <div class="PageContent-memberPhoto Member5" translate></div>
            <h2 class="PageContent-subtitle" translate>Toolkit.AboutUs.AdvisoryCouncil.Name5</h2>
            <p class="PageContent-text" translate>Toolkit.AboutUs.AdvisoryCouncil.Bio5</p>
          </div>
          <div class="Position--relative">
            <div class="PageContent-memberPhoto Member6" translate></div>
            <h2 class="PageContent-subtitle" translate>Toolkit.AboutUs.AdvisoryCouncil.Name6</h2>
            <p class="PageContent-text" translate>Toolkit.AboutUs.AdvisoryCouncil.Bio6</p>
            <p class="PageContent-text" translate>Toolkit.AboutUs.AdvisoryCouncil.Bio7</p>
          </div>
        </div>

        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row--moreTopMargin">
          <section class="Message">
            <h1 class="Message-title" translate>Toolkit.AboutUs.ScientificCouncil.Title</h1>
          </section>
            <div *ngFor="let member of 'Toolkit.AboutUs.ScientificCouncil.Members' | translate">
              <div style="min-height:160px;">
                <div class="Position--relative">
                  <div class="PageContent-sacPhoto" [ngStyle]="{'background-image' : 'url(' + member.image + ')'}"></div>
                  <h2 class="PageContent-sac-name">
                    <div *ngIf="member.url">
                        <a [href]="member.url" target="_blank">{{member.name}}</a>
                    </div>
                    <div *ngIf="!member.url">
                        {{member.name}}
                    </div>

                  </h2>
                  <p class="PageContent-sac-institution" *ngFor="let affiliation of member.affiliations">
                    {{ affiliation }}
                  </p>
                </div>
              </div>
            </div>
        </div>

        <div class="row row--moreTopMargin"></div>
      </div>
    </article>
  </div>
  `
})
export class AboutUsComponent implements OnInit {
  public countMeInUrl: string;

  constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.countMeInUrl = this.toolkitConfiguration.countMeInUrl;
  }
}
