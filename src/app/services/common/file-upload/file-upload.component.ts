import { Component, Input } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { HttpClientService } from '../http-client.service';
import { HttpHeaders } from '@angular/common/http';
import { AlertifyService, MessageType, Position } from '../../admin/alertify.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadDialogComponent, FileUploadDialogState } from 'app/dialogs/file-upload-dialog/file-upload-dialog.component';
import { BaseDialog } from 'app/dialogs/base/base-dialog';
import { DialogService } from '../dialog.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'app/base/base.component';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private toastrService: CustomToastrService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private spinner: NgxSpinnerService
    ){
    }
  public files: NgxFileDropEntry[];
  @Input() options: Partial<FileUploadOptions>;
  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
    const fileData: FormData = new FormData();
    for(const file of files){
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
        fileData.append(_file.name, _file, file.relativePath);
      });
    }
    this.dialogService.openDialog({
      componentType: FileUploadDialogComponent,
      data: FileUploadDialogState.Yes,
      afterClosed: () => {
        this.spinner.show(SpinnerType.Ball8bits);
        this.httpClientService.post({
          controller: this.options.controller,
          action: this.options.action,
          queryString: this.options.queryString,
          headers: new HttpHeaders({"responseType":"blob"})
        }, fileData).subscribe(data => {
            const message: string = "Dosyalar basariyla yuklenmistir.";

            this.spinner.hide(SpinnerType.Ball8bits);
            if(this.options.isAdminPage){
              this.alertifyService.message(message,{
                dismissOthers: true,
                messageType: MessageType.Success,
                position: Position.TopRight
              })
            }else{
            this.toastrService.message(message, "Basarili",{
              messageType: ToastrMessageType.Success,
              position: ToastrPosition.TopRight
            })
            }
          },(errorResponse) => {
            const message: string = "Dosyalar yuklenirken beklenmeyen bir hatayla karsilasilmistir.";

            this.spinner.hide(SpinnerType.Ball8bits);
            if(this.options.isAdminPage){
              this.alertifyService.message(message,{
                dismissOthers: true,
                messageType: MessageType.Error,
                position: Position.TopRight
              })
            }else{
            this.toastrService.message(message, "Basarisiz",{
              messageType: ToastrMessageType.Error,
              position: ToastrPosition.TopRight
            })
          }
        });
      }
    });
  }
}

export class FileUploadOptions{
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
  isAdminPage?: boolean = false;
}
