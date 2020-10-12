import { Component, OnInit, Input } from '@angular/core';
import { GalleryItem } from '../../models/galleryItem.model';
import { NGXTranslateService } from 'ddp-sdk';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  @Input() private translateSource = 'BehindScenesGallery.Items';
  public gallery: Array<GalleryItem>;
  public selectedItem: GalleryItem;

  constructor(private translate: NGXTranslateService) { }

  public ngOnInit(): void {
    this.translate.getTranslationObject(this.translateSource).pipe(
      take(1)
    ).subscribe((gallery: Array<GalleryItem>) => {
      this.gallery = gallery;
      this.selectedItem = gallery[0];
    });
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
}
