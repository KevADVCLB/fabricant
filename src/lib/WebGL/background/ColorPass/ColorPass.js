import {vertex} from './shader/vertex.js';
import {fragment} from './shader/fragment.js';


import {calcViewportSize} from '../../utils/calcViewportSize.js';
import {calcAspect} from '../../utils/calcAspect.js';

import {BACKGORUND_GRADIENT_SRC} from '$lib/_globals.js';
import {Geometry, Mesh, Plane, Program, RenderTarget, Texture, Transform, Vec2} from 'ogl';

export default class ColorPass {

    constructor(gl,{
        circleAnchorPoints,
        camera
    }) {

        this.gl = gl;

        this.camera = camera;

        this.scene = new Transform();


        this.viewplaneSize = new Vec2(1.0, 1.0);

        this.textureScale = 0.5;


        this.initAnchorPoints({circleAnchorPoints});
        this.calcViewplaneSize();
        this.initCirclesMesh();
        // this.initDistanceFieldPass();


    }

    initAnchorPoints({circleAnchorPoints}) {

        this.circleAnchorPoints = null;
        this.copyCircleAnchorPoints({circleAnchorPoints});

        this.circleWebGLAnchorPoints = [];

        for(let i = 0; i < this.circleAnchorPoints.length; i++) {
            this.circleWebGLAnchorPoints[i] = new Vec2(0,0);
        }

    }

    calcViewplaneSize() {

        this.w = this.gl.canvas.clientWidth;
        this.h = this.gl.canvas.clientHeight;

        this.viewplaneSize.copy(calcViewportSize(this.camera));

      }

      //calculate the anchor points dom position to a point on the camera's
      //viewplane akin to how the domQuads position is being determined
    calcAnchorWebGLPos({mapTransform}) {

        if(this.circleWebGLAnchorPoints.length === 0) return;

        for(let i = 0; i < this.circleWebGLAnchorPoints.length; i++) {

        const {x, y} = this.circleAnchorPoints[i];

        const domAnchorX = (x * mapTransform.scale);
        const domAnchorY = (y * mapTransform.scale);

        let posPhaseX =
            2.0 * ((mapTransform.x + domAnchorX) / this.w) - 1.0;
        let posPhaseY =
            2.0 * ((mapTransform.y + domAnchorY)/ this.h) - 1.0;

            this.circleWebGLAnchorPoints[i].set(
                posPhaseX * this.gl.cameraViewplaneSize.x,
                posPhaseY * this.gl.cameraViewplaneSize.y * -1.0
                );

        }


    }

    initCirclesMesh() {

        const refGeometry = new Plane(this.gl, {
            width: 2,
            height: 2,
            widthSegments: 84,
            heightSegments: 84
        });

        const {position, uv, index} = refGeometry.attributes;
        const localPositionData = position.data;
        const uvData = uv.data;
        const indexData = index.data;

        const worldPositionIndexData = new Float32Array(this.circleWebGLAnchorPoints.length);

            for(let i = 0; i < this.circleWebGLAnchorPoints.length; i++) {
            // for(let i = this.circleWebGLAnchorPoints.length-1; i >= 0; i--) {
            worldPositionIndexData[i] = i;
        }

        const colorParamData = new Float32Array(this.circleWebGLAnchorPoints.length * 3.0);
        let colorParamDataIterator = 0;

        for(let i = 0; i < colorParamData.length; i++) {

            colorParamData[colorParamDataIterator++] = i;
            colorParamData[colorParamDataIterator++] = Math.random()*100.0;
            colorParamData[colorParamDataIterator++] = Math.random();

        }

        const geometry = new Geometry(this.gl, {

            position: {
                size: 3,
                data: localPositionData
            },
            worldPositionIndex: {
                instanced: 1,
                size: 1,
                data: worldPositionIndexData
            },
            uv: {
                size: 2,
                data: uvData
            },
            colorParams: {
                size: 3,
                instanced: 1,
                data: colorParamData
            },
            index: {
                data: indexData
            }

        });

        const gradient = new Image();
        gradient.crossOrigin = "*";
        gradient.src = BACKGORUND_GRADIENT_SRC;

        const gradientTexture = new Texture(this.gl, {
          generateMipmaps: false,
          format: this.gl.RGB,
          internalFormat: this.gl.RGB
        });

        gradient.onload = () => gradientTexture.image = gradient;

        const uniforms = {
            _AnchorPoints: {
                value: this.circleWebGLAnchorPoints
            },
            _ViewplaneSize: {
                value: this.viewplaneSize
              },
              _Gradient: {
                value: gradientTexture
              },
              _Resolution: {
                value: new Vec2(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight)
              },
              _Aspect: {
                  value: calcAspect({width: this.gl.canvas.clientWidth, height: this.gl.canvas.clientHeight})
              },
              _Time: {
                value: 0
              },
              _Feedback: {
                  value: new Texture(this.gl)
              }
        }

        const program = new Program(this.gl, {
            uniforms,
            vertex,
            fragment,
            depthTest: false,
            depthWrite: false,
            transparent: false,
            cullFace: null

        });

        program.setBlendFunc(this.gl.ONE, this.gl.ONE);

        this.circles = new Mesh(this.gl, {
            geometry,
            program
        });

        this.circles.setParent(this.scene);

    }

    blit() {
        this.gl.renderer.render({scene: this.scene, camera: this.camera, target: this.distanceFieldTexture});
    }

    updateDistanceFieldPass({mapTransform, time}) {

        this.calcAnchorWebGLPos({mapTransform});
        this.circles.program.uniforms._ViewplaneSize.value.copy(this.viewplaneSize);
        this.circles.program.uniforms._AnchorPoints.value = this.circleWebGLAnchorPoints;
        this.circles.program.uniforms._Time.value = time;


    }

    update({mapTransform, time, texture}) {

        // this.circles.program.uniforms._Feedback.value = texture;

        this.updateDistanceFieldPass({mapTransform, time});
        this.blit();

    }

    onResize() {

        this.calcViewplaneSize();
        this.circles.program.uniforms._Resolution.value.set(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight);
        this.circles.program.uniforms._Aspect.value.copy(calcAspect({width: this.gl.canvas.clientWidth, height: this.gl.canvas.clientHeight}));
        this.distanceFieldTexture = this.createRenderTarget();

    }

    createRenderTarget() {

        return new RenderTarget(this.gl, {
            width: (this.gl.canvas.clientWidth * this.textureScale) ,
            height: (this.gl.canvas.clientHeight * this.textureScale) ,
            wrapS: this.gl.CLAMP_TO_EDGE,
            wrapT: this.gl.CLAMP_TO_EDGE,
            format: this.gl.RGB,
            internalFormat: this.gl.RGB
        });

    }

    copyCircleAnchorPoints({circleAnchorPoints}) {
        this.circleAnchorPoints = circleAnchorPoints.slice();
    }

    get Texture() {
        return this.distanceFieldTexture.texture;
    }

}
