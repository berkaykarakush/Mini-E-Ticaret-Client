import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource, _MatTableDataSource} from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'app/base/base.component';
import { List_Product } from 'app/contracts/list_product';
import { SelectProductImageDialogComponent } from 'app/dialogs/select-product-image-dialog/select-product-image-dialog.component';
import { AlertifyService, MessageType, Position } from 'app/services/admin/alertify.service';
import { DialogService } from 'app/services/common/dialog.service';
import { ProductService } from 'app/services/common/models/product.service';
declare var $: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {
  constructor(
    spinner: NgxSpinnerService,
    private productService: ProductService,
     private alertifty: AlertifyService,
     private dialogService: DialogService){
    super(spinner)
  }

  displayedColumns: string[] = ['name', 'stock', 'price', 'createddate','updateddate', 'photos','edit','delete'];
  dataSource: MatTableDataSource<List_Product> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  async getProducts(){
    this.showSpinner(SpinnerType.Ball8bits);
    const allProducts: {totalCount: number; products:List_Product[]} = await this.productService.read(this.paginator ? this.paginator.pageIndex: 0, this.paginator ? this.paginator.pageSize: 5, () => this.hideSpinner(SpinnerType.Ball8bits),errorMessage =>
    this.alertifty.message(errorMessage, {
      dismissOthers: true,
      messageType: MessageType.Error,
      position: Position.TopRight
    }))
    this.dataSource = new MatTableDataSource<List_Product>(allProducts.products);
    this.paginator.length = allProducts.totalCount;
  }
  addProductImages(id: string){
    this.dialogService.openDialog({
      componentType: SelectProductImageDialogComponent,
      data: id,
      options: {
        width: "1200px"
      }
    })
  }
  async pageChanged(){
    await this.getProducts();
  }

  async ngOnInit(){
    await this.getProducts();
  }
}

