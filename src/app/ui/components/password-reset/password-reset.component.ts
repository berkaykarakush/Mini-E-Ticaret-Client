import { Component } from '@angular/core';
import { BaseComponent, SpinnerType } from 'app/base/base.component';
import { AlertifyService, MessageType, Position } from 'app/services/admin/alertify.service';
import { UserAuthService } from 'app/services/common/models/user-auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent extends BaseComponent{
  constructor(
    spinner: NgxSpinnerService,
    private userAuthService: UserAuthService,
    private alertifyService: AlertifyService){
    super(spinner)
  }
  passwordReset(email: string){
    this.showSpinner(SpinnerType.Ball8bits);
    this.userAuthService.passwordReset(email, () =>{
      this.alertifyService.message("Mail basariyla gonderilmistir.",{
        messageType: MessageType.Success,
        position: Position.TopRight,
        dismissOthers: false
      });
      this.hideSpinner(SpinnerType.Ball8bits);
    });
  }
}
