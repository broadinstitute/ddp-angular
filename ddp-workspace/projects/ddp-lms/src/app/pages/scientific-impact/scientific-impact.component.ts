import {Component} from '@angular/core';

@Component({
  selector: 'app-scientific-impact',
  templateUrl: './scientific-impact.component.html',
  styleUrls: ['./scientific-impact.component.scss'],
})
export class ScientificImpactComponent {
  imageArray = [{
    src: 'assets/images/Angio.png',
    alt: 'test1',
    text: 'SIPage.IMGSection.Text1',
    link: 'https://www.cbioportal.org/study/summary?id=angs_painter_2020'
  },
    {
      src: 'assets/images/meta.png',
      alt: 'test2',
      text: 'SIPage.IMGSection.Text2',
      link: 'https://www.cbioportal.org/study/summary?id=mpcproject_broad_2021'
    },
    {
      src: 'assets/images/breast.png',
      alt: 'test3',
      text: 'SIPage.IMGSection.Text3',
      link: 'https://www.cbioportal.org/study/summary?id=brca_mbcproject_wagle_2017'
    }]

}
