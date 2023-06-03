import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseUrl } from 'app/contracts/base_url';
import { List_Product } from 'app/contracts/list_product';
import { FileService } from 'app/services/common/models/file.service';
import { ProductService } from 'app/services/common/models/product.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute, private fileService: FileService){}
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

}