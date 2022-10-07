import {Component, EventEmitter, Input, Output} from '@angular/core';
import {cardData} from './cardData.model';

@Component({
  selector: 'app-card',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.scss']
})

export class CardComponent {
  @Input() data: cardData;
  @Output() cardClicked = new EventEmitter();

  public onCardClick(): void {
    this.cardClicked.emit(this.data);
  }
}
