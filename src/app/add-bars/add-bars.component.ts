import { Component, Input} from '@angular/core';
import { FabricjsEditorComponent } from 'projects/angular-editor-fabric-js/src/public-api';

@Component({
  selector: 'app-add-bars',
  templateUrl: './add-bars.component.html',
  styleUrls: ['./add-bars.component.scss']
})
export class AddBarsComponent {

  @Input() canvas: FabricjsEditorComponent;

  public setBottomBar() {
    this.canvas.setBottomBar();
  }

  public setTopBar() {
    this.canvas.setTopBar();
  }
}
