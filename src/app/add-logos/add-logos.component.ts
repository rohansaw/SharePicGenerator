import { Component, Input} from '@angular/core';
import { FabricjsEditorComponent } from 'projects/angular-editor-fabric-js/src/public-api';

@Component({
  selector: 'app-add-logos',
  templateUrl: './add-logos.component.html',
  styleUrls: ['./add-logos.component.scss']
})
export class AddLogosComponent {

  @Input() canvas: FabricjsEditorComponent;

  public addImageOnCanvas(event){
    this.canvas.addImageOnCanvas(event);
  }

}
