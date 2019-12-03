import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  public prequalifierStudyGuid: string;
  public prequalifierActivityGuid: string;

  constructor(private router: Router) { }

  public ngOnInit(): void {
    this.prequalifierStudyGuid = 'TESTSTUDY1';
    this.prequalifierActivityGuid = '103e1ee3-51ab-4295-bb95-6ea8a43fdc43';
  }

  public navigate(url: string): void {
    this.router.navigateByUrl(url);
  }

  public onSubmitPrequalifier(): void {
    alert('SUBMIT');
  }
}
