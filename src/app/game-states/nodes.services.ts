import { MapService } from './map.services';
import { Node } from '../models/nodes';
import { Tile } from '../models/tile';

export class NodeManager {

    nodes: Node[];
    lastNodeId: number = 1;

    constructor(private mapService: MapService) {
        this.nodes = new Array();
    }

    generateNeighbourNodes(node: Node, withDiagonals: boolean): Node[] {
        var pixel = this.mapService.pixelSize
        var neighbours: Node[] = Array();

        neighbours.push(this.getNodeAtXY(node.xPos, node.yPos + pixel, node))
        neighbours.push(this.getNodeAtXY(node.xPos + pixel, node.yPos, node))
        neighbours.push(this.getNodeAtXY(node.xPos - pixel, node.yPos, node))
        neighbours.push(this.getNodeAtXY(node.xPos, node.yPos - pixel, node))

        if (withDiagonals) {
            neighbours.push(this.getNodeAtXY(node.xPos - pixel, node.yPos - pixel, node))
            neighbours.push(this.getNodeAtXY(node.xPos + pixel, node.yPos - pixel, node))
            neighbours.push(this.getNodeAtXY(node.xPos - pixel, node.yPos + pixel, node))
            neighbours.push(this.getNodeAtXY(node.xPos + pixel, node.yPos + pixel, node))
        }

        return neighbours;
    }

    getNodeAtXY(x: number, y: number, parentNode: Node): Node {
        var createdNode: Node;
         this.nodes.forEach(node => {
            if (node.xPos == x && node.yPos == y) {
                createdNode = node;
            }
        }) ;
        if (createdNode == null) {
            createdNode = this.createNodeAtWithParent(x, y, parentNode)
        }
        return createdNode;
    }

    createStartNode(): Node {
        var startNode = new Node(this.mapService.getTileAt(this.mapService.spawnTileX, this.mapService.spawnTileY),
            this.lastNodeId,
            null,
            this.mapService.spawnTileX,
            this.mapService.spawnTileY,
            2000,
            2000,
            2000+2000);
        this.nodes.push(startNode);
        return startNode
    }

    createNodeAtWithParent(x, y, parentNode): Node {
        this.lastNodeId += 1;

        // The HCOST is how much it costs to get to the current position from start via parents..
        // First how much does it cost to get from parent to this position -
        var hCost = parentNode.hCost +
        (parentNode.xPos !== x ||
            parentNode.yPos! == y
          ? 1
          : 1 * 1.41421);

        // The G Cost is the euclidian distance from here to the target.
        var gCost = this.mapService.measureDistance(x,
            y,
            this.mapService.targetTileX,
            this.mapService.targetTileY) * 2;

        //The F Cost is hCost + GCost.
        var fCost = hCost + gCost;

        var tile = this.mapService.getTileAt(x, y);
        //Create the new node.
        var drawnNode = new Node(tile,
            this.lastNodeId,
            parentNode,
            x,
            y,
            hCost,
            gCost,
            fCost)

        // this.mapService.writeTextAt(fCost, x, y)
        this.nodes.push(drawnNode);
        return drawnNode;
    }
}
