import { Injectable } from "@angular/core";
import * as THREE from "three";
import { Camera, Raycaster, Vector2 } from "three";
import { MapService } from "../game-states/map.services";


@Injectable({ providedIn: 'root' })
export class DrawWalls {

    raycaster: Raycaster = new THREE.Raycaster();
    mouse: Vector2 = new THREE.Vector2();
    camera: Camera;

    constructor(private mapService: MapService) {

    }

    setupCamera(camera) {
        this.camera = camera;
    }

    onMouseMove(event) {
        this.mouse.x = ((event.clientX / window.innerWidth) * 10 - 1)
        this.mouse.y = (-(event.clientY / window.innerHeight) * 10 + 1)
        console.log("Clicked at x: " + this.mouse.x + " and y: " + this.mouse.y)
        this.raycaster.setFromCamera(this.mouse, event.camera)
        var instersectVector = new THREE.Vector3();
        const intersects = this.raycaster.ray.intersectPlane(this.mapService.plane,
            instersectVector);

            const xPos = instersectVector.x
            const yPos = instersectVector.y
            this.mapService.createObstructionAt(xPos, yPos)
    
    }
}