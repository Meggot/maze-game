import { Injectable } from "@angular/core";
import * as THREE from "three";
import { BufferGeometry, Line, LineBasicMaterial, Path, Scene, Vector2 } from "three";
import { MapService } from "./map.services";
import { Node } from '../models/nodes';

@Injectable({ providedIn: 'root' })
export class Astar {

    scene: Scene;
    mapService: MapService;

    lastId: number = 0;

    openNodes: Node[] = new Array();
    closedNodes: Node[] = new Array();

    pathingNodes: Node[] = new Array();

    setup(mapService: MapService,
        scene: Scene) {
        this.mapService = mapService;
        this.scene = scene;
        this.pathFind();
    }

    async pathFind() {
        var startNode = this.createNodeFromAt(
            null,
            1000,
            1000,
            this.mapService.spawnCube.position.x,
            this.mapService.spawnCube.position.y);

        this.openNodes.push(startNode);
        var currentNode: Node;
        while (true) {
            currentNode = this.findLowestFCostInArray(this.openNodes);
            this.renderNode(currentNode, "green")
            this.removeNodeFromArray(currentNode, this.openNodes);
            this.closedNodes.push(currentNode)
            if (this.isNodeOnTarget(currentNode)) {
                console.log('Path has been found!')
                return;
            }
            var neigbours = this.generateNeighbourNodes(currentNode)
            neigbours.forEach(neighbourNode => {
                this.renderNode(neighbourNode, "red")
                if (!this.isTraversable(neighbourNode) || this.isNodeInArray(neighbourNode, this.closedNodes)) {
                    this.renderNode(neighbourNode, "black")
                    this.closedNodes.push(neighbourNode)
                    console.log('not traversable, or in closed')
                } else if (neighbourNode.fCost < currentNode.fCost || this.isNodeInArray(neighbourNode, this.openNodes)) {
                    neighbourNode.gCost = this.measureDistance(this.mapService.targetCube.position.x,
                        this.mapService.targetCube.position.y,
                        currentNode.xPos,
                        currentNode.yPos);
                    var hCost = this.measureDistance(neighbourNode.xPos,
                        neighbourNode.yPos,
                        currentNode.xPos,
                        currentNode.yPos);
                    if (neighbourNode.parent != null) {
                        neighbourNode.hCost += neighbourNode.parent.hCost;
                    }
                    neighbourNode.hCost = hCost;
                    neighbourNode.fCost = neighbourNode.gCost + neighbourNode.hCost;
                    currentNode = neighbourNode.parent;
                    if (!this.isNodeInArray(neighbourNode, this.openNodes)) {
                        this.openNodes.push(neighbourNode);
                    }
                }

            })
        }
    }

    generateNeighbourNodes(node: Node): Node[] {
        var neighbours: Node[] = Array();
        // //TOP RIGHT
        // var newNodeXPos = node.xPos + this.mapService.pixelSize;
        // var newNodeYPos = node.yPos + this.mapService.pixelSize;
        // neighbours.push(this.createNodeFromAt(
        //     node,
        //     node.xPos,
        //     node.yPos,
        //     newNodeXPos,
        //     newNodeYPos))
        //TOP LEFT
        // var newNodeXPos = node.xPos - this.mapService.pixelSize;
        // var newNodeYPos = node.yPos + this.mapService.pixelSize;
        // neighbours.push(this.createNodeFromAt(
        //     node,
        //     node.xPos,
        //     node.yPos,
        //     newNodeXPos,
        //     newNodeYPos))
        //TOP MIDDLE
        var newNodeXPos = node.xPos;
        var newNodeYPos = node.yPos + this.mapService.pixelSize;
        neighbours.push(this.createNodeFromAt(
            node,
            node.xPos,
            node.yPos,
            newNodeXPos,
            newNodeYPos));
        //RIGHT MIDDLE
        var newNodeXPos = node.xPos + this.mapService.pixelSize;
        var newNodeYPos = node.yPos;
        neighbours.push(this.createNodeFromAt(
            node,
            node.xPos,
            node.yPos,
            newNodeXPos,
            newNodeYPos));
        // //BOTTOM RIGHT
        // var newNodeXPos = node.xPos + this.mapService.pixelSize;
        // var newNodeYPos = node.yPos - this.mapService.pixelSize;
        // neighbours.push(this.createNodeFromAt(
        //     node,
        //     node.xPos,
        //     node.yPos,
        //     newNodeXPos,
        //     newNodeYPos));
        //MIDDLE LEFT
        var newNodeXPos = node.xPos - this.mapService.pixelSize;
        var newNodeYPos = node.yPos;
        neighbours.push(this.createNodeFromAt(
            node,
            node.xPos,
            node.yPos,
            newNodeXPos,
            newNodeYPos));
        //BOTTOM MIDDLE
        var newNodeXPos = node.xPos;
        var newNodeYPos = node.yPos - this.mapService.pixelSize;
        neighbours.push(this.createNodeFromAt(
            node,
            node.xPos,
            node.yPos,
            newNodeXPos,
            newNodeYPos));
        // //BOTTOM LEFT
        // var newNodeXPos = node.xPos - this.mapService.pixelSize;
        // var newNodeYPos = node.yPos - this.mapService.pixelSize;
        // neighbours.push(this.createNodeFromAt(
        //     node,
        //     node.xPos,
        //     node.yPos,
        //     newNodeXPos,
        //     newNodeYPos));
        return neighbours;
    }

    isTraversable(node: Node): Boolean {
        return true;
    }

    isNodeOnTarget(node: Node): Boolean {
        if (node.xPos == this.mapService.targetCube.position.x &&
            node.yPos == this.mapService.targetCube.position.y) {
            console.log(node.toString() + " IS ON TARGET!")
            var pointerNodeId = node.id
            this.pathingNodes.push(node)
            while (pointerNodeId != 1) {
                if (node.parent == null) {
                    console.log('found path, it is ' + this.pathingNodes.length)
                    break;
                }
                this.pathingNodes.push(node.parent)
                node = node.parent;
            }
            this.pathingNodes.forEach(pathingnode => {
                this.renderNode(pathingnode, "yellow")
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

    measureDistance(startX, startY, targetX, targetY): number {
        const path = new Path();
        path.currentPoint = new Vector2(startX,
            startY);
        path.lineTo(targetX,
            targetY);
        const points = path.getPoints();
        const geometry = new BufferGeometry().setFromPoints(points);
        const material = new LineBasicMaterial({ color: 0xffffff });
        const line = new Line(geometry, material);
        line.computeLineDistances();
        // this.scene.add(line)
        return line.geometry.attributes.lineDistance.getX(line.geometry.attributes.lineDistance.count - 1);
    }

    renderNode(node: Node, color: string) {
        const geometry = new THREE.BoxGeometry(this.mapService.pixelSize, this.mapService.pixelSize, this.mapService.pixelSize)
        const material = new THREE.MeshBasicMaterial({ color: color });
        const nodeMesh = new THREE.Mesh(geometry, material);
        material.wireframe = true
        nodeMesh.position.x = node.xPos
        nodeMesh.position.y = node.yPos
        nodeMesh.position.z = 0;
        this.scene.add(nodeMesh)
    }

    createNodeFromAt(parentNode, startX, startY, xPosition, yPosition): Node {
        this.lastId += 1;
        var hCost = this.measureDistance(xPosition,
            yPosition,
            startX,
            startY);
        if (parentNode!=null) {
             hCost += parentNode.hCost;
        }
        var drawnNode = new Node(
            this.lastId,
            parentNode,
            xPosition,
            yPosition,
            this.measureDistance(xPosition,
                yPosition,
                this.mapService.targetCube.position.x,
                this.mapService.targetCube.position.y),
            hCost)
        return drawnNode;
    }
}