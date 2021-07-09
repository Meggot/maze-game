import { Path, Scene } from "three";
import { getSpiderMesh } from "../models/creep-meshes.mode";
import { Creep } from "../models/creep.model";
import { CreepBehaviour } from "../models/creepBehaviour.model";
import { MapService } from "./map.services";

export class CreepManager{

    private activeCreeps: CreepBehaviour[];

    constructor(private creepPath: Path,
        private mapService: MapService,
        private scene: Scene,
        private waveNumber: string){}

    
    async startWave() {
        
    }

    spawnCreep(creep:Creep) {
        var mesh = getSpiderMesh(1)
        var creepBehaviour = new CreepBehaviour(creep, mesh);
        this.activeCreeps.push(creepBehaviour)
        this.scene.add(mesh)
        creepBehaviour.follow(this.creepPath);
    }

    
}