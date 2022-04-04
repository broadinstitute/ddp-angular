import {Pipe, PipeTransform} from '@angular/core';
import {ComponentService} from '../../services/component.service';

@Pipe({
  name: 'dynamicFormTypeAndStudyRGP'
})

export class dynamicFormTypeAndStudyRGP implements PipeTransform {
  transform(settings: any): boolean {
    return settings.hasOwnProperty('TAB_GROUPED') && !!localStorage.getItem(ComponentService.MENU_SELECTED_REALM) === 'RGP';
  }
}
