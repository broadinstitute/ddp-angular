import { Component } from '@angular/core';
import * as RouterResource from '../../router-resources';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {
  public RouterResource = RouterResource;
}
