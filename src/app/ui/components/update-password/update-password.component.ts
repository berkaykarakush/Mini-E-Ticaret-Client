import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { BaseComponent, SpinnerType } from 'app/base/base.component';
import { AlertifyService, MessageType, Position } from 'app/services/admin/alertify.service';
import { UserAuthService } from 'app/services/common/models/user-auth.service';
import { UserService } from 'app/services/common/models/user.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent extends BaseComponent implements OnInit{
  constructor(
    spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private userAuthService: UserAuthService,
    private alertifyService: AlertifyService,
    private userService: UserService,
    private router: Router){
    super(spinner)
  }
  state: any;
  ngOnInit(): void {
    this.showSpinner(SpinnerType.Ball8bits);
    this.activatedRoute.params.subscribe({
      next: async params => {
        const userId = params["userId"];
        const resetToken = params["resetToken"];
        this.state = await this.userAuthService.verifyResetToken(resetToken,userId, () => {
          this.state = true;
          this.hideSpinner(SpinnerType.Ball8bits);
        });
      }
    });
  }
  updatePassword(password: string, passwordConfirm: string){
     this.showSpinner(SpinnerType.Ball8bits);
     if(password != passwordConfirm){
      this.alertifyService.message("Sifreleri dogrulayiniz!",{
        messageType: MessageType.Error,
        position: Position.TopCenter
      });
      this.hideSpinner(SpinnerType.Ball8bits);
      return;
     }
     this.activatedRoute.params.subscribe({
      next: async params => {
        const userId: string = params["userId"];
        const resetToken: string = params["resetToken"];
        await this.userService.updatePassword(userId, resetToken, password, passwordConfirm,
          () => {
            this.alertifyService.message("Sifre basariyle degistirilmistir",{
              messageType: MessageType.Success,
              position: Position.TopCenter
            })
            this.router.navigate(["/login"]);
          },
          error => {
            console.log(error)
          });
          this.hideSpinner(SpinnerType.Ball8bits);
        }
      });
  }
}
