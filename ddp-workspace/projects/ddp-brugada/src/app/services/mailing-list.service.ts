import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { MailingListModalComponent } from '../components/mailing-list-modal/mailing-list-modal.component';
import { FuncType } from 'ddp-sdk';

type Cache = Array<{
  node: Node;
  eventType: string;
  handler: (e: MouseEvent) => void;
}>;

@Injectable()
export class MailingListService {
  private cache: Cache | null = null;
  private readonly ELEMENT_CLASS_NAME = 'mailing-list-toggle';

  constructor(private dialog: MatDialog) {}

  applyEventListeners(): void {
    const nodes = this.findAllNodes();
    const cache: Cache = [];

    nodes.forEach(node => {
      const eventType = 'click';
      const handler: FuncType<any> = (e: MouseEvent) => {
        e.preventDefault();

        this.openDialog();
      };

      node.addEventListener(eventType, handler);

      cache.push({ node, eventType, handler });
    });

    this.cache = cache;
  }

  removeEventListeners(): void {
    this.cache.forEach(({ node, eventType, handler }) => {
      node.removeEventListener(eventType, handler);
    });

    this.cache = null;
  }

  openDialog(): void {
    const options: MatDialogConfig = {
      width: '100%',
      maxWidth: '80rem',
      disableClose: true,
      autoFocus: false,
    };

    this.dialog.open(MailingListModalComponent, options);
  }

  private findAllNodes(): NodeList {
    return document.querySelectorAll(`.${this.ELEMENT_CLASS_NAME}`);
  }
}
