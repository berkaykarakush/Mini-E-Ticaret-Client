import { Injectable } from '@angular/core';
import { TokenResponse } from 'app/contracts/token/tokenResponse';
import { Observable, first, firstValueFrom } from 'rxjs';
import { HttpClientService } from '../http-client.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'app/services/ui/custom-toastr.service';
import { SocialUser } from '@abacritt/angularx-social-login';
import { Token } from '@angular/compiler';

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
    localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
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
    localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
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
    localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
    localStorage.setItem("accessToken", tokenResponse.token.accessToken);
    this.toastrService.message("Facebook uzerinden giris yapilmistir","Giris Basarili!",{
      messageType: ToastrMessageType.Success,
      position: ToastrPosition.TopRight
    });
   }
   callBackFunction();
  }
  async refreshTokenLogin(refreshToken: string, callBackFunction?: (state) => void): Promise<any>{
    const observable: Observable<any | TokenResponse> = this.httpClientService.post({
      action: "refreshtokenlogin",
      controller: "auth"
    },{refreshToken: refreshToken});

    try {
      const tokenResponse: TokenResponse = await firstValueFrom(observable) as TokenResponse;

      if(tokenResponse){
        localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
        localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      }
      callBackFunction(tokenResponse ? true : false);
    }
    catch{
      callBackFunction(false);
    }
  }

  async passwordReset(email: string, callBackFunction?: () => void){
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "password-reset"
    }, {email: email});

    await firstValueFrom(observable);
    callBackFunction();
  }

  async verifyResetToken(resetToken: string, userId: string, callBackFunction?: () => void): Promise<boolean>{
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "verify-reset-token"
    },{
      resetToken: resetToken,
      userId: userId
    });

   const state: boolean = await firstValueFrom(observable);
    callBackFunction();
    return state;
  }
}
