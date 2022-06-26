import {
  distance,
  getRandomColor,
  randomIntFromRange,
  collision,
} from "./lib/utils";
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

export class Particle {
  x: number;
  y: number;
  radius: number;
  color: string | CanvasGradient | CanvasPattern;
  velocity: {
    x: number;
    y: number;
  };
  mass: number;
  alpha: number;

  constructor(
    x: number,
    y: number,
    radius: number,
    color: string | CanvasGradient | CanvasPattern,
    mass: number
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = {
      x: (Math.random() - 0.5) * 5,
      y: (Math.random() - 0.5) * 5,
    };
    this.mass = mass;
    this.radius = radius;
    this.alpha = 0;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.save();
    c.globalAlpha = this.alpha;
    c.fillStyle = this.color;
    c.fill();
    c.restore();
    c.strokeStyle = this.color;
    c.stroke();
    c.closePath();
  }

  update(particles: Particle[]) {
    if (
      canvas &&
      (this.x <= 0 + this.radius || this.x >= canvas.width - this.radius)
    ) {
      this.velocity.x = -this.velocity.x;
    }

    if (
      canvas &&
      (this.y <= 0 + this.radius || this.y >= canvas.height - this.radius)
    ) {
      this.velocity.y = -this.velocity.y;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    particles.forEach((particle) => {
      if (particle === this) return;

      if (
        distance(this.x, this.y, particle.x, particle.y) -
          (this.radius + particle.radius) <
        0
      ) {
        collision(this, particle, 1);
      }
    });

    if (distance(mouse.x, mouse.y, this.x, this.y) < 50 && this.alpha < 0.3) {
      this.alpha += 0.05;
    } else if (this.alpha > 0) {
      this.alpha -= 0.05;

      this.alpha = Math.max(0, this.alpha);
    }

    this.draw();
  }
}

/**
 * Implementation
 */

let particles: Particle[];

const init = () => {
  particles = [];

  const maxRadius = 20;
  const maxParticles =
    (canvas.width * canvas.height) / (Math.PI * Math.pow(maxRadius, 2));

  for (let i = 0; i < maxParticles; i++) {
    const mass = Math.random();
    const radius = maxRadius * mass;
    let x = randomIntFromRange(radius, canvas.width - radius);
    let y = randomIntFromRange(radius, canvas.height - radius);
    const color = getRandomColor(0.01);

    if (i !== 0) {
      for (let j = 0; j < particles.length; j++) {
        if (
          distance(x, y, particles[j].x, particles[j].y) -
            (radius + particles[j].radius) <
          0
        ) {
          x = randomIntFromRange(radius, canvas.width - radius);
          y = randomIntFromRange(radius, canvas.height - radius);

          j = -1;
        }
      }
    }

    particles.push(new Particle(x, y, radius, color, mass));
  }
};

const animate = () => {
  requestAnimationFrame(animate);
  // c.clearRect(0, 0, canvas.width, canvas.height);

  c.font = `${canvas.width / 15}px serif`;
  c.textAlign = "center";
  c.strokeStyle = "rgba(0, 0 , 0, 0.02)"
  c.strokeText("HTML Canvas Boilerplate", canvas.width / 2, canvas.height / 2);

  particles.forEach((object: Particle) => object.update(particles));
};

init();
animate();
