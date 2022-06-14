import { Component } from '@angular/core';
import { AppRoutes } from '../app-routes';

@Component({
    selector: 'app-scientific-research',
    templateUrl: './scientific-research.component.html'
})
export class ScientificResearchComponent {
    readonly route = AppRoutes.ScientificResearch;
    readonly linksMap = {
        Angio: 'https://ascproject.org/',
        Brain: 'https://braintumorproject.org/',
        CRC: '/colorectal',
        ESC: 'https://escproject.org/',
        LMS: 'http://www.lmsproject.org',
        MBC: 'https://www.mbcproject.org/',
        MBCSpanish: 'http://mbcprojectenespanol.org/',
        MPC: 'https://mpcproject.org/',
        Osteo: 'https://osproject.org/'
    };
}
