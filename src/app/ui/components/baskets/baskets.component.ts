import { Component, OnInit } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'app/base/base.component';
import { BasketService } from 'app/services/common/models/basket.service';
import { List_Basket_Item } from 'app/contracts/basket/list_Basket_Item';
import { Update_Basket_Item } from 'app/contracts/basket/Update_Basket_Item';
import { OrderService } from 'app/services/common/models/order.service';
import { Create_Order } from 'app/contracts/order/create_order';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'app/services/ui/custom-toastr.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-baskets',
  templateUrl: './baskets.component.html',
  styleUrls: ['./baskets.component.scss']
})
export class BasketsComponent extends BaseComponent implements OnInit{
  constructor(spinner:NgxSpinnerService, private basketService:BasketService, private orderService: OrderService, private toastrService: CustomToastrService, private router: Router){
    super(spinner)
  }
  basketItems: List_Basket_Item[];
  async ngOnInit(): Promise<void> {
    this.showSpinner(SpinnerType.Ball8bits);
    this.basketItems = await this.basketService.get();
    this.hideSpinner(SpinnerType.Ball8bits);
  }
  async changeQuantity(object: any){
    this.showSpinner(SpinnerType.Ball8bits);
    const basketItemId: string = object.target.attributes["id"].value;
    const quantity: number = object.target.value;
    const basketItem: Update_Basket_Item = new Update_Basket_Item();
    basketItem.basketItemId = basketItemId;
    basketItem.quantity = quantity;
    debugger;
    await this.basketService.updateQuantity(basketItem);
    this.hideSpinner(SpinnerType.Ball8bits);
  }

  async removeBasketItem(basketItemId: string){
    this.showSpinner(SpinnerType.Ball8bits);
    await this.basketService.remove(basketItemId);
    $("."+basketItemId).fadeOut(100, () => this.hideSpinner(SpinnerType.Ball8bits));
  }

  async shoppingComplete(){
    this.showSpinner(SpinnerType.Ball8bits);
    const order: Create_Order = new Create_Order();
    order.address = "Ankara";
    order.description = "Bla bla bla";
   await this.orderService.create(order);
   this.hideSpinner(SpinnerType.Ball8bits);
   this.toastrService.message("Siparis olusturuldu", "Siparis tamamlandi",{
    messageType: ToastrMessageType.Success,
    position: ToastrPosition.TopRight
   });
   this.router.navigate(["/"]);
  }
}
