# MazeGame

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.1.

The Kata challenge is to build a PATHFINDING algorithm that will go from the start to the end in the most optimium path. Optimum path is the shortest distance.

MAPS:

The maps are in the /inputs/ folder. They are represented as number grids of tiles:

```
[
    [2], [0], [0],
    [0], [1], [0],
    [0], [1], [0],
    [0], [0], [3]
]

```
 0 =  Free space that is traversable.
 1 = Obstruction like a wall or something.
 2 = Start point for the algorithm.
 3 = End point for the algorith,

Path Find Algo:

The goal of the Kata is to implement this PathFindAlgo pathFind() algorithm and return an array of Vector2 (this is just x + y) coordinats of the path going from the start point (represented by 2), to the end point (represented by 3). This will then be drawn by the canvas service as a nice green line.

 AID FUNCTIONS AND SERVICES:

 MapService: This holds all the drawings for the maps, this is what actually decides what to display on the canvas and is aware of all the tiles. The binary map is processed by this service and provides convinence methods for measuring distance, getting tiles at certain coordinates.

 NodeManager: This is a service that allows you to easily explore the map and store whatever details you like on each node. It is not required to use this but it's very helpful to add information ontop of a tile.

 Canvas Component: This is the actual THREE.JS scene definition, and where we implement the helper methods like drawing and working out where the user is clicking, as well as setting up the camera and lights. This is a fully fledged 3d library but for our useages we're just using it in a 2d space.

 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Deploys upon merge to Master

see [S3 hosted site](http://pathfinding.challenge.s3-website-eu-west-1.amazonaws.com/) to view latest master live.

For teams please use /teams/{team-name} on the s3 bucket.

