import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BaseComponent, SpinnerType } from 'app/base/base.component';
import { List_Order } from 'app/contracts/order/list_order';
import { AlertifyService, MessageType, Position } from 'app/services/admin/alertify.service';
import { DialogService } from 'app/services/common/dialog.service';
import { OrderService } from 'app/services/common/models/order.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {
  constructor(
    spinner: NgxSpinnerService,
    private orderService: OrderService,
     private alertifyService: AlertifyService,
     private dialogService: DialogService){
    super(spinner)
  }
  displayedColumns: string[] = ['orderCode', 'userName', 'totalPrice', 'createddate','delete'];
  dataSource: MatTableDataSource<List_Order> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  async getOrders(){
    this.showSpinner(SpinnerType.Ball8bits);
    const allOrders: { totalOrderCount: number; orders: List_Order[] } = await this.orderService.getAllOrders(this.paginator ? this.paginator.pageIndex : 0, this.paginator ? this.paginator.pageSize : 5, () => this.hideSpinner(SpinnerType.Ball8bits), (errorMessage: any) => {
      this.alertifyService.message(errorMessage.message, {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      });
    })
    this.dataSource = new MatTableDataSource<List_Order>(allOrders.orders);
    this.paginator.length = allOrders.totalOrderCount;
  }
  async pageChanged(){
    await this.getOrders();
  }

  async ngOnInit(){
    await this.getOrders();
  }
}
