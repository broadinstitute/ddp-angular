import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {CompositeDisposable} from 'ddp-sdk';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-scientific-research',
    templateUrl: './scientific-research.component.html'
})
export class ScientificResearchComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(
        private route: ActivatedRoute,
    ) {}

    private fragment$ = new ReplaySubject<string | null | undefined>(1);
    private subs = new CompositeDisposable();
    readonly linksMap = {
        Angio: 'https://ascproject.org/',
        Brain: 'https://braintumorproject.org/',
        CRC: '/colorectal',
        ESC: 'https://escproject.org/',
        LMS: 'http://www.lmsproject.org',
        MBC: 'https://www.mbcproject.org/',
        MBCSpanish: 'http://mbcprojectenespanol.org/',
        MPC: 'https://mpcproject.org/',
        Osteo: 'https://osproject.org/',
        PediHCC: '/pedihcc'
    };

    ngOnInit(): void {
        const routeFragmentSub = this.route.fragment.subscribe(fragment =>
            this.fragment$.next(fragment),
        );

        this.subs.addNew(routeFragmentSub);
    }

    private scrollToTop(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    private scrollToAnchor(anchor: string): void {
        const el: HTMLElement = document.getElementById(anchor);

        if (!el) {
            return;
        }

        const yOffset = el.offsetTop;
        window.scrollTo({
            top: yOffset,
            behavior: 'smooth',
        });
    }

    ngAfterViewInit(): void {
        const fragmentSub = this.fragment$.subscribe(fragment => {
            if (fragment === null) {
                return;
            }

            if (fragment === undefined) {
                return this.scrollToTop();
            }

            this.scrollToAnchor(fragment);
        });

        this.subs.addNew(fragmentSub);
    }

    ngOnDestroy(): void {
        this.subs.removeAll();
    }

}
