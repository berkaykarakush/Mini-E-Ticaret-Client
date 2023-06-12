import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderService } from 'app/services/common/models/order.service';
import { Single_Order } from 'app/contracts/order/single_order';
import { DialogService } from 'app/services/common/dialog.service';
import { CompleteOrderDialogComponent, CompleteOrderDialogState } from '../complete-order-dialog/complete-order-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'app/base/base.component';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-order-detail-dialog',
  templateUrl: './order-detail-dialog.component.html',
  styleUrls: ['./order-detail-dialog.component.scss']
})
export class OrderDetailDialogComponent extends BaseDialog<OrderDetailDialogComponent> implements OnInit{
  constructor(
    dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDetailDialogState | string,
    private orderService: OrderService,
    private dialogService: DialogService,
    private spinner: NgxSpinnerService,
    private toastrService: CustomToastrService){
      super(dialogRef)
    }
    displayedColumns: string[] = ['name', 'price', 'quantity', 'totalPrice'];
    dataSource = [];
    clickedRows = new Set<any>();
    singleOrder: Single_Order;
    totalPrice: number;

    async ngOnInit(): Promise<void> {
    this.singleOrder = await this.orderService.getOrderById(this.data as string);
    this.dataSource = this.singleOrder.basketItems;
    this.totalPrice = this.singleOrder.basketItems.map((basketItem, index) => basketItem.price * basketItem.quantity).reduce((price, current) => price + current);
    }

    completeOrder(){
      this.dialogService.openDialog({
        componentType: CompleteOrderDialogComponent,
        data: CompleteOrderDialogState.Yes,
        afterClosed: async () => {
          this.spinner.show(SpinnerType.Ball8bits);
          await this.orderService.completeOrder(this.data as string);
          this.spinner.hide(SpinnerType.Ball8bits);
          this.toastrService.message("Siparis tamamlandi. Musteriye bilgi verilmistir.", "Siparis tamamlandi!",{
            messageType: ToastrMessageType.Success,
            position: ToastrPosition.TopRight
          });
        }
      });
    }
}
export enum OrderDetailDialogState{
  Close, OrderComplete
}
