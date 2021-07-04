

export class Node {

    public fCost: number;

    constructor(public id: number,
        public parent: Node,
        public xPos: number,
        public yPos: number,
        public gCost: number,
        public hCost) {
            this.fCost = gCost + hCost;
        }


        public toString(): string {
            return "Id: " +this.id +
            " xPos:" + this.xPos +
            " yPos: " + this.yPos +
            " gCost: " + this.gCost + 
            " xCost: " + this.hCost +
            " fCost: " + this.fCost
        }
}