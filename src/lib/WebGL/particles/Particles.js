
import {vertex} from './shaders/vertex.js';
import {fragment} from './shaders/fragment.js';
import {Geometry, Mesh, Plane, Program, Vec2} from 'ogl';

export default class Particles extends Mesh {

    constructor(gl, {
        count,
    }) {

        super(gl);

        this.gl = gl;

        this.count = count;

        this.initGeometry();
        this.initMaterial();
        this.renderOrder = 1;

    }

    initGeometry() {

        const refGeometry = new Plane(this.gl, {width: 0.2, height: 0.2});
        const {position, normal, uv, index} = refGeometry.attributes;
        const localPositionData = position.data;
        const normalData = normal.data;
        const uvData = uv.data;
        const indexData = index.data;

        const worldPositionData = new Float32Array(this.count*3);
        let worldPositionDataIterator = 0;

        for(let i = 0; i < this.count; i++) {

            worldPositionData[worldPositionDataIterator++] = (Math.random() * 2.0 - 1.0) * 10.0;
            worldPositionData[worldPositionDataIterator++] = (Math.random() * 2.0 - 1.0) * 10.0;
            worldPositionData[worldPositionDataIterator++] = (Math.random() * 2.0 - 1.0) * 0.5;

        }

        const scaleData = new Float32Array(this.count);
        let scaleDataIterator = 0.0;
        for(let i = 0; i < scaleData.length;i++) {
            scaleData[scaleDataIterator++] = Math.random();
        }

        this.geometry = new Geometry(this.gl, {

            position: {
                size: 3,
                data: localPositionData
            },
            worldPosition: {
                instanced: 1,
                size: 3,
                data: worldPositionData
            },
            uv: {
                size: 2,
                data: uvData
            },
            normal: {
                size: 3,
                data: normalData
            },
            scale: {
                size:1,
                instanced: 1,
                data: scaleData
            },
            index: {
                data: indexData
            }

        });

    }

    initMaterial() {

        const uniforms = {

            _Offset: {
                value: new Vec2(0.0, 0.0)
            },
            _Time: {
                value: 0
            }

        }

        this.program = new Program(this.gl, {
            uniforms,
            vertex,
            fragment,
            cullFace: this.gl.BACK,
            transparent: true,
            depthTest: false,
            depthWrite: false,
        });
        this.program.setBlendFunc(this.gl.ONE, this.gl.ONE);

    }

    update({time, mapTransform}) {

        this.program.uniforms._Offset.value.set(mapTransform.offset.x * mapTransform.scale, mapTransform.offset.y * mapTransform.scale);
        this.program.uniforms._Time.value = time;

    }

}
