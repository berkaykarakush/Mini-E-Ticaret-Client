import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private jwtHelperService: JwtHelperService) { }
  identityCheck(){
    const token: string = localStorage.getItem("accessToken");
    // const decodeToken = this.jwtHelperService.decodeToken(token);
    // const expirationDate: Date = this.jwtHelperService.getTokenExpirationDate(token);
    let expired: boolean;
    try {
      expired  = this.jwtHelperService.isTokenExpired(token);
    } catch{
      expired = true;
    }
    _isAuthenticated = token != null && !expired;
  }
  get isAuthenticated():boolean{
    return _isAuthenticated;
  }
}

export let _isAuthenticated: boolean;
