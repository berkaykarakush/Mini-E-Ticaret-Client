import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'app/base/base.component';
import { AlertifyService, MessageType, Position } from 'app/services/admin/alertify.service';
import { SignalRService } from 'app/services/common/signalr.service';
import { ReceiveFunctions } from 'app/constants/receive-functions';
import { HubUrls } from 'app/constants/hub-urls';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit{
  constructor(private alertify:AlertifyService, spinner:NgxSpinnerService, private signalRService: SignalRService){
    super(spinner)
    signalRService.start(HubUrls.OrderHub)
    signalRService.start(HubUrls.ProductHub)
  }
  ngOnInit(): void {
    this.signalRService.on(ReceiveFunctions.ProductAddedMessageReceiveFunction, message => {
      this.alertify.message(message,{
        messageType: MessageType.Notfiy,
        position: Position.TopRight
      })
    });
    this.signalRService.on(ReceiveFunctions.OrderAddedMessageReceiveFunction, message => {
      this.alertify.message(message,{
        messageType: MessageType.Success,
        position: Position.TopCenter
      })
    });
  }

  m(){
    this.alertify.message("merhaba",{
      messageType:MessageType.Success,
      delay : 5,
      position : Position.TopRight
    });
  }

  d(){
    this.alertify.dismiss();
  }
}
