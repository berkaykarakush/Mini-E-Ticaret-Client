import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { Menu } from 'app/contracts/application-configuration/menu';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private httpClientService: HttpClientService) { }

  async getAuthorizeDefinitionEndpoints(){
    const observable: Observable<Menu[]> = this.httpClientService.get<Menu[]>({
      controller: "applicationservices"
    });
    return await firstValueFrom(observable);
  }
}
