import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { Box3 } from 'three';

@Injectable({ providedIn: 'root' })
export class MapService {

    public spawnCube: THREE.Mesh;
    public targetCube: THREE.Mesh;
    public obstructions: THREE.Mesh[];

    public pixelSize: number = 1;
    public scene: THREE.Scene;
    public floor: THREE.Mesh;
    public plane: THREE.Plane;

    clearScene() {
        this.scene.clear()
        this.setupSpawnCube();
        this.setupTargetCube();
        this.setupFloor();
        this.obstructions.forEach(obstruction =>{
            this.scene.add(obstruction);
        })
    }

    setup(scene: THREE.Scene): void {
        this.scene = scene;
        this.obstructions = new Array();
    }

    setupFloor() {
        this.plane = new THREE.Plane( new THREE.Vector3( 60, 0, 60), 0 );
        const geometry = new THREE.PlaneGeometry(60, 60);
        const material = new THREE.MeshBasicMaterial({ color: "grey", side: THREE.DoubleSide });
        this.floor = new THREE.Mesh(geometry, material);
        this.scene.add(this.floor);
    }

    setupSpawnCube() {
        const geometry = new THREE.BoxGeometry(this.pixelSize, this.pixelSize, this.pixelSize);
        const material = new THREE.MeshBasicMaterial({ color: "green" });
        this.spawnCube = new THREE.Mesh(geometry, material);
        this.spawnCube.position.x = -25
        this.spawnCube.position.y = 20
        this.spawnCube.position.z = 0
        this.scene.add(this.spawnCube);
    }

    setupTargetCube() {
        const geometry = new THREE.BoxGeometry(this.pixelSize, this.pixelSize, this.pixelSize);
        const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
        this.targetCube = new THREE.Mesh(geometry, material);
        this.targetCube.position.x = 0;
        this.targetCube.position.y = 0;
        this.targetCube.position.z = 0;
        this.scene.add(this.targetCube);
    }

    createObstructionAt(xPos, yPos) {
        const geometry = new THREE.BoxGeometry(this.pixelSize, this.pixelSize, this.pixelSize)
        const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const alphaObstruction = new THREE.Mesh(geometry, material);
        alphaObstruction.position.x = xPos;
        alphaObstruction.position.y = yPos;
        alphaObstruction.position.z = 0;
        this.scene.add(alphaObstruction);
        this.obstructions.push(alphaObstruction);
    }
}