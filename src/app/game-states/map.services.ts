import * as THREE from 'three';
import {Injectable} from '@angular/core';
import { Box3 } from 'three';

@Injectable({providedIn: 'root'})
export class MapService {



    public spawnCube: THREE.Mesh;
    public targetCube: THREE.Mesh;

    public pixelSize: 1;

    public scene: THREE.Scene;

    setup(scene: THREE.Scene): void {
        this.scene = scene;
        this.setupSpawnCube();
        this.setupTargetCube();
        // this.setupObsructions();
    }

    setupSpawnCube(){
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        material.wireframe = true
        this.spawnCube = new THREE.Mesh(geometry, material);
        this.spawnCube.position.x = -25
        this.spawnCube.position.y = 20
        this.spawnCube.position.z = 0
        this.scene.add(this.spawnCube);
    }

    setupTargetCube(){
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0xFF0000});
        this.targetCube = new THREE.Mesh(geometry, material);
        this.targetCube.position.x = 0;
        this.targetCube.position.y = 0;
        this.targetCube.position.z = 0;
        this.scene.add(this.targetCube);
    }

    setupObsructions(){
        const geometry = new THREE.BoxGeometry(5, 20, 1)
        const material = new THREE.MeshBasicMaterial({color: 0x000000});
        const alphaObstruction = new THREE.Mesh(geometry, material);
        alphaObstruction.position.x = -5;
        alphaObstruction.position.y = 1;
        alphaObstruction.position.z = 0;
        material.wireframe = true
        this.scene.add(alphaObstruction);
    }
}