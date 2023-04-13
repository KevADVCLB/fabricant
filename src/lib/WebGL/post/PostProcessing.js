
import BlurPass from '../utils/blurPass/blurPass.js';
import {output} from './output.js';
import {Post, Texture} from 'ogl';

export default class PostProcessing {

    constructor(gl) {

        this.gl = gl;

        this.initBlurPass();
        this.initOutputPass();

    }

    initBlurPass() {

        this.blurPass = new BlurPass(this.gl, {
            width: this.gl.canvas.clientWidth,
            height: this.gl.canvas.clientHeight,
            scale: 1.0,
            initBlurScale: 0
        });

    }

    initOutputPass() {

        this.outputPass = new Post(this.gl, {
            width: this.gl.canvas.width,
            height: this.gl.canvas.height
        });

        const uniforms = {
            _BlurPass: {
                value: this.blurPass.Output
            },
            _Image: {
                value: new Texture(this.gl)
            },
            _Time: {
                value: 0
            },
            _BlurPhase: {
                value: 0
            }
        }
        this.outputPass.addPass({
            uniforms,
            fragment: output
        })

    }

    render({scene, time, phase}) {

        this.blurPass.render({target: scene.texture, time, blurScale: phase, stepCount: 8});
        this.outputPass.passes[0].program.uniforms._BlurPass.value = this.blurPass.Output;
        this.outputPass.passes[0].program.uniforms._Image.value = scene.texture;
        this.outputPass.passes[0].program.uniforms._Time.value = time;
        this.outputPass.passes[0].program.uniforms._BlurPhase.value = phase;
        this.outputPass.render({scene: this.outputPass.passes[0].mesh});

    }

    onResize({width, height}) {
        this.blurPass.onResize({width: width, height: height});
    }

}
