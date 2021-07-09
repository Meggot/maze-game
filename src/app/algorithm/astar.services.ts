import { MapService } from "../game-states/map.services";
import { Node } from '../models/nodes';
import { NodeManager } from '../game-states/nodes.services';
import { Vector2 } from "three";
import { PathFindAlgo } from "./PathFindAlgo.interface";

export class Astar implements PathFindAlgo {

    openNodes: Node[] = new Array();
    closedNodes: Node[] = new Array();
    pathingNodes: Node[] = new Array();

    nodeManager: NodeManager;

    constructor(private mapService: MapService) {
    }

    public pathFind(): Vector2[] {
        this.nodeManager = new NodeManager(this.mapService);
        this.openNodes = new Array();
        this.closedNodes = new Array();
        this.pathingNodes = new Array();

        var startNode = this.nodeManager.createStartNode();
        this.openNodes.push(startNode);

        var currentNode: Node;
        while (this.openNodes.length !== 0) {
            if (this.closedNodes.length > 2000) {
                console.log("Path cannot be found.")
                break;
            }

            var currentNode = this.findLowestFCostInArray(this.openNodes);
            this.removeNodeFromArray(currentNode, this.openNodes);

            this.closedNodes.push(currentNode)

            if (this.isNodeOnTarget(currentNode)) {
                console.log('Path has been found!')
                break;
            }

            var neigbours = this.nodeManager.generateNeighbourNodes(currentNode, false)

            neigbours.forEach(neighbourNode => {
                if (!this.isNodeInArray(neighbourNode, this.closedNodes)) {
                    const nextHCost =
                    currentNode.hCost +
                    (neighbourNode.xPos !== currentNode.xPos||
                    neighbourNode.yPos! == currentNode.yPos
                      ? 1
                      : 1 * 1.41421);
                    if (!neighbourNode.tile.isTraversable) {
                        this.closedNodes.push(neighbourNode)
                    } else if (!this.isNodeInArray(neighbourNode, this.openNodes) || nextHCost < neighbourNode.hCost){
                        neighbourNode.hCost = nextHCost
                        neighbourNode.parent = currentNode;
                        this.openNodes.push(neighbourNode);
                    }
                }
            })
        }
        if (this.pathingNodes.length <= 0) {
            throw Error("Pathfind was not successful.")
        }
        var vectorArray: Vector2[] = new Array();
        this.pathingNodes.forEach(pathNode => {
            vectorArray.push(new Vector2(pathNode.xPos, pathNode.yPos))
        })
        return vectorArray.reverse();
    }

    private isNodeInArray(node: Node, array: Node[]) {
        const objIndex = array.findIndex(obj => obj.id === node.id);
        if (objIndex > -1) {
            return true;
        }
        return false;
    }

    private isNodeOnTarget(node: Node): Boolean {
        if (node.xPos == this.mapService.targetTileX &&
            node.yPos == this.mapService.targetTileY) {
            this.pathingNodes.push(node)
            while (true) {
                if (node.id == 1) {
                    console.log('Found path, it is ' + this.pathingNodes.length + "long!")
                    break;
                }
                this.pathingNodes.push(node)
                node = node.parent;
            }
            //Add start node to the pathing nodes.
            this.pathingNodes.push(this.nodeManager.getNodeAtXY(this.mapService.spawnTileX, this.mapService.spawnTileY, node));
            return true;
        }
        return false;
    }

    private removeNodeFromArray(node: Node, array: Node[]) {
        const objIndex = array.findIndex(obj => obj.id === node.id);
        if (objIndex > -1) {
            array = array.splice(objIndex, 1);
        }
    }

    private findLowestFCostInArray(array: Node[]): Node {
        var lowestNode: Node;
        array.forEach(node => {
            if (lowestNode == null) {
                lowestNode = node;
            }
            if (node != null && node.fCost < lowestNode.fCost) {
                lowestNode = node;
            }
        })
        return lowestNode;
    }
}