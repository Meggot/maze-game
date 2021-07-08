import { Injectable } from "@angular/core";
import { Scene } from "three";
import { MapService } from "./map.services";
import { Node } from '../models/nodes';
import { NodeManager } from './nodes.services';

@Injectable({ providedIn: 'root' })
export class Astar {

    scene: Scene;



    openNodes: Node[] = new Array();
    closedNodes: Node[] = new Array();
    pathingNodes: Node[] = new Array();

    nodeManager: NodeManager;

    constructor(private mapService: MapService) {

    }

    setup(scene: Scene) {
        this.scene = scene;
    }

    async pathFind() {
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

            var neigbours = this.nodeManager.generateNeighbourNodes(currentNode, true)

            neigbours.forEach(neighbourNode => {
                if (!this.isNodeInArray(neighbourNode, this.closedNodes)) {
                    const nextHCost =
                    currentNode.hCost +
                    (neighbourNode.xPos !== currentNode.xPos||
                    neighbourNode.yPos! == currentNode.yPos
                      ? 1
                      : 1 * 1.41421);
                    if (!neighbourNode.tile.isTraversable) {
                        neighbourNode.tile.setColour("black")
                        this.closedNodes.push(neighbourNode)
                    } else if (!this.isNodeInArray(neighbourNode, this.openNodes) || nextHCost < neighbourNode.hCost){
                        neighbourNode.hCost = nextHCost
                        neighbourNode.parent = currentNode;
                        neighbourNode.tile.setColour("red")
                        this.openNodes.push(neighbourNode);
                    }
                }
            })
        }
    }


    isNodeInArray(node: Node, array: Node[]) {
        const objIndex = array.findIndex(obj => obj.id === node.id);
        if (objIndex > -1) {
            return true;
        }
        return false;
    }


    isNodeOnTarget(node: Node): Boolean {
        if (node.xPos == this.mapService.targetTileX &&
            node.yPos == this.mapService.targetTileY) {
            this.pathingNodes.push(node)
            while (true) {
                if (node.id == 1) {
                    console.log('Found path, it is ' + this.pathingNodes.length + "long!")
                    break;
                }
                node.tile.setColour("yellow")
                this.pathingNodes.push(node)
                node = node.parent;
            }
            return true;
        }
        return false;
    }

    removeNodeFromArray(node: Node, array: Node[]) {
        const objIndex = array.findIndex(obj => obj.id === node.id);
        if (objIndex > -1) {
            array = array.splice(objIndex, 1);
        }
    }

    findLowestFCostInArray(array: Node[]): Node {
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