import {Direction, pacmanName} from './Constants';
import * as P5 from 'p5';
import {WorldBlock} from './WorldBlock';
import {_Node} from './Nodes';
import {MoveStrategy} from './MoveStrategy';

export abstract class Actor {
  constructor(protected _pos: P5.vector, protected p5: P5,
              private _actorName: string, protected img: any,
              protected _dir: Direction, protected moveStrategy: MoveStrategy) {
  }

  get actorName(): string {
    return this._actorName;
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

  keyPressed(world: _Node[][], actors: Actor[]): Direction {
    return this.moveStrategy.keyPressed(actors, this.p5, world, this.pos);
  }
  abstract removeOnTouch(wb: WorldBlock, actors: Actor[]): boolean;

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

  removeOnTouch(wb: WorldBlock, actors: Actor[]): boolean {
    return wb.eatCheese();
  }
}

export class Ghost extends Actor {
  removeOnTouch(wb: WorldBlock, actors: Actor[]): boolean {
    for (let i = 0; i < actors.length; i++) {
      if (this.pos.equals(actors[i].pos)
        && actors[i].actorName === pacmanName) {
        return true;
      }
    }

    return false;
  }

  draw(): void {
    super.draw();
    this.p5.image(this.img, 0, 0, 1, 1);
  }
}
