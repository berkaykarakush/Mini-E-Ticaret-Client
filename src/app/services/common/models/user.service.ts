import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from 'entities/user';
import { Create_User } from 'app/contracts/users/create_user';
import { Observable, first, firstValueFrom } from 'rxjs';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { Token } from 'app/contracts/token/token';
import { TokenResponse } from 'app/contracts/token/tokenResponse';
import { Router } from '@angular/router';
import { SocialUser } from '@abacritt/angularx-social-login';
import { coerceStringArray } from '@angular/cdk/coercion';

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

  async updatePassword(userId: string, resetToken: string, password: string, passwordConfirm: string, successCallBack?: () => void, errorCallBack?: (error) => void){
    const observable: Observable<any> = this.httpClientService.post({
      controller: "users",
      action: "update-password"
    }, {
      userId: userId,
      resetToken: resetToken,
      password: password,
      PasswordConfirm: passwordConfirm
    });

    const promiseData: Promise<any> = firstValueFrom(observable);
    promiseData.then(value => successCallBack()).catch(error => errorCallBack(error))
    await promiseData;
  }
}
