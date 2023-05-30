import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'app/base/base.component';
import { CreateProduct } from 'app/contracts/createProduct';
import { HttpClientService } from 'app/services/common/http-client.service';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends BaseComponent implements OnInit{

  constructor(spinner:NgxSpinnerService, private httpClientService: HttpClientService){
    super(spinner)
  }
  ngOnInit(): void {


  }
@ViewChild(ListComponent) ListComponents: ListComponent
  createdProduct(createdProduct: CreateProduct){
    this.ListComponents.getProducts();
  }

}
