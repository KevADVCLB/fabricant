import {Mesh, Program, RenderTarget, Triangle, Vec2} from 'ogl';
import {vertex} from './shader/vertex.js'
import {blur} from './shader/fragment'
// import {blur_noDither} from './shader/blur_noDither'

export default class BlurPass {

    constructor(gl, {
        width,
        height,
        applyDither = true,
        scale = 0.25,
        initBlurScale = 1.0
    }) {

        this.gl = gl;

        this.scale = scale;

        this.width = width === null ? this.gl.canvas.width : width
        this.height = height === null ? this.gl.canvas.height : height

        this.init({applyDither, initBlurScale});
        this.initCaptureTexture();

    }

    init({applyDither, initBlurScale}) {

        this.createBlurBuffers();

        // const scale = 0.25;

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
                fragment: blur,
                uniforms,
                transparent: false,
                depthTest: false,
                depthWrite: false
            })
        });

    }

    initCaptureTexture() {

        this.captureTarget = new RenderTarget(this.gl, {
            width: this.width,
            height: this.height
        });

    }

    render({scene = null, target = null, time = 0, phase = 0, stepCount = 1}) {

        if(target === null) {
            this.gl.renderer.render({scene, target: this.captureTarget});
        }

        // const stepCount = 4;

        for(let i = 0; i < 8; i++) {

            this.pass.program.uniforms._Image.value = i === 0 ? target : this.blurTextureRead.texture;
            this.pass.program.uniforms._Time.value = time;
            this.pass.program.uniforms._StepSize.value = 0.5 + i;
            this.pass.program.uniforms._Seed.value += i;
            this.pass.program.uniforms._Scale.value = phase;

            this.gl.renderer.render({scene: this.pass, target: this.blurTextureWrite, clear: false});

            const tmp = this.blurTextureWrite;
            this.blurTextureWrite = this.blurTextureRead;
            this.blurTextureRead = tmp;

        }

    }

    createBlurBuffers() {

        // const scale = 0.25;

        const textureParams = {
            width: this.width*this.scale,
            height: this.height*this.scale,
            minFilter: this.gl.LINEAR,
            magFilter: this.gl.LINEAR,
            depth: false,
            format: this.gl.RGB,
            internalFormat: this.gl.RGB
        }

        this.blurTextureWrite = new RenderTarget(this.gl, textureParams);
        this.blurTextureRead = new RenderTarget(this.gl, textureParams);

    }

    onResize({width, height}) {
        this.createBlurBuffers()
    }

    get Output() {
        return this.blurTextureRead.texture;
    }

}
