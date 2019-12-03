import { Component } from '@angular/core';

@Component({
    selector: 'ddp-loader',
    template: `
    <div class="PageLayout">
        <div class="row NoMargin">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <section class="PageContent-section Loader-height">
                    <div class="Loader"></div>
                </section>
            </div>
        </div>
    </div>`
})
export class LoaderComponent { }
