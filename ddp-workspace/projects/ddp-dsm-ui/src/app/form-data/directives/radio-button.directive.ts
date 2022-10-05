import {Directive, EmbeddedViewRef, Input, OnInit, TemplateRef, ViewContainerRef} from "@angular/core";
import {FieldSettings} from "../../field-settings/field-settings.model";


class btnContext {
  value: string;
  name: string;
}

class conditionalFieldSettings {
  settings: any;
}

@Directive({
  selector: '[ddpRadioBtn]'
})

export class RadioButtonDirective implements OnInit {
  constructor(private viewContainerRef: ViewContainerRef,
              private templateRef: TemplateRef<any>) {
  }

  private btnContext = new btnContext();
  private textAreaContext = new conditionalFieldSettings();
  private activeValue: string;
  private belongingValue: string;
  private embeddedViewRef: EmbeddedViewRef<any>;
  private fieldSettings: FieldSettings;
  private checkedRadioBtn: string;

  @Input('ddpRadioBtn') set setValue(radio: any) {
    this.belongingValue = radio.value;
    this.setContextValues(radio);
  }

  @Input('ddpRadioBtnFieldSetting') set setFieldSettings(fieldSettings: FieldSettings) {
   this.fieldSettings = fieldSettings;
  }

  @Input('ddpRadioBtnCheckedRadioBtn') set setCheckedRadioBtn(value: string) {
    this.checkedRadioBtn = value;
  }

  @Input('ddpRadioBtnCurrentValue') set currentValue(value: string) {
    this.activeValue = value;
    value && this.createEmbeddedView();
  }

  @Input('ddpRadioBtnTextArea') textAreaRef: TemplateRef<any> | null = null;

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.templateRef, this.btnContext)
    this.createEmbeddedView();
  }

  private createEmbeddedView() {
    if(this.embeddedViewRef) {
      this.embeddedViewRef.destroy();
      this.embeddedViewRef = null;
    }
    const cfs = this.conditionalFieldSetting;
    if(!!cfs) {
      this.textAreaContext.settings = cfs;
      this.embeddedViewRef = this.viewContainerRef.createEmbeddedView(this.textAreaRef, this.textAreaContext);
    }
  }

  private setContextValues(radio: any) {
    this.btnContext.name = radio?.name || radio?.value || radio;
    this.btnContext.value = radio?.value || radio;
  }

  private get conditionalFieldSetting(): FieldSettings | null {
    const conditionalActions = this.fieldSettings.actions?.filter(action => action.conditionalFieldSetting);
    const conditionalItemIndex = conditionalActions?.findIndex(data => data.condition === String(this.activeValue || this.checkedRadioBtn));
    return conditionalItemIndex > -1 && this.isBelonging ? conditionalActions[conditionalItemIndex].conditionalFieldSetting : null;
  }

  private get isBelonging() : boolean {
    return (this.activeValue || this.checkedRadioBtn) === this.belongingValue;
  }
}
