import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from 'app/base/base.component';
import { HttpClientService } from 'app/services/common/http-client.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListComponent } from '../role/list/list.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild(ListComponent) listComponents: ListComponent;

  createdRole(createdRole: string) {
    this.listComponents.getRoles();
  }
}
