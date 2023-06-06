import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Basket_Item } from 'app/contracts/basket/list_Basket_Item';
import { Create_Basket_Item } from 'app/contracts/basket/Create_Basket_Item';
import { Update_Basket_Item } from 'app/contracts/basket/Update_Basket_Item';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  constructor(private httpClientService: HttpClientService) { }

  async get():Promise<List_Basket_Item[]>{
    const observable : Observable<List_Basket_Item[]> = this.httpClientService.get({
      controller: "baskets"
    });
    return await firstValueFrom(observable);
  }

  async addItem(basketItem: Create_Basket_Item): Promise<void>{
  const observable: Observable<any> = this.httpClientService.post({
    controller: "baskets"
  }, basketItem);

  return await firstValueFrom(observable);
  }

  async updateQuantity(basketItem: Update_Basket_Item): Promise<void>{
    const observable: Observable<any> = this.httpClientService.put({
      controller: "baskets"
    }, basketItem);

    await firstValueFrom(observable);
  }

  async remove(basketItemId: string):Promise<void>{
    const observable: Observable<any> = this.httpClientService.delete({
      controller: "baskets"
    }, basketItemId);

    await firstValueFrom(observable);
  }
}
