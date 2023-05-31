import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent, SpinnerType } from 'app/base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'app/services/common/auth.service';
import { UserService } from 'app/services/common/models/user.service';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser} from '@abacritt/angularx-social-login';
import { UserAuthService } from 'app/services/common/models/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit{
  constructor(
    spinner: NgxSpinnerService,
    private userAuthService: UserAuthService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private socialAuthService: SocialAuthService) {
    super(spinner);
    socialAuthService.authState.subscribe(async (user: SocialUser) => {
      console.log(user)
      this.showSpinner(SpinnerType.Ball8bits);
      switch(user.provider){
        case "GOOGLE":
          await userAuthService.googleLogin(user, () => {
            this.authService.identityCheck();
            this.hideSpinner(SpinnerType.Ball8bits);
          });
          break;
        case "FACEBOOK":
          await userAuthService.facebookLogin(user, () => {
            this.authService.identityCheck();
            this.hideSpinner(SpinnerType.Ball8bits);
          });
          break;
      }
    });
  }
  ngOnInit(): void {

  }
  async login(usernameOrEmail: string, password: string){
    this.showSpinner(SpinnerType.Ball8bits);
    await this.userAuthService.login(usernameOrEmail, password, () => {
      this.authService.identityCheck();
      this.activatedRoute.queryParams.subscribe(params =>{
        const returnUrl: string = params["returnUrl"];
        if(returnUrl)
          this.router.navigate([returnUrl]);
      })
      this.hideSpinner(SpinnerType.Ball8bits);
    });
  }

  facebookLogin(){
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}
