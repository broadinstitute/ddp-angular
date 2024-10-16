import { Pipe, PipeTransform } from '@angular/core';
import { KitRequest } from '../shipping/shipping.model';

@Pipe({
  name: 'kitRequestFilter'
})
export class KitRequestFilterPipe implements PipeTransform {
  transform(array: KitRequest[], filterShortId: any, filterShippingId: any, filterReason: any, filterTrackingTo: any,
            filterTrackingReturn: any, filterMfCode: any, noReturn: any, externalOrderNumber: any, externalOrderStatus: any): any {
    if (filterShortId !== '') {
      return array.filter(row => row.getID() != null && row.getID().indexOf(filterShortId) > -1);
    }
    if (filterShippingId !== '') {
      return array.filter(row => row.ddpLabel != null && row.ddpLabel.indexOf(filterShippingId) > -1);
    }
    if (filterReason !== '') {
      return array.filter(row => row.deactivationReason != null && row.deactivationReason.indexOf(filterReason) > -1);
    }
    if (filterTrackingTo !== '') {
      return array.filter(row => row.trackingToId != null && row.trackingToId.indexOf(filterTrackingTo) > -1);
    }
    if (filterTrackingReturn !== '') {
      return array.filter(row => (row.trackingReturnId != null && row.trackingReturnId.indexOf(filterTrackingReturn) > -1));
    }
    if (filterMfCode !== '') {
      return array.filter(row => row.kitLabel != null && row.kitLabel.indexOf(filterMfCode) > -1);
    }
    if (externalOrderNumber !== '') {
      return array.filter(row => row.externalOrderNumber != null && row.externalOrderNumber.indexOf(filterMfCode) > -1);
    }
    if (externalOrderStatus !== '') {
      return array.filter(row => row.externalOrderStatus != null && row.externalOrderStatus.indexOf(filterMfCode) > -1);
    }
    if (noReturn !== '') {
      if (noReturn.toLowerCase().startsWith('n')) {
        return array.filter(row => row.noReturn != null && row.noReturn === true);
      } else if (noReturn.toLowerCase().startsWith('y')) {
        return array.filter(row => row.noReturn != null && row.noReturn === false);
      }
    }
    return array;
  }
}
