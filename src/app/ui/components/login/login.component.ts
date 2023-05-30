import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent, SpinnerType } from 'app/base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'app/services/common/auth.service';
import { UserService } from 'app/services/common/models/user.service';
import { SocialAuthService, SocialUser} from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent{
  constructor(
    spinner: NgxSpinnerService,
    private userService: UserService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private socialAuthService: SocialAuthService) {
    super(spinner);
    this.socialAuthService.authState.subscribe(async (user: SocialUser) => {
      console.log(user);
      this.showSpinner(SpinnerType.Ball8bits);
      await userService.googleLogin(user, () => {
        this.authService.identityCheck();
        this.hideSpinner(SpinnerType.Ball8bits)
      })
    });
  }
  async login(usernameOrEmail: string, password: string){
    this.showSpinner(SpinnerType.Ball8bits);
    await this.userService.login(usernameOrEmail, password, () => {
      this.authService.identityCheck();
      this.activatedRoute.queryParams.subscribe(params =>{
        const returnUrl: string = params["returnUrl"];
        if(returnUrl)
          this.router.navigate([returnUrl]);
      })
      this.hideSpinner(SpinnerType.Ball8bits);
    });
  }
}
