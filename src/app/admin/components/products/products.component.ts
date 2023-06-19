import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent} from 'app/base/base.component';
import { CreateProduct } from 'app/contracts/createProduct';
import { HttpClientService } from 'app/services/common/http-client.service';
import { ListComponent } from './list/list.component';
import { DialogService } from 'app/services/common/dialog.service';
import { QrcodeReadingDialogComponent } from 'app/dialogs/qrcode-reading-dialog/qrcode-reading-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends BaseComponent implements OnInit{

  constructor(spinner:NgxSpinnerService, private httpClientService: HttpClientService, private dialogService: DialogService){
    super(spinner)
  }
  ngOnInit(): void {
  }
  @ViewChild(ListComponent) ListComponents: ListComponent
  createdProduct(createdProduct: CreateProduct){
    this.ListComponents.getProducts();
  }
  showProductQrCodeReading(){
    this.dialogService.openDialog({
     componentType: QrcodeReadingDialogComponent,
      data:  null,
      options: {
        width: "750px"
      },
      afterClosed: () => {}
    });
  }
}
