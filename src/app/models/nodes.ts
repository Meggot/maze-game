import { Tile } from './tile';


export class Node {

    constructor(
        public tile: Tile,
        public id: number,
        public parent: Node,
        public xPos: number,
        public yPos: number,
        public hCost: number,
        public gCost: number,
        public fCost: number) {
        }


        public toString(): string {
            return "Id: " + this.id +
            " xPos:" + this.xPos +
            " yPos: " + this.yPos +
            " gCost: " + this.gCost + 
            " hCost: " + this.hCost +
            " fCost: " + this.fCost
        }
}