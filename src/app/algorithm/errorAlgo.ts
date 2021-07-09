import { Vector2 } from "three";
import { PathFindAlgo } from "./PathFindAlgo.interface";

export class ErrorAlgo implements PathFindAlgo {

    pathFind(): Vector2[] {
        throw new Error("Algo not implemented.");
    }

}