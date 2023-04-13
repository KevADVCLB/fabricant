

import {vertex} from './shader/vertex.js';
import {fragment} from './shader/fragment.js';
import ColorPass from './ColorPass/ColorPass.js';
import FeedbackTexture from './FeedbackTexture/FeedbackTexture.js';
import DualFilterBlurPass from './dualFilterBlurPass/dualFilterBlurPass.js';
import {Mesh, Plane, Program} from 'ogl';

/**
 * @param gl
 */
export default class Background extends Mesh {

    constructor(gl, {camera, circleAnchorPoints}) {

        super(gl)

        this.gl = gl;

        this.camera = camera;

        this.initColorPass({circleAnchorPoints});
        this.initFeedbackPass();
        this.initBlurPass();
        this.initGeometry();
        this.initMaterial();
        this.renderOrder = 0;
    }

    initColorPass({circleAnchorPoints}) {

        this.colorPass = new ColorPass(this.gl, {
            circleAnchorPoints,
            camera: this.camera
        });

    }

    initFeedbackPass() {

        this.feedbackTexture = new FeedbackTexture(this.gl, {
            width: 256,
            height: 256
        });

    }

    initBlurPass() {

        this.blurPass = new DualFilterBlurPass(this.gl, {
            width: this.gl.canvas.clientWidth,
            height: this.gl.canvas.clientHeight,
        });
    }

  initGeometry() {

        this.geometry = new Plane(this.gl, {width: 2, height: 2});

    }

    initMaterial() {

        const uniforms = {
         _OutPut: {
             value: this.blurPass.Output
         },
         _Time: {
             value: 0
         }
        }


        this.program = new Program(this.gl, {
            uniforms,
            vertex,
            fragment,
            cullFace: null,
            depthTest: false,
            depthWrite: false
        });

    }

    update({time, mapTransform, inputDelta}) {


      this.colorPass.update({mapTransform, time})
      this.feedbackTexture.update({time, inputDelta, inputPass: this.colorPass.Texture});
      this.blurPass.render({scene: this.feedbackTexture.Texture, time});

      this.program.uniforms._OutPut.value = this.blurPass.Output;
    //   this.program.uniforms._OutPut.value = this.feedbackTexture.Texture;
    //   this.program.uniforms._OutPut.value = this.colorPass.Texture;
      this.program.uniforms._Time.value = time;

    }

    onResize() {

      this.colorPass.onResize();
      this.blurPass.onResize({width: this.gl.canvas.clientWidth, height: this.gl.canvas.clientHeight});

    }

}
