import { Component, Input} from '@angular/core';
import { FabricjsEditorComponent } from 'projects/angular-editor-fabric-js/src/public-api';

@Component({
  selector: 'app-add-text',
  templateUrl: './add-text.component.html',
  styleUrls: ['./add-text.component.scss']
})
export class AddTextComponent {

  @Input() canvas: FabricjsEditorComponent;

  public addText() {
    this.canvas.addText();
  }

  public addTextTitle() {
    this.canvas.addTextTitle();
  }

  public addTextSubtitle() {
    this.canvas.addTextSubtitle();
  }

}
