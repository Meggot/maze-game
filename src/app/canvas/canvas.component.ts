import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../game-states/map.services';
import { Astar } from '../game-states/astar.services';
import { CanvasService } from './canvas.service';
import { DEFAULT_MAP } from '../inputs/maps.services';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html'
})
export class CanvasComponent implements OnInit {

  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  scene: THREE.Scene;

  public constructor(private mapService: MapService,
    private canvasService: CanvasService,
    private astar: Astar) {
  }

  public ngOnInit(): void {
    console.log("Creating scene...")
    console.log(this.rendererCanvas.nativeElement)
    this.scene = this.canvasService.createScene(this.rendererCanvas);
    this.mapService.setup(this.scene, DEFAULT_MAP)
    this.astar.setup(this.scene);
    this.canvasService.animate();
  }

}