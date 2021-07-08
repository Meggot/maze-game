import { Mesh, Scene, MeshBasicMaterial, Color } from 'three';

export class Tile {

    private tileStartingColor: string;

    constructor(
        public mesh: Mesh,
        public startingColor: string,
        public isTraversable: boolean) {
    }

    reloadMesh(scene: Scene){
        scene.add(this.mesh)
    }

    clearMesh(scene: Scene){
        scene.remove(this.mesh)
    }

    setColour(color: string) {
        const material: MeshBasicMaterial = (this.mesh.material as MeshBasicMaterial);
        material.color = new Color(color);
    }

    clean() {
        if (this.isTraversable) {
            this.setColour("white")
        }
    }
}