import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { CreateProduct } from 'app/contracts/createProduct';
import { HttpErrorResponse } from '@angular/common/http';
import { ArrayType, identifierName } from '@angular/compiler';
import { List_Product } from 'app/contracts/list_product';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Product_Image } from 'app/contracts/list_product_image';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClientService:HttpClientService) { }

  create(product: CreateProduct, successCallBack?: any, errorCallBack?: (errorMessage: string) => void){
    this.httpClientService.post({
      controller: "products"
    },product).subscribe(result=>{
      successCallBack();
    },(errorResponse: HttpErrorResponse) => {
      const _error: Array<{key: string, value: Array<string>}> = errorResponse.error;
      let message = "";
      _error.forEach((v, index) => {
        v.value.forEach((_v, _index) => {
          message += `${_v}<br>`;
        })
      })
      errorCallBack(message);
    });
  }
  async read(page: number = 0,size: number = 5, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{totalCount: number; products:List_Product[]}>{
    const promiseData:Promise<{totalCount: number; products:List_Product[]}>= this.httpClientService.get<{totalCount: number; products:List_Product[]}>({
      controller: "products",
      queryString: `page=${page}&size=${size}`
    }).toPromise();

    promiseData.then(d => successCallBack())
      .catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message))

      return await promiseData;
  }

  async delete(id:string){
    const deleteObservable: Observable<any> = this.httpClientService.delete<any>({
      controller: "products"
    }, id);

    await firstValueFrom(deleteObservable);
  }

  async readImages(id: string, successCallBack?: () => void): Promise<List_Product_Image[]> {
    const getObservable: Observable<List_Product_Image[]> = this.httpClientService.get<List_Product_Image[]>({
      action: "getproductimages",
      controller: "products"
    }, id);

    const images: List_Product_Image[] = await firstValueFrom(getObservable);
    successCallBack();
    return images;
  }

  async deleteImage(id: string, imageId: string, successCallBack?: () => void){
    const deleteObservable = this.httpClientService.delete({
      controller: "products",
      action: "deleteproductimage",
      queryString: `imageId=${imageId}`
    }, id)
    await firstValueFrom(deleteObservable);
    successCallBack();
  }
  async changeShowcaseImage(imageId: string, productId: string, successCallBack?: () => void): Promise<void>{
    const changeShowcaseImageObservable =  this.httpClientService.get({
      controller:"products",
      action: "changeshowcaseimage",
      queryString: `imageId=${imageId}&productId=${productId}`
    });
    await firstValueFrom(changeShowcaseImageObservable);
    successCallBack();
  }

  async updateStockQrCodeToProduct(productId: string, stock: number, successCallBack?: () => void){
    const observable = this.httpClientService.put({
      action: "qrcode",
      controller: "products"
    }, {
      productId, stock
    });

    await firstValueFrom(observable);
    successCallBack();
  }
}
