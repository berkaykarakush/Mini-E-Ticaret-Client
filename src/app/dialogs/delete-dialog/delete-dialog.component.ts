import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeleteState } from 'app/directives/admin/delete.directive';
import { BaseDialog } from '../base/base-dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent extends BaseDialog<DeleteDialogComponent> {
  constructor(
    dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteState,
  ) {
    super(dialogRef);
  }
}


