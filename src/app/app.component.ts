import { Component, ViewChild } from '@angular/core';
import { FabricjsEditorComponent } from 'projects/angular-editor-fabric-js/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-editor-fabric-js';

  @ViewChild('canvas', {static: false}) canvas: FabricjsEditorComponent;

  public setCanvasImage() {
    this.canvas.setCanvasImage();
  }

  public setSelectedText() {
    this.canvas.setSelectedText();
  }
}
