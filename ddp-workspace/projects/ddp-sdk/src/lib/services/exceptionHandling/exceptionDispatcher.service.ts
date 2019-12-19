import { Injectable } from '@angular/core';
import { DdpException } from '../../models/exceptions/ddpException';

@Injectable()
export class ExceptionDispatcher {
    public consume(excpetion: DdpException): void {
        console.log('consumed');
    }
}
