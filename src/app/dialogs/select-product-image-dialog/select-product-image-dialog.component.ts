import { Component, Inject, OnInit, Output } from '@angular/core';
import { BaseComponent, SpinnerType } from 'app/base/base.component';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PartialObserver } from 'rxjs';
import { FileUploadOptions } from 'app/services/common/file-upload/file-upload.component';
import { identifierName } from '@angular/compiler';
import { ProductService } from 'app/services/common/models/product.service';
import { List_Product_Image } from 'app/contracts/list_product_image';
import { NgxSpinnerService } from 'ngx-spinner';
import { AnimateTimings } from '@angular/animations';
import { DialogService } from 'app/services/common/dialog.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { DeleteState } from 'app/directives/admin/delete.directive';
declare var $: any;

@Component({
  selector: 'app-select-product-image-dialog',
  templateUrl: './select-product-image-dialog.component.html',
  styleUrls: ['./select-product-image-dialog.component.scss']
})
export class SelectProductImageDialogComponent extends BaseDialog<SelectProductImageDialogComponent> implements OnInit{
  constructor(dialogRef: MatDialogRef<SelectProductImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectProductImageState | string,
      private productService: ProductService,
      private spinner: NgxSpinnerService,
      private dialogService: DialogService){
  super(dialogRef);
}


  @Output() fileUploadOptions: Partial<FileUploadOptions> = {
    action: "upload",
    controller: "products",
    explanation: "Resimleri surukleyin veya secin.",
    accept: ".jpg, .png, .jpeg, .json",
    isAdminPage: true,
    queryString: `id=${this.data}`
  };

  images: List_Product_Image[];

  async ngOnInit(){
    this.spinner.show(SpinnerType.Ball8bits);
    this.images = await this.productService.readImages(this.data as string, () => this.spinner.hide(SpinnerType.Ball8bits));
  }

  async deleteImages(imageId: string, event){

    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: async () => {
        this.spinner.show(SpinnerType.Ball8bits);
        await this.productService.deleteImage(this.data as string, imageId, () => {
          this.spinner.hide(SpinnerType.Ball8bits);
          var card = $(event.srcElement).parent().parent();
          card.fadeOut(500);
        });
      }
    })
  }

  showCase(imageId:string){
    this.spinner.show(SpinnerType.Ball8bits);
    this.productService.changeShowcaseImage(imageId, this.data as string, () => {
      this.spinner.hide(SpinnerType.Ball8bits);
    })
  }
}

export enum SelectProductImageState{
  Close
}
