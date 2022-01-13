import { SessionExpiredComponent } from './pages/session-expired/session-expired.component';
import { DdpModule } from 'ddp-sdk';
import { ToolkitModule } from 'toolkit';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RecaptchaModule } from 'ng-recaptcha';
import { AppComponent } from './components/app/app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ActivityComponent } from './components/activity/activity.component';
import { SignInOutComponent } from './components/sign-in-out/sign-in-out.component';
import { MailingListModalComponent } from './components/mailing-list-modal/mailing-list-modal.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { UserActivitiesComponent } from './components/user-activities/user-activities.component';
import { SKDConfigProvider } from './config/sdk.provider';
import { translateProvider } from './config/translate.provider';
import { toolkitConfigProvider } from './config/toolkit.provider';
import { FaqComponent } from './pages/faq/faq.component';
import { HomeComponent } from './pages/home/home.component';
import { JoinComponent } from './pages/join/join.component';
import { TeamComponent } from './pages/team/team.component';
import { AboutComponent } from './pages/about/about.component';
import { ErrorComponent } from './pages/error/error.component';
import { LoginComponent } from './pages/login/login.component';
import { LoginLandingComponent } from './pages/login-landing/login-landing.component';
import { PasswordComponent } from './pages/password/password.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ActivityPageComponent } from './pages/activity-page/activity-page.component';
import { AuthRedirectComponent } from './pages/auth-redirect/auth-redirect.component';
import { SessionExpiredDialogComponent } from './components/session-expired-dialog/session-expired-dialog.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    ActivityComponent,
    AppComponent,
    FooterComponent,
    HeaderComponent,
    MailingListModalComponent,
    AboutComponent,
    ErrorComponent,
    FaqComponent,
    HomeComponent,
    JoinComponent,
    PasswordComponent,
    TeamComponent,
    RegistrationComponent,
    SignUpComponent,
    LoginComponent,
    LoginLandingComponent,
    SignInComponent,
    SignInOutComponent,
    ProgressBarComponent,
    DashboardComponent,
    UserActivitiesComponent,
    ActivityPageComponent,
    ForgotPasswordComponent,
    SessionExpiredComponent,
    SessionExpiredDialogComponent,
    AuthRedirectComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MatIconModule,
    MatExpansionModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    RecaptchaModule,
    DdpModule,
    ToolkitModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
  ],
  providers: [SKDConfigProvider, translateProvider, toolkitConfigProvider],
  bootstrap: [AppComponent],
})
export class AppModule { }
