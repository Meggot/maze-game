import * as THREE from "three";
import { Mesh } from "three";

export function getSpiderMesh(size: number): Mesh {
    const geometry = new THREE.SphereGeometry(5 * size, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sphere = new THREE.Mesh(geometry, material);
    return sphere;
}