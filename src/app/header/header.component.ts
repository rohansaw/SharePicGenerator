import { Component, Input} from '@angular/core';
import { FabricjsEditorComponent } from 'projects/angular-editor-fabric-js/src/public-api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{

  @Input() canvas: FabricjsEditorComponent;

  public rasterize() {
    this.canvas.rasterize();
  }

  public confirmClear() {
    this.canvas.confirmClear();
  }

}
