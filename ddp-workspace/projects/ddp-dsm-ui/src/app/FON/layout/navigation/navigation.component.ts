import {Component, OnInit} from "@angular/core";
import {botNavItems, topNavItems} from "./navItems";
import {Auth} from "../../../services/auth.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})

export class NavigationComponent implements OnInit {
  topNavigation = topNavItems;
  botNavigation = botNavItems('Giorgi Charkviani')

  constructor(private auth: Auth) {
  }

  signOut(allow: boolean) {
    allow && this.auth.logout();
  }

  ngOnInit() {
  }
}
