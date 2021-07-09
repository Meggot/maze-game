import * as THREE from 'three';
import { Tile } from '../models/tile';
import { Path, Vector2, BufferGeometry, LineBasicMaterial, Line } from 'three';

export class MapService {

    public tiles: Tile[][];
    public pixelSize: number = 1;

    public floor: THREE.Mesh;
    public plane: THREE.Plane;

    public mapWidth: number = 70;
    public mapHeight: number = 70;

    public spawnTileX: number;
    public spawnTileY: number;

    public targetTileX: number;
    public targetTileY: number;

    //Hacky fix to make coords appear in the bottom left. This is only added to the render meshes.
    public offsetX: number = 20;
    public offsetY: number = 16;

    constructor(private scene: THREE.Scene,
        private binaryMap: number[][]) {
            this.setup()
        }

    getTileAt(x: number, y: number): Tile {
        var tile;
        try {
         tile = this.tiles[x][y];
        } catch {
            //Out of bounds or cheating! Create wall..
        }
        if (tile == undefined) {
            tile = this.createTile(x, y, false);
        }
        return tile;
    }

    setup(): void {
        this.tiles = new Array()
        for (let x = 0; x < this.binaryMap.length; x++) {
            this.tiles[x] = new Array();
            for (let y = 0; y < this.binaryMap[x].length; y++) {
                const isTraversable = this.binaryMap[x][y] == 1 ? false : true;
                var createdTile = this.createTile(x, y, isTraversable)
                this.tiles[x][y] = createdTile;
                if (this.binaryMap[x][y] == 2) {
                    this.spawnTileX = x;
                    this.spawnTileY = y;
                    createdTile.setColour("green");
                }
                if (this.binaryMap[x][y] == 3) {
                    this.targetTileX = x;
                    this.targetTileY = y;
                    createdTile.setColour("red");
                }
            }
        }

        this.plane = new THREE.Plane(new THREE.Vector3(60, 0, 60), 0);
        const geometry = new THREE.PlaneGeometry(60, 60);
        const material = new THREE.MeshBasicMaterial({ color: "grey", side: THREE.DoubleSide });
        this.floor = new THREE.Mesh(geometry, material);
        this.scene.add(this.floor);
    }

    public drawPath(pathVector: THREE.Vector2[]) {
            //Have to Offset by X and Y to get in correct place.. (Would prefer to use setFromPoints)
        pathVector.forEach(nodeVector => {
            this.getTileAt(nodeVector.x, nodeVector.y).setColour("green");
        })

      }

    public cleanMap() {
        this.tiles.forEach(tileRow => {
            tileRow.forEach(tile => {
                tile.clean();
            })
        })
    }

    public measureDistance(startX, startY, targetX, targetY): number {
        const path = new Path();
        path.currentPoint = new Vector2(startX,
            startY);
        path.lineTo(targetX,
            targetY);
        const points = path.getPoints();
        const geometry = new BufferGeometry().setFromPoints(points);
        const material = new LineBasicMaterial({ color: "red" });
        const line = new Line(geometry, material).computeLineDistances();
        var rawdistance = line.geometry.attributes.lineDistance.getX(line.geometry.attributes.lineDistance.count - 1);
        return Math.round(rawdistance * 100) / 100
    }

    private createTile(xPos, yPos, isTraversable): Tile {
        const geometry = new THREE.BoxGeometry(this.pixelSize, this.pixelSize, this.pixelSize)
        var tileStartingColor = isTraversable ? "white" : "black"
        const material = new THREE.MeshBasicMaterial({ color: tileStartingColor });
        const tileMesh = new THREE.Mesh(geometry, material);
        tileMesh.position.x = xPos - this.offsetX;
        tileMesh.position.y = yPos - this.offsetY;
        tileMesh.position.z = 0;

        var tile: Tile = new Tile(tileMesh, tileStartingColor, isTraversable)
        this.scene.add(tileMesh)
        return tile;
    }


    async writeTextAt(message, x, y) {
        const loader = new THREE.FontLoader();
        loader.load('assets/helvetica.json', function (font) {
            const geometry = new THREE.TextGeometry(message, {
                font: font,
                size: .3,
                height: 1
            });
            var textMaterial = new THREE.MeshPhongMaterial(
                { color: 0xff0000, specular: 0xffffff }
            );
            var textMesh = new THREE.Mesh(geometry, textMaterial);
            textMesh.position.x = x - this.offsetX;
            textMesh.position.y = y - this.offsetY;
            textMesh.position.z = 0;
            this.scene.add(textMesh);
        });
    }


}