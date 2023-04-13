

import {vertex} from './shader/vertex.js'
import {blur} from './shader/blur.js'
import {blur_noDither} from './shader/blur_noDither'
import {Mesh, Program, RenderTarget, Triangle, Vec2} from 'ogl';


//FIX WIDTH AND HEIGHT ARGUMENT. WILL CAUSE PROBLEMS WITH RESIZE
export default class BlurPass {

    constructor(gl, {
        width,
        height,
        applyDither = true,
        scale = 0.25,
        initBlurScale = 0.0
    }) {

        this.gl = gl;

        this.scale = scale;

        this.width = width === null ? this.gl.canvas.width : width
        this.height = height === null ? this.gl.canvas.height : height

        this.init({applyDither});
        this.initCaptureTexture();

    }

    init({applyDither, initBlurScale}) {

        this.createBlurBuffers();

        const uniforms = {

                _Image: {
                    value: this.blurTextureRead.texture
                },
                _StepSize: {
                    value: 0.5
                },
                _Time: {
                    value: 0
                },
                _Resolution: {
                    value: new Vec2(this.width*this.scale, this.height*this.scale)
                },
                _Seed: {
                    value: 0
                },
                _Scale: {
                    value: initBlurScale
                }
        }

        this.pass = new Mesh(this.gl, {
            geometry: new Triangle(this.gl),
            program: new Program(this.gl, {
                vertex,
                fragment: applyDither ? blur : blur_noDither,
                uniforms,
                transparent: false,
                depthTest: false,
                depthWrite: false
            })
        });

    }

    initCaptureTexture() {

        this.captureTarget = new RenderTarget(this.gl, {
            width: this.width*0.5,
            height: this.height*0.5
        });

    }

    render({scene = null, target = null, depth = null, time, blurScale = 0.0, stepCount = 1}) {

        if(target === null && scene) {
            this.gl.renderer.render({scene, target: this.captureTarget});
        }

        // const stepCount = 4;

        for(let i = 0; i < stepCount; i++) {

            this.pass.program.uniforms._Image.value = i === 0 ? (target === null ? this.captureTarget.texture : target) : this.blurTextureRead.texture;
            this.pass.program.uniforms._Time.value = time;
            this.pass.program.uniforms._StepSize.value = 0.5 + i;
            this.pass.program.uniforms._Seed.value += i;
            this.pass.program.uniforms._Scale.value = blurScale;

            this.gl.renderer.render({scene: this.pass, target: this.blurTextureWrite, clear: false});

            const tmp = this.blurTextureWrite;
            this.blurTextureWrite = this.blurTextureRead;
            this.blurTextureRead = tmp;

        }

    }

    createBlurBuffers() {

        const textureParams = {
            width: this.width*this.scale,
            height: this.height*this.scale,
            minFilter: this.gl.LINEAR,
            magFilter: this.gl.LINEAR,
            format: this.gl.RGB,
            internalFormat: this.gl.RGB,
            depth: false
        }

        this.blurTextureWrite = new RenderTarget(this.gl, textureParams);
        this.blurTextureRead = new RenderTarget(this.gl, textureParams);

    }

    onResize({width, height}) {
        this.width = width === null ? this.gl.canvas.width : width
        this.height = height === null ? this.gl.canvas.height : height
        this.initCaptureTexture();
        this.createBlurBuffers();
    }

    get Output() {
        return this.blurTextureRead.texture;
    }

}
