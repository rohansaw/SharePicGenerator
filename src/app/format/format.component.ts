import { Component, Input} from '@angular/core';
import { FabricjsEditorComponent } from 'projects/angular-editor-fabric-js/src/public-api';

@Component({
  selector: 'app-format',
  templateUrl: './format.component.html',
  styleUrls: ['./format.component.scss']
})
export class FormatComponent {

  @Input() canvas: FabricjsEditorComponent;

  public changeSize() {
    this.canvas.changeSize();
  }

  public readBGUrl(event) {
    this.canvas.readBGUrl(event);
  }

  public scaleBGImage() {
    this.canvas.scaleBGImage();
  }

  public deleteBG() {
    this.canvas.deleteBG();
  }

}
