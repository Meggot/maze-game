import { Tile } from './tile';


export class Node {

    constructor(
        public tile: Tile,
        public id: number,
        public parent: Node,
        public xPos: number,
        public yPos: number) {}


        public toString(): string {
            return "Id: " + this.id +
            " xPos:" + this.xPos +
            " yPos: " + this.yPos 
        }
}