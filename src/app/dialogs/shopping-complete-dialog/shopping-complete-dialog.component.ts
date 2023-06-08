import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseDialog } from '../base/base-dialog';
declare var $: any;
@Component({
  selector: 'app-shopping-complete-dialog',
  templateUrl: './shopping-complete-dialog.component.html',
  styleUrls: ['./shopping-complete-dialog.component.scss']
})
export class ShoppingCompleteDialogComponent extends BaseDialog<ShoppingCompleteDialogComponent> implements OnDestroy{
  constructor(dialogRef: MatDialogRef<ShoppingCompleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShoppingCompleteDialogState){
    super(dialogRef)
  }

  show: boolean = false;
  complete() {
    this.show = true;
  }
  ngOnDestroy(): void {
    if (!this.show)
      $("#basketModal").modal("show");
  }
}
export enum ShoppingCompleteDialogState{
  Yes,NO
}
