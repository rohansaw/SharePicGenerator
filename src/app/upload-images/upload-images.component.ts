import { Component, Input} from '@angular/core';
import { FabricjsEditorComponent } from 'projects/angular-editor-fabric-js/src/public-api';


@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.scss']
})
export class UploadImagesComponent {

  @Input() canvas: FabricjsEditorComponent;

  public addImageOnCanvasFromUrl(url) {
    this.canvas.addImageOnCanvasFromUrl(url);
  }

  public removeWhite(url) {
    this.canvas.removeWhite(url);
  }

  public readUrl(event) {
    this.canvas.readUrl(event);
  }

}
