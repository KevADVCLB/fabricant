
import RenderingImage from './domQuad/RenderingImage.js';
import RenderingImageSequence from './domQuad/RenderingImageSequence.js';
import {calcViewportSize} from "../utils/calcViewportSize.js";

import {QUAD_TYPE, MAP_TRANSFORM} from '$lib/_globals.js';
import {Plane, Transform, Vec2} from 'ogl';


export default class DomQuadManager extends Transform {

    constructor(gl, {camera}) {

        super();

        this.gl = gl;

        this.camera = camera;
        this.gl.cameraViewplaneSize = new Vec2(2.0, 2.0);
        this.updateDomToGlRelations({camera: this.camera});

        //in this project, we are drawing a background quad,
        //followed by particles. To ensure the quads are being drawn on top always,
        //we have to offset from the last background element's draw order (which is also manually set)
        this.quadRenderOrder = 2;

        this.initGeometry();

        this.matrixAutoUpdate = false;
        this.updateMatrixWorld();

    }

    initGeometry() {

        this.planeGeometry = new Plane(this.gl, {
            width: 2,
            height: 2,
            widthSegments: 1,
            heightSegments: 1
        });
    }

    createQuad({id, type, domElement}) {

        //if ID matches exisiting quad's id, then it already exists
        //so there is no need to create a new quad
        for(let i = 0; i < this.Quads.length; i++) {
            if(this.Quads[i].id === id) return;
        }

        let quad;

        switch(type) {
            case QUAD_TYPE.image: {
                quad = new RenderingImage(this.gl, id, {
                    domElement,
                    geometry: this.planeGeometry,
                    renderOrder: this.quadRenderOrder
                });
            }
            break;

            case QUAD_TYPE.imageSequence: {
                quad = new RenderingImageSequence(this.gl, id, {
                    domElement,
                    geometry: this.planeGeometry,
                    renderOrder: this.quadRenderOrder
                });
            }
            break;
            default: {
                console.error('provided quad type does not exist. quad could not be constructed')
            }
        }

        quad.matrixAutoUpdate = false;
        quad.setParent(this);
        quad.updateMatrixWorld();

        this.quadRenderOrder++;

    }

    //acquire the current canvas's dimensions and calculate
    //the size of viewport based on the camera's frustum
    updateDomToGlRelations({
        camera
      }) {

        this.w = this.gl.canvas.clientWidth;
        this.h = this.gl.canvas.clientHeight;

        this.wK = 1.0 / this.w;
        this.hK = 1.0 / this.h;
        this.gl.cameraViewplaneSize.copy(calcViewportSize(this.camera));

      }

    hideQuads() {

        this.Quads.forEach((quad) => {
            quad.hide();
        });

    }

    revealQuads() {

        this.Quads.forEach((quad) => {
            quad.reveal();
        });

    }

    update({time, mapTransform, delta, imageElements}) {

        if(this.Quads.length > 0) {

            this.Quads.forEach((quad, i) => {

                quad.visible = quad.isRenderable() ? true : false;

                quad.updateDimensions({canvasWidth: this.w, canvasHeight: this.h, mapTransform});

                quad.calcDomToWebGLPos({mapTransform, canvasWidth: this.w, canvasHeight: this.h, mapPosition: imageElements[i].currentPos});
                quad.update({time, delta});

            });

        }

    }

    onResize() {

        this.updateMatrixWorld();
        this.updateDomToGlRelations({camera: this.camera});
        this.Quads.forEach((quad, i) => {
            quad.onResize();
            quad.updateMatrixWorld();
        });

    }

    get Quads() {
        return this.children;
    }

}
