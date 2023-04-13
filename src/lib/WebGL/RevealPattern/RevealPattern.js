import {vertex} from './shader/vertex.js';
import {fragment} from './shader/fragment.js';
import {Mesh, Plane, Program, RenderTarget, Vec2} from 'ogl';


/**
 * @param gl
 */
export default class RevealPattern extends Mesh {

    constructor(gl) {

        super(gl)

        this.gl = gl;

        this.initGeometry();
        this.initProgram();
        this.initRenderTarget();
    }

    initGeometry() {

        this.geometry = new Plane(this.gl, {
          width: 2,
          height: 2
        })

    }

    initProgram() {

        const phaseHashMap25 = [20, 21, 22, 23, 24, 19, 6, 7, 8, 9, 18, 5, 0, 1, 10, 17, 4, 3, 2, 11, 16, 15, 14, 13, 12]

        const uniforms = {
          _Resolution: {
            value: new Vec2(window.innerWidth, window.innerHeight)
          },
          _PhaseValues: {
            value:phaseHashMap25
          },
          _Time: {
            value: 0
          },
          _Seed: {
            value: Math.random()
          }
        }

        this.program = new Program(this.gl, {
            uniforms,
            vertex,
            fragment
        });

    }

    initRenderTarget() {

      this.target = new RenderTarget(this.gl, {
        width: 32,
        height: 32,
        minFilter: this.gl.NEAREST,
        magFilter: this.gl.NEAREST,
        wrapS: this.gl.CLAMP_TO_EDGE,
        wrapT: this.gl.CLAMP_TO_EDGE,
        format: this.gl.RGB,
        internalFormat: this.gl.RGB,
        generateMipMaps: false
      });

    }

    blit() {
      this.gl.renderer.render({scene: this, target: this.target});
    }

    update({time}) {

      this.program.uniforms._Time.value = time;
      this.blit();

    }

    get Texture() {
      return this.target.texture;
    }

}
