import { Injectable } from "@angular/core";
import { Scene } from "three";
import { MapService } from "./map.services";
import { Node } from '../models/nodes';
import { NodeService } from './nodes.services';

@Injectable({ providedIn: 'root' })
export class Astar {

    scene: Scene;

    openNodes: Node[] = new Array();
    closedNodes: Node[] = new Array();
    pathingNodes: Node[] = new Array();

    constructor(private nodeService: NodeService,
        private mapService: MapService) {

        }

    setup(scene: Scene) {
        this.scene = scene;

        this.openNodes = new Array();
        this.closedNodes = new Array();
        this.pathingNodes = new Array();
        
        this.mapService.setup(scene);
        this.pathFind();
    }

    async pathFind() {
        this.openNodes = new Array();
        this.closedNodes = new Array();
        this.pathingNodes = new Array();

        console.log(this.mapService.startTile)
        var startNode = this.nodeService.creatStartNode();
        this.openNodes.push(startNode);

        var currentNode: Node;
        while (true) {
            if (this.closedNodes.length > 10000) {
                console.log("Path cannot be found.")
                break;
            }
            if (this.openNodes.length == 0) {
                console.log("Path cannot be found")
                break;
            }
            currentNode = this.findLowestFCostInArray(this.openNodes);
            if (currentNode == undefined) {
                console.log("Path is unreachable..")
                break;
            }
            this.removeNodeFromArray(currentNode, this.openNodes);
            this.closedNodes.push(currentNode)

            if (this.isNodeOnTarget(currentNode)) {
                console.log('Path has been found!')
                break;
            }
            var neigbours = this.nodeService.generateNeighbourNodes(currentNode)
            neigbours.forEach(neighbourNode => {
                console.log(neighbourNode)
                console.log("vs")
                console.log(currentNode)
                if (!this.isTraversable(neighbourNode) || this.isNodeInArray(neighbourNode, this.closedNodes)) {
                    console.log("Adding node " + currentNode + " To closed nodes.")
                    this.closedNodes.push(neighbourNode)
                } else if (neighbourNode.fCost <= currentNode.fCost || this.isNodeInArray(neighbourNode, this.openNodes)) {
                    console.log("Adding node " + currentNode + "To open nodes.")
                    this.openNodes.push(neighbourNode);
                }
            })
        }
    }
    isTraversable(node: Node): Boolean {
        var isTraversable = node.tile.isTraversable;
        if  (node.xPos == 5 &&  node.yPos !=2)  {
            return false;
        }
        if (!isTraversable){
            console.log("Node " + node + " is NOT Traversable.")
            return false;
        }
        return isTraversable;
    }

    isNodeOnTarget(node: Node): Boolean {
        if (node.xPos == this.mapService.targetTile.mesh.position.x &&
            node.yPos == this.mapService.targetTile.mesh.position.y) {
            this.pathingNodes.push(node)
            while (node.id != 1) {
                if (node.parent == null) {
                    console.log('Found path, it is ' + this.pathingNodes.length + "long!")
                    break;
                }
                this.pathingNodes.push(node)
                node = node.parent;
            }
            this.pathingNodes.forEach(pathNode => {
                console.log("Setting " + pathNode + " as yellow..")
                pathNode.tile.setColour("yellow")
                this.scene.add(pathNode.tile.mesh);
            })
            return true;
        }
        return false;
    }

    isNodeInArray(node: Node, array: Node[]): Boolean {
        const objIndex = array.findIndex(obj => obj.id === node.id);
        if (objIndex > -1) {
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