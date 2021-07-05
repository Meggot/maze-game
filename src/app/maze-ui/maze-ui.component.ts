import { Component, OnInit } from '@angular/core';
import { Astar } from '../game-states/astar.services';
import { MapService } from '../game-states/map.services';

@Component({
  selector: 'app-maze-ui',
  templateUrl: './maze-ui.component.html',
  styleUrls: ['./maze-ui.component.css']
})
export class MazeUiComponent implements OnInit {

  constructor(private astar: Astar,
    private mapService: MapService) { }

  ngOnInit(): void {
  }

  pathFind() {
    this.mapService.clearScene();
    this.astar.pathFind();
  }

}
