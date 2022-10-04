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
  private conditionalFieldSettings = new conditionalFieldSettings();
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
    if(this.activeValue === "OTHER_HYPOPLASTIC" && this.activeValue === this.belongingValue) {
      this.createEmbeddedView("OTHER_HYPOPLASTIC");
    } else if(this.activeValue === "OTHER" && this.activeValue === this.belongingValue) {
      this.createEmbeddedView("OTHER");
    }
    else {
      if(this.embeddedViewRef) {
        this.embeddedViewRef.destroy();
        this.embeddedViewRef = null;
      }
    }
  }


  @Input('ddpRadioBtnTextArea') textAreaRef: TemplateRef<any> | null = null;

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.templateRef, this.btnContext)
    if(this.checkedRadioBtn === this.belongingValue
      && (this.checkedRadioBtn === "OTHER_HYPOPLASTIC" ||
        this.checkedRadioBtn === "OTHER")) {
      this.createEmbeddedView(this.checkedRadioBtn);
    }
  }

  private createEmbeddedView(value: string) {
    if(this.embeddedViewRef) {
      this.embeddedViewRef.destroy();
      this.embeddedViewRef = null;
    } else {
      this.conditionalFieldSettings.settings = this.fieldSettings.actions.find(data => data.condition === value).conditionalFieldSetting;
      this.embeddedViewRef = this.viewContainerRef.createEmbeddedView(this.textAreaRef, this.conditionalFieldSettings);
    }
  }

  private setContextValues(radio: any) {
    this.btnContext.name = radio?.name || radio?.value || radio;
    this.btnContext.value = radio?.value || radio;
  }
}
