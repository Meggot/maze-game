import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { MazeUiComponent } from './maze-ui/maze-ui.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    MazeUiComponent
    ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
