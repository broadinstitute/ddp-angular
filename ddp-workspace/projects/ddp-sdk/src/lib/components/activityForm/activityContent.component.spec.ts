import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivityContentBlock } from '../../models/activity/activityContentBlock';
import { ActivityContentComponent } from './activityContent.component';

describe('ActivityContentComponent', () => {
    const contentBlock = {
        content: 'Some text',
        title: null
    } as ActivityContentBlock;

    @Component({
        template: `
        <ddp-activity-content [block]="block">
        </ddp-activity-content>`
    })
    class TestHostComponent {
        block = contentBlock;
    }

    let component: ActivityContentComponent;
    let fixture: ComponentFixture<ActivityContentComponent>;
    let debugElement: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                TestHostComponent,
                ActivityContentComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ActivityContentComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        component.block = contentBlock;
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(component).toBeTruthy();
    });

    it('should render content', () => {
        const content = debugElement.queryAll(By.css('.ddp-content'));
        expect(content.length).toBe(1);
        expect(content[0].nativeElement.innerText).toBe('Some text');
    });

    it('should render title and content', () => {
        component.block.title = 'Some title';
        fixture.detectChanges();
        const data = debugElement.queryAll(By.css('div'));
        expect(data.length).toBe(2);
        expect(data[0].nativeElement.innerText).toBe('Some title');
        expect(data[1].nativeElement.innerText).toBe('Some text');
    });
});
