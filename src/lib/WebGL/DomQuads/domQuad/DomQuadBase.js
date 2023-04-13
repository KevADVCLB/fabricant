/**
 * GOTCHA: THIS CLASS HAS BEEN CATERED FOR THIS PROJECT'S
 * SOLUTION OF DRAWING DOM REPRESENTATIONS IN WEBGL.
 *
 * USUALLY YOU'D DRAW QUADS BASED ON THE ELEMENTS BOUNDING RECTS
 * BUT FOR THIS PROJECT, THE SIZES AND POSITIONS ARE ALREADY KNOWN
 * SO WE DO NOT NEED AN ELEMENTS BOUNDING RECTANGLES
 *
 */
import {Mesh, Vec2} from 'ogl';


export default class DomQuadBase extends Mesh {
  constructor(gl, {id, domElement}) {

    super(gl);

    this.gl = gl;

    this.id = id;
    this.domElement = domElement;
    this.rect = {width: domElement.width, height: domElement.height, top: domElement.y, left: domElement.x};

    this.viewPlaneSize = new Vec2(1.0, 1.0);
    this.viewPlanePos = new Vec2(0.0, 0.0);
    this.scaleOffset = new Vec2(1.0, 1.0);

    this.inViewCheckOffsetScale = 0.5;


  }

  updateDimensions({canvasWidth, canvasHeight, mapTransform}) {

    if (this.domElement === null) return;

    let {
      width,
      height
    } = this.rect;

    let viewportScaleX = (width * mapTransform.scale) / canvasWidth;
    let viewportScaleY = (height * mapTransform.scale) / canvasHeight;

    this.viewPlaneSize.x = this.gl.cameraViewplaneSize.x * viewportScaleX;
    this.viewPlaneSize.y = this.gl.cameraViewplaneSize.y * viewportScaleY;

  }


  calcDomToWebGLPos({canvasWidth, canvasHeight, mapPosition}) {

    if (this.domElement === null) return;

    const domAnchorX = mapPosition.x;
    const domAnchorY = mapPosition.y;

    let posPhaseX = 2.0 * ((domAnchorX) / canvasWidth) - 1.0;
    let posPhaseY = 2.0 * ((domAnchorY)/ canvasHeight) - 1.0;

    this.viewPlanePos.x = posPhaseX * this.gl.cameraViewplaneSize.x;
    this.viewPlanePos.y = posPhaseY * this.gl.cameraViewplaneSize.y * -1.0;

  }

  //checks if centers are inside the viewport! Useful for nice reveals, transitions etc.
  inView() {

    const inBoundsX = (this.viewPlanePos.x + this.viewPlaneSize.x * this.inViewCheckOffsetScale) > (-this.gl.cameraViewplaneSize.x) && (this.viewPlanePos.x - this.viewPlaneSize.x * this.inViewCheckOffsetScale) < this.gl.cameraViewplaneSize.x;
    const inBoundsY = (this.viewPlanePos.y + this.viewPlaneSize.y * this.inViewCheckOffsetScale) > (-this.gl.cameraViewplaneSize.y) && (this.viewPlanePos.y - this.viewPlaneSize.y * this.inViewCheckOffsetScale) < this.gl.cameraViewplaneSize.y;

    return inBoundsX && inBoundsY;

  }

  //because the quads are considiered to be a size of 1 and not transforming on the CPU, we end up
  //with unwanted quads invoking drawcalls. To fix this, we manually check if quads are inside
  //the viewpoert and toggle visibility (which is the first check the renderer does before queing a given mesh for drawing)

  isRenderable() {

    const inFrustumX = (this.viewPlanePos.x + this.viewPlaneSize.x) > (-this.gl.cameraViewplaneSize.x) && (this.viewPlanePos.x - this.viewPlaneSize.x) < this.gl.cameraViewplaneSize.x;
    const inFrustumY = (this.viewPlanePos.y + this.viewPlaneSize.y) > (-this.gl.cameraViewplaneSize.y) && (this.viewPlanePos.y - this.viewPlaneSize.y) < this.gl.cameraViewplaneSize.y;

    return inFrustumX && inFrustumY;

  }

  //virtual methods
  hide() {}
  reveal() {}

  updateBounds() {}

}
