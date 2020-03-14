import {Component, OnInit} from '@angular/core';
import * as p5 from 'p5';
import {Actor, Pacman} from '../assets/Actor';
import {Direction, frameRate, ghostImage, height, heightBlock, pacmanImgUrl, pacmanName, width, widthBlock} from '../assets/Constants';
import {WorldBlock} from '../assets/WorldBlock';
import {Wall} from '../assets/Wall';
import {_Node} from '../assets/Nodes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'itCamp';
  private p5;

  constructor() {
  }

  ngOnInit(): void {
    this.createCanvas();
  }

  private createCanvas(): void {
    this.p5 = new p5(this.sketch);
  }

  private sketch(p5: any) {
    const world: WorldBlock[][] = [];
    const nodes: _Node[][] = [];
    const actors: Actor[] = [];
    let pacman;
    let ghost;


    p5.setup = () => {
      p5.createCanvas(width, height);
      p5.pixelDensity(1);
      p5.frameRate(frameRate);

      pacman = p5.loadImage(pacmanImgUrl);
      ghost = p5.loadImage(ghostImage);

      createWorld();
    };

    p5.draw = () => {
      p5.scale(width / widthBlock, height / heightBlock);
      p5.background(220);
      p5.push();
      p5.imageMode(p5.CENTER);
      p5.angleMode(p5.DEGREES);
      actors.forEach(a => {
        moveIfPossibleInDirection(a);
        a.draw();
      });
      p5.pop();
      world.forEach(row => row.forEach(col => col.draw()));
    };

    function createWorld(): void {
      for (let y = 0; y < heightBlock; y++) {
        world[y] = [];
        for (let x = 0; x < widthBlock; x++) {
          world[y][x] = new WorldBlock(null, null, p5, p5.createVector(x, y));
        }
      }
      createWalls();
      createCheese();
      createActors();
    }

    function createWalls() {
      const walls: number[][] = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      ];

      for (let y = 0; y < walls.length; y++) {
        for (let x = 0; x < walls[y].length; x++) {
          if (walls[y][x] === 1) {
            world[y][x].wall = new Wall();
          }
        }
      }

      for (let y = 0; y < walls.length; y++) {
        nodes[y] = [];
        for (let x = 0; x < walls[y].length; x++) {
          nodes[y][x] = new _Node(x, y, [], walls[y][x] == 1);
        }
      }

      for (let y = 1; y < walls.length - 1; y++) {
        for (let x = 1; x < walls[y].length - 1; x++) {
          if (walls[y + 1][x] == 0) {
            nodes[y][x].connections.push(nodes[y + 1][x]);
          }
          if (walls[y - 1][x] == 0) {
            nodes[y][x].connections.push(nodes[y - 1][x]);
          }
          if (walls[y][x + 1] == 0) {
            nodes[y][x].connections.push(nodes[y][x + 1]);
          }
          if (walls[y][x - 1] == 0) {
            nodes[y][x].connections.push(nodes[y][x - 1]);
          }
        }
      }
    }

    function createCheese() {
      for (let y = 0; y < world.length; y++) {
        for (let x = 0; x < world[y].length; x++) {
          world[y][x].createCheese();
        }
      }
    }

    function createActors() {
      // Add pacman to the game
      actors.push(new Pacman(new p5.createVector(12, 13), p5, pacmanName, pacman, Direction.Right));

      // Add ghosts to the game
    }

    function moveIfPossibleInDirection(actor: Actor) {
      let x: number = actor.pos.x;
      let y: number = actor.pos.y;
      const dir: Direction = actor.keyPressed(nodes, actors);
      actor.dir = dir === Direction.None ? actor.dir : dir;

      switch (dir) {
        case Direction.Down: {
          if (world[y + 1][x].isMovable()) {
            y += 1;
          }
          break;
        }
        case Direction.Left: {
          if (world[y][x - 1].isMovable()) {
            x -= 1;
          }
          break;
        }
        case Direction.Right: {
          if (world[y][x + 1].isMovable()) {
            x += 1;
          }
          break;
        }
        case Direction.Up: {
          if (world[y - 1][x].isMovable()) {
            y -= 1;
          }
          break;
        }
      }
      actor.pos = p5.createVector(x, y);
      actor.removeOnTouch(world[y][x], actors);
    }
  }
}
