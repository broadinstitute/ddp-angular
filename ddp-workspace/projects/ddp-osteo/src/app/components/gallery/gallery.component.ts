import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { GalleryItem } from '../../models/galleryItem.model';
import { CompositeDisposable, NGXTranslateService } from 'ddp-sdk';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnDestroy {
  public gallery: Array<GalleryItem>;
  public selectedItem: GalleryItem;
  @Input() private translateSource = 'BehindScenesGallery.Items';

  private anchor = new CompositeDisposable();

  constructor(private translate: NGXTranslateService) { }

  public ngOnInit(): void {
    if(this.translate) {
      const translate$ = this.translate.getTranslationObject(this.translateSource)
        .subscribe((gallery: Array<GalleryItem>) => {
            this.gallery = gallery;
            this.selectedItem = gallery[0];
        });
      this.anchor.addNew(translate$);
    }
  }

  public isItemSelected(index: number): boolean {
    return this.selectedItem.id === index;
  }

  public moveForward(): void {
    const item = this.gallery[this.selectedItem.id + 1];
    this.selectedItem = item !== undefined ? item : this.gallery[0];
  }

  public moveBack(): void {
    const item = this.gallery[this.selectedItem.id - 1];
    const length = this.gallery.length;
    this.selectedItem = item !== undefined ? item : this.gallery[length - 1];
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }
}
