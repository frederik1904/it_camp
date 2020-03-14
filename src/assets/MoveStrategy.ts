import {Direction, pacmanName} from './Constants';
import {Actor} from './Actor';
import * as P5 from 'p5';
import {_Node} from './Nodes';
import {WorldBlock} from './WorldBlock';

export interface MoveStrategy {
  keyPressed(actors: Actor[], p5: P5, nodes: _Node[][], pos: P5.vector): Direction;
}

export class PacmanMoveStrategy implements MoveStrategy {
  keyPressed(actors: Actor[], p5: P5, nodes: _Node[][], pos: P5.vector): Direction {
    if (p5.keyIsDown(p5.LEFT_ARROW)) {
      return Direction.Left;
    }
    if (p5.keyIsDown(p5.RIGHT_ARROW)) {
      return Direction.Right;
    }
    if (p5.keyIsDown(p5.UP_ARROW)) {
      return Direction.Up;
    }
    if (p5.keyIsDown(p5.DOWN_ARROW)) {
      return Direction.Down;
    }
    return Direction.None;
  }
}

export class GhostMoveStrategy implements MoveStrategy {
  keyPressed(actors: Actor[], p5, nodes: _Node[][], pos: P5.vector): Direction {
    if (Math.round(Math.random() * 3) === 1) {
      let pacman: Actor;
      actors.forEach(actor => {
        if (actor.actorName === pacmanName) {
          pacman = actor;
        }
      });
      let dir = Direction.Up;
      const pacmanNode: _Node = nodes[pacman.pos.y][pacman.pos.x];
      let shortestSoFar = 1000;
      let tmp = this.lkv(pacmanNode, nodes[pos.y - 1][pos.x], [], 10000)
      if (tmp < shortestSoFar) {
        shortestSoFar = tmp;
      }
      tmp = this.lkv(pacmanNode, nodes[pos.y + 1][pos.x], [], 10000)
      if (tmp < shortestSoFar) {
        shortestSoFar = tmp
        dir = Direction.Down;
      }
      tmp = this.lkv(pacmanNode, nodes[pos.y][pos.x + 1], [], 10000)
      if (tmp < shortestSoFar) {
        shortestSoFar = tmp
        dir = Direction.Right;
      }
      tmp = this.lkv(pacmanNode, nodes[pos.y][pos.x - 1], [], 10000)
      if (tmp < shortestSoFar) {
        shortestSoFar = tmp
        dir = Direction.Left;
      }

      return dir;
    } else {
      switch (Math.floor(Math.random() * 8)) {
        case 0:
          return Direction.Down;
        case 1:
          return Direction.Up;
        case 2:
          return Direction.Left;
        case 3:
          return Direction.Right;
      }
      return Direction.None;
    }
  }
  private lkv(endNode: _Node, nextNode: _Node, beenToNodes: _Node[], shortestSoFar: number) {
    let shortestLength = 1000000;
    if (nextNode.wall) {
      return 10000;
    }
    if (endNode === nextNode) {
      return beenToNodes.length;
    }

    for (let i = 0; i < nextNode.connections.length; i++) {
      // check if road has been travelled before on this trip
      let roadTravelled = false;
      for (let j = 0; j < beenToNodes.length; j++) {
        if (beenToNodes[j].x === nextNode.connections[i].x && beenToNodes[j].y == nextNode.connections[i].y) {
          roadTravelled = true;
          break;
        }
      }

      if (!roadTravelled) {
        beenToNodes.push(nextNode);

        if (shortestSoFar > beenToNodes.length + 1) {
          const temp: number = this.lkv(endNode, nextNode.connections[i], beenToNodes, shortestSoFar);

          if (temp < shortestLength) {
            shortestSoFar = temp;
            shortestLength = temp;
          }
        }
        beenToNodes.pop();
      }
    }

    return shortestLength;
  }
}
