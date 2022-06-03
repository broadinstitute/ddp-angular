import {Component, Inject, Input} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {AnalyticsEventCategories, AnalyticsEventsService} from "ddp-sdk";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  @Input() isColorectal: boolean;
  readonly twitterUrl: string;
  readonly facebookUrl: string;
  readonly instagramUrl: string;

  imagesArray = [{
    src: 'assets/images/step1_big.png',
    alt: 'step1',
    text1: 'home.step1.Text1',
    text2: 'home.step1.Text2',
    text3: 'home.step1.Text3',

  }, {
    src: 'assets/images/step2_big.png',
    alt: 'step2',
    text1: 'home.step2.Text1',
    text2: 'home.step2.Text2',
    text3: 'home.step2.Text3',
  }, {
    src: 'assets/images/step3_big.png',
    alt: 'step3',
    text1: 'home.step3.Text1',
    text2: 'home.step3.Text2',
    text3: 'home.step3.Text3',
  },
    {
      src: 'assets/images/step4_big.png',
      alt: 'step4',
      text1: 'home.step4.Text1',
      text2: 'home.step4.Text2',
      text3: 'home.step4.Text3',
    }];

  par4imagesArray = [{
    src: 'assets/images/pic1_big.png',
    alt: 'benefit1',
    text: 'home.benefit.text1',
  }, {
    src: 'assets/images/pic2_big.png',
    alt: 'benefit2',
    text: 'home.benefit.text2',
  }, {
    src: 'assets/images/pic3_big.png',
    alt: 'benefit1',
    text: 'home.benefit.text3',
  },]

  questions = [{
    question: 'home.questions.question1',
    paragraph: 'home.questions.paragraph1'
  },
    {
      question: 'home.questions.question2',
      paragraph: 'home.questions.paragraph2'
    }, {
      question: 'home.questions.question3',
      paragraph: 'home.questions.paragraph3'
    },
    {
      question: 'home.questions.question4',
      paragraph: 'home.questions.paragraph4'
    }, {
      question: 'home.questions.question5',
      paragraph: 'home.questions.paragraph5'
    }]

  constructor(
    private dialog: MatDialog,
    private analytics: AnalyticsEventsService,
  ) {
    this.twitterUrl = `https://twitter.com/count_me_in`;
    this.facebookUrl = `https://www.facebook.com/joincountmein`;
    this.instagramUrl = `https://www.instagram.com/countmein`;
  }

  public sendSocialMediaAnalytics(event: string): void {
    this.analytics.emitCustomEvent(AnalyticsEventCategories.Social, event);
  }
}
