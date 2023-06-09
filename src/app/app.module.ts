import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { UiModule } from './ui/ui.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef,MatDialogModule, MatDialog  } from '@angular/material/dialog';
import { JwtModule } from '@auth0/angular-jwt';
import { FacebookLoginProvider, GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { LoginComponent } from './ui/components/login/login.component';
import { HttpErrorHandlerInterceptorService } from './services/common/http-error-handler-interceptor.service';
import { UserService } from './services/common/models/user.service';
import { multicast } from 'rxjs';
import { DynamicLoadComponentDirective } from './directives/common/dynamic-load-component.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DynamicLoadComponentDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AdminModule, UiModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    HttpClientModule,
    JwtModule.forRoot({
      config:{
        tokenGetter: () => localStorage.getItem("accessToken"),
        allowedDomains: ["eticaretapiapi20230619143509.azurewebsites.net"]
      }
    }),
    SocialLoginModule,
    GoogleSigninButtonModule,
  ],
  providers: [
    {provide: MatDialogRef, useValue: {}},
    {provide:MAT_DIALOG_DATA, useValue:{}},
    {provide: "baseUrl", useValue:"https://eticaretapiapi20230619143509.azurewebsites.net/api", multi:true},
    {provide: "baseSignalRUrl", useValue:"https://eticaretapiapi20230619143509.azurewebsites.net/", multi:true},
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider("654451652149-3e9ihhg7cnl4ps1nb3g23id6nbbss2ts.apps.googleusercontent.com")
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider("615261950535480")
          }
        ],
        onError: err => console.log(err)
      } as SocialAuthServiceConfig
    },
    {provide: HTTP_INTERCEPTORS, useClass: HttpErrorHandlerInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
