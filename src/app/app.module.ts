import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FabricjsEditorModule } from 'projects/angular-editor-fabric-js/src/public-api';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { HeaderComponent } from './header/header.component';
import { ModalComponent } from './modal/modal.component';
import { CustomEditorComponent } from './custom-editor/custom-editor.component';
import { OptionsComponent } from './options/options.component';
import { FormatComponent } from './format/format.component';
import { AddTextComponent } from './add-text/add-text.component';
import { AddBarsComponent } from './add-bars/add-bars.component';
import { AddLogosComponent } from './add-logos/add-logos.component';
import { UploadImagesComponent } from './upload-images/upload-images.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ModalComponent,
    CustomEditorComponent,
    OptionsComponent,
    FormatComponent,
    AddTextComponent,
    AddBarsComponent,
    AddLogosComponent,
    UploadImagesComponent
  ],
  imports: [
    BrowserModule,
    FabricjsEditorModule,
    FormsModule,
    ColorPickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
