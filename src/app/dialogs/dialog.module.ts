import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { FileUploadComponent } from '../services/common/file-upload/file-upload.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FileUploadModule } from '../services/common/file-upload/file-upload.module';
import { MatButtonModule } from '@angular/material/button';
import { SelectProductImageDialogComponent } from './select-product-image-dialog/select-product-image-dialog.component';
import {MatCardModule} from '@angular/material/card';



@NgModule({
  declarations: [
    DeleteDialogComponent,
    SelectProductImageDialogComponent
  ],
  imports: [
    CommonModule,
    FileUploadModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class DialogModule { }
