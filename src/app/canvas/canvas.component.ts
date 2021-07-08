import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../game-states/map.services';
import { Astar } from '../game-states/astar.services';
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
    private astar: Astar) {
  }

  public ngOnInit(): void {
    this.scene = this.canvasService.createScene(this.rendererCanvas);
    this.mapService.setup(this.scene);
    this.astar.setup(this.scene);
    this.canvasService.animate();
  }

}