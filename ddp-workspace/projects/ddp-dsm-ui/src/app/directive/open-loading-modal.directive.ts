import { Directive, HostListener, Input, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Observable, Subscription } from "rxjs";
import { LoadingModalComponent } from "../modals/loading-modal.component";

@Directive({
    selector: "[openLoading]"
})

export class OpenDialog implements OnInit, OnDestroy {

    state$: Observable<any>;
    unsubscribe: Subscription;
    dialog: MatDialogRef<any>;

    constructor(private matDialog: MatDialog) {

    }

    ngOnInit(): void {
        this.unsubscribe = this.state$?.subscribe(data => data && this.dialog.close());
    }

    ngOnDestroy(): void {
        this.unsubscribe.unsubscribe();
    }

    @Input("openLoading") set setState(state: any) {
        this.state$ = state;
    } 

    @HostListener("click") openDialog(): void {
        this.dialog = this.matDialog.open(LoadingModalComponent, {data: {message: "Inserting cohort tags..."}, disableClose: true});
    }

}