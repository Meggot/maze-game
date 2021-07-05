import * as THREE from 'three';
import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';
import { Raycaster, Vector2, Camera } from 'three';
import { MapService } from '../game-states/map.services';

@Injectable({ providedIn: 'root' })
export class CanvasService implements OnDestroy {
    private canvas: HTMLCanvasElement;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    public scene: THREE.Scene;
    private light: THREE.AmbientLight;
    private frameId: number = null;

    public constructor(private ngZone: NgZone,
        private mapService: MapService) {
    }

    public ngOnDestroy(): void {
        if (this.frameId != null) {
            cancelAnimationFrame(this.frameId);
        }
    }

    public createScene(canvas: ElementRef<HTMLCanvasElement>): THREE.Scene {
        // The first step is to get the reference of the canvas element from our HTML document
        this.canvas = canvas.nativeElement;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,    // transparent background
            antialias: true // smooth edges
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // create the scene
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            10, window.innerWidth / window.innerHeight, 0.2, 1000
        );
        this.camera.position.z = 250;
        this.scene.add(this.camera);

        // soft white light
        this.light = new THREE.AmbientLight(0x404040);
        this.light.position.z = 250;
        this.scene.add(this.light);

        return this.scene;
    }

    public animate(): void {
        // We have to run this outside angular zones,
        // because it could trigger heavy changeDetection cycles.
        this.ngZone.runOutsideAngular(() => {
            if (document.readyState !== 'loading') {
                this.render();
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    this.render();
                });
            }

            window.addEventListener('resize', () => {
                this.resize();
            });
            window.addEventListener('mousedown', (event) => {
                this.onMouseMove(event);
            });
        });
    }

    public render(): void {
        this.frameId = requestAnimationFrame(() => {
            this.render();
        });

        // this.cube.position.x += -0.2;

        // this.cube.rotation.y += 0.01;
        this.renderer.render(this.scene, this.camera);
    }

    public resize(): void {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    raycaster: Raycaster = new THREE.Raycaster();
    mouse: Vector2 = new THREE.Vector2();

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        console.log(this.camera)
        this.raycaster.setFromCamera(this.mouse, this.camera)
        var instersectVector = new THREE.Vector3();
        const intersects = this.raycaster.ray.intersectPlane(this.mapService.plane,
            instersectVector);
        const xPos = Math.round(intersects.x)
        const yPos = Math.round(intersects.y)
        this.mapService.createObstructionAt(xPos, yPos)
    }
}