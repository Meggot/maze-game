import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { Tile } from '../models/tile';
import { Scene } from 'three';

@Injectable({ providedIn: 'root' })
export class MapService {

    public startTile: Tile;
    public targetTile: Tile;

    public tiles: Tile[] = new Array();

    public pixelSize: number = 1;

    public scene: THREE.Scene;
    public floor: THREE.Mesh;
    public plane: THREE.Plane;

    private spawnTileX: number = 10;
    private spawnTileY: number = 15;

    private targetTileX: number = 0;
    private targetTileY: number = 0;

    tearDown() {
        this.scene.clear();
        this.setupSpawnCube();
        this.setupTargetCube();
        this.setupFloor();
        var obstructions: Tile[] = new Array();
        this.tiles.forEach(tile => {;
            if (!tile.isTraversable) {
                tile.reloadMesh(this.scene)
                obstructions.push(tile)
                console.log("adding tile : ", tile)
            } 
        });
        this.tiles.push(...obstructions)
        console.log(this.tiles)
    }

    getTileAt(x, y): Tile {
        this.tiles.forEach(tile => {
            if (tile.mesh.position.x == x  &&  tile.mesh.position.y == y){
                if (!tile.isTraversable) {
                console.log("Found tile " + tile + " that isnt traversable") 
            }
                return tile;
            }
        });
        return this.createTile(x, y, "green", true) //create a tile that is traversable and starts green.
    }

    setup(scene: THREE.Scene): void {
        this.scene = scene;
        this.setupSpawnCube();
        this.setupTargetCube();
        this.setupFloor();
        this.tiles.forEach(tile => {;
            tile.reloadMesh(scene)
        });
    }

    // SETUP METHODS ---

    private setupFloor() {
        this.plane = new THREE.Plane(new THREE.Vector3(60, 0, 60), 0);
        const geometry = new THREE.PlaneGeometry(60, 60);
        const material = new THREE.MeshBasicMaterial({ color: "grey", side: THREE.DoubleSide });
        this.floor = new THREE.Mesh(geometry, material);
        this.scene.add(this.floor);
    }

    private setupSpawnCube() {
        this.startTile = this.createTile(this.spawnTileX, this.spawnTileY, "green", true)
    }

    private setupTargetCube() {
        this.targetTile = this.createTile(this.targetTileX, this.targetTileY, "red", true)
    }

    // Private Methods ---

    public createObstructionAt(x, y) {
        console.log("Creating obstrruction at:x " + x  +" y: " + y)
        const geometry = new THREE.BoxGeometry(this.pixelSize, this.pixelSize, this.pixelSize)
        const material = new THREE.MeshBasicMaterial({ color: "black" });
        const tileMesh = new THREE.Mesh(geometry, material);

        tileMesh.position.x = x
        tileMesh.position.y = y
        tileMesh.position.z = 0;

        var tile: Tile = new Tile(tileMesh, false)
        this.tiles.push(tile)
        this.scene.add(tileMesh)
        tile.displayText(this.scene, x + ", " + y, x, y)
     }

    private createTile(xPos, yPos, color, isTraversable): Tile {
        const geometry = new THREE.BoxGeometry(this.pixelSize, this.pixelSize, this.pixelSize)
        const material = new THREE.MeshBasicMaterial({ color: color });
        const tileMesh = new THREE.Mesh(geometry, material);

        tileMesh.position.x = xPos
        tileMesh.position.y = yPos
        tileMesh.position.z = 0;

        var tile: Tile = new Tile(tileMesh, isTraversable)
        this.tiles.push(tile)
        this.scene.add(tileMesh)
        tile.displayText(this.scene,xPos + ", " + yPos, xPos, yPos)

        return tile;
    }

}