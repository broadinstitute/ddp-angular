import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-for-researches',
  templateUrl: './for-researches.component.html',
  styleUrls: ['./for-researches.component.scss']
})
export class ForResearchesComponent implements OnInit {
  readonly TERRA_BIO_URL = 'https://terra.bio/';

  constructor() { }

  ngOnInit(): void {
  }

}
