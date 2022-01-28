import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PexEditorSandboxComponent } from './pex-editor-sandbox.component';

describe('PexEditorSandboxComponent', () => {
    let component: PexEditorSandboxComponent;
    let fixture: ComponentFixture<PexEditorSandboxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ PexEditorSandboxComponent ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PexEditorSandboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
