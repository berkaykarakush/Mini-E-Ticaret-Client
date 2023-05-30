import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from '@angular/cdk/dialog';
import { OrderModule } from './order/order.module';
import { CustomerModule } from './customer/customer.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProductsModule } from './products/products.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ProductsModule,
    OrderModule,
    CustomerModule,
    DashboardModule
  ]
})
export class ComponentsModule { }
