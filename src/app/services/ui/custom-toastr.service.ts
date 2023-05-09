import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { MessageType } from '../admin/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class CustomToastrService {
  constructor(private toastr:ToastrService) { }

  message(message: string, title:string,toastrOptions: Partial<ToastrOptions>){
    this.toastr[toastrOptions.messageType](message,title,{
      positionClass: toastrOptions.position
    });
  }
}
export class ToastrOptions{
  messageType:ToastrMessageType;
  position:ToastrPosition;
}

export enum ToastrMessageType{
  Success = "success",
  Warning = "warning",
  Info = "info",
  Error = "error"
}

export enum ToastrPosition{
  TopRight = "toast-top-right",
  BottomRight = "toast-bottom-right",
  TopLeft = "toast-top-left",
  BottomLeft = "toast-bottom-left",
  TopFullWidth = "toast-top-full-width",
  BottomFullWidth = "toast-bottom-full-width",
  TopCenter = "toast-top-center",
  BottomCenter = "toast-bottom-center"
}
