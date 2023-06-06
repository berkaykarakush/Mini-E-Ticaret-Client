import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent, SpinnerType } from 'app/base/base.component';
import { BaseUrl } from 'app/contracts/base_url';
import { Create_Basket_Item } from 'app/contracts/basket/Create_Basket_Item';
import { List_Product } from 'app/contracts/list_product';
import { BasketService } from 'app/services/common/models/basket.service';
import { FileService } from 'app/services/common/models/file.service';
import { ProductService } from 'app/services/common/models/product.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'app/services/ui/custom-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {
  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute, private fileService: FileService, spinner: NgxSpinnerService, private basketService: BasketService, private customToastrService: CustomToastrService){
    super(spinner)
  }
  currentPageNo: number;
  totalCount: number;
  totalPageCount: number;
  pageSize: number = 12;
  pageList: number[] = [];
  products: List_Product[];
  baseUrl: BaseUrl;
  async ngOnInit(){
    this.baseUrl = await this.fileService.getBaseStorageUrl();
    this.activatedRoute.params.subscribe(async params => {
      this.currentPageNo = parseInt(params["pageNo"] ?? 1);
      const data: {totalCount: number, products: List_Product[]} = await this.productService.read(this.currentPageNo - 1, this.pageSize,
        () => {

       }, errorMessage => {

       });
      this.products = data.products;
      this.products = this.products.map<List_Product>(p => {
        const listProduct: List_Product ={
            id: p.id,
            createdDate: p.createdDate,
            imagePath: p.productImageFiles.length ? p.productImageFiles.find(p => p.showcase).path : "",
            name: p.name,
            price: p.price,
            stock: p.stock,
            updatedDate: p.updatedDate,
            productImageFiles: p.productImageFiles
        };
        return listProduct;
      });
      this.totalCount = data.totalCount;
      this.totalPageCount = Math.ceil(this.totalCount / this.pageSize);
      this.pageList = [];

      if (this.currentPageNo - 3 <= 0)
      for (let i = 1; i <= 7; i++)
        this.pageList.push(i);

    else if (this.currentPageNo + 3 >= this.totalPageCount)
      for (let i = this.totalPageCount - 6; i <= this.totalPageCount; i++)
        this.pageList.push(i);

    else
      for (let i = this.currentPageNo - 3; i <= this.currentPageNo + 3; i++)
        this.pageList.push(i);
    });
  }
  async addToBasket(product: List_Product){
    this.showSpinner(SpinnerType.Ball8bits);
    let _basketItem: Create_Basket_Item = new Create_Basket_Item();
    _basketItem.productId = product.id;
    _basketItem.quantity = 1;
    await this.basketService.addItem(_basketItem);
    this.hideSpinner(SpinnerType.Ball8bits);
    this.customToastrService.message("Urun sepete eklenmistir","Sepete Eklendi",{
      messageType: ToastrMessageType.Success,
      position: ToastrPosition.TopRight
    });
  }
}
