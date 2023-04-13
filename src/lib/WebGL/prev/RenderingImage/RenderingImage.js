import {vertex} from './shader/vertex.js';
import {fragment} from './shader/fragment.js';
import {Geometry, Mesh, Plane, Program, Texture, Vec2} from 'ogl';


/**
 * @param gl
 */
export default class RevealPattern extends Mesh {

    constructor(gl, {
      pattern
    }) {

        super(gl)

        this.gl = gl;

        this.initGeometry();
        this.initMaterial(pattern);

    }

    initGeometry() {

        const refGeometry = new Plane(this.gl, {
            width: 2,
            height: 2,
            widthSegments: 1,
            heightSegments: 1
        });

        const {
            position,
            uv,
            normal,
            index
          } = refGeometry.attributes;


          // const data = [
          //     0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24
          // ]
          const data = [];
          let i = 0;
          while(i < 32) {
            data[i] = i;
            i++;
          }
          const spiralIndexData = new Float32Array(data);

          this.geometry = new Geometry(this.gl, {
            position: {
              size: 3,
              data: position.data
            },
            uv: {
              size: 2,
              data: uv.data
            },
            spiralIndex: {
                size: 1,
                data: spiralIndexData
            },
            index: {
              data: index.data
            }
          });

    }

    initMaterial(pattern) {

        // const img = new Image();
        // img.crossOrigin = "*";
        // img.src = './assets/images/creator2_2x.png';
        // const texture = new Texture(this.gl, {
        //   generateMipmaps: false
        // });

        // img.onload = () => texture.image = img;

        const phaseHashMap25 = [20, 21, 22, 23, 24, 19, 6, 7, 8, 9, 18, 5, 0, 1, 10, 17, 4, 3, 2, 11, 16, 15, 14, 13, 12]
        // const phaseHashMap64 = [
        //   0, 1, 2, 3, 4, 5, 6 ,7,
        //   27, 28, 29,30,31,32,33,8,
        //   26, 47, 48, 49, 50, 51, 34, 9,
        //   25, 46, 59, 60, 61, 52, 35, 10,
        //   24, 45, 58, 63, 62, 53, 36, 11,
        //   23, 44, 57, 56, 55, 54, 37, 12,
        //   22, 43, 42, 41, 40, 39, 38, 13,
        //   21, 20, 19, 18, 17, 16, 15, 14
        // ]

        const texture = new Texture(this.gl, {
          generateMipmaps: false
        })

        const uniforms = {
          _Pattern: {
            value: pattern
          },
          _Resolution: {
            value: new Vec2(this.gl.canvas.clientWidth, this.gl.canvas.clientHeight)
          },
          _PhaseValues: {
            value:phaseHashMap25
          },
          _Image: {
            value: texture
          },
          _Time: {
            value: 0
          },
          _TextureSize: {
            value: new Vec2(2, 2) //hard-coded for now
          }
        }

        this.program = new Program(this.gl, {
            uniforms,
            vertex,
            fragment,
            transparent: false,
            depthTest: false,
            depthWrite: false,
        });

    }

    update({time}) {

      this.program.uniforms._Time.value = time * 0.001;

    }

    setImage({image, width, height}) {

      const texture = this.program.uniforms._Image.value;
      texture.image = image;
      texture.needsUpdate = true;
      this.program.uniforms._Image.value = texture;
      this.program.uniforms._TextureSize.value.set(width, height);

    }

    onResize({width, height}) {


      this.program.uniforms._Resolution.value.set(width, height);

    }

}
