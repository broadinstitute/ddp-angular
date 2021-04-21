import { Component, Input, OnInit } from '@angular/core';
import { ContentBlockDef } from '../model/contentBlockDef';

@Component({
  selector: 'app-content-block',
  templateUrl: './content-block.component.html',
  styleUrls: ['./content-block.component.scss']
})
export class ContentBlockComponent implements OnInit {
  @Input() block: ContentBlockDef;

  constructor() { }

  ngOnInit(): void {
  }

  public editorInit(): object {
    return {
      toolbar: 'pepper',
      setup: editor => {
        let toggled = false;
        editor.ui.registry.addMenuButton('pepper', {
          text: 'pepper',
          fetch: callback => {
            callback([
            {
              type: 'menuitem',
              text: '$pepper.firstName()',
              onAction: () => {
                editor.insertContent('<strong>$pepper.firstName()</strong>')
              }
            }
            ]);
          }
        });
      }
    };
  }

  public initialContent(): String {
    const translation = this.block.bodyTemplate.variables[0].translations[0];
    return translation.text;
  }

  public onContentChange({ event, editor}): void {
    // const data = editor.getData();
    // console.log("the content:", data);

    // const translation = this.block.bodyTemplate.variables[0].translations[0];
    // translation.text = data;
    console.log(event);
    console.log(editor);

    const data = editor.getContent();
    console.log("the content:", data);
    const translation = this.block.bodyTemplate.variables[0].translations[0];
    translation.text = data;
  }
}
