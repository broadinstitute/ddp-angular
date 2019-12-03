import { Component, OnDestroy } from '@angular/core';
import { UserProfileBusService, UserProfileDto, CompositeDisposable, Auth0Mode } from 'ddp-sdk';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sandbox-login',
  templateUrl: 'loginSandbox.component.html'
})
export class LoginSandboxComponent implements OnDestroy {
  public currentEvent: string;
  public profile: string;
  public auth0Mode: Auth0Mode = Auth0Mode.SignupAndLogin;
  public loginCaption: string = 'LOG IN';
  public logoutCaption: string = 'LOG OUT';
  private anchor: CompositeDisposable;

  constructor(private userProfile: UserProfileBusService) {
    this.profile = null;
    this.anchor = new CompositeDisposable();
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  public call(): void {
    const get = this.getData().subscribe(x => this.profile = JSON.stringify(x));
    this.anchor.addNew(get);
  }

  private getData(): Observable<UserProfileDto | null> {
    return this.userProfile.getProfile();
  }
}
