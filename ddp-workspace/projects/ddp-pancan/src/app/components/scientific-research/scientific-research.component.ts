import { Component } from '@angular/core';
import { AppRoutes } from '../app-routes';

@Component({
    selector: 'app-scientific-research',
    templateUrl: './scientific-research.component.html'
})
export class ScientificResearchComponent {
    readonly route = AppRoutes.ScientificResearch;
    readonly linksMap = {
        Angio: 'Angiosarcoma Project',
        Brain: 'Brain Tumor Project',
        CRC: 'Colorectal Cancer Project',
        ESC: 'Esophageal and Stomach Cancer Project',
        LMS: 'Leiomyosarcoma Project',
        MBC: 'Metastatic Breast Cancer Project',
        MBCSpanish: 'Metastatic Breast Cancer Project in Spanish',
        MPC: 'Metastatic Prostate Cancer Project',
        Osteo: 'Osteosarcoma Project'
    };
}
