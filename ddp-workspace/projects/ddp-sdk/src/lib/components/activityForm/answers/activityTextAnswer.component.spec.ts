import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';

import { TranslateTestingModule } from '../../../testsupport/translateTestingModule';
import { ActivityTextQuestionBlock } from '../../../models/activity/activityTextQuestionBlock';
import { InputType } from '../../../models/activity/inputType';
import { TooltipComponent } from '../../tooltip.component';
import { QuestionPromptComponent } from './question-prompt/questionPrompt.component';
import { ActivityTextAnswer } from './activityTextAnswer.component';

fdescribe('ActivityTextAnswer', () => {
  let component: ActivityTextAnswer;
  let fixture: ComponentFixture<ActivityTextAnswer>;
  const configServiceSpy = jasmine.createSpyObj('ddp.config', [
    'tooltipIconUrl',
  ]);
  configServiceSpy.tooltipIconUrl.and.callFake(() => {
    return '/path/';
  });

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ActivityTextAnswer,
          QuestionPromptComponent,
          TooltipComponent,
        ],
        imports: [TranslateTestingModule, MatTooltipModule],
        providers: [{ provide: 'ddp.config', useValue: configServiceSpy }],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityTextAnswer);

    expect(fixture instanceof ComponentFixture).toBe(true);
    expect(fixture.componentInstance instanceof ActivityTextAnswer).toBe(true);

    const block = new ActivityTextQuestionBlock();
    block.inputType = InputType.Text;
    block.question = 'Who are you?';
    block.tooltip = 'Helper text';

    component = fixture.componentInstance;
    component.readonly = false;
    component.placeholder = 'nothing';
    component.block = block;
  });

  it('should render 1 tooltip', () => {
    fixture.detectChanges();

    const count = fixture.debugElement.queryAll(By.css('ddp-tooltip'));

    expect(count.length).toBe(1);
  });
});
