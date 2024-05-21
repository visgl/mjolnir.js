import {EventManager, Pinch, Pan, MjolnirGestureEvent, MjolnirWheelEvent} from 'mjolnir.js';
import {Transform, Point} from './transform';

import './style.css';

export function renderToDOM(container: HTMLElement) {
  const border = document.createElement('div');
  border.className = 'image-viewer';

  const img = document.createElement('img');
  img.src = 'https://upload.wikimedia.org/wikipedia/commons/7/75/Planisph%C3%A6ri_c%C5%93leste.jpg';
  img.style.maxWidth = '400px';

  border.appendChild(img);

  const currState = new Transform();

  // Uncommitted changes
  let startState: Transform;
  let startCenter: Point;

  img.onload = () => {
    currState.width = img.width;
    currState.height = img.height;
    currState.centerX = border.clientWidth / 2 - img.width / 2;
    currState.centerY = border.clientHeight / 2 - img.height / 2;
    updateTransform();
  };

  function updateTransform() {
    img.style.transform = currState.toCSSTransform();
  }

  function onPinchStart(e: MjolnirGestureEvent) {
    startState = currState.clone();
    startCenter = currState.unproject(e.offsetCenter);
  }

  function onPinchMove(e: MjolnirGestureEvent) {
    currState.scale = startState.scale * e.scale;
    currState.angle = startState.angle + e.rotation;
    const center = currState.project(startCenter);
    currState.centerX += e.offsetCenter.x - center.x;
    currState.centerY += e.offsetCenter.y - center.y;
    updateTransform();
  }

  function onPanStart(e: MjolnirGestureEvent) {
    startState = currState.clone();
    startState.centerX -= e.deltaX;
    startState.centerY -= e.deltaY;
  }

  function onPanMove(e: MjolnirGestureEvent) {
    currState.centerX = startState.centerX + e.deltaX;
    currState.centerY = startState.centerY + e.deltaY;
    updateTransform();
  }

  function onWheel(e: MjolnirWheelEvent) {
    e.preventDefault();
    startCenter = currState.unproject(e.offsetCenter);
    currState.scale *= e.delta > 0 ? 1.1 : 1 / 1.1;
    const center = currState.project(startCenter);
    currState.centerX += e.offsetCenter.x - center.x;
    currState.centerY += e.offsetCenter.y - center.y;
    updateTransform();
  }

  const manager = new EventManager(border, {
    recognizers: [new Pinch(), new Pan()],
    events: {
      pinchstart: onPinchStart,
      pinchmove: onPinchMove,
      panstart: onPanStart,
      panmove: onPanMove,
      wheel: onWheel
    }
  });

  container.appendChild(border);

  return () => {
    container.removeChild(border);
    manager.destroy();
  };
}
