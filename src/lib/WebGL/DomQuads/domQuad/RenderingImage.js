
import DomQuadBase from './DomQuadBase.js';
import RevealPattern from '../../RevealPattern/RevealPattern.js';
import {vertex} from './shader/vertex.js';
import {fragment} from './shader/fragment.js';

import {gsap} from '$lib/gsap.js'

import {calcAspectSquareUv} from '../../utils/calcAspect.js'
import {Program, Texture, Vec3, Vec2} from 'ogl';

export default class RenderingImage extends DomQuadBase {

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
        this.revealAnim = null;
        this.hideAnim = null;

        this.initProgram();
        this.renderOrder = renderOrder;

    }

    initProgram() {

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
            _Time: {
                value: 0
            },
            _RevealPhase: {
              value: 0
            },
            _Aspect: {
              value: calcAspectSquareUv({width: this.viewPlaneSize.x, height: this.viewPlaneSize.y})
            }

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

    loadImage() {

      return new Promise((resolve, reject)=> {

        const image = new Image()
        image.crossOrigin = "*";
        image.src = this.domElement.src;

        image.onload = () => {

          this.texture.image = image;
          resolve();

        }

        image.onerror = () => {
          console.error('unable to load image, check source URL');
          reject();
        }

      });

    }

    animateRevealPattern() {

        if(this.inView()) {

          this.loaded = true;

          this.loadImage().then(() => {

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

    }

    onResize() {
      this.program.uniforms._ViewPlanePos.value.copy(this.viewPlanePos);
    }

}
