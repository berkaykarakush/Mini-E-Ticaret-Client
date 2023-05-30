import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BaseComponent } from 'app/base/base.component';
import { Create_User } from 'app/contracts/users/create_user';
import { UserService } from 'app/services/common/models/user.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'app/services/ui/custom-toastr.service';
import { User } from 'entities/user';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent implements OnInit{
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: CustomToastrService,
    spinner: NgxSpinnerService
    ) {
      super(spinner)
    }


  frm: FormGroup;
  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      nameSurname: ["",[
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3)]],
      username: ["",[
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3)]],
      email: ["",[
        Validators.required,
        Validators.maxLength(250),
        Validators.email]],
      password: ["",[
        Validators.required
      ]],
      passwordConfirm: ["",[
        Validators.required
      ]]
    },{
      validators: (group: AbstractControl): ValidationErrors | null =>
      {
        let password = group.get('password').value;
        let passwordConfirm = group.get('passwordConfirm').value;
        return password === passwordConfirm ? null : {notSame: true};
      }
    })
  }

  get component(){
    return this.frm.controls;
  }
  submitted: boolean;
  async onSubmit(user: User){
    this.submitted = true;

    if(this.frm.invalid)
      return;

    const result: Create_User = await this.userService.create(user);
    if(result.succeeded)
      this.toastrService.message(result.message, "Kullanici kaydi basarili",{
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      })
    else
      this.toastrService.message(result.message, "Hata",{
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      })
  }
}
