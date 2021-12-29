import { Component } from '@angular/core';

@Component({
    selector: 'app-pex-editor-sandbox',
    templateUrl: 'pex-editor-sandbox.component.html',
    styleUrls: ['pex-editor-sandbox.component.scss']
})
export class PexEditorSandboxComponent {
    pexExpression = 'user.studies["A"].forms["B"].questions["COUNTRY"].answers.hasOption("US")';
}
