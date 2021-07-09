import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Vector2 } from 'three';
import { PathFindAlgo } from '../algorithm/PathFindAlgo.interface';
import { MapService } from '../game-states/map.services';

@Component({
  selector: 'app-maze-ui',
  templateUrl: './maze-ui.component.html'
})
export class MazeUiComponent {

  @Input('mapService')
  private mapService: MapService

  @Input('pathFindAlgo')
  private pathFindAlgo: PathFindAlgo;

  @Output('pathFindOutput')
  private pathFindEvent = new EventEmitter<Vector2[]>();

  constructor() { }

  pathFind() {
    this.mapService.cleanMap();
    var path = this.pathFindAlgo.pathFind();
    this.pathFindEvent.emit(path)
  }

}
