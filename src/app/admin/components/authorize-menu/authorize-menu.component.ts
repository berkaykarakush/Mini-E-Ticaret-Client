import { Component, OnInit } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { BaseComponent } from 'app/base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApplicationService } from 'app/services/common/models/application.service';
import { Menu } from 'app/contracts/application-configuration/menu';
import { DialogService } from 'app/services/common/dialog.service';
import { AuthorizeMenuDialogComponent } from 'app/dialogs/authorize-menu-dialog/authorize-menu-dialog.component';

interface ITreeMenu{
    name?: string,
    actions?: ITreeMenu[],
    code?: string,
    menuName?: string
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
@Component({
  selector: 'app-authorize-menu',
  templateUrl: './authorize-menu.component.html',
  styleUrls: ['./authorize-menu.component.scss']
})
export class AuthorizeMenuComponent extends BaseComponent implements OnInit{
  constructor(spinner: NgxSpinnerService, private applicationService: ApplicationService, private dialogService:DialogService) {
    super(spinner)
  }
  async ngOnInit(){
    this.dataSource.data = await(await this.applicationService.getAuthorizeDefinitionEndpoints())
      .map(m => {
        const treeMenu: ITreeMenu = {
          name: m.name,
          actions: m.actions.map(a => {
            const _treeMenu: ITreeMenu = {
              name: a.definition,
              code: a.code,
              menuName: m.name
            }
            return _treeMenu;
          })
        }
        return treeMenu;
      });
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    (menu: ITreeMenu, level: number) => {
      return {
        expandable: menu.actions?.length > 0,
        name: menu.name,
        level: level,
        code: menu.code,
        menuName: menu.menuName
      };
    },
    menu => menu.level,
    menu => menu.expandable,
    menu => menu.actions
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  assignRole(code:string, name: string, menuName: string){
    this.dialogService.openDialog({
      componentType: AuthorizeMenuDialogComponent,
      data: {code, name, menuName},
      options: {
        width: "500px"
      },
      afterClosed: () => {

      }
    });
  }
}
