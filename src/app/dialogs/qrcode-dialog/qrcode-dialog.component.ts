import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QrCodeService } from 'app/services/common/qr-code.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SpinnerType } from 'app/base/base.component';

@Component({
  selector: 'app-qrcode-dialog',
  templateUrl: './qrcode-dialog.component.html',
  styleUrls: ['./qrcode-dialog.component.scss']
})
export class QrcodeDialogComponent extends BaseDialog<QrcodeDialogComponent> implements OnInit{
  constructor(
    dialogRef: MatDialogRef<QrcodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private spinner: NgxSpinnerService,
    private qrCodeService: QrCodeService,
    private domSanitizer: DomSanitizer){
      super(dialogRef)
    }

  qrCodeSafeUrl: SafeUrl;
  async ngOnInit(){
    this.spinner.show(SpinnerType.Ball8bits);
    const qrCodeBlob = await this.qrCodeService.generateQRCode(this.data);
    const url = URL.createObjectURL(qrCodeBlob);
    this.qrCodeSafeUrl = this.domSanitizer.bypassSecurityTrustUrl(url);
    this.spinner.hide(SpinnerType.Ball8bits);
  }
}
