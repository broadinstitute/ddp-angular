import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorComponent {
    errorMessage: string;

    constructor(private router: Router) {
        this.errorMessage = this.router.getCurrentNavigation().extras?.state?.errorMessage;
    }
}
