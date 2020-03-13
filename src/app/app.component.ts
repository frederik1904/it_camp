import {Component, OnInit} from '@angular/core';
import * as p5 from 'p5';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'itCamp';
  private p5;
  constructor() { }

  ngOnInit(): void {
    this.createCanvas();
  }

  private createCanvas(): void {
    this.p5 = new p5(this.sketch);
  }

  private sketch(p: any) {
    p.setup = () => {
      p.createCanvas(700, 600);
    };

    p.draw = () => {
      p.background(255);
      p.fill(0);
      p.rect(p.width / 2, p.height / 2, 100, 200);
    };
  }
}
