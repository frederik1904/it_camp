import {Direction, pacmanName} from './Constants';
import * as P5 from 'p5';
import {WorldBlock} from './WorldBlock';
import {_Node} from './Nodes';

export abstract class Actor {
  constructor(protected _pos: P5.vector, protected p5: P5,
              private actorName: string, protected img: any,
              protected _dir: Direction) {
  }

  get pos(): P5.vector {
    return this._pos;
  }

  set pos(value: P5.vector) {
    this._pos = value;
  }

  get dir(): Direction {
    return this._dir;
  }

  set dir(value: Direction) {
    this._dir = value;
  }

  abstract keyPressed(world: _Node[][], actors: Actor[]): Direction;
  abstract removeOnTouch(wb: WorldBlock, actors: Actor[]): boolean;
  getClassName(): string {
    return this.actorName;
  }
  draw(): void {
    this.p5.translate(this._pos.x + 0.5, this._pos.y + 0.5);
  }
}

export class Pacman extends Actor {

  draw(): void {
    super.draw();
    switch (this.dir) {
      case Direction.Down:
        this.p5.rotate(90);
        break;
      case Direction.Up:
        this.p5.rotate(270);
        break;
      case Direction.Left:
        this.p5.rotate(180);
        break;
      case Direction.Right:
        this.p5.rotate(0);
        break;
    }
    this.p5.image(this.img, 0, 0, 1, 1);
  }

  keyPressed(world: _Node[][], actors: Actor[]): Direction {
    if (this.p5.keyIsDown(this.p5.LEFT_ARROW)) {
      return Direction.Left;
    }
    if (this.p5.keyIsDown(this.p5.RIGHT_ARROW)) {
      return Direction.Right;
    }
    if (this.p5.keyIsDown(this.p5.UP_ARROW)) {
      return Direction.Up;
    }
    if (this.p5.keyIsDown(this.p5.DOWN_ARROW)) {
      return Direction.Down;
    }
    return Direction.None;
  }

  removeOnTouch(wb: WorldBlock, actors: Actor[]): boolean {
    return wb.eatCheese();
  }
}
