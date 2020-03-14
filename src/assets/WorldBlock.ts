import * as P5 from 'p5';
import { Cheese} from './Cheese';
import { Wall } from './Wall';

export class WorldBlock {
  // tslint:disable-next-line:variable-name
  constructor(private _cheese: Cheese, private _wall: Wall, private _p5: P5, private pos: P5.vector) {}

  get cheese(): Cheese {
    return this._cheese;
  }

  set cheese(value: Cheese) {
    this._cheese = value;
  }

  get wall(): Wall {
    return this._wall;
  }

  set wall(value: Wall) {
    this._wall = value;
  }

  createCheese() {
    if (this.wall == null) {
      this.cheese = new Cheese();
    }
  }

  isMovable() {
    return this.wall == null;
  }

  hasCheese() {
    return this.cheese != null && this.wall == null;
  }

  eatCheese() {
    const tmp = this.cheese;
    this.cheese = null;
    return tmp != null;
  }

  public draw(): void {
    this._p5.noStroke();
    if (this.wall != null) {
      this._p5.fill(0, 0, 0);
      this._p5.rect(this.pos.x, this.pos.y, 1, 1);
    }
    if (this.cheese != null) {
      this._p5.fill(252, 190, 3);
      this._p5.circle(this.pos.x + 0.5, this.pos.y + 0.5, 0.3);
    }
  }
}

