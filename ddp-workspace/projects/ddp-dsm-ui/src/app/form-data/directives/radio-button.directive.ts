import {Directive, EmbeddedViewRef, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {FieldSettings} from '../../field-settings/field-settings.model';


class btnContext {
  constructor(public value: string, public name: string) {
  }
}

class conditionalFieldSettings {
  constructor(public settings: FieldSettings) {
  }
}

type NameValuePair = {name: string; value: string};

@Directive({
  selector: '[ddpRadioBtn]'
})

export class RadioButtonDirective implements OnInit {
  constructor(private viewContainerRef: ViewContainerRef,
              private templateRef: TemplateRef<any>) {
  }

  private btnNameValuePair: NameValuePair;
  private embeddedViewRef: EmbeddedViewRef<any>;
  private fieldSettings: FieldSettings;

  // dynamically changes
  // on init - undefined
  private afterClickCheckedRadioBtn: string;
  // on init - defined
  private initCheckedRadioBtn: string;

  @Input('ddpRadioBtn') set setValue(radio: any) {
    this.btnNameValuePair = radio;
  }

  @Input('ddpRadioBtnFieldSetting') set setFieldSettings(fieldSettings: FieldSettings) {
   this.fieldSettings = fieldSettings;
  }

  @Input('ddpRadioBtnCheckedRadioBtn') set setCheckedRadioBtn(value: string) {
    this.initCheckedRadioBtn = value;
  }

  @Input('ddpRadioBtnCurrentValue') set currentValue(value: string) {
    this.afterClickCheckedRadioBtn = value;
    value && this.createEmbeddedView();
  }

  @Input('ddpRadioBtnTextArea') textAreaRef: TemplateRef<any> | null = null;

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.templateRef, this.getBtnContextInstance);
    this.createEmbeddedView();
  }

  private createEmbeddedView(): void {
    if(this.embeddedViewRef) {
      this.embeddedViewRef.destroy();
      this.embeddedViewRef = null;
    }
    const cfs: FieldSettings | null = this.conditionalFieldSetting;
    if(!!cfs) {
      this.embeddedViewRef = this.viewContainerRef.createEmbeddedView(this.textAreaRef, new conditionalFieldSettings(cfs));
    }
  }

  private get getBtnContextInstance(): btnContext {
    const name = this.btnNameValuePair?.name || this.btnNameValuePair?.value || String(this.btnNameValuePair);
    const value = this.btnNameValuePair?.value || String(this.btnNameValuePair);
    return new btnContext(value, name);
  }

  private get conditionalFieldSetting(): FieldSettings | null {
    const conditionalActions = this.fieldSettings.actions?.filter(action => action.conditionalFieldSetting);
    const conditionalItemIndex = conditionalActions?.findIndex(
      data => data.condition === String(this.afterClickCheckedRadioBtn || this.initCheckedRadioBtn));
    return conditionalItemIndex > -1 && this.isBelonging ? conditionalActions[conditionalItemIndex].conditionalFieldSetting : null;
  }

  private get isBelonging(): boolean {
    return (this.afterClickCheckedRadioBtn || this.initCheckedRadioBtn) === this.belongingValue;
  }

  private get belongingValue(): string {
    return this.btnNameValuePair.value || String(this.btnNameValuePair);
  }

  // for types to catch
  static ngTemplateContextGuard(dir: RadioButtonDirective, ctx: unknown): ctx is RadioButtonDirective {
    return true;
  }
}
