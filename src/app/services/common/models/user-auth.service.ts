import { Injectable } from '@angular/core';
import { TokenResponse } from 'app/contracts/token/tokenResponse';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpClientService } from '../http-client.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'app/services/ui/custom-toastr.service';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  constructor(private httpClientService:HttpClientService,
    private toastrService: CustomToastrService) { }

  async login(usernameOrEmail: string, password: string, callBackFunction?: () => void): Promise<any>{
    const observable: Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse>({
      controller: "auth",
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

  async googleLogin(user: SocialUser, callBackFunction: () => void): Promise<any>{
    const observable: Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      action: "google-login",
      controller: "auth"
    }, user);
   const tokenResponse: TokenResponse =  await firstValueFrom(observable) as TokenResponse;

   if(tokenResponse){
    localStorage.setItem("accessToken", tokenResponse.token.accessToken);
    this.toastrService.message("Google uzerinden giris yapilmistir","Giris Basarili!",{
      messageType: ToastrMessageType.Success,
      position: ToastrPosition.TopRight
    });
   }
   callBackFunction();
  }

  async facebookLogin(user: SocialUser, callBackFunction: () => void): Promise<any>{
    const observable: Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      controller: "auth",
      action: "facebook-login"
    }, user);
   const tokenResponse: TokenResponse =  await firstValueFrom(observable) as TokenResponse;

   if(tokenResponse){
    localStorage.setItem("accessToken", tokenResponse.token.accessToken);
    this.toastrService.message("Facebook uzerinden giris yapilmistir","Giris Basarili!",{
      messageType: ToastrMessageType.Success,
      position: ToastrPosition.TopRight
    });
   }
   callBackFunction();
  }
}
