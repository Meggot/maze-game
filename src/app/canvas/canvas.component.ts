import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../game-states/map.services';
import { Astar } from '../algorithm/astar.services';
import { CanvasService } from './canvas.service';
import { BLANK_MAP, FOREST_MAP, MAZE_MAP } from '../inputs/maps.services';
import { PathFindAlgo } from '../algorithm/PathFindAlgo.interface';
import { Vector2 } from 'three';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html'
})
export class CanvasComponent implements OnInit {

  @ViewChild('renderCanvas', { static: true })
  public renderCanvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('mapSelection', { static: true })
  public mapSelection: any;

  public selectedMap: number[][] = BLANK_MAP;
  public mapService: MapService;
  public pathFindAlgo: PathFindAlgo;

  public lastPathFindLength: number = 0;

  scene: THREE.Scene;

  public maps = [
    { mapName: "Blank Map", mapBinaryArray: BLANK_MAP },
    { mapName: "Maze Map", mapBinaryArray: MAZE_MAP },
    { mapName: "Forest Map", mapBinaryArray: FOREST_MAP }
  ]

  public constructor(private canvasService: CanvasService) {

  }

  ngOnInit(): void {
        //SETUP THREE.JS CANVAS
        this.scene = this.canvasService.createScene(this.renderCanvas);

        this.canvasService.animate();
        console.log(this.mapSelection);
    
        this.setupMap()
  }

  getMapFromId() {

  }

  setMap(mapName: string) {
    console.log(mapName);
    this.maps.forEach(map => {
      if (map.mapName == mapName) {
        console.log("SELECTED MAP: " + map.mapName)
        this.selectedMap = map.mapBinaryArray
        this.setupMap();
        return;
      }
    });
  }

  setupMap() {
    //DEFINE MAP
    this.mapService = new MapService(this.scene, this.selectedMap)

    //GIVE CANVAS SERVICE THE MAP SO WE CAN DRAW ON IT!
    this.canvasService.mapService = this.mapService;
  }

  pathStart() {
    //YOUR ALGO HERE!
    this.pathFindAlgo = new Astar(this.mapService);

    //Clean previous paths.
    this.mapService.cleanMap();

    //GET PATH!
    var path = this.pathFindAlgo.pathFind();

    //DRAW PATH!
    this.drawPath(path);
  }

  /**
   *  Draws all the vectors (x, y)  in green.
   * @param pathVector 
   */
  drawPath(pathVector: Vector2[]) {
    this.lastPathFindLength = pathVector.length;
    this.mapService.drawPath(pathVector)
  }

}