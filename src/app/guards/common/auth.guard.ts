import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { SpinnerType } from 'app/base/base.component';
import { _isAuthenticated } from 'app/services/common/auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'app/services/ui/custom-toastr.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(private jwtHelperService: JwtHelperService, private router: Router, private toastrService:CustomToastrService, private spinner: NgxSpinnerService){
  }
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot){
    this.spinner.show(SpinnerType.Ball8bits);

    if(!_isAuthenticated){
      this.router.navigate(["login"], {queryParams: {returnUrl: state.url}});
      this.toastrService.message("Oturum acmaniz gerekiyor!","Yetkisiz Erisim!",{
        messageType: ToastrMessageType.Warning,
        position: ToastrPosition.TopRight
      })
    }
    this.spinner.hide(SpinnerType.Ball8bits);
    return true;
  }
}
