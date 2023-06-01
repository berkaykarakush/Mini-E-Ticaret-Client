import { Injectable } from '@angular/core';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../ui/custom-toastr.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { UserAuthService } from './models/user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {

  constructor(private toastrService: CustomToastrService, private userAuthService: UserAuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(error => {
      switch(error.status){
        case HttpStatusCode.Unauthorized:
          this.toastrService.message("Bu islem icin gecerli yetkiniz bulunmamaktadir.","Yetkisiz Erisim!",{
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopFullWidth
          });
          this.userAuthService.refreshTokenLogin(localStorage.getItem("refreshToken")).then(data => {
          });
          break;
        case HttpStatusCode.InternalServerError:
          this.toastrService.message("Sunucuya erisilemiyor.","Sunucu Hatasi!",{
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopFullWidth
          });
          break;
        case HttpStatusCode.BadRequest:
          this.toastrService.message("BGecersiz istek yapildi.","Gecersiz Istek!",{
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
      return of(error);
    }));
  }
}
