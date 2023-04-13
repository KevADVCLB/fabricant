
import DomQuadBase from './DomQuadBase.js';
import RevealPattern from '../../RevealPattern/RevealPattern.js';
import {vertex} from './shader/vertex_sequence';
import {fragment} from './shader/fragment_sequence.js';

import {calcAspectSquareUv} from '../../utils/calcAspect.js'

import {gsap} from '$lib/gsap.js'
import {Program, Texture, Vec3, Vec2} from 'ogl';

export default class RenderingImageSequence extends DomQuadBase {

    constructor(gl, id, {
      domElement,
      geometry,
      renderOrder
    }) {

        super(gl, {
          id,
          domElement
        });

        this.gl = gl;

        this.geometry = geometry;

        this.initPosition = new Vec3();
        this.loaded = false;
        this.revealPhase = 0.0;
        this.parallaxOffsetScale = 0.15;

        this.initProgram();
        this.renderOrder = renderOrder;

    }

    initProgram() {

        this.frames = [];

        this.revealPattern = new RevealPattern(this.gl);
        this.revealPattern.update({time: 0});

        //load image
        this.texture = new Texture(this.gl, {
          generateMipmaps: false
        });

        const uniforms = {

            _ViewplaneSize: {
              value: this.viewPlaneSize
            },
            _ViewPlanePos: {
              value: this.viewPlanePos
            },
            _Pattern: {
              value: this.revealPattern.Texture
            },
            _Image: {
              value: this.texture
            },
            _Resolution: {
              value: new Vec2(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight)
            },
            _Aspect: {
              value: calcAspectSquareUv({width: this.viewPlaneSize.x, height: this.viewPlaneSize.y})
            },
            _Time: {
                value: 0
            },
            _RandColor: {
              value: new Vec3(Math.random(), Math.random(), Math.random())
            },
            _RevealPhase: {
              value: 0
            },

          }

          this.program = new Program(this.gl, {
            vertex,
            fragment,
            uniforms: uniforms,
            transparent: true,
            depthTest: false,
            depthWrite: false
          });
    }

    async loadFrame({frameSrc}) {
      return await this.gl.basisLoader.load(frameSrc);
    }

    async loadFrames() {

        const frameCount = this.domElement.src.frameCount;

        for(let i = 0; i < frameCount; i++) {
          const frameSrc = this.domElement.src.path+i+this.domElement.src.format;
          const texture = await this.gl.basisLoader.load(frameSrc);
          this.frames[i] = texture;

        }


    }

    animateRevealPattern() {

        if(this.inView()) {

          this.loaded = true;

          this.loadFrames().then(() => {

            gsap.to(this, {
              ease: "sine.out",
              duration: 1.5,
              revealPhase: 1.0,
              onUpdate: () => {
                this.program.uniforms._RevealPhase.value = this.revealPhase;
                this.revealPattern.update({time: this.revealPhase});
              }
            });

          });

        }
    }

    reveal() {
      super.reveal();
      if(this.loaded === false) return;

      if(this.hideAnim) this.hideAnim.kill();

      this.revealAnim = gsap.to(this, {
        ease: "sine.out",
        duration: 1.0,
        revealPhase: 1.0,
        onUpdate: () => {
          this.program.uniforms._RevealPhase.value = this.revealPhase;
          this.revealPattern.update({time: this.revealPhase});
        }
      });

    }

    hide() {
      super.hide();

      if(this.loaded === false) return;

      if(this.revealAnim) this.revealAnim.kill();

      this.hideAnim = gsap.to(this, {
        ease: "sine.out",
        duration: 0.75,
        revealPhase: 0.0,
        onUpdate: () => {
          this.program.uniforms._RevealPhase.value = this.revealPhase;
          this.revealPattern.update({time: this.revealPhase});
        }
      });

    }

    update({time, deltaTime, delta}) {


        if(this.loaded===false) {
          this.animateRevealPattern();
        }

        this.program.uniforms._Time.value = time;
        this.program.uniforms._ViewplaneSize.value.copy(this.viewPlaneSize);
        this.program.uniforms._ViewPlanePos.value.copy(this.viewPlanePos);
        this.program.uniforms._Aspect.value.copy(calcAspectSquareUv({width: this.viewPlaneSize.x, height: this.viewPlaneSize.y}));

        if(this.visible === false) return;
        if(this.frames.length === 0) return;
        const frameCounter = Math.floor(time*30) % this.frames.length;
        this.program.uniforms._Image.value = this.frames[frameCounter]

    }

    onResize() {
    }

}
