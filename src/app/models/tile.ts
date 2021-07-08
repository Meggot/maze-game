import { Mesh, Scene, TextBufferGeometry, Font, FontLoader, MeshBasicMaterial, Color } from 'three';
import * as THREE from 'three';

export class Tile {

    constructor(
        public mesh: Mesh,
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


    displayText(scene, message, x, y) {
        const loader = new THREE.FontLoader();
        loader.load( 'assets/helvetica.json', function ( font ) {
            const geometry = new THREE.TextGeometry( message, {
                font: font,
                size: .3,
                height: 1
            } );
            var textMaterial = new THREE.MeshPhongMaterial( 
                { color: 0xff0000, specular: 0xffffff }
            );
            var textMesh = new THREE.Mesh(geometry, textMaterial);
            textMesh.position.x = x-.5
            textMesh.position.y = y
            textMesh.position.z = 0;
            scene.add(textMesh);
        } );
    }
}