import { HttpErrorResponse } from '@angular/common/http';
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'app/base/base.component';
import { DeleteDialogComponent } from 'app/dialogs/delete-dialog/delete-dialog.component';
import { AlertifyService, MessageType, Position } from 'app/services/admin/alertify.service';
import { DialogService } from 'app/services/common/dialog.service';
import { HttpClientService } from 'app/services/common/http-client.service';
import { ProductService } from 'app/services/common/models/product.service';
declare var $: any;

@Directive({
  selector: '[appDelete]'
})
export class DeleteDirective{

  constructor(
    private element: ElementRef,
    private _renderer: Renderer2,
    private httpClientService: HttpClientService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private alertifyService: AlertifyService,
    private dialogService: DialogService
    ) {
      const img = _renderer.createElement("img");
      img.setAttribute("src", "../../../assets/delete.png");
      img.setAttribute("style","cursor: pointer;");
      img.width = 25;
      img.height = 25;
      _renderer.appendChild(element.nativeElement, img);
    }

    @Input() id: string;
    @Input() controller: string;
    @Output() callback: EventEmitter<any> = new EventEmitter();
    @HostListener("click")
    async onclick(){
      this.dialogService.openDialog({
        componentType: DeleteDialogComponent,
        data: DeleteState.Yes,
        afterClosed: async () => {
          this.spinner.show(SpinnerType.Ball8bits);
          const td: HTMLTableCellElement = this.element.nativeElement;
          // await this.productService.delete(this.id);
          await this.httpClientService.delete({
            controller: this.controller
          },this.id).subscribe(data =>
          {
            $(td.parentElement).animate({
              opacity: 0,
              left: "+=50",
              height: "toogle"
            },700, () => {
              this.callback.emit();
              this.alertifyService.message(`${this.controller == 'roles' ? 'Rol' : 'Ürün'} başarıyla silinmiştir.`,{
                dismissOthers: true,
                messageType: MessageType.Success,
                position: Position.TopRight
              })
            });
          }, (errorRespone: HttpErrorResponse) => {
            this.spinner.hide(SpinnerType.Ball8bits);
            this.alertifyService.message("Urun silinirken bir hatayla karsilasilmistir",{
              dismissOthers: true,
              messageType: MessageType.Error,
              position: Position.TopRight
            })
          });
        }
      })
    }
}

export enum DeleteState{
  Yes, No
}
