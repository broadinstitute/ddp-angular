import { Injectable } from '@angular/core';

@Injectable()
export class HeaderConfigurationService {
    public showMainButtons = true; // Hides or shows FAQ, About Us, Mailing List, For Physicians buttons
    public showLoginButton = true;
    public showCmiButton = true;
    public showDashboardButton = false;
    public showBreadcrumbs = false;
    public stickySubtitle = '';
    public currentActivity = '';
    public workflowStartSectionsVisibility: number | null = null;

    public setupActivityHeader(): void {
        this.setupDefaultHeader();
        this.showMainButtons = false;
        this.showDashboardButton = true;
        this.showBreadcrumbs = true;
    }

    public setupLoginLandingHeader(): void {
        this.setupDefaultHeader();
        this.showMainButtons = false;
        this.showCmiButton = false;
    }

    public setupPasswordHeader(): void {
        this.setupDefaultHeader();
        this.showLoginButton = false;
    }

    public setupDefaultHeader(): void {
        this.showMainButtons = true;
        this.showLoginButton = true;
        this.showCmiButton = true;
        this.showDashboardButton = false;
        this.showBreadcrumbs = false;
        this.stickySubtitle = '';
        this.currentActivity = '';
        this.workflowStartSectionsVisibility = null;
    }
}
