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
    // console.log(radio, 'value')
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
    // console.log(value, 'active value')
    this.activeValue = value;

    // console.log(this.textAreaRef, 'text are ref')

    if(this.activeValue === "OTHER_HYPOPLASTIC" && this.activeValue === this.belongingValue) {
      // console.log(this.embeddedViewRef)
      this.createEmbeddedView("OTHER_HYPOPLASTIC");
    } else if(this.activeValue === "OTHER" && this.activeValue === this.belongingValue) {
      // console.log(this.embeddedViewRef)
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
      console.log(this.checkedRadioBtn, 'CHECKED')
      this.createEmbeddedView(this.checkedRadioBtn);
    }
  }

  private createEmbeddedView(value: string) {
    if(this.embeddedViewRef) {
      this.embeddedViewRef.destroy();
      this.embeddedViewRef = null;
    } else {
      console.log('CAME HERE')

      this.conditionalFieldSettings.settings = this.fieldSettings.actions.find(data => data.condition === value).conditionalFieldSetting;
      console.log(this.conditionalFieldSettings.settings, 'settings')
      this.embeddedViewRef = this.viewContainerRef.createEmbeddedView(this.textAreaRef, this.conditionalFieldSettings);
      // console.log(this.embeddedViewRef, 'embeded view')
    }
  }

  private setContextValues(radio: any) {
    // console.log(radio, 'radio')
    this.btnContext.name = radio?.name || radio?.value || radio;
    this.btnContext.value = radio?.value || radio;
  }
}
