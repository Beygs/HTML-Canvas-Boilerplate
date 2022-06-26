import { getRandomColor } from "./lib/utils";
import "./style.css";

/**
 * Base
 */

const canvas = document.querySelector("canvas");

if (!canvas) throw new Error("Oups! There was an issue!");

const c = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/**
 * Variables
 */

const mouse = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

/**
 * Event Listeners
 */

document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
});

/**
 * Objects
 */

class Circle {
  x: number;
  y: number;
  radius: number;
  color: string | CanvasGradient | CanvasPattern;
  dx?: number;
  dy?: number;

  constructor(
    x: number,
    y: number,
    radius: number,
    color: string | CanvasGradient | CanvasPattern,
    dx: number | undefined,
    dy: number | undefined
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = dx;
    this.dy = dy;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    if (
      canvas && this.dx &&
      (this.x <= 0 + this.radius / 2 || this.x >= canvas.width - this.radius / 2)
    ) {
      this.dx = -this.dx;
    }

    if (
      canvas && this.dy &&
      (this.y <= 0 + this.radius / 2 || this.y >= canvas.height - this.radius / 2)
    ) {
      this.dy = -this.dy;
    }

    this.x += this.dx ?? 0;
    this.y += this.dy ?? 0;
    this.draw();
  }
}

/**
 * Implementation
 */

let objects: Circle[];

const init = () => {
  objects = [];

  for (let i = 0; i < 400; i++) {
    const radius = Math.random() * 30;
    const x = (radius / 2) + (Math.random() * (canvas.width - radius));
    const y = (radius / 2) + (Math.random() * (canvas.height - radius));
    const color = getRandomColor(0.1);
    const dx = Math.random() - 0.5;
    const dy = Math.random() - 0.5;

    objects.push(new Circle(x, y, radius, color, dx, dy));
  }
};

const animate = () => {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "black";
  c.fillText("HTML CANVAS BOILERPLATE", mouse.x, mouse.y);

  objects.forEach((object: Circle) => object.update());
};

init();
animate();
