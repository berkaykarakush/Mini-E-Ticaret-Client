import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from 'src/entities/user';
import { Create_User } from 'src/app/contracts/users/create_user';
import { Observable, first, firstValueFrom } from 'rxjs';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { Token } from 'src/app/contracts/token/token';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClientService:HttpClientService,
    private toastrService: CustomToastrService) { }

  async create(user: User): Promise<Create_User>{
    const observable: Observable<Create_User | User> = this.httpClientService.post<Create_User | User>({
      controller: "users"
    }, user);

    return await firstValueFrom(observable) as Create_User;
  }
  async login(usernameOrEmail: string, password: string, callBackFunction?: () => void): Promise<any>{
    const observable: Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse>({
      controller: "users",
      action: "login"
    }, {usernameOrEmail, password});

    const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;

    if(tokenResponse){
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      this.toastrService.message("Basariyla giris yapildi","Giris Basarili",{
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
    }

    callBackFunction();
  }
}
