import {Component, OnInit} from '@angular/core';
import {Auth} from '../services/auth.service';
import {ComponentService} from '../services/component.service';
import {DSMService} from '../services/dsm.service';
import {RoleService} from '../services/role.service';
import {Statics} from '../utils/statics';
import {Utils} from '../utils/utils';
import {ClinicalOrder} from './clinical-order.model';

@Component( {
  selector: 'app-clinical-page',
  templateUrl: './clinical-page.component.html',
  styleUrls: [ './clinical-page.component.scss' ]
} )
export class ClinicalPageComponent implements OnInit {
  clinicalOrdersArray: ClinicalOrder[];
  loading: boolean;
  errorMessage: string;

  constructor( private dsmService: DSMService, private auth: Auth, private role: RoleService ) {
  }

  ngOnInit(): void {
    this.getMercuryOrders();
  }

  getMercuryOrders(): void {
    this.loading = true;
    const realm = localStorage.getItem( ComponentService.MENU_SELECTED_REALM );
    this.dsmService.getMercuryOrders( realm ).subscribe( {
      next: data => {
        const jsonData = data;
        this.clinicalOrdersArray = [];
        jsonData.forEach( ( json ) => {
            const order = ClinicalOrder.parse( json );
            this.clinicalOrdersArray.push( order );
          }
        );
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error - Loading Clinical Page, Please contact your DSM developer';
        this.loading = false;
      }
    } );
  }

  getDateFormatted( date: any ): string {
    return Utils.getLongDateFormatted( date );
  }

  getOrderStatus( statusDetail: string ): string {
    return statusDetail || 'Sent';
  }

  public downloadList(): void {
    const map: { shortId: string; sampleType: string; sample: string; orderDate: string; status: string; orderId: string }[] = [];
    for (const order of this.clinicalOrdersArray) {
      map.push( this.getOrderJson( order ) );
    }
    const fields = [];
    fields.push( 'shortId' );
    fields.push( 'sampleType' );
    fields.push( 'sample' );
    fields.push( 'orderDate' );
    fields.push( 'status' );
    fields.push( 'orderId' );
    const date = new Date();
    Utils.createCSV(
      fields,
      map,
      'Sequencing_Orders ' + Utils.getDateFormatted( date, Utils.DATE_STRING_CVS ) + Statics.CSV_FILE_EXTENSION
    );
  }

  reloadList(): void {
    this.getMercuryOrders();
  }

  private getOrderJson( order: ClinicalOrder ): any {
    const dateCreated = this.getDateFormatted( order.orderDate );
    return {
      shortId: order.shortId,
      sampleType: order.sampleType,
      sample: order.sample,
      orderDate: dateCreated,
      status: this.getOrderStatus( order.statusDetail ),
      orderId: order.orderId
    };
  }
}
