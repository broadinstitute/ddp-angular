import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivityContentBlock } from '../../../models/activity/activityContentBlock';
import { ActivityContentComponent } from './activityContent.component';
import {FileDownloadService} from '../../../services/fileDownload.service';
import {of} from 'rxjs';
import {ActivitySection} from 'ddp-sdk';
import {DownloadFileComponent} from './downloadFile.component';
import {expect} from '@angular/flex-layout/_private-utils/testing';

describe('ActivityContentComponent', () => {
    const contentBlock = {
        content: 'Some text',
        title: null
    } as ActivityContentBlock;

    const section = {
        blocks: []
    } as ActivitySection;

    @Component({
        template: `
        <ddp-activity-content  [studyGuid]="'CMI-LMS'" [block]="block">
        </ddp-activity-content>`
    })
    class TestHostComponent {
        block = contentBlock;
    }
    let fileDownloadService: jasmine.SpyObj<FileDownloadService>;


    let component: ActivityContentComponent;
    let fixture: ComponentFixture<ActivityContentComponent>;
    let debugElement: DebugElement;


    beforeEach(() => {
        fileDownloadService = jasmine.createSpyObj('FileDownloadService', ['getDownloadUrl']);
        fileDownloadService.getDownloadUrl.and.returnValue(of({downloadUrl: 'someUrl'}));

        TestBed.configureTestingModule({
            declarations: [
                TestHostComponent,
                ActivityContentComponent,
                DownloadFileComponent
            ],
            providers: [
                {provide: FileDownloadService, useValue: fileDownloadService },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ActivityContentComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        component.block = contentBlock;
        component.section = section;
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

    it('should display file download button',  () => {
        spyOnProperty(component, 'shouldDisplayDownloadButton', 'get')
            .and.returnValue(true);
        fixture.detectChanges();
        const childComponent = debugElement.query(By.directive(DownloadFileComponent)).componentInstance;
        expect(childComponent).toBeTruthy('File Download Button is not visible');
    });
});
