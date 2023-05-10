import { Component, OnInit } from '@angular/core';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Product } from 'src/app/contracts/product';
import { HttpClientService } from 'src/app/services/common/http-client.service';

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
    this.showSpinner(SpinnerType.Ball8bits);

    this.httpClientService.get<Product[]>({
      controller:"products"
    }).subscribe(data => console.log(data[1].name));

    // this.httpClientService.post({
    //   controller:"products"
    // },{
    //   name:"Tahta",
    //   stock: 100,
    //   price: 15
    // }).subscribe();

    // this.httpClientService.put({
    //   controller: "products"
    // },{
    //   id: "59bc7d8a-cb90-4beb-b9dd-0cb7f5f9b63f",
    //   name: "Renkli Kagit",
    //   stock: 1500,
    //   price: 5.5
    // }).subscribe();

    // this.httpClientService.delete({
    //   controller: "products"
    // },"ea295724-0c3f-453b-bb20-0c4d95188614")
    // .subscribe();

    // this.httpClientService.get({
    //   fullEndPoint:"https://jsonplaceholder.typicode.com/posts"
    // }).subscribe(data => console.log(data));
  }
}
