import { Injectable } from "@angular/core";
import * as THREE from "three";
import { BufferGeometry, Line, LineBasicMaterial, Path, Scene, Vector2 } from "three";
import { MapService } from "./map.services";
import { Node } from '../models/nodes';

@Injectable({ providedIn: 'root' })
export class PathServices {

    scene: Scene;
    mapService: MapService;

    lastId: number = 0;
    openNodes: Node[] = new Array();
    closedNodes: Node[] = new Array();

    setup(mapService: MapService,
        scene: Scene) {
        this.mapService = mapService;
        this.scene = scene;
        this.pathFind();
    }


    pathFind() {
        var startNode = this.drawNode(
            null,
            this.mapService.spawnCube.position.x,
            this.mapService.spawnCube.position.y,
            this.mapService.spawnCube.position.x,
            this.mapService.spawnCube.position.y);

        this.openNodes.push(startNode);
        var currentNode: Node;
        while (true) {
            currentNode = this.findLowestFCostInArray(this.openNodes);
            this.removeNodeFromArray(currentNode, this.openNodes);
            this.closedNodes.push(currentNode)
            if (this.isNodeOnTarget(currentNode)) {
                console.log('Path has been found!')
                return;
            }
            var neighbours = this.generateNeighbourNodes(currentNode)
            neighbours.forEach(neighbourNode => {
                console.log("Current Neighbour Node: " + neighbourNode.toString())
                if (!this.isTraversable(neighbourNode) || this.isNodeInArray(neighbourNode, this.closedNodes)) {
                    console.log('not traversable, or in closed')
                }
                if (!(neighbourNode.fCost > currentNode.fCost) || this.isNodeInArray(neighbourNode, this.openNodes))  {
                    neighbourNode.gCost = this.measureDistance(this.mapService.targetCube.position.x,
                        this.mapService.targetCube.position.y,
                        currentNode.xPos,
                        currentNode.yPos);
                    neighbourNode.hCost = this.measureDistance(this.mapService.spawnCube.position.x,
                        this.mapService.spawnCube.position.y,
                        currentNode.xPos,
                        currentNode.yPos);
                    neighbourNode.fCost = neighbourNode.gCost + neighbourNode.hCost;
                    console.log("Setting " + neighbourNode.toString() + " parent as current node")
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
        //TOP RIGHT
        var newNodeXPos = node.xPos + 1;
        var newNodeYPos = node.yPos + 1;
        neighbours.push(this.drawNode(
            node,
            node.xPos,
            node.yPos,
            newNodeXPos,
            newNodeYPos))
        //TOP LEFT
        var newNodeXPos = node.xPos - 1;
        var newNodeYPos = node.yPos + 1;
        neighbours.push(this.drawNode(
            node,
            node.xPos,
            node.yPos,
            newNodeXPos,
            newNodeYPos))
        //TOP MIDDLE
        var newNodeXPos = node.xPos;
        var newNodeYPos = node.yPos + 1;
        neighbours.push(this.drawNode(
            node,
            node.xPos,
            node.yPos,
            newNodeXPos,
            newNodeYPos));
        //RIGHT MIDDLE
        var newNodeXPos = node.xPos + 1;
        var newNodeYPos = node.yPos;
        neighbours.push(this.drawNode(
            node,
            node.xPos,
            node.yPos,
            newNodeXPos,
            newNodeYPos));
        //BOTTOM RIGHT
        var newNodeXPos = node.xPos + 1;
        var newNodeYPos = node.yPos - 1;
        neighbours.push(this.drawNode(
            node,
            node.xPos,
            node.yPos,
            newNodeXPos,
            newNodeYPos));
        //MIDDLE LEFT
        var newNodeXPos = node.xPos - 1;
        var newNodeYPos = node.yPos;
        neighbours.push(this.drawNode(
            node,
            node.xPos,
            node.yPos,
            newNodeXPos,
            newNodeYPos));
        //BOTTOM MIDDLE
        var newNodeXPos = node.xPos;
        var newNodeYPos = node.yPos - 1;
        neighbours.push(this.drawNode(
            node,
            node.xPos,
            node.yPos,
            newNodeXPos,
            newNodeYPos));
        //BOTTOM LEFT
        var newNodeXPos = node.xPos - 1;
        var newNodeYPos = node.yPos - 1;
        neighbours.push(this.drawNode(
            node,
            node.xPos,
            node.yPos,
            newNodeXPos,
            newNodeYPos));
        return neighbours;
    }

    isTraversable(node: Node): Boolean {
        return true;
    }

    isNodeOnTarget(node: Node): Boolean {
        console.log("Checking if node " + node.toString() + " is on target...")
        if (node.hCost = 0) {
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
        console.log("Lowest Nodes is: " + lowestNode.toString())
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
        return line.geometry.attributes.lineDistance.getX(line.geometry.attributes.lineDistance.count - 1);
    }


    drawNode(parentNode, startX, startY, xPosition, yPosition): Node {
        this.lastId += 1;
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff });
        const nodeMesh = new THREE.Mesh(geometry, material);
        nodeMesh.position.x = xPosition
        nodeMesh.position.y = yPosition
        nodeMesh.position.z = 0;
        this.scene.add(nodeMesh);
        var drawnNode = new Node(
            this.lastId,
            parentNode,
            xPosition,
            yPosition,
            this.measureDistance(xPosition,
                yPosition,
                this.mapService.targetCube.position.x,
                this.mapService.targetCube.position.y),
            this.measureDistance(xPosition,
                yPosition,
                startX,
                startY))
        console.log("G Cost: " + drawnNode.gCost)
        console.log("H Cost: " + drawnNode.hCost)
        console.log("F Cost: " + drawnNode.fCost)
        return drawnNode;
    }
}