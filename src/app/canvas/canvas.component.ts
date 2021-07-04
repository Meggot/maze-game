import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../game-states/map.services';
import { PathServices } from '../game-states/path.services';
import { CanvasService } from './canvas.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html'
})
export class CanvasComponent implements OnInit {

  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  scene: THREE.Scene;

  public constructor(private canvasService: CanvasService,
    private mapService: MapService,
    private pathService: PathServices) {
  }

  public ngOnInit(): void {
    this.scene = this.canvasService.createScene(this.rendererCanvas);
    this.canvasService.animate();
    this.mapService.setup(this.scene);
    this.pathService.setup(this.mapService, this.scene);
  }

}