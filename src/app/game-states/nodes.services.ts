import { MapService } from './map.services';
import { Injectable } from '@angular/core';
import { Path, Vector2, BufferGeometry, LineBasicMaterial, Line } from 'three';
import { Node } from '../models/nodes';

@Injectable({ providedIn: 'root' })
export class NodeService {

    nodes: Node[] = new Array();
    lastNodeId: number = 0;

    constructor(private mapService: MapService) {
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
        const line = new Line(geometry, material).computeLineDistances();
        this.mapService.scene.add(line)
        var rawdistance = line.geometry.attributes.lineDistance.getX(line.geometry.attributes.lineDistance.count - 1);
        return Math.round(rawdistance * 100) / 100
    }

    generateNeighbourNodes(node: Node, withDiagonals: boolean = true): Node[] {
        var neighbours: Node[] = Array();

        var newNodeXPos = node.xPos;
        var newNodeYPos = node.yPos + this.mapService.pixelSize;
        neighbours.push(this.getNodeAtXY(newNodeXPos, newNodeYPos, node))

        newNodeXPos = node.xPos + this.mapService.pixelSize;
        newNodeYPos = node.yPos;
        neighbours.push(this.getNodeAtXY(newNodeXPos, newNodeYPos, node))

        newNodeXPos = node.xPos - this.mapService.pixelSize;
        newNodeYPos = node.yPos;
        neighbours.push(this.getNodeAtXY(newNodeXPos, newNodeYPos, node))

        newNodeXPos = node.xPos;
        newNodeYPos = node.yPos - this.mapService.pixelSize;
        neighbours.push(this.getNodeAtXY(newNodeXPos, newNodeYPos, node))

        if (withDiagonals) {

            newNodeXPos = node.xPos - this.mapService.pixelSize;
            newNodeYPos = node.yPos - this.mapService.pixelSize;
            neighbours.push(this.getNodeAtXY(newNodeXPos, newNodeYPos, node))

            newNodeXPos = node.xPos + this.mapService.pixelSize;
            newNodeYPos = node.yPos - this.mapService.pixelSize;
            neighbours.push(this.getNodeAtXY(newNodeXPos, newNodeYPos, node))

            newNodeXPos = node.xPos - this.mapService.pixelSize;
            newNodeYPos = node.yPos + this.mapService.pixelSize;
            neighbours.push(this.getNodeAtXY(newNodeXPos, newNodeYPos, node))

            newNodeXPos = node.xPos + this.mapService.pixelSize
            newNodeYPos = node.yPos + this.mapService.pixelSize;
            neighbours.push(this.getNodeAtXY(newNodeXPos, newNodeYPos, node))
        }

        return neighbours;
    }

    getNodeAtXY(x, y, parentNode): Node {
        this.nodes.forEach(node => {
            if (node.xPos == x && node.yPos == y) {
                return node;
            }
        });
        return this.createNodeAtWithParent(x, y, parentNode)
    }

    creatStartNode(): Node {
        this.lastNodeId += 1;

        return new Node(this.mapService.startTile,
            this.lastNodeId,
            null,
            this.mapService.startTile.mesh.position.x,
            this.mapService.startTile.mesh.position.y,
            200,
            200,
            200);
    }

    createNodeAtWithParent(x, y, parentNode): Node {
        this.lastNodeId += 1;

        // The HCOST is how much it costs to get to the current position from start via parents..
        // First how much does it cost to get from parent to this position -
        // var hCost = this.measureDistance(x,
        //     y,
        //     parentNode.xPos,
        //     parentNode.yPos);
        var hCost = 1;

        var diff = Math.abs((x+y) - (parentNode.xPos + parentNode.yPos))

        // if (diff == 1) {
        //     hCost = 1;
        // } else if (diff == 2){
        //     hCost = 1.22
        // }

        // We then add it to the parents HCost and this is our own hcost to get to this point.
        if (parentNode.tile != this.mapService.startTile) {
            hCost += parentNode.hCost;
        }

        // The G Cost is the euclidian distance from here to the target.
        var gCost = this.measureDistance(x,
            y,
            this.mapService.targetTile.mesh.position.x,
            this.mapService.targetTile.mesh.position.y);

        //The F Cost is hCost + GCost.
        var fCost = hCost + gCost;

        //Create the new node.
        var drawnNode = new Node(
            this.mapService.getTileAt(x, y),
            this.lastNodeId,
            parentNode,
            x,
            y,
            hCost,
            gCost,
            fCost)

        this.nodes.push(drawnNode);
        return drawnNode;
    }
}