import { Injectable } from '@angular/core';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../ui/custom-toastr.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { UserAuthService } from './models/user-auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'app/base/base.component';
import { state } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {

  constructor(private toastrService: CustomToastrService, private userAuthService: UserAuthService, private router: Router, private spinner: NgxSpinnerService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(error => {
      switch(error.status){
        case HttpStatusCode.Unauthorized:
          this.userAuthService.refreshTokenLogin(localStorage.getItem("refreshToken"), (state) => {
            if (!state) {
              const url = this.router.url;
              if(url == "/products"){
                this.toastrService.message("Sepete urun ekleyebilmek icin oturum acmaniz gerekiyor","Lutfen giris yapiniz",{
                  messageType: ToastrMessageType.Warning,
                  position: ToastrPosition.TopRight
                });
              }else
                this.toastrService.message("Bu islem icin gecerli yetkiniz bulunmamaktadir.","Yetkisiz Erisim!",{
                  messageType: ToastrMessageType.Warning,
                  position: ToastrPosition.TopFullWidth
            });
            }
          }).then(data => {
            this.toastrService.message("Bu islem icin gecerli yetkiniz bulunmamaktadir.","Yetkisiz Erisim!",{
              messageType: ToastrMessageType.Warning,
              position: ToastrPosition.TopFullWidth
              });
          });
          break;
        case HttpStatusCode.InternalServerError:
          this.toastrService.message("Sunucuya erisilemiyor.","Sunucu Hatasi!",{
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopFullWidth
          });
          break;
        case HttpStatusCode.BadRequest:
          this.toastrService.message("Gecersiz istek yapildi.","Gecersiz Istek!",{
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopFullWidth
          });
          break;
        case HttpStatusCode.NotFound:
          this.toastrService.message("Sayfa bulunamadi","Sayfa bulunamadi!",{
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopFullWidth
          });
          break;
        default:
          this.toastrService.message("Bilinmeyen bir hata ile karsilasildi.","Hata!",{
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopFullWidth
          });
          break;
      }
      this.spinner.hide(SpinnerType.Ball8bits);
      return of(error);
    }));
  }
}
