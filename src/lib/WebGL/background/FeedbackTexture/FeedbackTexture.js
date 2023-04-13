import {Mesh, Program, RenderTarget, Texture, Triangle, Vec2} from 'ogl';
import {vertex} from './shader/vertex.js';
import {fragment} from './shader/fragment.js';


export default class FeedbackTexture {
    constructor(gl, {
        width = 2.0,
        height = 2.0
    }) {
        this.gl = gl;
        this.width = width;
        this.height = height;

        this.velocity = 0.0;
        this.inertia = 0.93;

        this.initFBO();
        this.initBlitProgram();
    }

    initFBO() {
        this.fbo = {
            read: this.createRenderTexture(this.width),
            write: this.createRenderTexture(this.width),
            swap: () => {
                let tmp = this.fbo.read;
                this.fbo.read = this.fbo.write;
                this.fbo.write = tmp;
            }
        };
    }

    createRenderTexture(s) {
        const params = {
            width: s,
            height: s,
            format: this.gl.RGB,
            internalFormat: this.gl.RGB,
            depth: false,
            generateMipMaps: false
        };
        return new RenderTarget(this.gl, params);
    }

    initBlitProgram() {
        const geometry = new Triangle(this.gl);

        const uniforms = {
            _ColorPass: {
                value: new Texture(this.gl)
            },
            _PrevFrame: {
                value: this.fbo.read.texture
            },
            _Time: {
                value: 1
            },
            _TextureOffset: {
                value: new Vec2(0.0, 0.0)
            },
            _Scale: {
                value: 1.0
            },
            _FeedbackAmpK: {
                value: 1.0
            }
        };

        const program = new Program(this.gl, {
            vertex,
            fragment,
            uniforms
        });

        this.mesh = new Mesh(this.gl, {
            geometry,
            program,
            transparent: false,
            depthTest: false,
            depthWrite: false
        });
    }

    update({
        time,
        inputDelta,
        inputPass,
        scale
    }) {

        this.velocity += inputDelta.len()*0.005;
        this.velocity = Math.min(1.0, this.velocity);
        if(this.velocity < 0.0001) this.velocity = 0.0;

        this.mesh.program.uniforms._Time.value = time;
        this.mesh.program.uniforms._FeedbackAmpK.value = 1.0 - this.velocity;
        this.mesh.program.uniforms._ColorPass.value = inputPass;
        this.mesh.program.uniforms._PrevFrame.value = this.fbo.read.texture;

        this.gl.renderer.render({
            scene: this.mesh,
            target: this.fbo.write,
            clear: false
        });
        this.fbo.swap();

        this.velocity *= this.inertia;
    }

    get Texture() {
        return this.fbo.read.texture;
    }
}
