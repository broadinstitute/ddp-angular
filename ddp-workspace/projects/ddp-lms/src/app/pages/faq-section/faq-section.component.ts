import { Component, Input, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

type Question = { Question: string; Paragraphs: string[] };

@Component({
  selector: 'app-faq-section',
  // templateUrl: './faq-section.component.html',
  template: `
    <div>
      <div>
        <button mat-flat-button class="expand-btn" (click)="toggleAll()">
          <mat-icon class="icon">{{ isAllOpened ? 'clear' : 'add' }}</mat-icon>
          <span>{{ (isAllOpened ? 'App.FAQ.Button.Collapse' : 'App.FAQ.Button.Expand') | translate }}</span>
        </button>

        <h3 class="no-margin">{{ title }}</h3>
      </div>

      <mat-accordion #a="matAccordion" hideToggle="true" multi="true" displayMode="flat">
        <ng-container *ngFor="let item of questions">
          <mat-expansion-panel #panel>
            <mat-expansion-panel-header collapsedHeight="100%" expandedHeight="100%">
              <mat-icon *ngIf="!panel.expanded" class="faq-block__icon">add</mat-icon>
              <mat-icon *ngIf="panel.expanded" class="faq-block__icon">clear</mat-icon>
              <p class="faq-block__question no-margin">{{ item.Question }}</p>
            </mat-expansion-panel-header>
            <ng-template matExpansionPanelContent>
              <p
                *ngFor="let paragraph of item.Paragraphs"
                class="faq-block__text"
                [innerHTML]="paragraph"
                routeTransformer
              ></p>
            </ng-template>
          </mat-expansion-panel>
        </ng-container>
      </mat-accordion>
    </div>
  `,
  styleUrls: ['./faq-section.component.scss'],
})
export class FaqSectionComponent {
  @Input() title: string;
  @Input() questions: Question[];
  @ViewChild(MatAccordion) accordion: MatAccordion;
  isAllOpened = false;

  public toggleAll(): void {
    this.isAllOpened ? this.accordion.closeAll() : this.accordion.openAll();

    this.isAllOpened = !this.isAllOpened;
  }
}
