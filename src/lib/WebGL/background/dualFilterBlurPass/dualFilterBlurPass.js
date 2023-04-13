
import {vertex} from './shader/vertex.js'
import {blur_downsample} from './shader/blur_downsample.js'
import {blur_upsample} from './shader/blur_upsample'
import {Mesh, Program, RenderTarget, Texture, Triangle, Vec2} from 'ogl';


export default class DualFilterBlurPass {

    constructor(gl, {
        width,
        height,
    }) {

        this.gl = gl;

        this.resolutionScale = 0.5;

        this.setSize({width, height});

        this.init();
        this.initCaptureTexture();

    }

    init() {

        this.createBlurBuffers();

        const downSamplePassUniforms = {

                _Image: {
                    value: new Texture(this.gl)
                },
                _StepSize: {
                    value: 3.0
                },
                _Time: {
                    value: 0
                },
                _Resolution: {
                    value: new Vec2(this.width, this.height)
                },
                _Seed: {
                    value: 0
                }
        }

        this.downsamplePass = new Mesh(this.gl, {
            geometry: new Triangle(this.gl),
            program: new Program(this.gl, {
                vertex,
                fragment: blur_downsample,
                uniforms: downSamplePassUniforms,
                transparent: false,
                depthTest: false,
                depthWrite: false
            })
        });

        const upsamplePassUniforms = {

            _Image: {
                value: new Texture(this.gl)
            },
            _StepSize: {
                value: 3.0
            },
            _Time: {
                value: 0
            },
            _Resolution: {
                value: new Vec2(this.width, this.height)
            },
            _Seed: {
                value: 0
            }
    }

        this.upsamplePass = new Mesh(this.gl, {
            geometry: new Triangle(this.gl),
            program: new Program(this.gl, {
                vertex,
                fragment: blur_upsample,
                uniforms: upsamplePassUniforms,
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

    render({scene, time, phase}) {

        let scale = 1.0;

        for(let i = 0; i < this.downSamplePasses.length; i++) {

            this.downsamplePass.program.uniforms._Image.value = i === 0 ? scene : this.downSamplePasses[i - 1].texture;
            this.downsamplePass.program.uniforms._Resolution.value.set(this.width*this.resolutionScale*scale, this.height*this.resolutionScale*scale);
            this.downsamplePass.program.uniforms._Seed.value = i * 100.0 * Math.random();
            this.downsamplePass.program.uniforms._Time.value = time;

            this.gl.renderer.render({scene: this.downsamplePass, target: this.downSamplePasses[i], clear: false});

            scale *= 0.5;

        }

        for(let i = 0; i < this.upsamplePasses.length; i++) {

            scale *= 2.0;

            this.upsamplePass.program.uniforms._Image.value = i === 0 ? this.downSamplePasses[this.downSamplePasses.length - 1].texture : this.upsamplePasses[i - 1].texture;
            this.upsamplePass.program.uniforms._Resolution.value.set(this.width*this.resolutionScale*scale, this.height*this.resolutionScale*scale);
            this.upsamplePass.program.uniforms._Time.value = time;
            this.upsamplePass.program.uniforms._Seed.value = i * 100.0 * Math.random();

            this.gl.renderer.render({scene: this.upsamplePass, target: this.upsamplePasses[i], clear: false});

        }

    }

    createBlurBuffers() {

        const passCount = 3;

        this.downSamplePasses = new Array(passCount);
        this.upsamplePasses = new Array(passCount);

        let scale = 1.0;
        for(let i = 0; i < this.downSamplePasses.length; i++) {

            const textureParams = {
                width: this.width*this.resolutionScale*scale,
                height: this.height*this.resolutionScale*scale,
                minFilter: this.gl.LINEAR,
                magFilter: this.gl.LINEAR,
                format: this.gl.RGB,
                internalFormat: this.gl.RGB,
                depth: false
            }

            this.downSamplePasses[i] = new RenderTarget(this.gl, textureParams);
            scale *= 0.5;

        }

        for(let i = 0; i < this.upsamplePasses.length; i++) {

            scale *= 2.0;

            const textureParams = {
                width: this.width*this.resolutionScale*scale,
                height: this.height*this.resolutionScale*scale,
                minFilter: this.gl.LINEAR,
                magFilter: this.gl.LINEAR,
                format: this.gl.RGB,
                internalFormat: this.gl.RGB,
                depth: false
            }

            this.upsamplePasses[i] = new RenderTarget(this.gl, textureParams);

        }

    }

    onResize({width, height}) {
        this.setSize({width, height});
        this.createBlurBuffers()
    }

    setSize({width, height}) {
        this.width = width === null ? this.gl.canvas.width : width
        this.height = height === null ? this.gl.canvas.height : height
    }

    get Output() {
        return this.upsamplePasses[this.upsamplePasses.length - 1].texture;
    }

}
