export type Point = {
  x: number;
  y: number;
};

export class Transform {
  width: number = 0;
  height: number = 0;
  scale: number = 1;
  angle: number = 0;
  centerX: number = 0;
  centerY: number = 0;

  clone(): Transform {
    const t = new Transform();
    t.width = this.width;
    t.height = this.height;
    t.scale = this.scale;
    t.angle = this.angle;
    t.centerX = this.centerX;
    t.centerY = this.centerY;
    return t;
  }

  /** From image-space coordinates to screen-space coordinates */
  project({x, y}: Point): Point {
    x -= this.width / 2;
    y -= this.height / 2;
    const p1 = rotate({x, y}, this.angle);
    p1.x = p1.x * this.scale + this.centerX + this.width / 2;
    p1.y = p1.y * this.scale + this.centerY + this.height / 2;

    return p1;
  }

  /** From screen-space coordinates to image-space coordinates */
  unproject({x, y}: Point): Point {
    x = (x - this.centerX - this.width / 2) / this.scale;
    y = (y - this.centerY - this.height / 2) / this.scale;
    const p1 = rotate({x, y}, -this.angle);
    p1.x += this.width / 2;
    p1.y += this.height / 2;

    return p1;
  }

  /** Convert to CSS transform prop value */
  toCSSTransform(): string {
    return `translate(${this.centerX}px, ${this.centerY}px) scale(${this.scale}) rotate(${this.angle}deg)`;
  }
}

function rotate(p: Point, angle: number): Point {
  const r = (angle * Math.PI) / 180;
  const x = p.x * Math.cos(r) - p.y * Math.sin(r);
  const y = p.x * Math.sin(r) + p.y * Math.cos(r);
  return {x, y};
}
