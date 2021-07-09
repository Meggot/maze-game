import * as THREE from "three";
import { Mesh, Path } from "three";
import { Creep } from "./creep.model"

export class CreepBehaviour {
    constructor(private creep: Creep, private creepMesh: Mesh) {

    }

    follow(path: Path) {
        var object = this.creepMesh;
        var direction = new THREE.Vector3(1, 0, 0);

        // scalar to simulate speed
        var speed = this.creep.attributes.speed;

        var vector = direction.multiplyScalar(speed);
        object.position.x += vector.x;
        object.position.y += vector.y;
        object.position.z += vector.z;
    }

    die() {

    }

    takeDamage() {

    }
}