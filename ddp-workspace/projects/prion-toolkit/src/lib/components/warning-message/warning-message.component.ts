import { Component } from '@angular/core';

@Component({
    selector: 'toolkit-warning-message',
    template: `
    <p class="warning-message-text" translate>Toolkit.Warning.Text1</p>
    <p class="warning-message-text" translate>Toolkit.Warning.Text2</p>
    <p class="warning-message-text">
        <span translate>Toolkit.Warning.Text3.Pt1 </span>
        <a href="https://www.google.com/chrome/" class="Link" target="_blank" translate>Toolkit.Warning.Text3.Chrome</a>
        <span translate> Toolkit.Warning.Text3.Pt2 </span>
        <a href="https://support.apple.com/downloads/safari" class="Link" target="_blank" translate>Toolkit.Warning.Text3.Safari</a>.
        <span translate>Toolkit.Warning.Text3.Pt3</span>
    </p>`
})
export class WarningMessageComponent { }
